"use client";

import React, { useState, useEffect } from 'react';

type Servicio = {
  id: number;
  servicio_id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  duracion: number;
  precio: number;
  icon?: string;
  imagen?: string;
  activo: boolean;
  orden: number;
  detalles?: string[];
};

type ServicioAdicional = {
  id: number;
  servicio_id: string;
  nombre: string;
  descripcion?: string;
  precio_particular: number;
  precio_afiliado: number;
  icon?: string;
  activo: boolean;
  orden: number;
};

type Producto = {
  id: number;
  producto_id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  icon?: string;
  stock?: number;
  activo: boolean;
  orden: number;
};

type SubTab = 'terapias' | 'adicionales' | 'productos';

export default function ServiciosTab() {
  const [subTab, setSubTab] = useState<SubTab>('terapias');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosAdicionales, setServiciosAdicionales] = useState<ServicioAdicional[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [subTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (subTab === 'terapias') {
        const res = await fetch('/api/admin/servicios');
        const data = await res.json();
        setServicios(data.servicios || []);
      } else if (subTab === 'adicionales') {
        const res = await fetch('/api/admin/servicios-adicionales');
        const data = await res.json();
        setServiciosAdicionales(data.servicios || []);
      } else if (subTab === 'productos') {
        const res = await fetch('/api/admin/productos');
        const data = await res.json();
        setProductos(data.productos || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (item: any, tipo: SubTab) => {
    try {
      const endpoint = 
        tipo === 'terapias' ? '/api/admin/servicios' :
        tipo === 'adicionales' ? '/api/admin/servicios-adicionales' :
        '/api/admin/productos';

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, activo: !item.activo }),
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleDelete = async (id: number, tipo: SubTab) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      const endpoint = 
        tipo === 'terapias' ? '/api/admin/servicios' :
        tipo === 'adicionales' ? '/api/admin/servicios-adicionales' :
        '/api/admin/productos';

      const res = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow">
        <button
          onClick={() => setSubTab('terapias')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            subTab === 'terapias'
              ? 'bg-gradient-to-r from-[#3d2817] to-amber-900 text-white shadow-lg'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          💆 Terapias ({servicios.length})
        </button>
        <button
          onClick={() => setSubTab('adicionales')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            subTab === 'adicionales'
              ? 'bg-gradient-to-r from-[#3d2817] to-amber-900 text-white shadow-lg'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          ✨ Servicios Adicionales ({serviciosAdicionales.length})
        </button>
        <button
          onClick={() => setSubTab('productos')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            subTab === 'productos'
              ? 'bg-gradient-to-r from-[#3d2817] to-amber-900 text-white shadow-lg'
              : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          🛍️ Productos ({productos.length})
        </button>
      </div>

      {/* Tabla de Terapias */}
      {subTab === 'terapias' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#3d2817]">Terapias y Masajes</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              + Nueva Terapia
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Icon</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Categoría</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Duración</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Precio</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((servicio) => (
                    <tr key={servicio.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 px-4 text-2xl">{servicio.icon || '💆'}</td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-stone-800">{servicio.nombre}</p>
                        <p className="text-xs text-stone-500">{servicio.servicio_id}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-stone-600">{servicio.categoria}</td>
                      <td className="py-4 px-4 text-sm text-stone-600">{servicio.duracion} min</td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${servicio.precio.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActivo(servicio, 'terapias')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            servicio.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {servicio.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(servicio)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(servicio.id, 'terapias')}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tabla de Servicios Adicionales */}
      {subTab === 'adicionales' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#3d2817]">Servicios Adicionales</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              + Nuevo Servicio Adicional
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Icon</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Precio Particular</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Precio Afiliado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosAdicionales.map((servicio) => (
                    <tr key={servicio.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 px-4 text-2xl">{servicio.icon || '✨'}</td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-stone-800">{servicio.nombre}</p>
                        <p className="text-xs text-stone-500">{servicio.servicio_id}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-600">
                        ${servicio.precio_particular.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${servicio.precio_afiliado.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActivo(servicio, 'adicionales')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            servicio.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {servicio.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(servicio)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(servicio.id, 'adicionales')}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tabla de Productos */}
      {subTab === 'productos' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#3d2817]">Productos del Spa</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              + Nuevo Producto
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Icon</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Precio</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 px-4 text-2xl">{producto.icon || '🛍️'}</td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-stone-800">{producto.nombre}</p>
                        <p className="text-xs text-stone-500">{producto.producto_id}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${producto.precio.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-4 text-sm text-stone-600">
                        {producto.stock !== null ? producto.stock : 'Sin control'}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActivo(producto, 'productos')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            producto.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(producto)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id, 'productos')}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Creación/Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar' : 'Crear'} {subTab === 'terapias' ? 'Terapia' : subTab === 'adicionales' ? 'Servicio Adicional' : 'Producto'}
            </h3>
            <p className="text-stone-600 text-sm">Funcionalidad de edición en desarrollo...</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

