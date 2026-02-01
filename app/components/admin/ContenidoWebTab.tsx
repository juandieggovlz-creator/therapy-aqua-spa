"use client";

import React, { useState, useEffect } from 'react';

type Configuracion = {
  id: number;
  clave: string;
  valor: string;
  descripcion: string | null;
  tipo: string;
  categoria: string;
  editable_por_gerente: boolean;
};

type Horario = {
  id: number;
  hora: string;
  activo: boolean;
  orden: number;
};

export default function ContenidoWebTab() {
  const [activeSection, setActiveSection] = useState<'configuracion' | 'horarios'>('configuracion');
  const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [nuevoValor, setNuevoValor] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [activeSection]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeSection === 'configuracion') {
        const res = await fetch('/api/admin/configuracion');
        const data = await res.json();
        setConfiguraciones(data.configuraciones || []);
      } else {
        const res = await fetch('/api/admin/horarios');
        const data = await res.json();
        setHorarios(data.horarios || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      mostrarMensaje('error', 'Error al cargar datos');
    }
    setLoading(false);
  };

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleGuardarConfig = async (config: Configuracion) => {
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: config.id,
          valor: nuevoValor
        })
      });

      if (res.ok) {
        mostrarMensaje('success', 'Configuración actualizada');
        setEditando(null);
        setNuevoValor('');
        cargarDatos();
      } else {
        mostrarMensaje('error', 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('error', 'Error al guardar');
    }
  };

  const handleToggleHorario = async (horario: Horario) => {
    try {
      const res = await fetch('/api/admin/horarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: horario.id,
          activo: !horario.activo
        })
      });

      if (res.ok) {
        mostrarMensaje('success', `Horario ${!horario.activo ? 'activado' : 'desactivado'}`);
        cargarDatos();
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('error', 'Error al actualizar horario');
    }
  };

  const categorizarConfiguraciones = () => {
    const categorias: Record<string, Configuracion[]> = {};
    configuraciones.forEach(config => {
      if (!categorias[config.categoria]) {
        categorias[config.categoria] = [];
      }
      categorias[config.categoria].push(config);
    });
    return categorias;
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'general': '🏢 Información General',
      'contacto': '📞 Información de Contacto',
      'redes_sociales': '📱 Redes Sociales',
      'horarios': '🕐 Horarios de Atención',
      'sobre_nosotros': '📝 Sobre Nosotros',
      'terminos': '📜 Términos y Condiciones'
    };
    return labels[categoria] || categoria;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3d2817]">Contenido Web</h2>
          <p className="text-stone-600 mt-1">Gestiona la información del sitio web</p>
        </div>
      </div>

      {/* Mensaje de notificación */}
      {mensaje && (
        <div className={`p-4 rounded-lg ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Pestañas */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveSection('configuracion')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === 'configuracion'
              ? 'border-b-2 border-[#3d2817] text-[#3d2817]'
              : 'text-stone-600 hover:text-[#3d2817]'
          }`}
        >
          📋 Configuración
        </button>
        <button
          onClick={() => setActiveSection('horarios')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === 'horarios'
              ? 'border-b-2 border-[#3d2817] text-[#3d2817]'
              : 'text-stone-600 hover:text-[#3d2817]'
          }`}
        >
          🕐 Horarios
        </button>
      </div>

      {/* Contenido de Configuración */}
      {activeSection === 'configuracion' && (
        <div className="space-y-8">
          {Object.entries(categorizarConfiguraciones()).map(([categoria, configs]) => (
            <div key={categoria} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
              <h3 className="text-lg font-bold text-[#3d2817] mb-4">
                {getCategoriaLabel(categoria)}
              </h3>
              <div className="space-y-4">
                {configs.map(config => (
                  <div key={config.id} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-stone-700 mb-1">
                          {config.clave.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        {config.descripcion && (
                          <p className="text-xs text-stone-500 mb-2">{config.descripcion}</p>
                        )}
                        {editando === config.id ? (
                          <div className="space-y-2">
                            {config.tipo === 'textarea' ? (
                              <textarea
                                value={nuevoValor}
                                onChange={(e) => setNuevoValor(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                              />
                            ) : (
                              <input
                                type={config.tipo === 'number' ? 'number' : 'text'}
                                value={nuevoValor}
                                onChange={(e) => setNuevoValor(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                              />
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleGuardarConfig(config)}
                                className="px-4 py-2 bg-[#3d2817] text-white rounded-lg hover:bg-[#2d1f11] transition-colors"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditando(null);
                                  setNuevoValor('');
                                }}
                                className="px-4 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-stone-900 font-medium">
                              {config.valor || <span className="text-stone-400 italic">No configurado</span>}
                            </p>
                            {config.editable_por_gerente && (
                              <button
                                onClick={() => {
                                  setEditando(config.id);
                                  setNuevoValor(config.valor);
                                }}
                                className="text-[#3d2817] hover:text-[#2d1f11] text-sm"
                              >
                                ✏️ Editar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contenido de Horarios */}
      {activeSection === 'horarios' && (
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h3 className="text-lg font-bold text-[#3d2817] mb-4">
            Horarios Disponibles para Reservas
          </h3>
          <p className="text-sm text-stone-600 mb-6">
            Activa o desactiva los horarios disponibles para que los clientes puedan reservar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {horarios.map(horario => (
              <button
                key={horario.id}
                onClick={() => handleToggleHorario(horario)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  horario.activo
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-stone-300 bg-stone-50 text-stone-400'
                }`}
              >
                <div className="text-2xl mb-1">🕐</div>
                <div className="font-bold">{horario.hora}</div>
                <div className="text-xs mt-1">
                  {horario.activo ? '✓ Activo' : '✗ Inactivo'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



