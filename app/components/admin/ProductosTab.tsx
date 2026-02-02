"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';
import EmojiSelector from '@/app/components/admin/EmojiSelector';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  icon: string;
  activo: boolean;
  orden: number;
};

export default function ProductosTab() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<Partial<Producto>>({});

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const response = await fetch('/api/admin/productos');
      const data = await response.json();
      setProductos(data.productos || []);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando productos:', error);
      showNotification.error('Error al cargar productos');
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      nombre: '',
      precio: 0,
      descripcion: '',
      icon: '📦',
      activo: true,
      orden: 0
    });
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setFormData(producto);
    setModalType('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.precio) {
        showNotification.error('Nombre y precio son obligatorios');
        return;
      }

      const url = '/api/admin/productos';
      const method = modalType === 'create' ? 'POST' : 'PATCH';

      const body = modalType === 'edit'
        ? { ...formData, id: selectedProducto?.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Error al guardar');

      showNotification.success(
        modalType === 'create'
          ? 'Producto creado exitosamente'
          : 'Producto actualizado exitosamente'
      );

      setShowModal(false);
      await loadProductos();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('productosActualizados'));
    } catch (error) {
      showNotification.error('Error al guardar producto');
    }
  };

  const handleDelete = async (producto: Producto) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar producto?',
      message: `¿Estás seguro de eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/productos?id=${producto.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      showNotification.success('Producto eliminado exitosamente');
      await loadProductos();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('productosActualizados'));
    } catch (error) {
      showNotification.error('Error al eliminar producto');
    }
  };

  const handleToggleActivo = async (producto: Producto) => {
    try {
      const response = await fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...producto,
          activo: !producto.activo
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      showNotification.success(`Producto ${!producto.activo ? 'activado' : 'desactivado'}`);
      await loadProductos();

      // Emitir evento para sincronización
      window.dispatchEvent(new CustomEvent('productosActualizados'));
    } catch (error) {
      showNotification.error('Error al actualizar producto');
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
          <p className="text-gray-600 mt-1">Administra productos adicionales (candado, kit ropa, etc.)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Productos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{productos.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Activos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{productos.filter(p => p.activo).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
          <p className="text-gray-600 text-sm font-medium">Inactivos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{productos.filter(p => !p.activo).length}</p>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{producto.icon}</div>
              <button
                onClick={() => handleToggleActivo(producto)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${producto.activo
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {producto.activo ? '✓ ACTIVO' : '✕ INACTIVO'}
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{producto.nombre}</h3>
            {producto.descripcion && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.descripcion}</p>
            )}

            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">Precio</p>
              <p className="text-2xl font-bold text-amber-600">${producto.precio.toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(producto)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(producto)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">No hay productos registrados</p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Crear Primer Producto
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalType === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
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
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: Candado para locker"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Descripción del producto"
                />
              </div>

              {/* Precio e Icon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    value={formData.precio || ''}
                    onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <EmojiSelector
                    value={formData.icon || '📦'}
                    onChange={(emoji) => setFormData({ ...formData, icon: emoji })}
                    category="productos"
                  />
                </div>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.activo !== false}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Producto activo (visible en la página de reservas)
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {modalType === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
