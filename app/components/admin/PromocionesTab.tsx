"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

type Promocion = {
  id: string;
  tipo: 'porcentaje' | 'monto_fijo';
  tipoAplicacion?: 'todos' | 'servicios_especificos' | 'monto_minimo';
  valor: number;
  montoMinimo?: number;
  serviciosIds?: string[];
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  pausada: boolean;
  usoLimitado: boolean;
  titulo: string;
  descripcion: string;
  textoPromocional: string;
  imagen?: string;
};

export default function PromocionesTab() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Promocion>>({});

  useEffect(() => {
    loadPromociones();
  }, []);

  // Cargar servicios cuando se muestra el selector de servicios específicos
  useEffect(() => {
    if (formData.tipoAplicacion === 'servicios_especificos' && servicios.length === 0 && !loading) {
      const loadServicios = async () => {
        try {
          const serviciosRes = await fetch('/api/admin/servicios');
          const serviciosData = await serviciosRes.json();
          const serviciosList = serviciosData.servicios || [];
          
          if (!Array.isArray(serviciosList)) {
            console.error('❌ serviciosData.servicios no es un array:', serviciosList);
            setServicios([]);
            return;
          }
          
          const serviciosActivos = serviciosList.filter((s: any) => s.activo === true);
          console.log('✅ Servicios activos cargados automáticamente:', serviciosActivos.length);
          setServicios(serviciosActivos);
        } catch (error) {
          console.error('Error cargando servicios:', error);
        }
      };
      loadServicios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.tipoAplicacion]);

  const loadPromociones = async () => {
    try {
      const [promocionesRes, serviciosRes] = await Promise.all([
        fetch('/api/admin/promociones'),
        fetch('/api/admin/servicios')
      ]);
      
      const promocionesData = await promocionesRes.json();
      const serviciosData = await serviciosRes.json();
      
      setPromociones(promocionesData.promociones || promocionesData.todas || []);
      
      // Filtrar solo servicios activos para la selección
      const serviciosList = serviciosData.servicios || [];
      
      // Validar que serviciosList sea un array
      if (!Array.isArray(serviciosList)) {
        console.error('❌ serviciosData.servicios no es un array:', serviciosList);
        setServicios([]);
      } else {
        const serviciosActivos = serviciosList.filter((s: any) => s.activo === true);
        console.log('✅ Servicios activos cargados para promociones:', serviciosActivos.length);
        setServicios(serviciosActivos);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    // Cargar servicios si aún no están cargados
    if (servicios.length === 0 && !loading) {
      try {
        const serviciosRes = await fetch('/api/admin/servicios');
        const serviciosData = await serviciosRes.json();
        const serviciosList = serviciosData.servicios || [];
        
        if (Array.isArray(serviciosList)) {
          const serviciosActivos = serviciosList.filter((s: any) => s.activo === true);
          setServicios(serviciosActivos);
          console.log('✅ Servicios activos cargados para nueva promoción:', serviciosActivos.length);
        } else {
          console.error('❌ serviciosData.servicios no es un array');
          setServicios([]);
        }
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    }
    
    setFormData({
      tipo: 'porcentaje',
      tipoAplicacion: 'todos', // Por defecto aplica a todos los servicios
      valor: 15,
      montoMinimo: undefined, // No requerido por defecto
      serviciosIds: [], // Vacío por defecto
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activa: false, // DESACTIVADA por defecto - el admin debe activarla manualmente
      pausada: false,
      usoLimitado: true,
      titulo: '',
      descripcion: '',
      textoPromocional: '',
      imagen: ''
    });
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = async (promocion: Promocion) => {
    // Cargar servicios si aún no están cargados
    if (servicios.length === 0 && !loading) {
      try {
        const serviciosRes = await fetch('/api/admin/servicios');
        const serviciosData = await serviciosRes.json();
        const serviciosList = serviciosData.servicios || [];
        
        if (Array.isArray(serviciosList)) {
          const serviciosActivos = serviciosList.filter((s: any) => s.activo === true);
          setServicios(serviciosActivos);
          console.log('✅ Servicios activos cargados para editar promoción:', serviciosActivos.length);
        } else {
          console.error('❌ serviciosData.servicios no es un array');
          setServicios([]);
        }
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    }
    
    setFormData({
      ...promocion,
      fechaInicio: promocion.fechaInicio.split('T')[0],
      fechaFin: promocion.fechaFin.split('T')[0],
      tipoAplicacion: promocion.tipoAplicacion || 'todos', // Asegurar que tenga valor por defecto
      serviciosIds: promocion.serviciosIds || [],
      montoMinimo: promocion.montoMinimo || undefined
    });
    setEditing(promocion.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    // Validar campos requeridos
    if (!formData.titulo || !formData.textoPromocional || !formData.fechaInicio || !formData.fechaFin || !formData.valor) {
      showNotification.error('Por favor completa todos los campos requeridos (marcados con *)');
      return;
    }

    // Validar tipo de aplicación
    const tipoAplicacion = formData.tipoAplicacion || 'todos';
    
    if (tipoAplicacion === 'servicios_especificos' && (!formData.serviciosIds || formData.serviciosIds.length === 0)) {
      showNotification.error('Por favor selecciona al menos un servicio para aplicar la promoción');
      return;
    }

    if (tipoAplicacion === 'monto_minimo' && (!formData.montoMinimo || formData.montoMinimo <= 0)) {
      showNotification.error('Por favor ingresa un monto mínimo válido');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        tipoAplicacion: tipoAplicacion,
        fechaInicio: new Date(formData.fechaInicio + 'T00:00:00').toISOString(),
        fechaFin: new Date(formData.fechaFin + 'T23:59:59').toISOString(),
        // Limpiar campos según el tipo de aplicación
        serviciosIds: tipoAplicacion === 'servicios_especificos' ? formData.serviciosIds : undefined,
        montoMinimo: tipoAplicacion === 'monto_minimo' ? formData.montoMinimo : undefined
      };

      const response = editing
        ? await fetch('/api/admin/promociones', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editing, ...dataToSave })
          })
        : await fetch('/api/admin/promociones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
          });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      showNotification.success(editing ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente (INACTIVA por defecto)');
      setShowForm(false);
      setEditing(null);
      setFormData({});
      await loadPromociones();

      // Disparar eventos para actualizar la página principal automáticamente
      const timestamp = Date.now();
      localStorage.setItem('promociones_actualizadas', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-promociones' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      setTimeout(() => {
        ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-promociones' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      
      setTimeout(() => {
        ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-promociones' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error: any) {
      console.error('Error guardando:', error);
      showNotification.error(`Error al guardar promoción: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleToggle = async (id: string, field: 'activa' | 'pausada', value: boolean) => {
    try {
      await fetch('/api/admin/promociones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      });
      await loadPromociones();

      // Disparar eventos para actualizar la página principal automáticamente
      const timestamp = Date.now();
      localStorage.setItem('promociones_actualizadas', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-promociones-toggle' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      setTimeout(() => {
        ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-promociones-toggle' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
    } catch (error) {
      console.error('Error actualizando:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmado = await showConfirm('¿Estás seguro de eliminar esta promoción?');
    if (!confirmado) return;
    try {
      await fetch(`/api/admin/promociones?id=${id}`, { method: 'DELETE' });
      showNotification.success('Promoción eliminada correctamente');
      await loadPromociones();

      // Disparar eventos para actualizar la página principal automáticamente
      const timestamp = Date.now();
      localStorage.setItem('promociones_actualizadas', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-promociones-delete' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      setTimeout(() => {
        ['promocionActualizada', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp, source: 'admin-promociones-delete' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
    } catch (error) {
      console.error('Error eliminando:', error);
      showNotification.error('Error al eliminar promoción');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando promociones...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#3d2817] mb-2">Gestión de Promociones</h2>
          <p className="text-stone-600">Crea y gestiona promociones especiales para tus clientes</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
        >
          <span className="text-xl">+</span>
          Nueva Promoción
        </button>
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditing(null);
              setFormData({});
            }
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#3d2817]">
                  {editing ? '✏️ Editar Promoción' : '➕ Nueva Promoción'}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  {editing ? 'Modifica los datos de la promoción' : 'Completa el formulario para crear una nueva promoción'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setFormData({});
                }}
                className="text-stone-400 hover:text-stone-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información Básica */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <h4 className="text-sm font-bold text-[#3d2817] mb-3 uppercase">📝 Información Básica</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Título de la Promoción <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.titulo || ''}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                      placeholder="Ej: 15% OFF en compras mayores a $200.000"
                      required
                    />
                    <p className="text-xs text-stone-500 mt-1">Título corto y descriptivo de la promoción</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Texto Promocional (Visible en Home) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.textoPromocional || ''}
                      onChange={(e) => setFormData({ ...formData, textoPromocional: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                      placeholder="Ej: ¡Obtén 15% de descuento en compras superiores a $200.000!"
                      required
                    />
                    <p className="text-xs text-stone-500 mt-1">Este texto aparecerá destacado en la página principal</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">Descripción Detallada</label>
                    <textarea
                      value={formData.descripcion || ''}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                      placeholder="Describe los términos y condiciones de la promoción..."
                    />
                    <p className="text-xs text-stone-500 mt-1">Información adicional sobre la promoción (opcional)</p>
                  </div>
                </div>
              </div>

              {/* Configuración del Descuento */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-bold text-[#3d2817] mb-3 uppercase">💰 Configuración del Descuento</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Tipo de Descuento <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tipo || 'porcentaje'}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'porcentaje' | 'monto_fijo' })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent bg-white"
                    >
                      <option value="porcentaje">Porcentaje (%)</option>
                      <option value="monto_fijo">Monto Fijo (COP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      {formData.tipo === 'porcentaje' ? 'Descuento (%)' : 'Descuento (COP)'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.valor || 0}
                      onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                      min="0"
                      max={formData.tipo === 'porcentaje' ? 100 : undefined}
                      placeholder={formData.tipo === 'porcentaje' ? 'Ej: 15' : 'Ej: 50000'}
                      required
                    />
                  </div>
                </div>

                {/* Tipo de Aplicación */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    ¿A qué servicios se aplica? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tipoAplicacion || 'todos'}
                    onChange={(e) => {
                      const tipoAplicacion = e.target.value as 'todos' | 'servicios_especificos' | 'monto_minimo';
                      console.log('Tipo de aplicación seleccionado:', tipoAplicacion);
                      
                      // Cargar servicios activos cuando se selecciona "servicios_especificos"
                      if (tipoAplicacion === 'servicios_especificos' && servicios.length === 0) {
                        fetch('/api/admin/servicios')
                          .then(res => res.json())
                          .then(data => {
                            const serviciosList = data.servicios || [];
                            if (Array.isArray(serviciosList)) {
                              const serviciosActivos = serviciosList.filter((s: any) => s.activo === true);
                              console.log('✅ Servicios activos cargados:', serviciosActivos.length);
                              setServicios(serviciosActivos);
                            } else {
                              console.error('❌ serviciosData.servicios no es un array');
                              setServicios([]);
                            }
                          })
                          .catch(error => {
                            console.error('Error cargando servicios:', error);
                          });
                      }
                      
                      setFormData({ 
                        ...formData, 
                        tipoAplicacion,
                        montoMinimo: tipoAplicacion === 'monto_minimo' ? (formData.montoMinimo || 200000) : undefined,
                        serviciosIds: tipoAplicacion === 'servicios_especificos' ? (formData.serviciosIds || []) : undefined
                      });
                    }}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent bg-white"
                  >
                    <option value="todos">Todos los servicios</option>
                    <option value="servicios_especificos">Servicios específicos (seleccionar)</option>
                    <option value="monto_minimo">Solo cuando el total sea superior a un monto</option>
                  </select>
                </div>

                {/* Selección de Servicios Específicos */}
                {formData.tipoAplicacion === 'servicios_especificos' && (
                  <div className="mb-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-400 shadow-lg">
                    <div className="mb-4">
                      <label className="block text-base font-bold text-[#3d2817] mb-2 uppercase tracking-wide">
                        📋 Seleccionar Servicios donde Aplicar la Promoción <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-stone-700 bg-white/80 p-2 rounded border border-purple-200">
                        <strong>Instrucciones:</strong> Selecciona los servicios específicos a los que se aplicará esta promoción o descuento. Puedes seleccionar uno o varios servicios marcando las casillas. La promoción solo se aplicará a los servicios que selecciones aquí.
                      </p>
                    </div>
                    
                    {servicios.length === 0 && !loading ? (
                      <div className="text-center py-8 border-2 border-red-300 rounded-lg bg-red-50">
                        <p className="text-base text-red-700 font-bold mb-2">⚠️ No hay servicios disponibles</p>
                        <p className="text-sm text-red-600 mb-4">Asegúrate de tener servicios activos creados en la sección "Servicios"</p>
                        <button
                          type="button"
                          onClick={async () => {
                            // TODO: Reconstruir sistema de servicios
                            // API eliminada: /api/admin/servicios
                            try {
                              setLoading(true);
                              // const serviciosRes = await fetch('/api/admin/servicios');
                              // const serviciosData = await serviciosRes.json();
                              // const serviciosList = serviciosData.servicios || serviciosData || [];
                              // console.log('Servicios recargados:', serviciosList.length, serviciosList);
                              console.warn('⚠️ Sistema de servicios eliminado - necesita reconstrucción');
                              setServicios([]);
                            } catch (error) {
                              console.error('Error cargando servicios:', error);
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold shadow-md transition-all"
                        >
                          🔄 Recargar Servicios
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white rounded-lg border-2 border-purple-300 shadow-inner p-2">
                          <div className="max-h-96 overflow-y-auto rounded p-3 space-y-2 custom-scrollbar bg-stone-50">
                            {loading ? (
                              <div className="text-center py-12">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-3"></div>
                                <p className="text-sm text-stone-600 font-semibold">Cargando servicios...</p>
                              </div>
                            ) : servicios.filter((s: any) => s.activo !== false).length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-sm text-amber-700 font-semibold mb-2">⚠️ No hay servicios activos</p>
                                <p className="text-xs text-amber-600">Activa algunos servicios primero en la sección "Servicios"</p>
                              </div>
                            ) : (
                              servicios
                                .filter((s: any) => s.activo !== false) // Solo servicios activos
                                .map((servicio: any) => {
                                  const isSelected = (formData.serviciosIds || []).includes(servicio.id);
                                  return (
                                    <label
                                      key={servicio.id || `servicio-${Math.random()}`}
                                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all ${
                                        isSelected 
                                          ? 'bg-purple-100 border-purple-500 shadow-md' 
                                          : 'bg-white border-transparent hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          const serviciosIds = formData.serviciosIds || [];
                                          if (e.target.checked) {
                                            setFormData({ ...formData, serviciosIds: [...serviciosIds, servicio.id] });
                                          } else {
                                            setFormData({ ...formData, serviciosIds: serviciosIds.filter((id: string) => id !== servicio.id) });
                                          }
                                        }}
                                        className="w-6 h-6 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                                      />
                                      <div className="flex-1 flex items-center gap-3">
                                        <span className="text-3xl flex-shrink-0">{servicio.icon || '✨'}</span>
                                        <div className="flex-1 min-w-0">
                                          <span className="text-base font-bold text-[#3d2817] block">{servicio.nombre || 'Sin nombre'}</span>
                                          <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-semibold text-green-600">
                                              ${(servicio.precio || 0).toLocaleString('es-CO')}
                                            </span>
                                            <span className="text-xs text-stone-400">•</span>
                                            <span className="text-xs text-stone-600 font-medium">
                                              {servicio.duracion || 30} min
                                            </span>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <span className="text-2xl text-purple-600">✓</span>
                                        )}
                                      </div>
                                    </label>
                                  );
                                })
                            )}
                          </div>
                        </div>
                        
                        {servicios.filter((s: any) => s.activo !== false).length > 0 && (
                          <div className="mt-4 space-y-2">
                            {(formData.serviciosIds || []).length > 0 ? (
                              <p className="text-sm text-green-700 font-bold bg-green-100 p-3 rounded-lg border-2 border-green-400 flex items-center gap-2 shadow-sm">
                                <span className="text-xl">✓</span>
                                <span><strong>{formData.serviciosIds?.length}</strong> servicio(s) seleccionado(s) para aplicar la promoción</span>
                              </p>
                            ) : (
                              <p className="text-sm text-amber-700 font-semibold bg-amber-100 p-3 rounded-lg border-2 border-amber-400 flex items-center gap-2 shadow-sm">
                                <span className="text-xl">⚠️</span>
                                <span>Selecciona al menos un servicio para aplicar la promoción</span>
                              </p>
                            )}
                            
                            {servicios.filter((s: any) => s.activo !== false).length > 1 && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const todosActivos = servicios.filter((s: any) => s.activo !== false).map((s: any) => s.id);
                                    setFormData({ ...formData, serviciosIds: todosActivos });
                                  }}
                                  className="text-xs text-purple-600 hover:text-purple-800 hover:underline font-semibold px-3 py-1 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                                >
                                  ✓ Seleccionar todos ({servicios.filter((s: any) => s.activo !== false).length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, serviciosIds: [] });
                                  }}
                                  className="text-xs text-stone-600 hover:text-stone-800 hover:underline font-semibold px-3 py-1 bg-stone-100 rounded hover:bg-stone-200 transition-colors"
                                >
                                  ✗ Deseleccionar todos
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Monto Mínimo (Solo si tipoAplicacion es 'monto_minimo') */}
                {formData.tipoAplicacion === 'monto_minimo' && (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-stone-300">
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Monto Mínimo Total (COP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.montoMinimo || 0}
                      onChange={(e) => setFormData({ ...formData, montoMinimo: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
                      min="0"
                      placeholder="Ej: 200000"
                      required
                    />
                    <p className="text-xs text-stone-500 mt-2">
                      💡 El descuento se aplicará solo si el total de servicios reservados es igual o mayor a este monto
                    </p>
                  </div>
                )}

                {formData.tipoAplicacion === 'todos' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-semibold">
                      ℹ️ Esta promoción se aplicará a TODOS los servicios sin restricciones
                    </p>
                  </div>
                )}
              </div>

              {/* Fechas de Vigencia */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-bold text-[#3d2817] mb-3 uppercase">📅 Fechas de Vigencia</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fechaInicio || ''}
                      onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                      Fecha de Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fechaFin || ''}
                      onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Configuración Avanzada */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-bold text-[#3d2817] mb-3 uppercase">⚙️ Configuración Avanzada</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.activa || false}
                      onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                      className="w-5 h-5 text-[#3d2817] focus:ring-[#3d2817]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#3d2817] block">Activar Promoción</span>
                      <span className="text-xs text-stone-500">La promoción será visible en el sitio web</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.usoLimitado || false}
                      onChange={(e) => setFormData({ ...formData, usoLimitado: e.target.checked })}
                      className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#3d2817] block">Uso Limitado</span>
                      <span className="text-xs text-stone-500">Una sola vez por cliente</span>
                    </div>
                  </label>
                </div>
                
                <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-xs text-yellow-800 font-semibold">
                    ⚠️ Importante: Por defecto, las promociones se crean INACTIVAS. Activa manualmente cuando estés listo para publicarla.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-stone-200">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
              >
                💾 Guardar Promoción
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setFormData({});
                }}
                className="flex-1 bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-all font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Promociones */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200 bg-stone-50">
          <h3 className="text-lg font-bold text-[#3d2817]">Lista de Promociones ({promociones.length})</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {promociones.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-lg font-semibold text-stone-700 mb-2">No hay promociones creadas</p>
              <p className="text-sm text-stone-500 mb-4">Crea tu primera promoción usando el botón "Nueva Promoción"</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <span>+</span>
                Crear Primera Promoción
              </button>
            </div>
          ) : (
            promociones.map((promocion) => {
              const ahora = new Date();
              const fechaInicio = new Date(promocion.fechaInicio);
              const fechaFin = new Date(promocion.fechaFin);
              const valida = ahora >= fechaInicio && ahora <= fechaFin;

              return (
                <div
                  key={promocion.id}
                  className={`p-6 transition-colors ${
                    promocion.activa && !promocion.pausada && valida
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : promocion.activa && promocion.pausada
                      ? 'bg-yellow-50 border-l-4 border-yellow-500'
                      : 'bg-stone-50 border-l-4 border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#3d2817]">{promocion.titulo}</h3>
                        {promocion.activa && !promocion.pausada && valida && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            ACTIVA
                          </span>
                        )}
                        {promocion.pausada && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                            PAUSADA
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-600 mb-2">{promocion.textoPromocional}</p>
                      <div className="flex flex-wrap gap-4 text-sm mb-2">
                        <span className="font-semibold text-green-600">
                          {promocion.tipo === 'porcentaje' 
                            ? `${promocion.valor}% OFF`
                            : `${formatCurrency(promocion.valor)} OFF`}
                        </span>
                        {promocion.tipoAplicacion === 'todos' && (
                          <span className="text-blue-600 font-semibold">🌐 Aplica a todos los servicios</span>
                        )}
                        {promocion.tipoAplicacion === 'servicios_especificos' && promocion.serviciosIds && promocion.serviciosIds.length > 0 && (
                          <span className="text-purple-600 font-semibold">
                            📋 {promocion.serviciosIds.length} servicio(s) específico(s)
                          </span>
                        )}
                        {promocion.tipoAplicacion === 'monto_minimo' && promocion.montoMinimo && (
                          <span className="text-amber-600 font-semibold">
                            💰 Total mínimo: {formatCurrency(promocion.montoMinimo)}
                          </span>
                        )}
                        <span className="text-stone-500">
                          {promocion.usoLimitado ? '🔒 Una vez por cliente' : '♾️ Sin límite'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-2">
                        {new Date(promocion.fechaInicio).toLocaleDateString('es-CO')} - {new Date(promocion.fechaFin).toLocaleDateString('es-CO')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleToggle(promocion.id, 'activa', !promocion.activa)}
                        className={`px-3 py-1 rounded text-xs ${
                          promocion.activa
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {promocion.activa ? 'Activa' : 'Inactiva'}
                      </button>
                      <button
                        onClick={() => handleToggle(promocion.id, 'pausada', !promocion.pausada)}
                        className={`px-3 py-1 rounded text-xs ${
                          promocion.pausada
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {promocion.pausada ? 'Pausada' : 'Pausar'}
                      </button>
                      <button
                        onClick={() => handleEdit(promocion)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(promocion.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}







