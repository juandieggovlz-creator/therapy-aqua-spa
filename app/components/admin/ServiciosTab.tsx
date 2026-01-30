"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  precioOriginal: number;
  duracion: number;
  descripcion: string;
  imagen: string;
  icon: string;
  activo: boolean;
  destacado: boolean;
  categoria: string;
  orden: number;
};

export default function ServiciosTab() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [descuentos, setDescuentos] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Servicio>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDescuentoModal, setShowDescuentoModal] = useState<string | null>(null);
  const [descuentoValue, setDescuentoValue] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [serviciosRes, descuentosRes] = await Promise.all([
        fetch('/api/admin/servicios'),
        fetch('/api/admin/descuentos')
      ]);
      const serviciosData = await serviciosRes.json();
      const descuentosData = await descuentosRes.json();
      setServicios(serviciosData.servicios || []);
      setDescuentos(descuentosData.descuentos || {});
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showNotification.error('Error al cargar servicios');
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      id: '',
      nombre: '',
      precio: 0,
      precioOriginal: 0,
      duracion: 30,
      descripcion: '',
      imagen: '',
      icon: '✨',
      activo: true,
      destacado: false,
      categoria: 'Tratamientos de Bienestar', // Categoría por defecto
      orden: servicios.length + 1
    });
    setEditing(null);
    setShowForm(true);
  };

  // Función para verificar si un ID está disponible
  const esIdDisponible = (id: string): boolean => {
    if (!id || editing) return true; // Si está editando, el ID actual está bien
    return !servicios.some(s => s.id === id);
  };

  const handleEdit = (servicio: Servicio) => {
    setFormData(servicio);
    setEditing(servicio.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      // Validar campos requeridos
      if (!formData.nombre) {
        showNotification.error('El nombre del servicio es requerido');
        return;
      }

      // Generar ID automático si no existe (solo para nuevos servicios)
      let dataToSave = { ...formData };
      if (!editing && !dataToSave.id) {
        // Generar ID base automático basado en el nombre
        const nombreParaId = dataToSave.nombre || 'servicio';
        let idBase = nombreParaId
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remover acentos
          .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .replace(/-+/g, '-') // Múltiples guiones a uno solo
          .replace(/^-|-$/g, '') // Remover guiones al inicio/fin
          .substring(0, 50); // Limitar longitud
        
        // Verificar si el ID ya existe y agregar sufijo numérico si es necesario
        let idFinal = idBase;
        let contador = 1;
        const idsExistentes = servicios.map(s => s.id);
        
        while (idsExistentes.includes(idFinal)) {
          contador++;
          idFinal = `${idBase}-${contador}`;
          console.log(`⚠️ ID "${idBase}" ya existe, intentando con: ${idFinal}`);
        }
        
        dataToSave.id = idFinal;
        console.log('🆔 ID generado automáticamente:', idFinal);
      }

      // Validar que el ID exista
      if (!dataToSave.id) {
        showNotification.error('No se pudo generar el ID del servicio');
        return;
      }

      // Validación adicional de datos antes de enviar
      if (!dataToSave.nombre || dataToSave.nombre.trim() === '') {
        showNotification.error('El nombre del servicio no puede estar vacío');
        return;
      }

      if (dataToSave.precio === undefined || dataToSave.precio < 0) {
        showNotification.error('El precio debe ser un número válido mayor o igual a 0');
        return;
      }

      if (dataToSave.duracion === undefined || dataToSave.duracion < 1) {
        showNotification.error('La duración debe ser al menos 1 minuto');
        return;
      }

      console.log('📤 Enviando datos al servidor:', dataToSave);
      
      const method = editing ? 'PATCH' : 'POST';
      const response = await fetch('/api/admin/servicios', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Error al guardar el servicio';
        
        try {
          const error = await response.json();
          console.error('❌ Error del servidor:', error);
          
          // Mejorar mensaje de error para ID duplicado
          if (error.error && error.error.includes('Ya existe')) {
            errorMessage = `❌ ${error.error}. Por favor, elige un ID diferente o déjalo en automático.`;
          } else if (error.error) {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('❌ Error parseando respuesta del servidor:', parseError);
          errorMessage = `Error ${response.status}: No se pudo procesar la respuesta del servidor`;
        }
        
        showNotification.error(errorMessage);
        return; // No lanzar error, solo mostrar notificación
      }

      showNotification.success(editing ? 'Servicio actualizado' : 'Servicio creado');
      setShowForm(false);
      setEditing(null);
      setFormData({});
      await loadData();

      // Guardar señal en localStorage para páginas que se abran después
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      console.log('📝 Señal de actualización guardada (SAVE)');
      
      // Disparar eventos inmediatamente para páginas ya abiertas
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp: timestamp, source: 'admin-save' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      // Disparar eventos adicionales para asegurar captura
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-save' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-save' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error: any) {
      console.error('💥 Excepción capturada en handleSave:', error);
      console.error('💥 Tipo de error:', typeof error);
      console.error('💥 Error stringificado:', JSON.stringify(error, null, 2));
      
      let mensajeError = 'Error inesperado al guardar el servicio';
      
      if (error instanceof Error) {
        mensajeError = error.message;
      } else if (typeof error === 'string') {
        mensajeError = error;
      } else if (error && error.message) {
        mensajeError = error.message;
      } else if (error && error.error) {
        mensajeError = error.error;
      }
      
      showNotification.error(`❌ ${mensajeError}. Por favor, verifica los datos e intenta nuevamente.`);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      '¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      await fetch(`/api/admin/servicios?id=${id}`, { method: 'DELETE' });
      showNotification.success('Servicio eliminado');
      await loadData();

      // Guardar señal en localStorage
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      console.log('📝 Señal de actualización guardada (DELETE)');

      // Disparar eventos inmediatamente
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp: timestamp, source: 'admin-delete' },
          bubbles: true,
          cancelable: true
        }));
      });
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-delete' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-delete' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error) {
      console.error('Error eliminando:', error);
      showNotification.error('Error al eliminar servicio');
    }
  };

  const handleToggle = async (id: string, field: 'activo' | 'destacado', value: boolean) => {
    try {
      await fetch('/api/admin/servicios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      });
      await loadData();

      // Guardar señal en localStorage
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      console.log('📝 Señal de actualización guardada (TOGGLE)');

      // Disparar eventos inmediatamente
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp: timestamp, source: 'admin-toggle' },
          bubbles: true,
          cancelable: true
        }));
      });
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-toggle' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      setTimeout(() => {
        ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-toggle' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error) {
      console.error('Error actualizando:', error);
      showNotification.error('Error al actualizar servicio');
    }
  };

  const handleDescuento = async (servicioId: string) => {
    try {
      await fetch('/api/admin/descuentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicioId, descuento: descuentoValue })
      });

      showNotification.success(
        descuentoValue > 0
          ? `Descuento del ${descuentoValue}% aplicado`
          : 'Descuento removido'
      );

      setShowDescuentoModal(null);
      setDescuentoValue(0);
      await loadData();

      // Guardar señal en localStorage
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('descuentos_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      console.log('📝 Señal de actualización guardada (DESCUENTO)');

      // Disparar eventos inmediatamente
      ['descuentoActualizado', 'servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp: timestamp, source: 'admin-descuento' },
          bubbles: true,
          cancelable: true
        }));
      });
      
      setTimeout(() => {
        ['descuentoActualizado', 'servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-descuento' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 100);
      
      setTimeout(() => {
        ['descuentoActualizado', 'servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
          window.dispatchEvent(new CustomEvent(evento, {
            detail: { timestamp: timestamp, source: 'admin-descuento' },
            bubbles: true,
            cancelable: true
          }));
        });
      }, 300);
    } catch (error) {
      console.error('Error guardando descuento:', error);
      showNotification.error('Error al guardar descuento');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      console.log('📤 Subiendo imagen:', file.name, 'Tamaño:', file.size, 'bytes');
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      console.log('📥 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      console.log('✅ Imagen subida exitosamente:', data);
      console.log('✅ Nombre del archivo guardado:', data.filename);
      console.log('✅ Ruta que se usará:', `/image/${encodeURIComponent(data.filename)}`);
      
      setFormData(prev => ({ ...prev, imagen: data.filename }));
      showNotification.success(`✅ Imagen "${data.filename}" subida correctamente`);
    } catch (error) {
      console.error('💥 Error subiendo imagen:', error);
      showNotification.error('❌ Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const calcularPrecioFinal = (servicio: Servicio) => {
    const descuento = descuentos[servicio.id] || 0;
    if (descuento > 0) {
      return Math.round(servicio.precioOriginal * (1 - descuento / 100));
    }
    return servicio.precio;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2817]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#3d2817]">Gestión de Servicios</h2>
          <p className="text-stone-600 mt-1">Administra servicios, precios y descuentos</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
        >
          <span className="text-xl">+</span>
          Nuevo Servicio
        </button>
      </div>

      {/* Lista de servicios */}
      <div className="grid gap-4">
        {servicios.map((servicio) => {
          const descuento = descuentos[servicio.id] || 0;
          const precioFinal = calcularPrecioFinal(servicio);

          return (
            <div
              key={servicio.id}
              className="bg-white rounded-lg shadow-md p-6 border border-stone-200"
            >
              <div className="flex items-start gap-4">
                {/* Imagen */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-stone-200 flex-shrink-0">
                  {servicio.imagen && servicio.imagen.trim() !== '' ? (
                    <img
                      src={servicio.imagen.startsWith('http') || servicio.imagen.startsWith('/') 
                        ? servicio.imagen 
                        : `/image/${encodeURIComponent(servicio.imagen)}`}
                      alt={servicio.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Error cargando imagen:', servicio.imagen);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">${servicio.icon || '🛎️'}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {servicio.icon || '🛎️'}
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#3d2817] flex items-center gap-2">
                        {servicio.icon} {servicio.nombre}
                      </h3>
                      <p className="text-sm text-stone-600 mt-1">{servicio.descripcion}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-stone-700">
                          ⏱️ {servicio.duracion} min
                        </span>
                        <span className="text-stone-700">
                          📁 {servicio.categoria}
                        </span>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      {descuento > 0 ? (
                        <div>
                          <div className="text-sm text-stone-500 line-through">
                            ${servicio.precioOriginal.toLocaleString()}
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${precioFinal.toLocaleString()}
                          </div>
                          <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1">
                            -{descuento}% OFF
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-[#3d2817]">
                          ${servicio.precio.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(servicio)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        setShowDescuentoModal(servicio.id);
                        setDescuentoValue(descuentos[servicio.id] || 0);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                    >
                      💰 Descuento
                    </button>
                    <button
                      onClick={() => handleToggle(servicio.id, 'activo', !servicio.activo)}
                      className={`px-4 py-2 rounded transition text-sm ${
                        servicio.activo
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                    >
                      {servicio.activo ? '✓ Activo' : '✗ Inactivo'}
                    </button>
                    <button
                      onClick={() => handleToggle(servicio.id, 'destacado', !servicio.destacado)}
                      className={`px-4 py-2 rounded transition text-sm ${
                        servicio.destacado
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {servicio.destacado ? '⭐ Destacado' : '☆ Destacar'}
                    </button>
                    <button
                      onClick={() => handleDelete(servicio.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-[#3d2817] mb-4">
              {editing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  ID del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!editing}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                  placeholder="ej: masaje-relajante"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                  placeholder="ej: Masaje Relajante"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Precio (COP) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.precio !== undefined ? formData.precio : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const precio = value === '' ? 0 : Number(value);
                      // Actualizar precio y precioOriginal al mismo valor
                      // (el descuento se maneja por separado en el modal de descuentos)
                      setFormData({
                        ...formData,
                        precio,
                        precioOriginal: precio
                      });
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || Number(e.target.value) === 0) {
                        setFormData({ ...formData, precio: 0, precioOriginal: 0 });
                      }
                    }}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                    placeholder="Ej: 100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                    Duración (minutos) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.duracion !== undefined ? formData.duracion : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const duracion = value === '' ? 0 : Number(value);
                      setFormData({ ...formData, duracion });
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || Number(e.target.value) === 0) {
                        setFormData({ ...formData, duracion: 30 });
                      }
                    }}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                    placeholder="Ej: 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                  placeholder="Describe el servicio..."
                />
              </div>

              {/* ID del servicio */}
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  ID del Servicio {!editing && <span className="text-xs font-normal text-green-600">(Opcional - se genera automáticamente)</span>}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.id || ''}
                    disabled
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="ID automático"
                  />
                ) : (
                  <div className="space-y-2">
                    <select
                      value={formData.id || 'auto'}
                      onChange={(e) => {
                        if (e.target.value === 'auto' || e.target.value === 'custom') {
                          setFormData({ ...formData, id: '' });
                        } else {
                          setFormData({ ...formData, id: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                    >
                      <option value="auto">🤖 Generar automáticamente (Recomendado)</option>
                      <option value="custom">✍️ Escribir ID personalizado</option>
                      <option disabled>───── IDs Disponibles ─────</option>
                      <option value="columna" disabled={!esIdDisponible('columna')}>columna {!esIdDisponible('columna') ? '(En uso)' : '✓'}</option>
                      <option value="brazos" disabled={!esIdDisponible('brazos')}>brazos {!esIdDisponible('brazos') ? '(En uso)' : '✓'}</option>
                      <option value="piernas" disabled={!esIdDisponible('piernas')}>piernas {!esIdDisponible('piernas') ? '(En uso)' : '✓'}</option>
                      <option value="hombro" disabled={!esIdDisponible('hombro')}>hombro {!esIdDisponible('hombro') ? '(En uso)' : '✓'}</option>
                      <option value="cadera" disabled={!esIdDisponible('cadera')}>cadera {!esIdDisponible('cadera') ? '(En uso)' : '✓'}</option>
                      <option value="cuello" disabled={!esIdDisponible('cuello')}>cuello {!esIdDisponible('cuello') ? '(En uso)' : '✓'}</option>
                      <option value="espalda" disabled={!esIdDisponible('espalda')}>espalda {!esIdDisponible('espalda') ? '(En uso)' : '✓'}</option>
                      <option value="facial" disabled={!esIdDisponible('facial')}>facial {!esIdDisponible('facial') ? '(En uso)' : '✓'}</option>
                      <option value="rodillas" disabled={!esIdDisponible('rodillas')}>rodillas {!esIdDisponible('rodillas') ? '(En uso)' : '✓'}</option>
                      <option value="pies" disabled={!esIdDisponible('pies')}>pies {!esIdDisponible('pies') ? '(En uso)' : '✓'}</option>
                      <option value="deportivo" disabled={!esIdDisponible('deportivo')}>deportivo {!esIdDisponible('deportivo') ? '(En uso)' : '✓'}</option>
                      <option value="relajante" disabled={!esIdDisponible('relajante')}>relajante {!esIdDisponible('relajante') ? '(En uso)' : '✓'}</option>
                      <option value="terapeutico" disabled={!esIdDisponible('terapeutico')}>terapeutico {!esIdDisponible('terapeutico') ? '(En uso)' : '✓'}</option>
                    </select>
                    {formData.id && !['columna', 'brazos', 'piernas', 'hombro', 'cadera', 'cuello', 'espalda', 'facial', 'rodillas', 'pies', 'deportivo', 'relajante', 'terapeutico'].includes(formData.id) && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={formData.id || ''}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                            esIdDisponible(formData.id)
                              ? 'border-green-300 focus:ring-green-500 bg-green-50'
                              : 'border-red-300 focus:ring-red-500 bg-red-50'
                          }`}
                          placeholder="ej: masaje-relajante"
                        />
                        {esIdDisponible(formData.id) ? (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            ✅ ID personalizado disponible: <strong>{formData.id}</strong>
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            ❌ Este ID ya existe. El sistema agregará un sufijo automáticamente o elige otro.
                          </p>
                        )}
                      </div>
                    )}
                    {!formData.id && (
                      <p className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                        💡 <strong>Recomendado:</strong> Deja que se genere automáticamente basado en el nombre del servicio
                      </p>
                    )}
                    {formData.id && (
                      <p className="text-xs text-stone-600">El ID debe ser único en todo el sistema</p>
                    )}
                  </div>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.categoria || 'Tratamientos de Bienestar'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                >
                  <option value="Terapias de Rehabilitación">🦴 Terapias de Rehabilitación</option>
                  <option value="Tratamientos de Bienestar">🌿 Tratamientos de Bienestar</option>
                  <option value="Cuidado Facial y Especializado">✨ Cuidado Facial y Especializado</option>
                </select>
                <p className="text-xs text-stone-600 mt-1">
                  Selecciona una de las 3 categorías disponibles en la página de servicios
                </p>
              </div>

              {/* Icono (Emoji) */}
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Icono (Emoji)
                </label>
                <div className="space-y-3">
                  {/* Selector visual de emojis */}
                  <div className="grid grid-cols-8 gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
                    {['🦴', '💪', '🦵', '🤝', '🦿', '🤲', '👁️', '🌿', '💆', '✨', '🧘', '🌺', '🦶', '🏃', '🔥', '💫', '⚡', '🌟', '🎯', '💎'].map((emoji, index) => (
                      <button
                        key={`emoji-${index}-${emoji}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`text-3xl p-2 rounded-lg hover:bg-amber-100 transition ${formData.icon === emoji ? 'bg-amber-200 ring-2 ring-amber-500' : 'bg-white'}`}
                        title={`Seleccionar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {/* Input manual */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                      placeholder="o escribe otro emoji ej: 💆"
                      maxLength={2}
                    />
                    {formData.icon && (
                      <div className="text-4xl">{formData.icon}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                />
                {uploadingImage && <p className="text-sm text-stone-600 mt-1">Subiendo...</p>}
                {formData.imagen && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.imagen}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-[#3d2817] to-[#2d1f11] text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-semibold"
              >
                {editing ? 'Guardar Cambios' : 'Crear Servicio'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setFormData({});
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de descuento */}
      {showDescuentoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-[#3d2817] mb-4">
              Aplicar Descuento
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={descuentoValue}
                  onChange={(e) => setDescuentoValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817]"
                  placeholder="0"
                />
                <p className="text-xs text-stone-600 mt-1">
                  Ingresa 0 para remover el descuento
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDescuento(showDescuentoModal)}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Aplicar
              </button>
              <button
                onClick={() => {
                  setShowDescuentoModal(null);
                  setDescuentoValue(0);
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

