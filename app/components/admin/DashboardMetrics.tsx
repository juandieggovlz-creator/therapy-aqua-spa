"use client";

import React, { useEffect, useState, useCallback } from 'react';

type DashboardData = {
  ingresos: {
    hoy: number;
    semana: number;
    mes: number;
    total: number;
  };
  reservas: {
    hoy: number;
    semana: number;
    mes: number;
    total: number;
    conPromocion: number;
    porEstado?: {
      pendiente: number;
      confirmada: number;
      completada: number;
      cancelada: number;
      'pendiente de pago': number;
      sinEstado: number;
    };
  };
  serviciosMasSolicitados: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    ingresos: number;
    porcentaje: number;
  }>;
  ticketPromedio: number;
  ocupacion: {
    hoy: number;
    semana: number;
    mes: number;
  };
};

export default function DashboardMetrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadMetrics = useCallback(async () => {
    try {
      // Agregar timestamp para evitar caché
      const res = await fetch('/api/admin/dashboard?' + new Date().getTime(), {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      
      // Log detallado de lo que se recibe
      console.log('📥 Dashboard - Datos recibidos del servidor:', {
        totalBookings: json.reservas?._debug_total_bookings || 0,
        reservasHoy: json.reservas?.hoy || 0,
        reservasTotal: json.reservas?.total || 0,
        reservasPorEstado: json.reservas?.porEstado
      });
      
      // Validar que el total sea un número válido
      if (json.reservas) {
        if (typeof json.reservas.total !== 'number' || isNaN(json.reservas.total)) {
          console.error('❌ Dashboard - ERROR: total no es un número válido:', json.reservas.total);
          // Intentar corregir
          json.reservas.total = 0;
        }
        
        // Log siempre para ver qué está pasando
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📥 DASHBOARD - DATOS RECIBIDOS DEL SERVIDOR:');
        console.log(`  📊 Hoy: ${json.reservas.hoy || 0} reservas`);
        console.log(`  📊 Semana: ${json.reservas.semana || 0} reservas`);
        console.log(`  📊 Mes: ${json.reservas.mes || 0} reservas`);
        console.log(`  📊 Total: ${json.reservas.total || 0} reservas`);
        console.log(`  📊 Servicios más solicitados: ${json.serviciosMasSolicitados?.length || 0}`);
        console.log('═══════════════════════════════════════════════════════════');
      } else {
        console.error('❌ Dashboard - ERROR: No hay objeto reservas en la respuesta');
      }
      
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando métricas:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
    
    // Actualizar más frecuentemente para detectar nuevas reservas inmediatamente
    const interval = setInterval(() => {
      loadMetrics();
      setLastUpdate(new Date());
    }, 5000); // Actualizar cada 5 segundos para detectar nuevas reservas más rápido
    
    // Escuchar eventos de eliminación/actualización de reservas para actualizar inmediatamente
    const handleReservaChange = () => {
      console.log('🔄 Dashboard: Evento de cambio en reservas detectado, actualizando inmediatamente...');
      loadMetrics();
      setLastUpdate(new Date());
    };
    
    window.addEventListener('reservaEliminada', handleReservaChange);
    window.addEventListener('reservaActualizada', handleReservaChange);
    window.addEventListener('reservaCreada', handleReservaChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('reservaEliminada', handleReservaChange);
      window.removeEventListener('reservaActualizada', handleReservaChange);
      window.removeEventListener('reservaCreada', handleReservaChange);
    };
  }, [loadMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2817]"></div>
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header con botón de refresco */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3d2817]">Dashboard</h2>
          <p className="text-sm text-stone-500 mt-1">
            Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            loadMetrics();
            setLastUpdate(new Date());
          }}
          disabled={loading}
          className="px-4 py-2 bg-[#3d2817] hover:bg-[#2d1f11] text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Sección Principal: Ingresos y Reservas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#3d2817]">Ingresos</h3>
              <p className="text-sm text-stone-500">Resumen financiero</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCardCompact
              title="Hoy"
              value={formatCurrency(data.ingresos.hoy)}
              color="green"
            />
            <MetricCardCompact
              title="Semana"
              value={formatCurrency(data.ingresos.semana)}
              color="blue"
            />
            <MetricCardCompact
              title="Mes"
              value={formatCurrency(data.ingresos.mes)}
              color="purple"
            />
            <MetricCardCompact
              title="Total"
              value={formatCurrency(data.ingresos.total)}
              color="amber"
              highlight
            />
          </div>
        </div>

        {/* Reservas */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#3d2817]">Reservas</h3>
              <p className="text-sm text-stone-500">Actividad de reservas</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCardCompact
              title="Hoy"
              value={data.reservas.hoy}
              color="blue"
            />
            <MetricCardCompact
              title="Semana"
              value={data.reservas.semana}
              color="indigo"
            />
            <MetricCardCompact
              title="Mes"
              value={data.reservas.mes}
              color="purple"
            />
            <MetricCardCompact
              title="Total"
              value={data.reservas.total !== undefined && data.reservas.total !== null ? data.reservas.total : 0}
              color="green"
              highlight
            />
          </div>
          <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
            {/* Indicador de reservas pendientes */}
            {data.reservas.porEstado && data.reservas.porEstado.pendiente > 0 && (
              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏳</span>
                  <span className="text-sm font-medium text-yellow-800">Pendientes</span>
                </div>
                <span className="text-lg font-bold text-yellow-700">{data.reservas.porEstado.pendiente}</span>
              </div>
            )}
            {/* Información adicional de estados */}
            {data.reservas.porEstado && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {data.reservas.porEstado.confirmada > 0 && (
                  <div className="flex items-center justify-between bg-green-50 rounded px-2 py-1 border border-green-200">
                    <span className="text-green-700 font-medium">✓ Confirmadas</span>
                    <span className="text-green-800 font-bold">{data.reservas.porEstado.confirmada}</span>
                  </div>
                )}
                {data.reservas.porEstado.completada > 0 && (
                  <div className="flex items-center justify-between bg-blue-50 rounded px-2 py-1 border border-blue-200">
                    <span className="text-blue-700 font-medium">✓ Completadas</span>
                    <span className="text-blue-800 font-bold">{data.reservas.porEstado.completada}</span>
                  </div>
                )}
                {data.reservas.porEstado['pendiente de pago'] > 0 && (
                  <div className="flex items-center justify-between bg-orange-50 rounded px-2 py-1 border border-orange-200">
                    <span className="text-orange-700 font-medium">💰 Pend. Pago</span>
                    <span className="text-orange-800 font-bold">{data.reservas.porEstado['pendiente de pago']}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-sm font-medium text-stone-600">Con Promoción</span>
              <span className="text-lg font-bold text-red-600">{data.reservas.conPromocion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Secundaria: Métricas de Rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎫</span>
            </div>
            <h3 className="text-lg font-bold text-[#3d2817]">Ticket Promedio</h3>
          </div>
          <p className="text-3xl font-bold text-teal-600">
            {data.ticketPromedio > 0 ? formatCurrency(data.ticketPromedio) : '$0'}
          </p>
          {data.reservas.total === 0 && (
            <p className="text-xs text-stone-500 mt-2">Sin reservas aún</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-[#3d2817]">Ocupación</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Hoy</span>
              <span className="text-xl font-bold text-orange-600">{data.ocupacion.hoy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Semana</span>
              <span className="text-lg font-semibold text-stone-700">{data.ocupacion.semana}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Mes</span>
              <span className="text-lg font-semibold text-stone-700">{data.ocupacion.mes}%</span>
            </div>
          </div>
        </div>

        {/* Servicios más solicitados - Versión mejorada */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <h3 className="text-lg font-bold text-[#3d2817]">Top Servicios</h3>
          </div>
          <div className="space-y-3">
            {data.serviciosMasSolicitados.length > 0 ? (
              data.serviciosMasSolicitados.slice(0, 5).map((servicio, index) => (
                <div 
                  key={servicio.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3d2817] truncate">{servicio.nombre}</p>
                      <p className="text-xs text-stone-500">{servicio.cantidad} reservas</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3 text-right">
                    <p className="text-sm font-bold text-purple-600">{formatCurrency(servicio.ingresos)}</p>
                    <p className="text-xs text-stone-500">{servicio.porcentaje.toFixed(1)}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-stone-500">
                <p className="text-sm">No hay servicios reservados aún</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección Detallada: Servicios Más Solicitados */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#3d2817]">Servicios Más Solicitados</h3>
            <p className="text-sm text-stone-500">Análisis detallado de servicios</p>
          </div>
        </div>
        {data.serviciosMasSolicitados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Servicio</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-stone-600">Reservas</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-stone-600">Ingresos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-stone-600">% Total</th>
                </tr>
              </thead>
              <tbody>
                {data.serviciosMasSolicitados.map((servicio, index) => (
                  <tr key={servicio.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-lg font-bold text-stone-400">#{index + 1}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-[#3d2817]">{servicio.nombre}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-stone-700">{servicio.cantidad}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-green-600">{formatCurrency(servicio.ingresos)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium text-stone-600">{servicio.porcentaje.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500">
            <p className="text-base mb-2">📭 No hay reservas aún</p>
            <p className="text-sm">Las reservas aparecerán aquí cuando los clientes hagan reservaciones</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCardCompact({ title, value, color, highlight }: {
  title: string;
  value: string | number;
  color: string;
  highlight?: boolean;
}) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border} ${highlight ? 'ring-2 ring-offset-2 ring-amber-400' : ''}`}>
      <h4 className="text-xs font-semibold text-stone-600 mb-2">{title}</h4>
      <p className={`text-xl font-bold ${colors.text} truncate`}>{value}</p>
    </div>
  );
}


