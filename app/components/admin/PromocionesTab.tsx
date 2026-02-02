"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

type TipoPromocion = 'porcentaje' | 'monto_fijo' | 'precio_minimo' | '2x1' | 'combo';
type AplicableA = 'todos' | 'terapias' | 'productos' | 'servicios_adicionales' | 'especificos';

type Promocion = {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoPromocion;
  valorDescuento: number;
  precioMinimo?: number;
  aplicableA: AplicableA;
  itemsIncluidos: string[];
  fechaInicio: string;
  fechaFin: string;
  diasValidos: number[];
  horarioInicio?: string;
  horarioFin?: string;
  maximoUsos?: number;
  usosActuales: number;
  activo: boolean;
  prioridad: number;
  codigoPromocion?: string;
  visibleWeb: boolean;
};

type ItemSeleccionable = {
  id: string;
  nombre: string;
  tipo: 'terapia' | 'producto' | 'servicio_adicional';
  precio: number;
};

export default function PromocionesTab() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(null);
  const [itemsDisponibles, setItemsDisponibles] = useState<ItemSeleccionable[]>([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'porcentaje' as TipoPromocion,
    valorDescuento: 0,
    precioMinimo: 0,
    aplicableA: 'todos' as AplicableA,
    itemsIncluidos: [] as string[],
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    diasValidos: [1, 2, 3, 4, 5, 6, 0] as number[], // Todos los días
    horarioInicio: '',
    horarioFin: '',
    maximoUsos: undefined as number | undefined,
    activo: true,
    prioridad: 1,
    codigoPromocion: '',
    visibleWeb: true
  });

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    cargarPromociones();
    cargarItemsDisponibles();
  }, []);

  const cargarPromociones = async () => {
    try {
      const response = await fetch('/api/admin/promociones');
      const data = await response.json();
      if (data.success) {
        setPromociones(data.promociones);
      }
    } catch (error) {
      console.error('Error cargando promociones:', error);
      showNotification.error('Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const cargarItemsDisponibles = async () => {
    try {
      const [servicios, productos, serviciosAdicionales] = await Promise.all([
        fetch('/api/admin/servicios').then(r => r.json()),
        fetch('/api/admin/productos').then(r => r.json()),
        fetch('/api/admin/servicios-adicionales').then(r => r.json())
      ]);

      const items: ItemSeleccionable[] = [];

      if (servicios.success && Array.isArray(servicios.servicios)) {
        servicios.servicios.forEach((s: any) => {
          if (s.servicio_id && s.nombre) {
            items.push({
              id: s.servicio_id,
              nombre: s.nombre,
              tipo: 'terapia',
              precio: Number(s.precio) || 0
            });
          }
        });
      }

      if (productos.success && Array.isArray(productos.productos)) {
        productos.productos.forEach((p: any) => {
          if (p.producto_id && p.nombre) {
            items.push({
              id: p.producto_id,
              nombre: p.nombre,
              tipo: 'producto',
              precio: Number(p.precio) || 0
            });
          }
        });
      }

      if (serviciosAdicionales.success && serviciosAdicionales.serviciosAdicionales && Array.isArray(serviciosAdicionales.serviciosAdicionales)) {
        serviciosAdicionales.serviciosAdicionales.forEach((sa: any) => {
          if (sa.servicio_id && sa.nombre) {
            items.push({
              id: sa.servicio_id,
              nombre: sa.nombre,
              tipo: 'servicio_adicional',
              precio: Number(sa.precio_particular) || 0
            });
          }
        });
      }

      setItemsDisponibles(items);
      console.log('✅ Items disponibles cargados:', items.length);
    } catch (error) {
      console.error('❌ Error cargando items:', error);
      showNotification.error('Error al cargar items disponibles');
    }
  };

  const openCreateModal = () => {
    setEditingPromocion(null);
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'porcentaje',
      valorDescuento: 0,
      precioMinimo: 0,
      aplicableA: 'todos',
      itemsIncluidos: [],
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diasValidos: [1, 2, 3, 4, 5, 6, 0],
      horarioInicio: '',
      horarioFin: '',
      maximoUsos: undefined,
      activo: true,
      prioridad: 1,
      codigoPromocion: '',
      visibleWeb: true
    });
    setShowModal(true);
  };

  const openEditModal = (promocion: Promocion) => {
    setEditingPromocion(promocion);
    setFormData({
      nombre: promocion.nombre,
      descripcion: promocion.descripcion,
      tipo: promocion.tipo,
      valorDescuento: promocion.valorDescuento,
      precioMinimo: promocion.precioMinimo || 0,
      aplicableA: promocion.aplicableA,
      itemsIncluidos: promocion.itemsIncluidos,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      diasValidos: promocion.diasValidos,
      horarioInicio: promocion.horarioInicio || '',
      horarioFin: promocion.horarioFin || '',
      maximoUsos: promocion.maximoUsos,
      activo: promocion.activo,
      prioridad: promocion.prioridad,
      codigoPromocion: promocion.codigoPromocion || '',
      visibleWeb: promocion.visibleWeb
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      showNotification.error('El nombre es obligatorio');
      return;
    }

    if (formData.tipo === 'precio_minimo' && (!formData.precioMinimo || formData.precioMinimo <= 0)) {
      showNotification.error('Debes especificar un precio mínimo válido');
      return;
    }

    if (formData.aplicableA === 'especificos' && formData.itemsIncluidos.length === 0) {
      showNotification.error('Debes seleccionar al menos un item para esta promoción');
      return;
    }

    try {
      const url = editingPromocion
        ? '/api/admin/promociones'
        : '/api/admin/promociones';

      const method = editingPromocion ? 'PATCH' : 'POST';

      const payload: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        valorDescuento: formData.valorDescuento,
        precioMinimo: formData.tipo === 'precio_minimo' ? formData.precioMinimo : null,
        aplicableA: formData.aplicableA,
        itemsIncluidos: formData.aplicableA === 'especificos' ? formData.itemsIncluidos : [],
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        diasValidos: formData.diasValidos,
        horarioInicio: formData.horarioInicio || null,
        horarioFin: formData.horarioFin || null,
        maximoUsos: formData.maximoUsos || null,
        activo: formData.activo,
        prioridad: formData.prioridad,
        codigoPromocion: formData.codigoPromocion || null,
        visibleWeb: formData.visibleWeb
      };

      if (editingPromocion) {
        payload.id = editingPromocion.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al guardar');

      showNotification.success(
        editingPromocion ? 'Promoción actualizada' : 'Promoción creada'
      );

      // Disparar evento para actualización en tiempo real
      window.dispatchEvent(new CustomEvent('promocionActualizada', {
        bubbles: true,
        cancelable: true
      }));

      setShowModal(false);
      await cargarPromociones();
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotification.error('Error al guardar la promoción');
    }
  };

  const handleDelete = async (promocion: Promocion) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar promoción?',
      message: `¿Estás seguro de eliminar "${promocion.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/promociones?id=${promocion.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      showNotification.success('Promoción eliminada');

      window.dispatchEvent(new CustomEvent('promocionActualizada', {
        bubbles: true,
        cancelable: true
      }));

      await cargarPromociones();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showNotification.error('Error al eliminar la promoción');
    }
  };

  const toggleActivo = async (promocion: Promocion) => {
    try {
      const response = await fetch('/api/admin/promociones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promocion,
          activo: !promocion.activo
        })
      });

      if (!response.ok) throw new Error('Error al cambiar estado');

      showNotification.success(
        promocion.activo ? 'Promoción desactivada' : 'Promoción activada'
      );

      window.dispatchEvent(new CustomEvent('promocionActualizada', {
        bubbles: true,
        cancelable: true
      }));

      await cargarPromociones();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification.error('Error al cambiar estado');
    }
  };

  const toggleDia = (dia: number) => {
    setFormData(prev => ({
      ...prev,
      diasValidos: prev.diasValidos.includes(dia)
        ? prev.diasValidos.filter(d => d !== dia)
        : [...prev.diasValidos, dia]
    }));
  };

  const toggleItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      itemsIncluidos: prev.itemsIncluidos.includes(itemId)
        ? prev.itemsIncluidos.filter(id => id !== itemId)
        : [...prev.itemsIncluidos, itemId]
    }));
  };

  const getTipoLabel = (tipo: TipoPromocion) => {
    const labels = {
      'porcentaje': '% Descuento',
      'monto_fijo': '$ Monto Fijo',
      'precio_minimo': '💰 Por Precio Superior',
      '2x1': '🎁 2x1',
      'combo': '📦 Combo'
    };
    return labels[tipo];
  };

  const getAplicableALabel = (aplicableA: AplicableA) => {
    const labels = {
      'todos': 'Todos los servicios',
      'terapias': 'Solo terapias',
      'productos': 'Solo productos',
      'servicios_adicionales': 'Solo servicios adicionales',
      'especificos': 'Items específicos'
    };
    return labels[aplicableA];
  };

  const getItemsFiltrados = () => {
    if (formData.aplicableA === 'todos') return itemsDisponibles;
    if (formData.aplicableA === 'terapias') {
      return itemsDisponibles.filter(i => i.tipo === 'terapia');
    }
    if (formData.aplicableA === 'productos') {
      return itemsDisponibles.filter(i => i.tipo === 'producto');
    }
    if (formData.aplicableA === 'servicios_adicionales') {
      return itemsDisponibles.filter(i => i.tipo === 'servicio_adicional');
    }
    return itemsDisponibles;
  };

  const isPromocionVigente = (promocion: Promocion) => {
    const hoy = new Date().toISOString().split('T')[0];
    return promocion.fechaInicio <= hoy && promocion.fechaFin >= hoy && promocion.activo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl border-4 border-purple-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <span className="text-4xl">🎁</span>
              </div>
              <div>
                <h2 className="text-4xl font-black mb-1 text-white drop-shadow-lg">
                  Promociones y Descuentos
                </h2>
                <p className="text-white text-lg font-semibold drop-shadow-md">
                  Crea y gestiona promociones para aumentar tus ventas
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-white text-purple-700 px-8 py-4 rounded-xl font-black text-lg hover:bg-purple-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 border-2 border-purple-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Promoción
          </button>
        </div>

        {/* Estadísticas rápidas con mejor contraste */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl p-5 border-3 border-indigo-800 shadow-2xl hover:scale-105 transition-all">
            <p className="text-indigo-100 text-sm font-black mb-2 uppercase tracking-wide">Total Promociones</p>
            <p className="text-6xl font-black text-white drop-shadow-2xl">{promociones.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-xl p-5 border-3 border-green-800 shadow-2xl hover:scale-105 transition-all">
            <p className="text-green-100 text-sm font-black mb-2 uppercase tracking-wide">Activas Ahora</p>
            <p className="text-6xl font-black text-white drop-shadow-2xl">
              {promociones.filter(isPromocionVigente).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-blue-500 rounded-xl p-5 border-3 border-blue-800 shadow-2xl hover:scale-105 transition-all">
            <p className="text-blue-100 text-sm font-black mb-2 uppercase tracking-wide">Visible en Web</p>
            <p className="text-6xl font-black text-white drop-shadow-2xl">
              {promociones.filter(p => p.visibleWeb && p.activo).length}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de promociones mejorada */}
      <div className="grid grid-cols-1 gap-6">
        {promociones.map((promocion) => {
          const vigente = isPromocionVigente(promocion);

          return (
            <div
              key={promocion.id}
              className={`bg-white rounded-2xl overflow-hidden transition-all transform hover:scale-[1.01] ${vigente
                  ? 'border-4 border-green-500 shadow-2xl shadow-green-200'
                  : promocion.activo
                    ? 'border-4 border-purple-300 shadow-xl'
                    : 'border-4 border-gray-300 opacity-70 shadow-lg'
                }`}
            >
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-black text-gray-900">
                        {promocion.nombre}
                      </h3>
                      {vigente && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg animate-pulse">
                          ✓ VIGENTE
                        </span>
                      )}
                      {!promocion.activo && (
                        <span className="bg-gray-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-md">
                          ○ INACTIVA
                        </span>
                      )}
                      {promocion.visibleWeb && promocion.activo && (
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg">
                          🌐 WEB
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-lg mb-5 font-medium">{promocion.descripcion}</p>

                    {/* Detalles de la promoción mejorados */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 border-2 border-purple-300 shadow-md">
                        <p className="text-xs text-purple-700 font-black mb-2 uppercase tracking-wide">Tipo</p>
                        <p className="text-base font-black text-purple-900">
                          {getTipoLabel(promocion.tipo)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 border-2 border-amber-300 shadow-md">
                        <p className="text-xs text-amber-700 font-black mb-2 uppercase tracking-wide">Descuento</p>
                        <p className="text-base font-black text-amber-900">
                          {promocion.tipo === 'porcentaje'
                            ? `${promocion.valorDescuento}%`
                            : `$${promocion.valorDescuento.toLocaleString()}`
                          }
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border-2 border-blue-300 shadow-md">
                        <p className="text-xs text-blue-700 font-black mb-2 uppercase tracking-wide">Aplica a</p>
                        <p className="text-base font-black text-blue-900 line-clamp-2">
                          {getAplicableALabel(promocion.aplicableA)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 border-2 border-green-300 shadow-md">
                        <p className="text-xs text-green-700 font-black mb-2 uppercase tracking-wide">Usos</p>
                        <p className="text-base font-black text-green-900">
                          {promocion.usosActuales}
                          {promocion.maximoUsos ? ` / ${promocion.maximoUsos}` : ' / ∞'}
                        </p>
                      </div>
                    </div>

                    {/* Fechas y días */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">
                          {promocion.fechaInicio} → {promocion.fechaFin}
                        </span>
                      </div>
                      {promocion.diasValidos.length < 7 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Días:</span>
                          {promocion.diasValidos.map(d => (
                            <span key={d} className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {diasSemana[d]}
                            </span>
                          ))}
                        </div>
                      )}
                      {promocion.horarioInicio && promocion.horarioFin && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {promocion.horarioInicio} - {promocion.horarioFin}
                        </div>
                      )}
                    </div>

                    {/* Items específicos */}
                    {promocion.aplicableA === 'especificos' && promocion.itemsIncluidos.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 font-semibold mb-2">
                          Items incluidos ({promocion.itemsIncluidos.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {promocion.itemsIncluidos.slice(0, 5).map((itemId) => {
                            const item = itemsDisponibles.find(i => i.id === itemId);
                            return item ? (
                              <span key={itemId} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                {item.nombre}
                              </span>
                            ) : null;
                          })}
                          {promocion.itemsIncluidos.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{promocion.itemsIncluidos.length - 5} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones mejoradas */}
                  <div className="flex flex-col gap-3 ml-6">
                    <button
                      onClick={() => toggleActivo(promocion)}
                      className={`px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${promocion.activo
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 border-2 border-green-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 border-2 border-gray-600'
                        }`}
                    >
                      {promocion.activo ? '✓ Activa' : '○ Inactiva'}
                    </button>
                    <button
                      onClick={() => openEditModal(promocion)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-700"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(promocion)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-red-700"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {promociones.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-4 border-purple-200 shadow-xl">
            <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-purple-300">
              <span className="text-7xl">🎁</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">
              No hay promociones creadas
            </h3>
            <p className="text-gray-700 text-lg mb-8 font-semibold">
              Comienza a crear promociones para aumentar tus ventas
            </p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl font-black text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 border-2 border-purple-700"
            >
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Crear Primera Promoción
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9998]"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">
                      {editingPromocion ? '✏️ Editar Promoción' : '🎁 Nueva Promoción'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">📝 Información Básica</h4>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre de la Promoción *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ej: Descuento de Verano"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Describe la promoción para tus clientes"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Tipo y valor de descuento */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">💰 Tipo de Descuento</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Promoción *
                        </label>
                        <select
                          value={formData.tipo}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoPromocion })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="porcentaje">% Descuento Porcentual</option>
                          <option value="monto_fijo">$ Monto Fijo</option>
                          <option value="precio_minimo">💰 Por Precio Superior</option>
                          <option value="2x1">🎁 2x1</option>
                          <option value="combo">📦 Combo</option>
                        </select>
                      </div>

                      {formData.tipo !== '2x1' && formData.tipo !== 'combo' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Valor del Descuento *
                          </label>
                          <div className="relative">
                            {formData.tipo === 'porcentaje' && (
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                %
                              </span>
                            )}
                            {formData.tipo === 'monto_fijo' && (
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                $
                              </span>
                            )}
                            <input
                              type="number"
                              value={formData.valorDescuento}
                              onChange={(e) => setFormData({ ...formData, valorDescuento: Number(e.target.value) })}
                              className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${formData.tipo === 'monto_fijo' ? 'pl-8' : ''
                                }`}
                              min="0"
                              step={formData.tipo === 'porcentaje' ? '0.01' : '100'}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {formData.tipo === 'precio_minimo' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Precio Mínimo de Compra *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                            $
                          </span>
                          <input
                            type="number"
                            value={formData.precioMinimo}
                            onChange={(e) => setFormData({ ...formData, precioMinimo: Number(e.target.value) })}
                            className="w-full px-4 py-3 pl-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            min="0"
                            step="1000"
                            placeholder="Ej: 100000"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          La promoción se aplicará solo si el total supera este monto
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Aplicable a */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">🎯 ¿A qué se aplica?</h4>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aplicable a *
                      </label>
                      <select
                        value={formData.aplicableA}
                        onChange={(e) => setFormData({ ...formData, aplicableA: e.target.value as AplicableA, itemsIncluidos: [] })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="todos">Todos los servicios y productos</option>
                        <option value="terapias">Solo terapias</option>
                        <option value="productos">Solo productos</option>
                        <option value="servicios_adicionales">Solo servicios adicionales</option>
                        <option value="especificos">Items específicos</option>
                      </select>
                    </div>

                    {formData.aplicableA === 'especificos' && (
                      <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Selecciona los items que incluye esta promoción:
                        </p>
                        <div className="space-y-2">
                          {getItemsFiltrados().map((item) => (
                            <label
                              key={item.id}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${formData.itemsIncluidos.includes(item.id)
                                  ? 'bg-purple-100 border-2 border-purple-500'
                                  : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.itemsIncluidos.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.nombre}</p>
                                <p className="text-xs text-gray-500">
                                  {item.tipo === 'terapia' && '💆 Terapia'}
                                  {item.tipo === 'producto' && '📦 Producto'}
                                  {item.tipo === 'servicio_adicional' && '✨ Servicio Adicional'}
                                  {' • '}${item.precio.toLocaleString()}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fechas y horarios */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">📅 Vigencia y Horarios</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha Inicio *
                        </label>
                        <input
                          type="date"
                          value={formData.fechaInicio}
                          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha Fin *
                        </label>
                        <input
                          type="date"
                          value={formData.fechaFin}
                          onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Días válidos
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {diasSemana.map((dia, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => toggleDia(index)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${formData.diasValidos.includes(index)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            {dia}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Horario Inicio (opcional)
                        </label>
                        <input
                          type="time"
                          value={formData.horarioInicio}
                          onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Horario Fin (opcional)
                        </label>
                        <input
                          type="time"
                          value={formData.horarioFin}
                          onChange={(e) => setFormData({ ...formData, horarioFin: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configuración adicional */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900">⚙️ Configuración Adicional</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Máximo de usos (opcional)
                        </label>
                        <input
                          type="number"
                          value={formData.maximoUsos || ''}
                          onChange={(e) => setFormData({ ...formData, maximoUsos: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          min="1"
                          placeholder="Ilimitado"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Dejar vacío para usos ilimitados
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prioridad
                        </label>
                        <input
                          type="number"
                          value={formData.prioridad}
                          onChange={(e) => setFormData({ ...formData, prioridad: Number(e.target.value) })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          min="1"
                          max="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Mayor número = mayor prioridad (1-10)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Código de promoción (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.codigoPromocion}
                        onChange={(e) => setFormData({ ...formData, codigoPromocion: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 uppercase"
                        placeholder="VERANO2026"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Si defines un código, la promoción solo se aplicará al ingresarlo
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.activo}
                          onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Activar promoción inmediatamente
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.visibleWeb}
                          onChange={(e) => setFormData({ ...formData, visibleWeb: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Mostrar en página principal
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer del modal */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingPromocion ? 'Guardar Cambios' : 'Crear Promoción'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
