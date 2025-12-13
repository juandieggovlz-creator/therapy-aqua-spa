"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FisioDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas'); // todas, confirmada, pendiente, cancelada
  const [fechaFiltro, setFechaFiltro] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<any>(null);
  const [accionModal, setAccionModal] = useState<string>(''); // 'cancelar', 'confirmar', 'completar'

  // Verificar autenticación
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const user = sessionStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login/fisio');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'fisio') {
      router.push('/login/fisio');
      return;
    }

    // Cargar datos
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings?role=fisio');
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
    router.push('/login/fisio');
  };

  const handleAccionCita = (cita: any, accion: string) => {
    setCitaSeleccionada(cita);
    setAccionModal(accion);
    setShowModal(true);
  };

  const confirmarAccion = async () => {
    if (!citaSeleccionada) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: citaSeleccionada.id,
          accion: accionModal
        }),
      });

      if (response.ok) {
        // Actualizar estado local
        setBookings(prev => prev.map(b => 
          b.id === citaSeleccionada.id 
            ? { ...b, estado: accionModal === 'cancelar' ? 'cancelada' : accionModal === 'confirmar' ? 'confirmada' : 'completada' }
            : b
        ));
        setShowModal(false);
        setCitaSeleccionada(null);
      }
    } catch (error) {
      console.error('Error actualizando cita:', error);
      alert('Error al actualizar la cita. Intenta nuevamente.');
    }
  };

  // Calcular métricas
  const calcularMetricas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    const citasHoy = bookings.filter(b => b.fecha === hoy);
    const citasConfirmadasHoy = citasHoy.filter(b => b.estado === 'confirmada').length;
    const citasPendientesHoy = citasHoy.filter(b => b.estado === 'pendiente').length;
    
    const ingresosHoy = citasHoy
      .filter(b => b.estado === 'confirmada')
      .reduce((sum, b) => sum + (b.precio || 0), 0);

    const ingresosSemana = bookings
      .filter(b => {
        const fechaCita = new Date(b.fecha);
        const fechaActual = new Date();
        const diffTime = fechaActual.getTime() - fechaCita.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 7 && diffDays >= 0 && b.estado === 'confirmada';
      })
      .reduce((sum, b) => sum + (b.precio || 0), 0);

    const totalReservas = bookings.length;
    const reservasConfirmadas = bookings.filter(b => b.estado === 'confirmada').length;
    const reservasPendientes = bookings.filter(b => b.estado === 'pendiente').length;
    const reservasCanceladas = bookings.filter(b => b.estado === 'cancelada').length;

    const proximasCitas = bookings
      .filter(b => {
        const fechaCita = new Date(b.fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fechaCita >= hoy && (b.estado === 'confirmada' || b.estado === 'pendiente');
      })
      .sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA.getTime() - fechaB.getTime();
      })
      .slice(0, 5);

    return {
      citasHoy: citasHoy.length,
      citasConfirmadasHoy,
      citasPendientesHoy,
      ingresosHoy,
      ingresosSemana,
      totalReservas,
      reservasConfirmadas,
      reservasPendientes,
      reservasCanceladas,
      proximasCitas
    };
  };

  const metricas = calcularMetricas();

  // Filtrar citas
  const citasFiltradas = bookings.filter(b => {
    if (filtroEstado !== 'todas' && b.estado !== filtroEstado) return false;
    if (fechaFiltro && b.fecha !== fechaFiltro) return false;
    return true;
  }).sort((a, b) => {
    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);
    return fechaA.getTime() - fechaB.getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--crema-50)] via-stone-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-[color:var(--arena-300)]/20 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-[color:var(--cafe-900)] transition-all duration-300 hover:scale-105" style={{ fontFamily: "var(--font-playfair)" }}>
              Therapy Aqua Spa
            </Link>
            <div className="h-6 w-px bg-[color:var(--arena-300)]"></div>
            <h1 className="text-lg font-semibold text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Dashboard Fisioterapeuta
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[color:var(--cafe-900)] hover:bg-[#2d1f11] text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[color:var(--oliva-400)] to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold opacity-90">Citas Hoy</h3>
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-3xl font-bold">{metricas.citasHoy}</p>
            <p className="text-xs opacity-75 mt-2">
              {metricas.citasConfirmadasHoy} confirmadas, {metricas.citasPendientesHoy} pendientes
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold opacity-90">Ingresos Hoy</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold">${(metricas.ingresosHoy / 1000).toFixed(0)}K</p>
            <p className="text-xs opacity-75 mt-2">Ingresos del día</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold opacity-90">Ingresos Semana</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-3xl font-bold">${(metricas.ingresosSemana / 1000).toFixed(0)}K</p>
            <p className="text-xs opacity-75 mt-2">Últimos 7 días</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold opacity-90">Total Reservas</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-3xl font-bold">{metricas.totalReservas}</p>
            <p className="text-xs opacity-75 mt-2">
              {metricas.reservasConfirmadas} confirmadas, {metricas.reservasPendientes} pendientes
            </p>
          </div>
        </div>

        {/* Próximas Citas */}
        {metricas.proximasCitas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-[color:var(--cafe-900)] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              ⏰ Próximas Citas
            </h2>
            <div className="space-y-3">
              {metricas.proximasCitas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[color:var(--crema-50)] to-white rounded-xl border border-[color:var(--arena-300)]/20 hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--oliva-400)] to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {cita.hora.split(':')[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[color:var(--cafe-900)]">{cita.cliente}</p>
                        <p className="text-sm text-stone-600">{cita.servicio}</p>
                        <p className="text-xs text-stone-500">{cita.fecha} • {cita.hora} • {cita.duracion} min</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cita.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 
                      cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gestión de Citas */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[color:var(--cafe-900)]" style={{ fontFamily: "var(--font-playfair)" }}>
              📋 Gestión de Citas
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="px-4 py-2 border border-[color:var(--arena-300)] rounded-xl focus:ring-2 focus:ring-[color:var(--oliva-400)] focus:border-[color:var(--oliva-400)] outline-none text-sm"
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-[color:var(--arena-300)] rounded-xl focus:ring-2 focus:ring-[color:var(--oliva-400)] focus:border-[color:var(--oliva-400)] outline-none text-sm"
              >
                <option value="todas">Todas</option>
                <option value="confirmada">Confirmadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--cafe-900)] mx-auto"></div>
              <p className="mt-4 text-stone-600">Cargando citas...</p>
            </div>
          ) : citasFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Servicio</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Hora</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Duración</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Precio</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-stone-800">{cita.cliente}</p>
                          <p className="text-xs text-stone-500">{cita.telefono}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-stone-600">{cita.servicio}</td>
                      <td className="py-4 px-4 text-sm text-stone-600">{cita.fecha}</td>
                      <td className="py-4 px-4 text-sm text-stone-600">{cita.hora}</td>
                      <td className="py-4 px-4 text-sm text-stone-600">{cita.duracion} min</td>
                      <td className="py-4 px-4 text-sm font-semibold text-[color:var(--cafe-900)]">
                        ${(cita.precio || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          cita.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 
                          cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {cita.estado === 'pendiente' && (
                            <button
                              onClick={() => handleAccionCita(cita, 'confirmar')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Confirmar
                            </button>
                          )}
                          {cita.estado !== 'cancelada' && (
                            <button
                              onClick={() => handleAccionCita(cita, 'cancelar')}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Cancelar
                            </button>
                          )}
                          {cita.estado === 'confirmada' && (
                            <button
                              onClick={() => handleAccionCita(cita, 'completar')}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Completar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-600">No hay citas con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmación */}
      {showModal && citaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[color:var(--cafe-900)] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              {accionModal === 'cancelar' && '❌ Cancelar Cita'}
              {accionModal === 'confirmar' && '✅ Confirmar Cita'}
              {accionModal === 'completar' && '✓ Completar Cita'}
            </h3>
            <p className="text-stone-600 mb-6">
              ¿Estás seguro de que deseas {accionModal === 'cancelar' ? 'cancelar' : accionModal === 'confirmar' ? 'confirmar' : 'marcar como completada'} la cita de <strong>{citaSeleccionada.cliente}</strong>?
            </p>
            <div className="bg-[color:var(--crema-50)] rounded-xl p-4 mb-6">
              <p className="text-sm text-stone-700"><strong>Servicio:</strong> {citaSeleccionada.servicio}</p>
              <p className="text-sm text-stone-700"><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
              <p className="text-sm text-stone-700"><strong>Hora:</strong> {citaSeleccionada.hora}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCitaSeleccionada(null);
                }}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAccion}
                className={`flex-1 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
                  accionModal === 'cancelar' ? 'bg-red-600 hover:bg-red-700' :
                  accionModal === 'confirmar' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {accionModal === 'cancelar' && 'Sí, Cancelar'}
                {accionModal === 'confirmar' && 'Sí, Confirmar'}
                {accionModal === 'completar' && 'Sí, Completar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


