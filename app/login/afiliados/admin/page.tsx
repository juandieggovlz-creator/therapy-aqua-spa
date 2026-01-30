"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServiciosTab from '@/app/components/admin/ServiciosTab';

type TabType = 'dashboard' | 'usuarios' | 'reservas' | 'servicios' | 'finanzas' | 'comunicacion';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);

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
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings?role=admin');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    router.push('/login/admin');
  };

  // Calcular métricas desde bookings
  const calcularMetricas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const ingresosHoy = bookings
      .filter(b => b.fecha === hoy && b.estado === 'confirmada')
      .reduce((sum, b) => sum + (b.precio || 0), 0);

    const ingresosSemana = bookings
      .filter(b => {
        const fechaCita = new Date(b.fecha);
        const fechaActual = new Date();
        const diffTime = fechaActual.getTime() - fechaCita.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 7 && b.estado === 'confirmada';
      })
      .reduce((sum, b) => sum + (b.precio || 0), 0);

    const ingresosMes = bookings
      .filter(b => {
        const fechaCita = new Date(b.fecha);
        const fechaActual = new Date();
        return fechaCita.getMonth() === fechaActual.getMonth() && 
               fechaCita.getFullYear() === fechaActual.getFullYear() &&
               b.estado === 'confirmada';
      })
      .reduce((sum, b) => sum + (b.precio || 0), 0);

    const reservasActivas = bookings.filter(b => 
      b.estado === 'confirmada' || b.estado === 'pendiente'
    ).length;

    const reservasConfirmadas = bookings.filter(b => b.estado === 'confirmada').length;
    const reservasCanceladas = bookings.filter(b => b.estado === 'cancelada').length;
    const reservasPendientes = bookings.filter(b => b.estado === 'pendiente').length;

    // Servicios más solicitados
    const serviciosCount: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.servicio) {
        serviciosCount[b.servicio] = (serviciosCount[b.servicio] || 0) + 1;
      }
    });

    const serviciosMasSolicitados = Object.entries(serviciosCount)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 4)
      .map(s => ({
        ...s,
        porcentaje: Math.round((s.cantidad / bookings.length) * 100)
      }));

    return {
      ingresosHoy,
      ingresosSemana,
      ingresosMes,
      reservasActivas,
      reservasConfirmadas,
      reservasCanceladas,
      reservasPendientes,
      totalReservas: bookings.length,
      fisioterapeutasActivos: 1,
      satisfaccionPromedio: 4.8,
      serviciosMasSolicitados
    };
  };

  const kpis = calcularMetricas();

  const reservasRecientes = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-[#3d2817] to-[#2d1f11] text-white transition-all duration-300 fixed h-screen overflow-y-auto`}>
        {/* Header Sidebar */}
        <div className="p-6 border-b border-white/10">
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

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'usuarios' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Usuarios</span>}
          </button>

          <button
            onClick={() => setActiveTab('reservas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'reservas' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Reservas</span>}
          </button>

          <button
            onClick={() => setActiveTab('servicios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'servicios' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 005.4-5.4 2.25 2.25 0 012.4-2.245 3 3 0 005.78 1.128m-15.482.017a4.5 4.5 0 011.41-.513m11.851 0a4.5 4.5 0 01.494-.902l1.562-1.562a4.5 4.5 0 00-6.364-6.364l-1.562 1.562a4.5 4.5 0 01-.902.494m-16.5.41a4.5 4.5 0 00-1.41.513m14.095 0a4.5 4.5 0 011.41-.513m-16.5.41a4.5 4.5 0 011.085.802m14.095 0a4.5 4.5 0 00.802 1.085m-11.851 0a4.5 4.5 0 01-.513-1.41m11.851 0a4.5 4.5 0 00.902-.494l1.562-1.562a4.5 4.5 0 006.364 6.364l1.562-1.562a4.5 4.5 0 01.494-.902m-14.095 0a4.5 4.5 0 00-.802-1.085m14.095 0a4.5 4.5 0 011.085.802" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Servicios</span>}
          </button>

          <button
            onClick={() => setActiveTab('finanzas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'finanzas' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Finanzas</span>}
          </button>

          <button
            onClick={() => setActiveTab('comunicacion')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'comunicacion' ? 'bg-amber-500 text-white shadow-lg' : 'hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            {sidebarOpen && <span className="font-semibold">Comunicación</span>}
          </button>
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍💼</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Admin Principal</p>
                <p className="text-xs text-white/60">admin@therapyspa.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#3d2817] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {activeTab === 'dashboard' && '📊 Dashboard General'}
            {activeTab === 'usuarios' && '👥 Gestión de Usuarios'}
            {activeTab === 'reservas' && '📅 Gestión de Reservas'}
            {activeTab === 'servicios' && '💆 Gestión de Servicios'}
            {activeTab === 'finanzas' && '💰 Finanzas y Reportes'}
            {activeTab === 'comunicacion' && '📢 Comunicación'}
          </h1>
          <p className="text-stone-600">
            {activeTab === 'dashboard' && 'Vista general del rendimiento del spa'}
            {activeTab === 'usuarios' && 'Administra fisioterapeutas, afiliados y clientes'}
            {activeTab === 'reservas' && 'Calendario y gestión de citas'}
            {activeTab === 'servicios' && 'Administra terapias, paquetes y precios'}
            {activeTab === 'finanzas' && 'Análisis financiero y reportes detallados'}
            {activeTab === 'comunicacion' && 'Notificaciones y mensajes a clientes'}
          </p>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Ingresos Hoy</h3>
                  <span className="text-3xl">💰</span>
                </div>
                <p className="text-3xl font-bold">${(kpis.ingresosHoy / 1000).toFixed(0)}K</p>
                <p className="text-xs opacity-75 mt-2">Ingresos del día</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Ingresos Semana</h3>
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-3xl font-bold">${(kpis.ingresosSemana / 1000).toFixed(0)}K</p>
                <p className="text-xs opacity-75 mt-2">Últimos 7 días</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Ingresos Mes</h3>
                  <span className="text-3xl">💵</span>
                </div>
                <p className="text-3xl font-bold">${(kpis.ingresosMes / 1000000).toFixed(1)}M</p>
                <p className="text-xs opacity-75 mt-2">Mes actual</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Satisfacción</h3>
                  <span className="text-3xl">⭐</span>
                </div>
                <p className="text-3xl font-bold">{kpis.satisfaccionPromedio}/5</p>
                <p className="text-xs opacity-75 mt-2">Promedio mensual</p>
              </div>
            </div>

            {/* Segunda fila de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Reservas Activas</h3>
                  <span className="text-3xl">📅</span>
                </div>
                <p className="text-3xl font-bold">{kpis.reservasActivas}</p>
                <p className="text-xs opacity-75 mt-2">Confirmadas + Pendientes</p>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Confirmadas</h3>
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-3xl font-bold">{kpis.reservasConfirmadas}</p>
                <p className="text-xs opacity-75 mt-2">Citas confirmadas</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Pendientes</h3>
                  <span className="text-3xl">⏳</span>
                </div>
                <p className="text-3xl font-bold">{kpis.reservasPendientes}</p>
                <p className="text-xs opacity-75 mt-2">Por confirmar</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-90">Canceladas</h3>
                  <span className="text-3xl">❌</span>
                </div>
                <p className="text-3xl font-bold">{kpis.reservasCanceladas}</p>
                <p className="text-xs opacity-75 mt-2">Total canceladas</p>
              </div>
            </div>

            {/* Servicios Más Solicitados */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#3d2817] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                🏆 Servicios Más Solicitados
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--cafe-900)] mx-auto"></div>
                  <p className="mt-4 text-stone-600">Cargando datos...</p>
                </div>
              ) : kpis.serviciosMasSolicitados.length > 0 ? (
                <div className="space-y-4">
                  {kpis.serviciosMasSolicitados.map((servicio: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-stone-700">{servicio.nombre}</span>
                        <span className="text-sm text-stone-500">{servicio.cantidad} reservas</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[color:var(--oliva-400)] to-green-600 h-3 rounded-full transition-all duration-500"
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

            {/* Reservas Recientes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  📋 Reservas Recientes
                </h2>
                <button className="text-sm text-amber-600 hover:text-amber-700 font-semibold">
                  Ver todas →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Servicio</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Fisioterapeuta</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--cafe-900)] mx-auto"></div>
                        </td>
                      </tr>
                    ) : reservasRecientes.length > 0 ? (
                      reservasRecientes.map((reserva) => (
                        <tr key={reserva.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                          <td className="py-4 px-4 text-sm font-medium text-stone-800">{reserva.cliente}</td>
                          <td className="py-4 px-4 text-sm text-stone-600">{reserva.servicio}</td>
                          <td className="py-4 px-4 text-sm text-stone-600">{reserva.fisio}</td>
                          <td className="py-4 px-4 text-sm text-stone-600">{reserva.fecha} {reserva.hora}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              reserva.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 
                              reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {reserva.estado}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => {
                                setSelectedReserva(reserva);
                                setShowDetalleModal(true);
                              }}
                              className="text-[color:var(--cafe-900)] hover:text-[color:var(--oliva-400)] text-sm font-semibold transition-colors"
                            >
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-600">
                          No hay reservas recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab de Reservas */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#3d2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  📅 Todas las Reservas
                </h2>
                <div className="flex gap-3">
                  <select className="px-4 py-2 rounded-lg border-2 border-stone-200 focus:border-[#3d2817] focus:outline-none text-sm">
                    <option value="all">Todas</option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                  <button className="px-4 py-2 rounded-lg bg-[#3d2817] text-white font-semibold hover:bg-[#2d1f11] transition-all duration-300">
                    + Nueva Reserva
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Servicios</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2817] mx-auto"></div>
                          <p className="mt-4 text-stone-600">Cargando reservas...</p>
                        </td>
                      </tr>
                    ) : bookings.length > 0 ? (
                      bookings.map((reserva, idx) => (
                        <tr key={reserva.id || idx} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                          <td className="py-4 px-4 text-xs font-mono text-stone-500">
                            #{reserva.id?.slice(0, 8) || idx.toString().padStart(8, '0')}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm font-medium text-stone-800">{reserva.nombre || reserva.cliente}</p>
                              <p className="text-xs text-stone-500">{reserva.telefono}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              reserva.esAfiliado ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {reserva.esAfiliado ? '🏅 Afiliado' : 'Particular'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs space-y-1">
                              {reserva.terapias && reserva.terapias.length > 0 && (
                                <p className="text-stone-700">
                                  <span className="font-semibold">{reserva.terapias.length}</span> terapia(s)
                                </p>
                              )}
                              {reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0 && (
                                <p className="text-green-600">
                                  + <span className="font-semibold">{reserva.serviciosAdicionales.length}</span> servicio(s) adicional(es)
                                </p>
                              )}
                              {reserva.productos && reserva.productos.length > 0 && (
                                <p className="text-blue-600">
                                  + <span className="font-semibold">{reserva.productos.length}</span> producto(s)
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-stone-600">
                            <p>{reserva.fecha}</p>
                            <p className="text-xs text-stone-500">{reserva.horario || reserva.hora}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm font-bold text-green-600">
                              ${(reserva.total || reserva.precio || 0).toLocaleString('es-CO')}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              reserva.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 
                              reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {reserva.estado || 'pendiente'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => {
                                setSelectedReserva(reserva);
                                setShowDetalleModal(true);
                              }}
                              className="text-[#3d2817] hover:text-amber-600 text-sm font-semibold transition-colors"
                            >
                              Ver detalles →
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="text-6xl mb-4">📅</div>
                          <p className="text-stone-600 font-semibold">No hay reservas registradas</p>
                          <p className="text-sm text-stone-500 mt-2">Las nuevas reservas aparecerán aquí</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab de Servicios */}
        {activeTab === 'servicios' && <ServiciosTab />}

        {/* Otros tabs (placeholder) */}
        {activeTab !== 'dashboard' && activeTab !== 'reservas' && activeTab !== 'servicios' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🚧</span>
            </div>
            <h3 className="text-2xl font-bold text-[#3d2817] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sección en Construcción
            </h3>
            <p className="text-stone-600 mb-6">
              Esta funcionalidad estará disponible próximamente
            </p>
          </div>
        )}
      </main>

      {/* Modal de Detalle de Reserva */}
      {showDetalleModal && selectedReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#3d2817] to-amber-900 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Detalle de Reserva
              </h2>
              <button
                onClick={() => setShowDetalleModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del Cliente */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Nombre:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.nombre || selectedReserva.cliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Teléfono:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.telefono || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Email:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.email || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tipo:</span>
                    <span className={`font-semibold ${selectedReserva.esAfiliado ? 'text-green-600' : 'text-blue-600'}`}>
                      {selectedReserva.esAfiliado ? '🏅 Afiliado' : 'Particular'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fecha y Horario */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  Fecha y Horario
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Fecha:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Horario:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.horario || selectedReserva.hora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Duración:</span>
                    <span className="font-semibold text-[#3d2817]">{selectedReserva.duracionTotal || 30} minutos</span>
                  </div>
                </div>
              </div>

              {/* Terapias Seleccionadas */}
              {selectedReserva.terapias && selectedReserva.terapias.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                    <span className="text-2xl">💆</span>
                    Terapias Seleccionadas
                  </h3>
                  <div className="space-y-3">
                    {selectedReserva.terapias.map((terapia: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-[#3d2817] mb-1">
                              {terapia.icon && <span className="mr-2">{terapia.icon}</span>}
                              {terapia.nombre}
                            </p>
                            <p className="text-xs text-stone-600">
                              Duración: {terapia.duracion} minutos
                            </p>
                          </div>
                          <p className="font-bold text-green-600">
                            ${terapia.precio?.toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Servicios Adicionales */}
              {selectedReserva.serviciosAdicionales && selectedReserva.serviciosAdicionales.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Servicios Adicionales
                  </h3>
                  <div className="space-y-3">
                    {selectedReserva.serviciosAdicionales.map((servicio: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {servicio.icon && <span className="text-2xl">{servicio.icon}</span>}
                            <div>
                              <p className="font-semibold text-[#3d2817]">{servicio.nombre}</p>
                              {selectedReserva.esAfiliado && (
                                <p className="text-xs text-green-600 font-semibold">Precio afiliado aplicado</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {servicio.precioParticular && servicio.precioAplicado && servicio.precioParticular !== servicio.precioAplicado && (
                              <p className="text-xs text-stone-500 line-through">
                                ${servicio.precioParticular.toLocaleString('es-CO')}
                              </p>
                            )}
                            <p className="font-bold text-green-600">
                              ${(servicio.precioAplicado || servicio.precioAfiliado || servicio.precioParticular)?.toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Productos */}
              {selectedReserva.productos && selectedReserva.productos.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🛍️</span>
                    Productos
                  </h3>
                  <div className="space-y-2">
                    {selectedReserva.productos.map((producto: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          {producto.icon && <span className="text-xl">{producto.icon}</span>}
                          <span className="font-semibold text-[#3d2817]">{producto.nombre}</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          ${producto.precio?.toLocaleString('es-CO')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Método de Pago y Total */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Pago
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Método de pago:</span>
                    <span className="font-semibold text-[#3d2817]">
                      {selectedReserva.metodoPago === 'wompi' ? '💳 Tarjeta (Wompi)' :
                       selectedReserva.metodoPago === 'nequi' ? '📱 Nequi' :
                       selectedReserva.metodoPago === 'efectivo' ? '💵 Efectivo' : 
                       selectedReserva.metodoPago || 'No especificado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-amber-300 pt-3 mt-3">
                    <span className="text-lg font-bold text-[#3d2817]">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(selectedReserva.total || selectedReserva.precio || 0).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedReserva.notas && (
                <div className="bg-gradient-to-br from-stone-50 to-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Notas Adicionales
                  </h3>
                  <p className="text-sm text-stone-700 bg-white rounded-lg p-4">
                    {selectedReserva.notas}
                  </p>
                </div>
              )}

              {/* Estado */}
              <div className="flex items-center justify-between bg-gradient-to-r from-stone-100 to-stone-200 rounded-2xl p-6">
                <div>
                  <p className="text-sm text-stone-600 mb-1">Estado de la reserva</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    selectedReserva.estado === 'confirmada' ? 'bg-green-500 text-white' : 
                    selectedReserva.estado === 'pendiente' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {selectedReserva.estado?.toUpperCase() || 'PENDIENTE'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-600">ID de Reserva</p>
                  <p className="font-mono text-sm font-semibold text-stone-800">
                    {selectedReserva.id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="sticky bottom-0 bg-stone-50 p-6 rounded-b-3xl border-t-2 border-stone-200 flex gap-3">
              <button
                onClick={() => setShowDetalleModal(false)}
                className="flex-1 px-6 py-3 rounded-full bg-stone-200 hover:bg-stone-300 text-[#3d2817] font-semibold transition-all duration-300"
              >
                Cerrar
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contactar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}