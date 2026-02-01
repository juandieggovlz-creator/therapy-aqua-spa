"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';
import Image from 'next/image';

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
  detalles?: string[];
};

const categorias = [
  "Terapias de Rehabilitación",
  "Tratamientos de Bienestar",
  "Cuidado Facial y Especializado"
];

export default function ServiciosTabMejorado() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [descuentos, setDescuentos] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'descuento'>('create');
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState<Partial<Servicio>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [descuentoTemp, setDescuentoTemp] = useState(0);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todas');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

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

  const openCreateModal = () => {
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
      categoria: categorias[0],
      orden: servicios.length + 1,
      detalles: ['Profesionales certificados', 'Equipos de última tecnología']
    });
    setSelectedServicio(null);
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (servicio: Servicio) => {
    setFormData({...servicio});
    setSelectedServicio(servicio);
    setModalType('edit');
    setShowModal(true);
  };

  const openDescuentoModal = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setDescuentoTemp(servicio.descuento || descuentos[servicio.id] || 0);
    setModalType('descuento');
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification.error('Por favor selecciona un archivo de imagen');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imagen: data.url }));
        showNotification.success('Imagen subida exitosamente');
      } else {
        showNotification.error(data.error || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      showNotification.error('Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre) {
      showNotification.error('El nombre es requerido');
      return;
    }

    try {
      let dataToSave = { ...formData };
      
      // Generar ID automático para nuevos servicios
      if (modalType === 'create' && !dataToSave.id) {
        const nombreParaId = dataToSave.nombre || 'servicio';
        let idBase = nombreParaId
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        let id = idBase;
        let counter = 1;
        while (servicios.some(s => s.id === id)) {
          id = `${idBase}-${counter}`;
          counter++;
        }
        dataToSave.id = id;
      }

      const url = '/api/admin/servicios';
      const method = modalType === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar');
      }

      showNotification.success(modalType === 'create' ? 'Servicio creado' : 'Servicio actualizado');
      setShowModal(false);
      await loadData();

      // Disparar eventos de sincronización
      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-save' },
          bubbles: true
        }));
      });
    } catch (error: any) {
      console.error('Error guardando:', error);
      showNotification.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (servicio: Servicio) => {
    const confirmed = await showConfirm(
      `¿Eliminar "${servicio.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await fetch(`/api/admin/servicios?id=${servicio.id}`, { method: 'DELETE' });
      showNotification.success('Servicio eliminado');
      await loadData();

      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-delete' },
          bubbles: true
        }));
      });
    } catch (error) {
      showNotification.error('Error al eliminar');
    }
  };

  const handleToggle = async (servicio: Servicio, field: 'activo' | 'destacado') => {
    try {
      await fetch('/api/admin/servicios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: servicio.id, 
          [field]: !servicio[field] 
        })
      });
      await loadData();

      const timestamp = Date.now();
      localStorage.setItem('servicios_actualizados', timestamp.toString());
      localStorage.setItem('necesita_recarga', 'true');
      
      ['servicioActualizado', 'actualizarPaginaPrincipal'].forEach(evento => {
        window.dispatchEvent(new CustomEvent(evento, {
          detail: { timestamp, source: 'admin-toggle' },
          bubbles: true
        }));
      });
    } catch (error) {
      showNotification.error('Error al actualizar');
    }
  };

  const handleSaveDescuento = async () => {
    if (!selectedServicio) return;

    try {
      await fetch('/api/admin/descuentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          servicioId: selectedServicio.id, 
          descuento: descuentoTemp 
        })
      });

      showNotification.success(
        descuentoTemp > 0
          ? `Descuento del ${descuentoTemp}% aplicado`
          : 'Descuento eliminado'
      );
      
      setShowModal(false);
      await loadData();

      const timestamp = Date.now();
      localStorage.setItem('descuentos_actualizados', timestamp.toString());
      window.dispatchEvent(new CustomEvent('descuentoActualizado', {
        detail: { servicioId: selectedServicio.id, descuento: descuentoTemp }
      }));
    } catch (error) {
      showNotification.error('Error al aplicar descuento');
    }
  };

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter(s => {
    const matchSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filterCategoria === 'todas' || s.categoria === filterCategoria;
    const matchEstado = 
      filterEstado === 'todos' ||
      (filterEstado === 'activos' && s.activo) ||
      (filterEstado === 'inactivos' && !s.activo) ||
      (filterEstado === 'destacados' && s.destacado);
    
    return matchSearch && matchCategoria && matchEstado;
  });

  const stats = {
    total: servicios.length,
    activos: servicios.filter(s => s.activo).length,
    inactivos: servicios.filter(s => !s.activo).length,
    destacados: servicios.filter(s => s.destacado).length,
    conDescuento: Object.keys(descuentos).filter(k => descuentos[k] > 0).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Servicios</h2>
            <p className="text-gray-600 mt-1">Administra servicios, precios y descuentos</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Servicio
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-green-700">Activos</div>
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-red-700">Inactivos</div>
            <div className="text-2xl font-bold text-red-600">{stats.inactivos}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-amber-700">Destacados</div>
            <div className="text-2xl font-bold text-amber-600">{stats.destacados}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-blue-700">Con Descuento</div>
            <div className="text-2xl font-bold text-blue-600">{stats.conDescuento}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="todas">Todas</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="destacados">Destacados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serviciosFiltrados.map(servicio => {
          const descuentoActual = servicio.descuento || descuentos[servicio.id] || 0;
          const tieneDescuento = descuentoActual > 0;
          const precioConDescuento = tieneDescuento
            ? servicio.precio * (1 - descuentoActual / 100)
            : servicio.precio;

          return (
            <div
              key={servicio.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-gray-200 overflow-hidden"
            >
              {/* Header con estado */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(servicio, 'activo')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                    servicio.activo
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {servicio.activo ? '✓ ACTIVO' : '✕ INACTIVO'}
                </button>
                <div className="flex gap-2">
                  {tieneDescuento && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      -{descuentoActual}% OFF
                    </span>
                  )}
                  {servicio.destacado && (
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      ⭐ DESTACADO
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Columna Izquierda - Preview Visual */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3 text-center">
                      👁️ Preview Web Pública
                    </p>
                    
                    {/* Imagen Preview */}
                    <div className="relative h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden mb-3 shadow-md">
                      {servicio.imagen ? (
                        <Image
                          src={servicio.imagen}
                          alt={servicio.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-5xl">{servicio.icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Título como se verá en la web */}
                    <h3 className="font-bold text-sm text-gray-800 mb-2 text-center line-clamp-2 min-h-[2.5rem]">
                      {servicio.icon} {servicio.nombre}
                    </h3>

                    {/* Precio como se verá en la web */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Precio en la web:</p>
                        {tieneDescuento ? (
                          <div>
                            <p className="text-sm text-red-500 line-through font-semibold">
                              ${servicio.precio.toLocaleString('es-CO')}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <p className="text-2xl font-bold text-green-600">
                                ${Math.round(precioConDescuento).toLocaleString('es-CO')}
                              </p>
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                -{descuentoActual}%
                              </span>
                            </div>
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              ¡Ahorras ${(servicio.precio - Math.round(precioConDescuento)).toLocaleString('es-CO')}!
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-amber-600">
                            ${servicio.precio.toLocaleString('es-CO')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duración */}
                    <div className="bg-blue-50 rounded-lg p-2 mt-3 text-center border border-blue-200">
                      <p className="text-xs text-blue-700">⏱️ Duración</p>
                      <p className="text-lg font-bold text-blue-900">{servicio.duracion} min</p>
                    </div>

                    {/* Categoría */}
                    <div className="text-center mt-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                        📁 {servicio.categoria}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Información y Acciones */}
                <div className="space-y-3">
                  {/* Información del Servicio */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-2">
                      📋 Información
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Título:</p>
                        <p className="text-gray-900 font-medium">{servicio.nombre}</p>
                      </div>
                      
                      {servicio.descripcion && (
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Descripción:</p>
                          <p className="text-gray-700 text-xs line-clamp-3">{servicio.descripcion}</p>
                        </div>
                      )}

                      {servicio.detalles && servicio.detalles.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Incluye:</p>
                          <ul className="space-y-1">
                            {servicio.detalles.slice(0, 3).map((detalle, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span className="line-clamp-1">{detalle}</span>
                              </li>
                            ))}
                            {servicio.detalles.length > 3 && (
                              <li className="text-xs text-gray-500 italic">
                                +{servicio.detalles.length - 3} más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs text-gray-600">ID: <span className="font-mono text-xs">{servicio.id}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="space-y-2">
                    <button
                      onClick={() => openEditModal(servicio)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar Servicio
                    </button>

                    <button
                      onClick={() => openDescuentoModal(servicio)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {tieneDescuento ? `Descuento: ${descuentoActual}%` : 'Aplicar Descuento'}
                    </button>

                    <button
                      onClick={() => handleToggle(servicio, 'destacado')}
                      className={`w-full px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                        servicio.destacado
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={servicio.destacado ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {servicio.destacado ? 'Quitar Destacado' : 'Marcar Destacado'}
                    </button>

                    <button
                      onClick={() => handleDelete(servicio)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {serviciosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg">No se encontraron servicios</p>
          <p className="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold">
                {modalType === 'create' && '✨ Crear Nuevo Servicio'}
                {modalType === 'edit' && '✏️ Editar Servicio'}
                {modalType === 'descuento' && '🏷️ Gestionar Descuento'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {modalType === 'descuento' ? (
                /* Modal de Descuento */
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="font-bold text-lg text-purple-900 mb-2">
                      {selectedServicio?.nombre}
                    </h4>
                    <p className="text-purple-700">
                      Precio original: <span className="font-bold">${selectedServicio?.precio.toLocaleString()}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje de Descuento (0-100%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={descuentoTemp}
                      onChange={(e) => setDescuentoTemp(Number(e.target.value))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={descuentoTemp}
                        onChange={(e) => setDescuentoTemp(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12 text-right">{descuentoTemp}%</span>
                    </div>
                  </div>

                  {descuentoTemp > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700">Precio con descuento:</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${Math.round((selectedServicio?.precio || 0) * (1 - descuentoTemp / 100)).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">
                            ${selectedServicio?.precio.toLocaleString()}
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            Ahorras: ${Math.round((selectedServicio?.precio || 0) * (descuentoTemp / 100)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDescuento}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {descuentoTemp > 0 ? 'Aplicar Descuento' : 'Eliminar Descuento'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Modal de Crear/Editar */
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Servicio *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre || ''}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Ej: Masaje Relajante"
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={formData.categoria || ''}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        {categorias.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Icono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icono (Emoji)
                      </label>
                      <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Ej: 💆"
                      />
                    </div>

                    {/* Precio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio ($) *
                      </label>
                      <input
                        type="number"
                        value={formData.precio || 0}
                        onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Duración */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración (min) *
                      </label>
                      <input
                        type="number"
                        value={formData.duracion || 0}
                        onChange={(e) => setFormData({ ...formData, duracion: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Descripción */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.descripcion || ''}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Descripción breve del servicio..."
                      />
                    </div>

                    {/* Imagen */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen
                      </label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            disabled={uploadingImage}
                          />
                        </div>
                        {formData.imagen && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                            <Image
                              src={formData.imagen}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {uploadingImage && (
                        <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detalles (uno por línea)
                      </label>
                      <textarea
                        value={(formData.detalles || []).join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          detalles: e.target.value.split('\n').filter(d => d.trim()) 
                        })}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Profesionales certificados&#10;Equipos de última tecnología&#10;Ambiente relajante"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="col-span-2 flex gap-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.activo || false}
                          onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                          className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Activo</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.destacado || false}
                          onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                          className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Destacado</span>
                      </label>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                    >
                      {modalType === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

