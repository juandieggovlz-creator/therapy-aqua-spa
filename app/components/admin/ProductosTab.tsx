"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  icon: string;
  activo: boolean;
  orden: number;
};

// Tabla de emojis comunes para productos
const emojisDisponibles = [
  '🔐', '👕', '🧴', '🛡️', '🧳', '🎒', '👟', '🧢', '🧤', '🧦',
  '🧥', '🩱', '🩳', '🥽', '🕶️', '💼', '👜', '🧺', '🧻', '🧽',
  '🧹', '🧯', '🧊', '🍹', '🥤', '☕', '🧃', '🧉', '🍶', '💧',
  '📦', '🛍️', '🎁', '🏷️', '💳', '💰', '🪙', '💵', '💴', '💶',
  '💷', '💸', '🔑', '🗝️', '🔒', '🔓', '🔱', '⚡', '🔥', '⭐',
  '✨', '💎', '🏆', '🎖️', '🥇', '🥈', '🥉', '🌟', '💫', '🎯'
];

export default function ProductosTab() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Producto>>({});
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  // Cargar productos
  const loadProductos = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/productos?cache=${timestamp}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      showNotification.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  // Guardar producto
  const handleSave = async () => {
    try {
      if (!formData.nombre || formData.precio === undefined || formData.precio === null) {
        showNotification.error('Nombre y precio son obligatorios');
        return;
      }

      if (formData.precio < 0) {
        showNotification.error('El precio no puede ser negativo');
        return;
      }

      const response = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar producto');
      }

      const data = await response.json();
      setProductos(data.productos);
      
      showNotification.success(editing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      
      // Disparar eventos para actualizar la página principal
      window.dispatchEvent(new CustomEvent('productoActualizado'));
      window.dispatchEvent(new CustomEvent('actualizarPaginaPrincipal'));
      
      setShowForm(false);
      setEditing(null);
      setFormData({});
    } catch (error) {
      console.error('Error guardando producto:', error);
      showNotification.error('Error al guardar producto');
    }
  };

  // Editar producto
  const handleEdit = (producto: Producto) => {
    setFormData(producto);
    setEditing(producto.id);
    setShowForm(true);
  };

  // Eliminar producto
  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/productos?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      const data = await response.json();
      setProductos(data.productos);
      
      showNotification.success('Producto eliminado exitosamente');
      
      // Disparar eventos
      window.dispatchEvent(new CustomEvent('productoActualizado'));
      window.dispatchEvent(new CustomEvent('actualizarPaginaPrincipal'));
    } catch (error) {
      console.error('Error eliminando producto:', error);
      showNotification.error('Error al eliminar producto');
    }
  };

  // Toggle activo
  const handleToggle = async (id: string, activo: boolean) => {
    try {
      const producto = productos.find(p => p.id === id);
      if (!producto) return;

      const response = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...producto, activo })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const data = await response.json();
      setProductos(data.productos);
      
      showNotification.success(`Producto ${activo ? 'activado' : 'desactivado'}`);
      
      // Disparar eventos
      window.dispatchEvent(new CustomEvent('productoActualizado'));
      window.dispatchEvent(new CustomEvent('actualizarPaginaPrincipal'));
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showNotification.error('Error al actualizar estado');
    }
  };

  // Nuevo producto
  const handleNuevo = () => {
    setFormData({
      nombre: '',
      precio: 0,
      icon: '📦',
      activo: true,
      orden: productos.length + 1
    });
    setEditing(null);
    setShowForm(true);
  };

  // Seleccionar emoji
  const handleSelectEmoji = (emoji: string) => {
    setFormData({ ...formData, icon: emoji });
    setMostrarEmojis(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3d2817]">Productos Adicionales</h1>
          <p className="text-stone-600 mt-2">Gestiona los productos adicionales disponibles para las reservas</p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex items-center gap-2 px-6 py-3 bg-[#3d2817] text-white rounded-lg hover:bg-[#2d1f11] transition-all shadow-lg"
        >
          <span className="text-xl">➕</span>
          Nuevo Producto
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#3d2817] p-6">
          <h3 className="text-xl font-bold text-[#3d2817] mb-4">
            {editing ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emoji */}
            <div className="relative">
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                Icono *
              </label>
              <button
                onClick={() => setMostrarEmojis(!mostrarEmojis)}
                className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-4xl text-center hover:border-amber-400 transition-all bg-white"
              >
                {formData.icon || '📦'}
              </button>
              
              {mostrarEmojis && (
                <div className="absolute z-10 mt-2 w-full bg-white border-2 border-stone-300 rounded-lg shadow-xl p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-2">
                    {emojisDisponibles.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectEmoji(emoji)}
                        className="text-2xl p-2 hover:bg-amber-100 rounded-lg transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Candado para casillero"
                className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                Precio (COP) *
              </label>
              <input
                type="number"
                value={formData.precio || 0}
                onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) || 0 })}
                placeholder="5000"
                min="0"
                step="1000"
                className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-[#3d2817] mb-2">
                Estado
              </label>
              <button
                onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.activo
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-red-100 text-red-700 border-2 border-red-300'
                }`}
              >
                {formData.activo ? '✓ Activo' : '✗ Inactivo'}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#3d2817] text-white rounded-lg hover:bg-[#2d1f11] font-semibold transition-all shadow-md"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setFormData({});
                setMostrarEmojis(false);
              }}
              className="px-6 py-3 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 font-semibold transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.length === 0 ? (
          <div className="col-span-full p-12 border-2 border-dashed border-stone-300 rounded-xl text-center">
            <p className="text-2xl mb-2">🛍️</p>
            <p className="text-stone-600 font-semibold">No hay productos adicionales</p>
            <p className="text-stone-500 text-sm mt-1">Agrega tu primer producto para comenzar</p>
          </div>
        ) : (
          productos.map((producto) => (
            <div
              key={producto.id}
              className={`bg-white rounded-xl border-2 p-6 shadow-md transition-all hover:shadow-lg ${
                producto.activo ? 'border-green-300' : 'border-stone-300 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{producto.icon}</div>
                <button
                  onClick={() => handleToggle(producto.id, !producto.activo)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    producto.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {producto.activo ? '✓ Activo' : '✗ Inactivo'}
                </button>
              </div>

              <h3 className="text-lg font-bold text-[#3d2817] mb-2">
                {producto.nombre}
              </h3>

              <p className="text-2xl font-bold text-green-600 mb-4">
                ${producto.precio.toLocaleString('es-CO')}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(producto)}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold transition-all"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

