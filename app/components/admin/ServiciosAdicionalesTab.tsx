"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';
import EmojiSelector from '@/app/components/admin/EmojiSelector';

type ServicioAdicional = {
  id: string;
  nombre: string;
  precioParticular: number;
  precioAfiliado: number;
  descripcion: string;
  icon: string;
  activo: boolean;
  orden: number;
};

export default function ServiciosAdicionalesTab() {
  const [servicios, setServicios] = useState<ServicioAdicional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedServicio, setSelectedServicio] = useState<ServicioAdicional | null>(null);
  const [formData, setFormData] = useState<Partial<ServicioAdicional>>({});

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const response = await fetch('/api/admin/servicios-adicionales');
      const data = await response.json();
      setServicios(data.servicios || []);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando servicios adicionales:', error);
      showNotification.error('Error al cargar servicios adicionales');
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      nombre: '',
      precioParticular: 29900,
      precioAfiliado: 13000,
      descripcion: '',
      icon: '💆',
      activo: true,
      orden: 0
    });
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (servicio: ServicioAdicional) => {
    setSelectedServicio(servicio);
    setFormData(servicio);
    setModalType('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.precioParticular || !formData.precioAfiliado) {
        showNotification.error('Todos los campos de precio son obligatorios');
        return;
      }

      const url = '/api/admin/servicios-adicionales';
      const method = modalType === 'create' ? 'POST' : 'PATCH';
      
      const body = modalType === 'edit' 
        ? { ...formData, id: selectedServicio?.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Error al guardar');

      showNotification.success(
        modalType === 'create' 
          ? 'Servicio adicional creado exitosamente'
          : 'Servicio adicional actualizado exitosamente'
      );

      setShowModal(false);
      await loadServicios();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('serviciosAdicionalesActualizados'));
    } catch (error) {
      showNotification.error('Error al guardar servicio adicional');
    }
  };

  const handleDelete = async (servicio: ServicioAdicional) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar servicio adicional?',
      message: `¿Estás seguro de eliminar "${servicio.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/servicios-adicionales?id=${servicio.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      showNotification.success('Servicio adicional eliminado exitosamente');
      await loadServicios();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('serviciosAdicionalesActualizados'));
    } catch (error) {
      showNotification.error('Error al eliminar servicio adicional');
    }
  };

  const handleToggleActivo = async (servicio: ServicioAdicional) => {
    try {
      const response = await fetch('/api/admin/servicios-adicionales', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: servicio.id,
          ...servicio,
          activo: !servicio.activo
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      showNotification.success(`Servicio ${!servicio.activo ? 'activado' : 'desactivado'}`);
      await loadServicios();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('serviciosAdicionalesActualizados'));
    } catch (error) {
      showNotification.error('Error al actualizar servicio');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Servicios Adicionales</h2>
          <p className="text-gray-600 mt-1">Administra servicios adicionales (jacuzzi, turco, sauna, etc.)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Servicio Adicional
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Servicios</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{servicios.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Activos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{servicios.filter(s => s.activo).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
          <p className="text-gray-600 text-sm font-medium">Inactivos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{servicios.filter(s => !s.activo).length}</p>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map(servicio => {
          const ahorro = servicio.precioParticular - servicio.precioAfiliado;
          const porcentajeAhorro = Math.round((ahorro / servicio.precioParticular) * 100);

          return (
            <div
              key={servicio.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{servicio.icon}</div>
                <button
                  onClick={() => handleToggleActivo(servicio)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    servicio.activo
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {servicio.activo ? '✓ ACTIVO' : '✕ INACTIVO'}
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{servicio.nombre}</h3>
              {servicio.descripcion && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{servicio.descripcion}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Precio Particular</p>
                  <p className="text-xl font-bold text-blue-600">${servicio.precioParticular.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Precio Afiliado</p>
                  <p className="text-xl font-bold text-green-600">${servicio.precioAfiliado.toLocaleString()}</p>
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    Ahorro: ${ahorro.toLocaleString()} ({porcentajeAhorro}%)
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(servicio)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(servicio)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {servicios.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💆</div>
          <p className="text-gray-600 text-lg">No hay servicios adicionales registrados</p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Crear Primer Servicio
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalType === 'create' ? 'Nuevo Servicio Adicional' : 'Editar Servicio Adicional'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Jacuzzi"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Descripción del servicio"
                />
              </div>

              {/* Precios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Particular *
                  </label>
                  <input
                    type="number"
                    value={formData.precioParticular || ''}
                    onChange={(e) => setFormData({ ...formData, precioParticular: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="29900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Afiliado *
                  </label>
                  <input
                    type="number"
                    value={formData.precioAfiliado || ''}
                    onChange={(e) => setFormData({ ...formData, precioAfiliado: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="13000"
                  />
                </div>
              </div>

              {/* Vista previa de ahorro */}
              {formData.precioParticular && formData.precioAfiliado && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700 font-semibold mb-2">Vista Previa de Ahorro:</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Ahorro por servicio:</p>
                      <p className="text-lg font-bold text-green-600">
                        ${(formData.precioParticular - formData.precioAfiliado).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Porcentaje:</p>
                      <p className="text-lg font-bold text-green-600">
                        {Math.round(((formData.precioParticular - formData.precioAfiliado) / formData.precioParticular) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <EmojiSelector
                  value={formData.icon || '💆'}
                  onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
                  category="servicios"
                />
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.activo !== false}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Servicio activo (visible en la página de reservas)
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {modalType === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

