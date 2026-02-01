"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  imagen: string;
  icon: string;
  activo: boolean;
  categoria: string;
  detalles?: string[];
};

export default function ServiciosTab() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Servicio>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [detallesInput, setDetallesInput] = useState('');
  const [detallesArray, setDetallesArray] = useState<string[]>([]);

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/servicios');
      const data = await response.json();
      
      if (data.success) {
        setServicios(data.servicios || []);
      }
    } catch (error) {
      console.error('Error cargando servicios:', error);
      showNotification.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      id: '',
      nombre: '',
      precio: 0,
      duracion: 30,
      descripcion: '',
      imagen: '',
      icon: '💆',
      activo: true,
      categoria: 'Tratamientos de Bienestar',
      detalles: []
    });
    setDetallesArray([]);
    setImagePreview('');
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (servicio: Servicio) => {
    setFormData(servicio);
    setDetallesArray(servicio.detalles || []);
    setImagePreview(servicio.imagen || '');
    setEditing(servicio.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > 10 * 1024 * 1024) {
      showNotification.error('La imagen es muy grande. Máximo 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      const imageUrl = `/image/${data.filename}`;
      
      setFormData(prev => ({ ...prev, imagen: data.fileName }));
      setImagePreview(imageUrl);
      showNotification.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      showNotification.error('Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const agregarDetalle = () => {
    if (detallesInput.trim()) {
      setDetallesArray([...detallesArray, detallesInput.trim()]);
      setDetallesInput('');
    }
  };

  const eliminarDetalle = (index: number) => {
    setDetallesArray(detallesArray.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Validaciones
      if (!formData.nombre?.trim()) {
        showNotification.error('El nombre del servicio es requerido');
        return;
      }

      if (!formData.precio || formData.precio < 0) {
        showNotification.error('El precio debe ser un número válido');
        return;
      }

      if (!formData.duracion || formData.duracion < 1) {
        showNotification.error('La duración debe ser al menos 1 minuto');
        return;
      }

      const dataToSave = {
        ...formData,
        detalles: detallesArray.length > 0 ? detallesArray : [formData.descripcion || 'Servicio profesional']
      };

      const method = editing ? 'PATCH' : 'POST';
      const response = await fetch('/api/admin/servicios', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar servicio');
      }

      showNotification.success(editing ? 'Servicio actualizado' : 'Servicio creado');
      setShowForm(false);
      setEditing(null);
      setFormData({});
      setDetallesArray([]);
      setImagePreview('');
      await loadServicios();

      // Disparar eventos para actualización en tiempo real
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      window.dispatchEvent(new CustomEvent('servicioActualizado', { detail: { timestamp } }));
      window.dispatchEvent(new CustomEvent('actualizarPaginaPrincipal', { detail: { timestamp } }));
    } catch (error: any) {
      console.error('Error guardando servicio:', error);
      showNotification.error(error.message || 'Error al guardar servicio');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('¿Estás seguro de eliminar este servicio?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/servicios?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar servicio');
      }

      showNotification.success('Servicio eliminado');
      await loadServicios();

      // Disparar eventos
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      window.dispatchEvent(new CustomEvent('servicioActualizado', { detail: { timestamp } }));
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      showNotification.error('Error al eliminar servicio');
    }
  };

  const handleToggleActivo = async (id: string, activo: boolean) => {
    try {
      const response = await fetch('/api/admin/servicios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, activo })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      await loadServicios();
      showNotification.success(`Servicio ${activo ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showNotification.error('Error al cambiar estado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
          <p className="mt-4 text-stone-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">💆</span>
              Gestión de Servicios
            </h2>
            <p className="text-amber-200 mt-2">
              {servicios.length} servicio{servicios.length !== 1 ? 's' : ''} · Administra servicios, precios y detalles
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-[#3d2817] px-6 py-3 rounded-lg hover:bg-amber-50 transition-all flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-2xl">+</span>
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Lista de servicios con diseño mejorado */}
      <div className="grid gap-5">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-stone-100 overflow-hidden"
          >
            <div className="flex items-start gap-5 p-6">
              {/* Imagen mejorada */}
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-stone-200 flex-shrink-0 shadow-md">
                {servicio.imagen ? (
                  <img
                    src={servicio.imagen}
                    alt={servicio.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl">${servicio.icon || '🛎️'}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {servicio.icon || '🛎️'}
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-[#3d2817] flex items-center gap-2">
                      {servicio.icon} {servicio.nombre}
                      {servicio.activo ? (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          ✓ Activo
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-semibold">
                          ✗ Inactivo
                        </span>
                      )}
                    </h3>
                    <p className="text-stone-600 mt-2 leading-relaxed">{servicio.descripcion}</p>
                  </div>

                  {/* Precio destacado */}
                  <div className="text-right bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-3 rounded-xl border-2 border-amber-200">
                    <div className="text-3xl font-bold text-[#3d2817]">
                      ${servicio.precio.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-600 mt-1">
                      ⏱️ {servicio.duracion} min
                    </div>
                  </div>
                </div>

                {/* Categoría y Detalles */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-semibold">
                      📁 {servicio.categoria}
                    </span>
                  </div>
                  
                  {servicio.detalles && servicio.detalles.length > 0 && (
                    <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                      <p className="text-xs font-bold text-stone-600 mb-2">✨ Incluye:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {servicio.detalles.map((detalle, idx) => (
                          <li key={idx} className="text-sm text-stone-700 flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            {detalle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Botones de acción mejorados */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow hover:shadow-md"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleToggleActivo(servicio.id, !servicio.activo)}
                    className={`px-5 py-2 rounded-lg transition text-sm font-semibold shadow hover:shadow-md ${
                      servicio.activo
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {servicio.activo ? '⏸️ Desactivar' : '▶️ Activar'}
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id)}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold shadow hover:shadow-md"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {servicios.length === 0 && (
          <div className="text-center py-20 bg-stone-50 rounded-xl">
            <div className="text-6xl mb-4">🛎️</div>
            <p className="text-xl text-stone-600 font-semibold">No hay servicios creados</p>
            <p className="text-stone-500 mt-2">Haz clic en "Nuevo Servicio" para comenzar</p>
          </div>
        )}
      </div>

      {/* Modal de formulario mejorado */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header del formulario */}
            <div className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white p-6 sticky top-0 z-10">
              <h3 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{editing ? '✏️' : '✨'}</span>
                {editing ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <p className="text-amber-200 mt-1">
                {editing ? 'Actualiza la información del servicio' : 'Completa los datos del nuevo servicio'}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  📝 Nombre del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] transition text-lg"
                  placeholder="Ej: Masaje Relajante"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  📄 Descripción
                </label>
                <textarea
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] transition"
                  placeholder="Describe el servicio en detalle..."
                />
              </div>

              {/* Precio y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#3d2817] mb-2">
                    💵 Precio (COP) *
                  </label>
                  <input
                    type="number"
                    value={formData.precio || ''}
                    onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] transition text-lg"
                    placeholder="100000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#3d2817] mb-2">
                    ⏱️ Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    value={formData.duracion || ''}
                    onChange={(e) => setFormData({ ...formData, duracion: Number(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] transition text-lg"
                    placeholder="30"
                    min="1"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  📁 Categoría *
                </label>
                <select
                  value={formData.categoria || ''}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] transition text-lg"
                >
                  <option value="Terapias de Rehabilitación">🦴 Terapias de Rehabilitación</option>
                  <option value="Tratamientos de Bienestar">🌿 Tratamientos de Bienestar</option>
                  <option value="Cuidado Facial y Especializado">✨ Cuidado Facial y Especializado</option>
                </select>
              </div>

              {/* Icono */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  😊 Icono (Emoji)
                </label>
                <div className="grid grid-cols-10 gap-2 p-4 bg-stone-50 rounded-lg border-2 border-stone-200">
                  {['🦴', '💪', '🦵', '🤝', '🦿', '🤲', '👁️', '🌿', '💆', '✨', '🧘', '🌺', '🦶', '🏃', '🔥', '💫', '⚡', '🌟', '🎯', '💎'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`text-4xl p-3 rounded-lg hover:bg-amber-100 transition transform hover:scale-110 ${formData.icon === emoji ? 'bg-amber-200 ring-2 ring-amber-500' : 'bg-white'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  🖼️ Imagen del Servicio
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3d2817] file:text-white file:font-semibold hover:file:bg-[#2d1f11] transition"
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-[#3d2817]">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3d2817]"></div>
                      <span>Subiendo imagen...</span>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-stone-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles (nuevo) */}
              <div>
                <label className="block text-sm font-bold text-[#3d2817] mb-2">
                  ✨ Detalles del Servicio (qué incluye)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={detallesInput}
                      onChange={(e) => setDetallesInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && agregarDetalle()}
                      className="flex-1 px-4 py-2 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] transition"
                      placeholder="Ej: Masaje profundo de 60 minutos"
                    />
                    <button
                      type="button"
                      onClick={agregarDetalle}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      + Agregar
                    </button>
                  </div>
                  
                  {detallesArray.length > 0 && (
                    <div className="bg-stone-50 rounded-lg p-4 border-2 border-stone-200 space-y-2">
                      {detallesArray.map((detalle, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-stone-200">
                          <span className="text-sm">✓ {detalle}</span>
                          <button
                            type="button"
                            onClick={() => eliminarDetalle(idx)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 p-6 bg-stone-50 border-t-2 border-stone-200">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-4 rounded-lg hover:shadow-lg transition font-bold text-lg"
              >
                {editing ? '💾 Guardar Cambios' : '✨ Crear Servicio'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setFormData({});
                  setDetallesArray([]);
                  setImagePreview('');
                }}
                className="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-bold text-lg"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

