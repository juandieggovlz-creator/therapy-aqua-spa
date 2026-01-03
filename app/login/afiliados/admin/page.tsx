"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TabType = 'dashboard' | 'reservas' | 'servicios' | 'finanzas' | 'promociones';

type Terapia = {
  id: string;
  nombre: string;
  precio: number;
  icon: string;
};

type Promocion = {
  activa: boolean;
  descuento: number;
  fechaLimite: string;
  titulo: string;
  descripcion: string;
};

const terapiasList: Terapia[] = [
  { id: 'columna', nombre: 'THERAPY LESIONES DE COLUMNA', precio: 100000, icon: '🦴' },
  { id: 'brazos', nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', precio: 60000, icon: '💪' },
  { id: 'piernas', nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', precio: 60000, icon: '🦵' },
  { id: 'hombro', nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', precio: 250000, icon: '🤝' },
  { id: 'cadera', nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', precio: 250000, icon: '🦿' },
  { id: 'mano', nombre: 'SKINCARE MANO THERAPY', precio: 90000, icon: '🤲' },
  { id: 'ocular', nombre: 'PRESO THERAPY OCULAR', precio: 80000, icon: '👁️' },
  { id: 'bienestar', nombre: 'MASAJE BIENESTAR GENERAL', precio: 140000, icon: '🌿' },
  { id: 'facial', nombre: 'MASAJE FACIAL', precio: 90000, icon: '✨' },
  { id: 'espalda', nombre: 'MASAJE DE ESPALDA', precio: 120000, icon: '🧘' },
  { id: 'hombros', nombre: 'MASAJE HOMBROS Y BRAZOS', precio: 100000, icon: '💆' },
  { id: 'rodillas', nombre: 'MASAJE CADERAS Y RODILLAS', precio: 120000, icon: '🦴' },
  { id: 'pies', nombre: 'MASAJE PANTORRILLAS Y PIES', precio: 120000, icon: '🦶' },
  { id: 'deportivo', nombre: 'MASAJE THERAPY DEPORTIVO', precio: 100000, icon: '🏃' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [precios, setPrecios] = useState<Record<string, number>>({});
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [descuentos, setDescuentos] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editingPrecio, setEditingPrecio] = useState<string | null>(null);
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [editingDescuento, setEditingDescuento] = useState<string | null>(null);
  const [nuevoDescuento, setNuevoDescuento] = useState<number>(0);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFecha, setFiltroFecha] = useState<string>('todos');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [serviciosMasSolicitados, setServiciosMasSolicitados] = useState<any[]>([]);

  // Verificar autenticación
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const user = sessionStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login/admin');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      router.push('/login/admin');
      return;
    }

    // Cargar datos
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [bookingsRes, preciosRes, promocionRes, descuentosRes] = await Promise.all([
        fetch('/api/bookings?role=admin'),
        fetch('/api/admin/precios'),
        fetch('/api/admin/promociones'),
        fetch('/api/admin/descuentos')
      ]);

      const bookingsData = await bookingsRes.json();
      const preciosData = await preciosRes.json();
      const promocionData = await promocionRes.json();
      const descuentosData = await descuentosRes.json();

      setBookings(bookingsData.bookings || []);
      setPrecios(preciosData.precios || {});
      setPromocion(promocionData.promocion || null);
      setDescuentos(descuentosData.descuentos || {});

      // Calcular servicios más solicitados
      const serviciosCount: Record<string, number> = {};
      (bookingsData.bookings || []).forEach((b: any) => {
        if (b.servicio) {
          serviciosCount[b.servicio] = (serviciosCount[b.servicio] || 0) + 1;
        }
      });

      const serviciosMasSolicitados = Object.entries(serviciosCount)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5)
        .map(s => ({
          ...s,
          porcentaje: Math.round((s.cantidad / (bookingsData.bookings?.length || 1)) * 100)
        }));

      setServiciosMasSolicitados(serviciosMasSolicitados);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    router.push('/login/admin');
  };

  const handleUpdatePrecio = async (terapiaId: string) => {
    try {
      const response = await fetch('/api/admin/precios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terapiaId, nuevoPrecio: nuevoPrecio }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrecios(data.precios);
        setEditingPrecio(null);
        setNuevoPrecio(0);
        alert('Precio actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error actualizando precio:', error);
      alert('Error al actualizar precio');
    }
  };

  const handleTogglePromocion = async () => {
    if (!promocion) return;
    
    try {
      const response = await fetch('/api/admin/promociones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !promocion.activa }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromocion(data.promocion);
        alert(promocion.activa ? 'Promoción desactivada' : 'Promoción activada');
      }
    } catch (error) {
      console.error('Error actualizando promoción:', error);
      alert('Error al actualizar promoción');
    }
  };

  const handleUpdateDescuento = async (servicioId: string) => {
    try {
      const response = await fetch('/api/admin/descuentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicioId, descuento: nuevoDescuento }),
      });

      if (response.ok) {
        const data = await response.json();
        setDescuentos(data.descuentos);
        setEditingDescuento(null);
        setNuevoDescuento(0);
        alert('Descuento actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error actualizando descuento:', error);
      alert('Error al actualizar descuento');
    }
  };

  const handleUpdatePromocion = async (campo: string, valor: any) => {
    if (!promocion) return;
    
    try {
      const response = await fetch('/api/admin/promociones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [campo]: valor }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromocion(data.promocion);
        alert('Promoción actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error actualizando promoción:', error);
      alert('Error al actualizar promoción');
    }
  };

  const handleUpdateEstadoCita = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: nuevoEstado }),
      });

      if (response.ok) {
        await loadData();
        alert(`Cita ${nuevoEstado} exitosamente`);
      }
    } catch (error) {
      console.error('Error actualizando cita:', error);
      alert('Error al actualizar cita');
    }
  };

  // Citas del día
  const hoy = new Date().toISOString().split('T')[0];
  const citasHoy = bookings.filter(b => b.fecha === hoy);
  const citasAceptadas = citasHoy.filter(b => b.estado === 'confirmada');
  const citasCompletadas = citasHoy.filter(b => b.estado === 'completada');
  const citasPendientes = citasHoy.filter(b => b.estado === 'pendiente');

  // Transacciones
  const todasLasTransacciones = bookings
    .filter(b => b.estado === 'confirmada' || b.estado === 'completada')
    .map(b => ({
      ...b,
      serviciosAdicionales: b.serviciosAdicionales || [],
      productos: b.productos || [],
      total: b.precio + (b.serviciosAdicionales?.length || 0) * 20000 + (b.productos?.length || 0) * 5000
    }));

  // Filtrar transacciones por fecha
  const filtrarPorFecha = (transacciones: any[]) => {
    if (filtroFecha === 'todos') {
      return transacciones;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return transacciones.filter(trans => {
      const fechaTrans = new Date(trans.fecha);
      fechaTrans.setHours(0, 0, 0, 0);

      switch (filtroFecha) {
        case 'hoy':
          return fechaTrans.getTime() === hoy.getTime();
        
        case 'semana':
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - hoy.getDay());
          return fechaTrans >= inicioSemana;
        
        case 'mes':
          return fechaTrans.getMonth() === hoy.getMonth() && 
                 fechaTrans.getFullYear() === hoy.getFullYear();
        
        case 'rango':
          if (!fechaInicio || !fechaFin) return true;
          const inicio = new Date(fechaInicio);
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59, 999);
          return fechaTrans >= inicio && fechaTrans <= fin;
        
        default:
          return true;
      }
    });
  };

  const transacciones = filtrarPorFecha(todasLasTransacciones);

  const citasFiltradas = filtroEstado === 'todos' 
    ? citasHoy 
    : citasHoy.filter(b => b.estado === filtroEstado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex" style={{ marginTop: '-64px' }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-[#3d2817] to-[#2d1f11] text-white transition-all duration-300 fixed top-0 left-0 h-screen flex flex-col z-[100] shadow-2xl`}>
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Admin Panel
                </h2>
                <p className="text-xs text-white/60 mt-1">Therapy Aqua Spa</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'reservas', label: 'Citas del Día', icon: '📅' },
            { id: 'servicios', label: 'Precios Terapias', icon: '💆' },
            { id: 'promociones', label: 'Promociones', icon: '🎁' },
            { id: 'finanzas', label: 'Transacciones', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {sidebarOpen && <span className="font-semibold">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="mt-auto p-4 border-t border-white/10 bg-gradient-to-t from-[#2d1f11] to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👨‍💼</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">Admin Principal</p>
                <p className="text-xs text-white/60 truncate">admin@therapyspa.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 p-8`}>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {activeTab === 'dashboard' && '📊 Dashboard General'}
            {activeTab === 'reservas' && '📅 Citas del Día'}
            {activeTab === 'servicios' && '💆 Gestión de Precios'}
            {activeTab === 'promociones' && '🎁 Gestión de Promociones'}
            {activeTab === 'finanzas' && '💰 Transacciones y Pagos'}
          </h1>
          <p className="text-stone-600">
            {activeTab === 'dashboard' && 'Vista general del rendimiento del spa'}
            {activeTab === 'reservas' && 'Gestiona las citas del día de hoy'}
            {activeTab === 'servicios' && 'Actualiza los precios de las terapias'}
            {activeTab === 'promociones' && 'Activa o desactiva promociones'}
            {activeTab === 'finanzas' && 'Revisa todas las transacciones y pagos'}
          </p>
        </header>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Citas Hoy</h3>
                  <span className="text-3xl">📅</span>
                </div>
                <p className="text-4xl font-bold">{citasHoy.length}</p>
                <p className="text-xs opacity-75 mt-2">Total de citas programadas</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Aceptadas</h3>
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-4xl font-bold">{citasAceptadas.length}</p>
                <p className="text-xs opacity-75 mt-2">Citas confirmadas</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Pendientes</h3>
                  <span className="text-3xl">⏳</span>
                </div>
                <p className="text-4xl font-bold">{citasPendientes.length}</p>
                <p className="text-xs opacity-75 mt-2">Por confirmar</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Resumen del Día
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-sm text-stone-600 mb-1">Total Transacciones</p>
                  <p className="text-2xl font-bold text-[#3d2817]">{transacciones.length}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-sm text-stone-600 mb-1">Ingresos del Día</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${transacciones.reduce((sum, t) => sum + (t.total || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Servicios Más Solicitados */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#3d2817] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                🏆 Servicios Más Solicitados
              </h2>
              {serviciosMasSolicitados.length > 0 ? (
                <div className="space-y-4">
                  {serviciosMasSolicitados.map((servicio: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-stone-700">{servicio.nombre}</span>
                        <span className="text-sm text-stone-500">{servicio.cantidad} reservas ({servicio.porcentaje}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${servicio.porcentaje}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-stone-600 py-8">No hay datos disponibles</p>
              )}
            </div>
          </div>
        )}

        {/* Citas del Día */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              {['todos', 'pendiente', 'confirmada', 'completada'].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    filtroEstado === estado
                      ? 'bg-[#3d2817] text-white shadow-lg'
                      : 'bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {estado === 'todos' ? 'Todas' : estado.charAt(0).toUpperCase() + estado.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
                </div>
              ) : citasFiltradas.length > 0 ? (
                <div className="space-y-4">
                  {citasFiltradas.map((cita) => (
                    <div key={cita.id} className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-[#3d2817]">{cita.cliente}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              cita.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 
                              cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                              cita.estado === 'completada' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {cita.estado}
                            </span>
                          </div>
                          <p className="text-stone-600 mb-1"><strong>Servicio:</strong> {cita.servicio}</p>
                          <p className="text-stone-600 mb-1"><strong>Fecha:</strong> {cita.fecha} a las {cita.hora}</p>
                          <p className="text-stone-600 mb-1"><strong>Precio:</strong> ${cita.precio?.toLocaleString()}</p>
                          {cita.serviciosAdicionales && cita.serviciosAdicionales.length > 0 && (
                            <p className="text-stone-600 mb-1">
                              <strong>Servicios adicionales:</strong> {cita.serviciosAdicionales.join(', ')}
                            </p>
                          )}
                          {cita.productos && cita.productos.length > 0 && (
                            <p className="text-stone-600">
                              <strong>Productos:</strong> {cita.productos.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {cita.estado === 'pendiente' && (
                            <button
                              onClick={() => handleUpdateEstadoCita(cita.id, 'confirmar')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Aceptar
                            </button>
                          )}
                          {cita.estado === 'confirmada' && (
                            <button
                              onClick={() => handleUpdateEstadoCita(cita.id, 'completar')}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Completar
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateEstadoCita(cita.id, 'cancelar')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-stone-600 text-lg">No hay citas para mostrar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gestión de Precios */}
        {activeTab === 'servicios' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#3d2817] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Precios y Descuentos de Terapias
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {terapiasList.map((terapia) => {
                  const precioActual = precios[terapia.id] || terapia.precio;
                  const descuentoActual = descuentos[terapia.id] || 0;
                  const isEditing = editingPrecio === terapia.id;
                  const isEditingDescuento = editingDescuento === terapia.id;
                  const precioConDescuento = descuentoActual > 0 
                    ? precioActual * (1 - descuentoActual / 100) 
                    : precioActual;

                  return (
                    <div key={terapia.id} className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-3xl">{terapia.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#3d2817]">{terapia.nombre}</h3>
                            {isEditing ? (
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="number"
                                  value={nuevoPrecio || precioActual}
                                  onChange={(e) => setNuevoPrecio(Number(e.target.value))}
                                  className="border border-stone-300 rounded-lg px-3 py-2 w-32"
                                />
                                <button
                                  onClick={() => handleUpdatePrecio(terapia.id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPrecio(null);
                                    setNuevoPrecio(0);
                                  }}
                                  className="px-4 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="mt-1">
                                <p className="text-2xl font-bold text-green-600">
                                  ${precioActual.toLocaleString()}
                                </p>
                                {descuentoActual > 0 && (
                                  <div className="mt-1">
                                    <span className="text-sm text-red-600 font-semibold">
                                      -{descuentoActual}% OFF
                                    </span>
                                    <p className="text-lg font-bold text-amber-600">
                                      ${Math.round(precioConDescuento).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {!isEditing && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingPrecio(terapia.id);
                                setNuevoPrecio(precioActual);
                              }}
                              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
                            >
                              Editar Precio
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Sección de descuento */}
                      <div className="border-t border-stone-200 pt-3 mt-3">
                        {isEditingDescuento ? (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-stone-600">Descuento (%):</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={nuevoDescuento || descuentoActual}
                              onChange={(e) => setNuevoDescuento(Number(e.target.value))}
                              className="border border-stone-300 rounded-lg px-3 py-2 w-24"
                            />
                            <button
                              onClick={() => handleUpdateDescuento(terapia.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingDescuento(null);
                                setNuevoDescuento(0);
                              }}
                              className="px-4 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-stone-600">Descuento individual: </span>
                              {descuentoActual > 0 ? (
                                <span className="text-sm font-semibold text-red-600">
                                  {descuentoActual}% OFF
                                </span>
                              ) : (
                                <span className="text-sm text-stone-400">Sin descuento</span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setEditingDescuento(terapia.id);
                                setNuevoDescuento(descuentoActual);
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                            >
                              {descuentoActual > 0 ? 'Editar Descuento' : 'Agregar Descuento'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Gestión de Promociones */}
        {activeTab === 'promociones' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#3d2817] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gestión de Promociones
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
              </div>
            ) : promocion ? (
              <div className="space-y-6">
                <div className="border border-stone-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#3d2817]">Promoción General</h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      promocion.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {promocion.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={promocion.titulo}
                        onChange={(e) => handleUpdatePromocion('titulo', e.target.value)}
                        className="w-full border border-stone-300 rounded-lg px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Descripción</label>
                      <textarea
                        value={promocion.descripcion}
                        onChange={(e) => handleUpdatePromocion('descripcion', e.target.value)}
                        className="w-full border border-stone-300 rounded-lg px-4 py-2"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Descuento (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={promocion.descuento}
                          onChange={(e) => handleUpdatePromocion('descuento', Number(e.target.value))}
                          className="w-full border border-stone-300 rounded-lg px-4 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Fecha Límite</label>
                        <input
                          type="datetime-local"
                          value={new Date(promocion.fechaLimite).toISOString().slice(0, 16)}
                          onChange={(e) => handleUpdatePromocion('fechaLimite', new Date(e.target.value).toISOString())}
                          className="w-full border border-stone-300 rounded-lg px-4 py-2"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-200">
                      <button
                        onClick={handleTogglePromocion}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                          promocion.activa
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {promocion.activa ? 'Desactivar Promoción' : 'Activar Promoción'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-600">No hay promociones configuradas</p>
              </div>
            )}
          </div>
        )}

        {/* Transacciones */}
        {activeTab === 'finanzas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Transacciones y Pagos
                </h2>
                <div className="text-right">
                  <p className="text-sm text-stone-600">Total: <span className="font-bold text-green-600">${transacciones.reduce((sum, t) => sum + (t.total || 0), 0).toLocaleString()}</span></p>
                  <p className="text-xs text-stone-500">{transacciones.length} transacción(es)</p>
                </div>
              </div>

              {/* Filtros de Fecha */}
              <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <label className="text-sm font-semibold text-stone-700">Filtrar por fecha:</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'todos', label: 'Todas' },
                      { value: 'hoy', label: 'Hoy' },
                      { value: 'semana', label: 'Esta Semana' },
                      { value: 'mes', label: 'Este Mes' },
                      { value: 'rango', label: 'Rango Personalizado' },
                    ].map((opcion) => (
                      <button
                        key={opcion.value}
                        onClick={() => {
                          setFiltroFecha(opcion.value);
                          if (opcion.value !== 'rango') {
                            setFechaInicio('');
                            setFechaFin('');
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          filtroFecha === opcion.value
                            ? 'bg-[#3d2817] text-white shadow-lg'
                            : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                        }`}
                      >
                        {opcion.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rango de fechas personalizado */}
                {filtroFecha === 'rango' && (
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-stone-300">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-stone-700">Desde:</label>
                      <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-stone-700">Hasta:</label>
                      <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                    {(fechaInicio || fechaFin) && (
                      <button
                        onClick={() => {
                          setFechaInicio('');
                          setFechaFin('');
                        }}
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817] mx-auto"></div>
                </div>
              ) : transacciones.length > 0 ? (
                <div className="space-y-4">
                  {transacciones
                    .sort((a, b) => {
                      const fechaA = new Date(`${a.fecha}T${a.hora}`);
                      const fechaB = new Date(`${b.fecha}T${b.hora}`);
                      return fechaB.getTime() - fechaA.getTime();
                    })
                    .map((trans) => (
                      <div key={trans.id} className="border border-stone-200 rounded-xl p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-[#3d2817]">{trans.cliente}</h3>
                            <p className="text-stone-600 text-sm">{trans.fecha} a las {trans.hora}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            trans.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {trans.estado}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-stone-600 mb-1"><strong>Servicio:</strong> {trans.servicio}</p>
                            <p className="text-sm text-stone-600"><strong>Precio base:</strong> ${trans.precio?.toLocaleString()}</p>
                          </div>
                          <div>
                            {trans.serviciosAdicionales && trans.serviciosAdicionales.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-stone-700 mb-1">Servicios Adicionales:</p>
                                <ul className="text-sm text-stone-600 list-disc list-inside">
                                  {trans.serviciosAdicionales.map((s: string, idx: number) => (
                                    <li key={idx}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {trans.productos && trans.productos.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-stone-700 mb-1">Productos:</p>
                                <ul className="text-sm text-stone-600 list-disc list-inside">
                                  {trans.productos.map((p: string, idx: number) => (
                                    <li key={idx}>{p}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-stone-200 pt-4">
                          <div className="flex items-center justify-between">
                            <p className="text-stone-600"><strong>Total:</strong></p>
                            <p className="text-2xl font-bold text-green-600">${trans.total?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-stone-600 text-lg">No hay transacciones para mostrar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
