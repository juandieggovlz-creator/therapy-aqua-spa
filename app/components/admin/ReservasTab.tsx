"use client";

import React, { useState, useEffect } from 'react';
import { showNotification, showConfirm } from '@/app/components/NotificationSystem';

interface Reserva {
  id: string;
  cliente?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  servicio?: string;
  servicioId?: string;
  fisio?: string;
  fecha?: string;
  hora?: string;
  horario?: string;
  duracion?: number;
  duracionTotal?: number;
  precio?: number;
  total?: number;
  estado?: string;
  esAfiliado?: boolean;
  terapias?: any[];
  serviciosAdicionales?: (string | { id?: string; nombre?: string; precio?: number; precioAfiliado?: number; precioParticular?: number; icon?: string })[];
  productos?: (string | { id?: string; nombre?: string; precio?: number; icon?: string })[];
  paqueteSeleccionado?: string;
  notas?: string;
  fechaCreacion?: string;
  createdAt?: string;
}

interface ReservasTabProps {
  userRole?: 'admin';
}

// Referencias de precios de servicios adicionales y productos (deben coincidir con los de reservas/page.tsx)
const SERVICIOS_ADICIONALES_PRECIOS: Record<string, { nombre: string; precio: number; icon: string }> = {
  'sauna': { nombre: 'Sauna', precio: 29900, icon: '🔥' },
  'jacuzzi': { nombre: 'Jacuzzi', precio: 29900, icon: '🛁' },
  'turco': { nombre: 'Baño Turco', precio: 29900, icon: '💨' },
  // También por nombre por si acaso
  'Sauna': { nombre: 'Sauna', precio: 29900, icon: '🔥' },
  'Jacuzzi': { nombre: 'Jacuzzi', precio: 29900, icon: '🛁' },
  'Baño Turco': { nombre: 'Baño Turco', precio: 29900, icon: '💨' }
};

const PRODUCTOS_PRECIOS: Record<string, { nombre: string; precio: number; icon: string }> = {
  'candado': { nombre: 'Candado para casillero', precio: 5000, icon: '🔐' },
  'ropa': { nombre: 'Kit ropa interior desechable', precio: 8000, icon: '👕' },
  // También por nombre por si acaso
  'Candado para casillero': { nombre: 'Candado para casillero', precio: 5000, icon: '🔐' },
  'Kit ropa interior desechable': { nombre: 'Kit ropa interior desechable', precio: 8000, icon: '👕' }
};

// Precios de servicios adicionales para afiliados (para cálculos de descuento)
const PRECIO_SERVICIO_PARTICULAR = 29900;
const PRECIO_SERVICIO_AFILIADO = 13000;

export default function ReservasTab({ userRole = 'admin' }: ReservasTabProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservasOriginales, setReservasOriginales] = useState<Reserva[]>([]); // Todas las reservas sin filtrar
  const [loading, setLoading] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [filtroFecha, setFiltroFecha] = useState<string>('todas');
  const [filtroNombre, setFiltroNombre] = useState<string>('');
  const [filtroTelefono, setFiltroTelefono] = useState<string>('');
  const [filtroFechaEspecifica, setFiltroFechaEspecifica] = useState<string>('');
  const [mensajeNotificacion, setMensajeNotificacion] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [aplicandoDescuentos, setAplicandoDescuentos] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [reservaAEliminar, setReservaAEliminar] = useState<Reserva | null>(null);
  const [editandoFechaHora, setEditandoFechaHora] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const [nuevaHora, setNuevaHora] = useState<string>('');

  useEffect(() => {
    loadReservas();
  }, []); // Cargar solo al montar el componente

  // Resetear estado cuando cambia la reserva seleccionada
  useEffect(() => {
    if (reservaSeleccionada) {
      setAplicandoDescuentos(false);
    }
  }, [reservaSeleccionada?.id]);

  // Aplicar filtros cuando cambien (siempre, incluso si está vacío)
  useEffect(() => {
    // Si no hay reservas originales, asegurar que la lista esté vacía
    if (!reservasOriginales || reservasOriginales.length === 0) {
      setReservas([]);
      console.log('📊 ReservasTab - No hay reservas originales, lista vacía');
      return;
    }
    
    // Aplicar todos los filtros
    aplicarFiltros();
  }, [filtroEstado, filtroFecha, filtroNombre, filtroTelefono, filtroFechaEspecifica, reservasOriginales]);

  const loadReservas = async () => {
    try {
      setLoading(true);
      // IMPORTANTE: Cargar TODAS las reservas sin filtros del servidor
      // Los filtros se aplicarán localmente después
      const url = '/api/bookings?' + new Date().getTime();

      const response = await fetch(url, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Obtener TODAS las reservas del servidor (sin filtrar por estado ni fecha)
      let todasLasReservas = data.bookings || [];
      
      console.log(`📥 ReservasTab - Total reservas recibidas del servidor: ${todasLasReservas.length}`);
      
      if (todasLasReservas.length === 0) {
        console.log('⚠️ ReservasTab - NO HAY RESERVAS en el servidor - Array vacío');
        // Si no hay reservas, limpiar todo
        setReservasOriginales([]);
        setReservas([]);
        setLastUpdate(new Date());
        return;
      }
      
      // Guardar TODAS las reservas como originales (los filtros se aplicarán después mediante useEffect)
      setReservasOriginales(todasLasReservas);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('❌ Error cargando reservas:', error);
      // En caso de error, limpiar las reservas
      setReservasOriginales([]);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    if (reservasOriginales.length === 0) {
      setReservas([]);
      return;
    }
    
    let reservasFiltradas = [...reservasOriginales];

    // FILTRAR POR ESTADO (si no es "todas")
    if (filtroEstado !== 'todas') {
      reservasFiltradas = reservasFiltradas.filter((r: Reserva) => {
        const estado = String(r.estado || '').toLowerCase().trim();
        return estado === filtroEstado.toLowerCase().trim();
      });
    }

    // FILTRAR POR FECHA (PERÍODO: hoy, semana, mes)
    if (filtroFecha !== 'todas') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      reservasFiltradas = reservasFiltradas.filter((r: Reserva) => {
        // Usar fecha de creación (createdAt) para el filtro de período
        if (!r.createdAt && !r.fechaCreacion) return false;
        
        const fechaReserva = new Date(r.createdAt || r.fechaCreacion || '');
        fechaReserva.setHours(0, 0, 0, 0);

        switch (filtroFecha) {
          case 'hoy':
            return fechaReserva.getTime() === hoy.getTime();
          case 'semana':
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - hoy.getDay());
            return fechaReserva >= inicioSemana;
          case 'mes':
            return fechaReserva.getMonth() === hoy.getMonth() && 
                   fechaReserva.getFullYear() === hoy.getFullYear();
          default:
            return true;
        }
      });
    }

    // Filtrar por nombre
    if (filtroNombre.trim() !== '') {
      reservasFiltradas = reservasFiltradas.filter((r: Reserva) => {
        const nombre = (r.nombre || r.cliente || '').toLowerCase();
        return nombre.includes(filtroNombre.toLowerCase());
      });
    }

    // Filtrar por teléfono
    if (filtroTelefono.trim() !== '') {
      reservasFiltradas = reservasFiltradas.filter((r: Reserva) => {
        const telefono = (r.telefono || '').toString();
        return telefono.includes(filtroTelefono);
      });
    }

    // Filtrar por fecha específica (fecha de la cita)
    if (filtroFechaEspecifica.trim() !== '') {
      reservasFiltradas = reservasFiltradas.filter((r: Reserva) => {
        if (!r.fecha) return false;
        const fechaReserva = new Date(r.fecha);
        fechaReserva.setHours(0, 0, 0, 0);
        const fechaFiltro = new Date(filtroFechaEspecifica);
        fechaFiltro.setHours(0, 0, 0, 0);
        return fechaReserva.getTime() === fechaFiltro.getTime();
      });
    }

    // Ordenar por fecha más reciente
    reservasFiltradas.sort((a: Reserva, b: Reserva) => {
      const fechaA = new Date(a.fechaCreacion || a.createdAt || '');
      const fechaB = new Date(b.fechaCreacion || b.createdAt || '');
      return fechaB.getTime() - fechaA.getTime();
    });

    console.log(`📊 ReservasTab - Reservas después de aplicar filtros: ${reservasFiltradas.length} de ${reservasOriginales.length} totales`);
    setReservas(reservasFiltradas);
  };

  const eliminarReserva = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings?id=${id}&timestamp=${Date.now()}`, {
        method: 'DELETE',
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMensajeNotificacion({
          tipo: 'error',
          texto: errorData.error || 'Error al eliminar la reserva'
        });
        setShowDeleteModal(null);
        setReservaAEliminar(null);
        return;
      }

      // Si la reserva eliminada estaba seleccionada, limpiar la selección
      if (reservaSeleccionada?.id === id) {
        setReservaSeleccionada(null);
      }

      // Actualizar estado local inmediatamente para feedback visual rápido
      setReservasOriginales(prev => prev.filter(r => r.id !== id));
      setReservas(prev => prev.filter(r => r.id !== id));

      // Disparar evento personalizado para actualizar el dashboard inmediatamente
      window.dispatchEvent(new CustomEvent('reservaEliminada', { detail: { reservaId: id } }));

      // Recargar todas las reservas desde el servidor para sincronizar completamente
      // Esto asegura que los datos estén 100% sincronizados con el backend
      setTimeout(async () => {
        await loadReservas();
      }, 500); // Pequeño delay para asegurar que el servidor haya procesado la eliminación

      showNotification.success('Reserva eliminada exitosamente. El dashboard se actualizará automáticamente.');
      setMensajeNotificacion({
        tipo: 'success',
        texto: 'Reserva eliminada exitosamente. El dashboard se actualizará automáticamente.'
      });

      // Cerrar modal
      setShowDeleteModal(null);
      setReservaAEliminar(null);

      // Ocultar mensaje después de 4 segundos
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      setShowDeleteModal(null);
      setReservaAEliminar(null);
      setMensajeNotificacion({
        tipo: 'error',
        texto: 'Error de conexión al eliminar la reserva'
      });
    }
  };

  const aplicarDescuentosAfiliado = async (id: string, precioConDescuentos: number) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, total: precioConDescuentos, precio: precioConDescuentos, esAfiliado: true }),
      });

      if (!response.ok) {
        throw new Error('Error al aplicar descuentos');
      }

      // Actualizar estado local
      setReservasOriginales(prev => prev.map(r => 
        r.id === id ? { ...r, total: precioConDescuentos, precio: precioConDescuentos, esAfiliado: true } : r
      ));
      setReservas(prev => prev.map(r => 
        r.id === id ? { ...r, total: precioConDescuentos, precio: precioConDescuentos, esAfiliado: true } : r
      ));
      
      if (reservaSeleccionada?.id === id) {
        setReservaSeleccionada(prev => prev ? { ...prev, total: precioConDescuentos, precio: precioConDescuentos, esAfiliado: true } : null);
      }

      // Disparar evento para actualizar el dashboard
      window.dispatchEvent(new CustomEvent('reservaActualizada', { detail: { reservaId: id } }));

      setMensajeNotificacion({
        tipo: 'success',
        texto: `✅ Descuentos de afiliado aplicados exitosamente. Nuevo total: ${formatearPrecio(precioConDescuentos)}`
      });

      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);

      setAplicandoDescuentos(false);
    } catch (error) {
      console.error('Error aplicando descuentos:', error);
      setMensajeNotificacion({
        tipo: 'error',
        texto: 'Error al aplicar los descuentos'
      });
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
      setAplicandoDescuentos(false);
    }
  };

  const actualizarFechaHora = async (id: string, fecha: string, hora: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, fecha, horario: hora })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar fecha y hora');
      }

      // Actualizar estado local
      setReservasOriginales(prev => prev.map(r => 
        r.id === id ? { ...r, fecha, hora, horario: hora } : r
      ));
      setReservas(prev => prev.map(r => 
        r.id === id ? { ...r, fecha, hora, horario: hora } : r
      ));
      
      if (reservaSeleccionada?.id === id) {
        setReservaSeleccionada(prev => prev ? { ...prev, fecha, hora, horario: hora } : null);
      }

      // Disparar evento para actualizar el dashboard
      window.dispatchEvent(new CustomEvent('reservaActualizada', { detail: { reservaId: id } }));

      setMensajeNotificacion({
        tipo: 'success',
        texto: `✅ Fecha y hora actualizadas exitosamente: ${formatearFecha(fecha)} ${hora}`
      });

      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);

      setEditandoFechaHora(false);
      setNuevaFecha('');
      setNuevaHora('');
    } catch (error: any) {
      console.error('Error actualizando fecha y hora:', error);
      setMensajeNotificacion({
        tipo: 'error',
        texto: error.message || 'Error al actualizar la fecha y hora'
      });
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    }
  };

  const cancelarBeneficiosAfiliado = async (id: string, precioOriginal: number) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, total: precioOriginal, precio: precioOriginal, esAfiliado: false }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar beneficios');
      }

      // Actualizar estado local
      setReservasOriginales(prev => prev.map(r => 
        r.id === id ? { ...r, total: precioOriginal, precio: precioOriginal, esAfiliado: false } : r
      ));
      setReservas(prev => prev.map(r => 
        r.id === id ? { ...r, total: precioOriginal, precio: precioOriginal, esAfiliado: false } : r
      ));
      
      if (reservaSeleccionada?.id === id) {
        setReservaSeleccionada(prev => prev ? { ...prev, total: precioOriginal, precio: precioOriginal, esAfiliado: false } : null);
      }

      // Disparar evento para actualizar el dashboard
      window.dispatchEvent(new CustomEvent('reservaActualizada', { detail: { reservaId: id } }));

      setMensajeNotificacion({
        tipo: 'success',
        texto: `✅ Beneficios de afiliado cancelados. Precio restaurado a: ${formatearPrecio(precioOriginal)}`
      });

      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    } catch (error) {
      console.error('Error cancelando beneficios:', error);
      setMensajeNotificacion({
        tipo: 'error',
        texto: 'Error al cancelar los beneficios'
      });
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    }
  };

  // Función helper para calcular el precio final de una reserva
  const calcularPrecioFinal = (reserva: Reserva): number => {
    // Calcular subtotal de terapias
    let subtotalTerapias = 0;
    if (reserva.terapias && reserva.terapias.length > 0) {
      subtotalTerapias = reserva.terapias.reduce((sum: number, t: any) => {
        return sum + (t?.precio || t?.precioOriginal || 0);
      }, 0);
    } else if (reserva.precio && !reserva.terapias) {
      subtotalTerapias = reserva.precio;
    }

    // Calcular subtotal de servicios adicionales con precio aplicado
    let subtotalServiciosAdicionalesOriginal = 0;
    if (reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0) {
      subtotalServiciosAdicionalesOriginal = reserva.serviciosAdicionales.reduce((sum: number, s: any) => {
        if (typeof s === 'object' && s !== null) {
          // Usar precioAplicado si existe, sino usar precioParticular o precio
          return sum + (s.precioAplicado || s.precioParticular || s.precio || 0);
        } else {
          const servicioRef = SERVICIOS_ADICIONALES_PRECIOS[s];
          return sum + (servicioRef?.precio || 0);
        }
      }, 0);
    }

    // Calcular subtotal de productos
    let subtotalProductos = 0;
    if (reserva.productos && reserva.productos.length > 0) {
      subtotalProductos = reserva.productos.reduce((sum: number, p: any) => {
        if (typeof p === 'object' && p !== null) {
          return sum + (p.precio || 0);
        } else {
          const productoRef = PRODUCTOS_PRECIOS[p];
          return sum + (productoRef?.precio || 0);
        }
      }, 0);
    }

    // PRECIO ORIGINAL (sin ningún descuento)
    const precioTotalOriginal = subtotalTerapias + subtotalServiciosAdicionalesOriginal + subtotalProductos;

    // Los servicios adicionales ya vienen con el precio correcto (precioAplicado)
    // No necesitamos recalcular el descuento de afiliado porque ya se aplicó en la reserva
    let subtotalServiciosAdicionalesConDescuento = subtotalServiciosAdicionalesOriginal;
    if (reserva.esAfiliado && reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0) {
      // Los servicios adicionales ya tienen el precio de afiliado aplicado en precioAplicado
      subtotalServiciosAdicionalesConDescuento = reserva.serviciosAdicionales.length * 13000;
    }

    // Calcular nuevo total con el paquete/servicios ajustados a precio afiliado
    const precioTotalConPaqueteDescuento = subtotalTerapias + subtotalServiciosAdicionalesConDescuento + subtotalProductos;

    // Descuento del 20% sobre el TOTAL (con el paquete ya ajustado a $13,000 si aplica)
    const descuentoAfiliadoTotal = reserva.esAfiliado ? precioTotalConPaqueteDescuento * 0.20 : 0;

    // Precio final: total con paquete ajustado menos el descuento del 20%
    const precioConDescuento = precioTotalConPaqueteDescuento - descuentoAfiliadoTotal;

    // Si ya tiene un total guardado y es afiliado, usarlo; si no, calcular
    if (reserva.total && reserva.esAfiliado) {
      return reserva.total; // Ya tiene el precio con descuentos aplicados
    }

    // Precio mostrado: si es afiliado, usar precio con descuento; si no, usar precio original
    return reserva.esAfiliado ? precioConDescuento : precioTotalOriginal;
  };

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    try {
      // Obtener el nombre del estado para el mensaje
      const nombresEstado: Record<string, string> = {
        'pendiente': 'Pendiente',
        'pendiente de pago': 'Pendiente de Pago',
        'confirmada': 'Confirmada',
        'completada': 'Completada',
        'cancelada': 'Cancelada'
      };
      
      const nombreEstado = nombresEstado[nuevoEstado] || nuevoEstado;
      
      // Si se está confirmando o completando el pago, calcular y guardar el total correcto
      let totalAPagar: number | undefined = undefined;
      if (nuevoEstado === 'confirmada' || nuevoEstado === 'completada') {
        const reserva = reservasOriginales.find(r => r.id === id) || reservaSeleccionada;
        if (reserva) {
          totalAPagar = calcularPrecioFinal(reserva);
          console.log(`💰 ${nuevoEstado === 'confirmada' ? 'Confirmando' : 'Completando'} reserva ${id} con total a pagar: ${totalAPagar}`);
        }
      }
      
      const bodyData: any = { 
        id, 
        accion: nuevoEstado === 'confirmada' ? 'confirmar' : 
                nuevoEstado === 'cancelada' ? 'cancelar' : 
                nuevoEstado === 'completada' ? 'completar' : 
                nuevoEstado === 'pendiente de pago' ? 'pendiente_pago' : 'pendiente',
        estado: nuevoEstado
      };

      // Si hay un total a pagar calculado, incluirlo en la actualización
      if (totalAPagar !== undefined) {
        bodyData.total = totalAPagar;
        bodyData.precio = totalAPagar;
      }
      
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      // Actualizar localmente (incluyendo el total si se calculó)
      const actualizacionReserva: Partial<Reserva> = { estado: nuevoEstado };
      if (totalAPagar !== undefined) {
        actualizacionReserva.total = totalAPagar;
        actualizacionReserva.precio = totalAPagar;
      }

      setReservas(prev => prev.map(r => 
        r.id === id ? { ...r, ...actualizacionReserva } : r
      ));
      setReservasOriginales(prev => prev.map(r => 
        r.id === id ? { ...r, ...actualizacionReserva } : r
      ));
      
      if (reservaSeleccionada?.id === id) {
        setReservaSeleccionada(prev => prev ? { ...prev, ...actualizacionReserva } : null);
      }

      // Disparar evento para actualizar el dashboard y finanzas
      window.dispatchEvent(new CustomEvent('reservaActualizada', { 
        detail: { 
          reservaId: id, 
          nuevoEstado,
          total: totalAPagar,
          esAfiliado: reservaSeleccionada?.esAfiliado || false
        } 
      }));
      
      // Si el estado es confirmada o completada, registrar en logs
      if (nuevoEstado === 'confirmada' || nuevoEstado === 'completada') {
        console.log(`💰 ReservasTab - Reserva ${id} ${nuevoEstado} con total: ${totalAPagar || reservaSeleccionada?.total || 0}`);
      }

      // Mostrar mensaje de éxito en la página
      setMensajeNotificacion({
        tipo: 'success',
        texto: `✅ Estado actualizado exitosamente a: ${nombreEstado}`
      });

      // Ocultar el mensaje después de 4 segundos
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      
      // Mostrar mensaje de error en la página
      setMensajeNotificacion({
        tipo: 'error',
        texto: '❌ Error al actualizar el estado. Por favor intenta nuevamente.'
      });

      // Ocultar el mensaje después de 4 segundos
      setTimeout(() => {
        setMensajeNotificacion(null);
      }, 4000);
    }
  };

  const obtenerEstadoColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pendiente de pago':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'N/A';
    try {
      // Agregar T00:00:00 para evitar problemas de zona horaria
      const date = new Date(fecha + 'T00:00:00');
      return date.toLocaleDateString('es-CO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return fecha;
    }
  };

  const formatearPrecio = (precio?: number) => {
    if (!precio) return '$0';
    return `$${precio.toLocaleString('es-CO')}`;
  };

  if (reservaSeleccionada) {
    return (
      <div className="space-y-6">
        {/* Header con botón volver */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setReservaSeleccionada(null)}
            className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:text-[#3d2817] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver a la lista
          </button>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${obtenerEstadoColor(reservaSeleccionada.estado)}`}>
            {reservaSeleccionada.estado?.toUpperCase() || 'PENDIENTE'}
          </span>
        </div>

        {/* Vista detallada de la reserva */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-[#3d2817] mb-2">
              Reserva #{reservaSeleccionada.id}
            </h2>
            <p className="text-stone-600">Creada el {formatearFecha(reservaSeleccionada.fechaCreacion || reservaSeleccionada.createdAt)}</p>
          </div>

          {/* Información del Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
                <span>👤</span> Información del Cliente
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-stone-600">Nombre</p>
                  <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.nombre || reservaSeleccionada.cliente || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">Teléfono</p>
                  <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.telefono || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">Email</p>
                  <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.email || 'N/A'}</p>
                </div>
                {reservaSeleccionada.esAfiliado && (
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                      👑 Afiliado
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#3d2817] flex items-center gap-2">
                  <span>📅</span> Información de la Cita
                </h3>
                {!editandoFechaHora && (
                  <button
                    onClick={() => {
                      setEditandoFechaHora(true);
                      setNuevaFecha(reservaSeleccionada.fecha || '');
                      setNuevaHora(reservaSeleccionada.horario || reservaSeleccionada.hora || '');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                    title="Editar fecha y hora"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Editar
                  </button>
                )}
              </div>
              {editandoFechaHora ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">Nueva Fecha</label>
                    <input
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => setNuevaFecha(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3d2817] mb-2">Nueva Hora</label>
                    <select
                      value={nuevaHora}
                      onChange={(e) => setNuevaHora(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
                    >
                      <option value="">Seleccionar hora</option>
                      {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => actualizarFechaHora(reservaSeleccionada.id, nuevaFecha, nuevaHora)}
                      disabled={!nuevaFecha || !nuevaHora}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditandoFechaHora(false);
                        setNuevaFecha('');
                        setNuevaHora('');
                      }}
                      className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-stone-600">Fecha</p>
                    <p className="font-semibold text-[#3d2817]">{formatearFecha(reservaSeleccionada.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Hora</p>
                    <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.horario || reservaSeleccionada.hora || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Duración Total</p>
                    <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.duracionTotal || reservaSeleccionada.duracion || 0} minutos</p>
                  </div>
                  {reservaSeleccionada.fisio && (
                    <div>
                      <p className="text-sm text-stone-600">Fisioterapeuta</p>
                      <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.fisio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Servicios Seleccionados */}
          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
              <span>🛎️</span> Servicios Seleccionados
            </h3>
            
            <div className="space-y-4">
              {/* Terapias */}
              {reservaSeleccionada.terapias && reservaSeleccionada.terapias.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">Terapias ({reservaSeleccionada.terapias.length}):</p>
                  <div className="space-y-2">
                    {reservaSeleccionada.terapias.map((terapia: any, idx: number) => {
                      const nombre = terapia?.nombre || terapia?.servicio || 'Terapia sin nombre';
                      const duracion = terapia?.duracion || 0;
                      const precio = terapia?.precio || terapia?.precioOriginal || 0;
                      const icono = terapia?.icon || '✨';
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{icono}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-[#3d2817]">{nombre}</p>
                              <p className="text-xs text-stone-600 mt-1">{duracion} minutos</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#3d2817]">{formatearPrecio(precio)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Servicio único (formato antiguo) */}
              {!reservaSeleccionada.terapias && reservaSeleccionada.servicio && (
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">Servicio:</p>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">🛎️</span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#3d2817]">{reservaSeleccionada.servicio}</p>
                        <p className="text-xs text-stone-600 mt-1">{reservaSeleccionada.duracion || 0} minutos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#3d2817]">{formatearPrecio(reservaSeleccionada.precio || 0)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Servicios Adicionales Individuales */}
              {reservaSeleccionada.serviciosAdicionales && reservaSeleccionada.serviciosAdicionales.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide flex items-center justify-between">
                    <span>Servicios Adicionales ({reservaSeleccionada.serviciosAdicionales.length}):</span>
                    {reservaSeleccionada.esAfiliado && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        🏅 Afiliado
                      </span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {reservaSeleccionada.serviciosAdicionales.map((servicio: any, idx: number) => {
                      const nombre = typeof servicio === 'string' ? servicio : (servicio?.nombre || servicio?.id || 'Servicio');
                      const icon = typeof servicio === 'object' ? servicio?.icon : null;
                      const precioAplicado = typeof servicio === 'object' ? servicio?.precioAplicado : null;
                      const precioParticular = typeof servicio === 'object' ? servicio?.precioParticular : null;
                      const precioAfiliado = typeof servicio === 'object' ? servicio?.precioAfiliado : null;
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{icon || '💆'}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-[#3d2817]">{nombre}</p>
                              {reservaSeleccionada.esAfiliado && precioParticular && precioAfiliado && (
                                <p className="text-xs text-green-600 font-semibold">
                                  Ahorro: {formatearPrecio(precioParticular - precioAfiliado)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {reservaSeleccionada.esAfiliado && precioParticular && precioAplicado !== precioParticular && (
                              <p className="text-xs text-stone-500 line-through">
                                {formatearPrecio(precioParticular)}
                              </p>
                            )}
                            <p className="font-bold text-blue-600">
                              {formatearPrecio(precioAplicado || precioParticular || precioAfiliado || 0)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Productos */}
              {reservaSeleccionada.productos && reservaSeleccionada.productos.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">Productos ({reservaSeleccionada.productos.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {reservaSeleccionada.productos.map((producto: any, idx: number) => {
                      const nombre = typeof producto === 'string' ? producto : (producto?.nombre || producto?.id || 'Producto');
                      return (
                        <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold border border-blue-300">
                          📦 {nombre}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mensaje si no hay servicios */}
              {!reservaSeleccionada.terapias && !reservaSeleccionada.servicio && (
                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                  <p className="text-sm text-yellow-800 font-semibold">⚠️ No se encontraron servicios seleccionados</p>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          {reservaSeleccionada.notas && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-[#3d2817] mb-2 flex items-center gap-2">
                <span>📝</span> Notas
              </h3>
              <p className="text-stone-700">{reservaSeleccionada.notas}</p>
            </div>
          )}

          {/* Resumen de Precio con Descuento */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
            <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
              <span>💰</span> Resumen Financiero
            </h3>
            <div className="space-y-3">
              {/* Desglose de servicios */}
              {reservaSeleccionada.terapias && reservaSeleccionada.terapias.length > 0 && (
                <div className="bg-white/60 rounded-lg p-3 mb-2">
                  <p className="text-xs font-semibold text-stone-600 mb-2">Terapias:</p>
                  <div className="space-y-1">
                    {reservaSeleccionada.terapias.map((terapia: any, idx: number) => {
                      const nombre = terapia?.nombre || 'Terapia';
                      const precio = terapia?.precio || terapia?.precioOriginal || 0;
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-stone-700 truncate pr-2">{nombre}</span>
                          <span className="font-semibold text-[#3d2817] whitespace-nowrap">{formatearPrecio(precio)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Si hay paquete seleccionado, mostrar solo el paquete en el resumen financiero */}
              {reservaSeleccionada.paqueteSeleccionado ? (
                <div className="bg-white/60 rounded-lg p-3 mb-2">
                  <p className="text-xs font-semibold text-stone-600 mb-2">Paquete Relajación:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-700 truncate pr-2">
                        💆 Paquete Relajación (Sauna + Jacuzzi + Baño Turco)
                      </span>
                      <span className="font-semibold text-[#3d2817] whitespace-nowrap">
                        {formatearPrecio(
                          reservaSeleccionada.esAfiliado 
                            ? PRECIO_PAQUETE_AFILIADO 
                            : PRECIO_PAQUETE_RELAJACION
                        )}
                      </span>
                    </div>
                    {reservaSeleccionada.esAfiliado && (
                      <p className="text-xs text-green-700 mt-1">
                        ✓ Precio afiliado: $13,000
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Si NO hay paquete, mostrar servicios adicionales individuales */
                reservaSeleccionada.serviciosAdicionales && reservaSeleccionada.serviciosAdicionales.length > 0 && (
                  <div className="bg-white/60 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-stone-600 mb-2">Servicios Adicionales:</p>
                    <div className="space-y-2">
                      {reservaSeleccionada.serviciosAdicionales.map((servicio: any, idx: number) => {
                        let nombreServicio = '';
                        let precioParticular = 0;
                        let precioAfiliado = 0;
                        let iconoServicio = '💆';
                        
                        // Si es un objeto, usar sus propiedades
                        if (typeof servicio === 'object' && servicio !== null) {
                          nombreServicio = servicio.nombre || servicio.id || 'Servicio';
                          precioParticular = servicio.precioParticular || servicio.precio || 29900;
                          precioAfiliado = servicio.precioAfiliado || 13000;
                          iconoServicio = servicio.icon || '💆';
                        } else {
                          // Si es un string, buscar en las referencias
                          const servicioRef = SERVICIOS_ADICIONALES_PRECIOS[servicio];
                          if (servicioRef) {
                            nombreServicio = servicioRef.nombre;
                            precioParticular = servicioRef.precio;
                            precioAfiliado = PRECIO_SERVICIO_AFILIADO;
                            iconoServicio = servicioRef.icon;
                          } else {
                            nombreServicio = servicio;
                            precioParticular = 0;
                            precioAfiliado = 0;
                          }
                        }
                        
                        const precioAplicado = reservaSeleccionada.esAfiliado ? precioAfiliado : precioParticular;
                        
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-stone-700 truncate pr-2 flex items-center gap-1">
                              <span>{iconoServicio}</span>
                              <span>{nombreServicio}</span>
                            </span>
                            <div className="text-right">
                              {reservaSeleccionada.esAfiliado && precioParticular > 0 && (
                                <p className="text-xs text-stone-500 line-through">
                                  {formatearPrecio(precioParticular)}
                                </p>
                              )}
                              <span className={`font-semibold whitespace-nowrap ${reservaSeleccionada.esAfiliado ? 'text-green-600' : 'text-[#3d2817]'}`}>
                                {precioAplicado > 0 ? formatearPrecio(precioAplicado) : 'N/A'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* Servicios adicionales fuera del paquete en el resumen financiero (si hay alguno) */}
              {(() => {
                if (!reservaSeleccionada.serviciosAdicionales || reservaSeleccionada.serviciosAdicionales.length === 0) return null;
                
                // Filtrar servicios que NO están en el paquete (solo si hay paquete seleccionado)
                const serviciosFueraPaquete = reservaSeleccionada.paqueteSeleccionado
                  ? reservaSeleccionada.serviciosAdicionales.filter((servicio: any) => {
                      const id = typeof servicio === 'string' ? servicio : (servicio?.id || servicio?.nombre || '');
                      return !['sauna', 'jacuzzi', 'turco'].includes(id.toLowerCase());
                    })
                  : [];
                
                // Solo mostrar si hay servicios fuera del paquete
                if (serviciosFueraPaquete.length > 0) {
                  return (
                    <div className="bg-white/60 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-stone-600 mb-2">Otros Servicios Adicionales:</p>
                      <div className="space-y-1">
                        {serviciosFueraPaquete.map((servicio: any, idx: number) => {
                          let nombreServicio = '';
                          let precioServicio = 0;
                          let iconoServicio = '💆';
                          
                          if (typeof servicio === 'object' && servicio !== null) {
                            nombreServicio = servicio.nombre || servicio.id || 'Servicio';
                            precioServicio = servicio.precio || servicio.precioParticular || 0;
                            iconoServicio = servicio.icon || '💆';
                          } else {
                            const servicioRef = SERVICIOS_ADICIONALES_PRECIOS[servicio];
                            if (servicioRef) {
                              nombreServicio = servicioRef.nombre;
                              precioServicio = servicioRef.precio;
                              iconoServicio = servicioRef.icon;
                            } else {
                              nombreServicio = servicio;
                              precioServicio = 0;
                            }
                          }
                          
                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-stone-700 truncate pr-2">{iconoServicio} {nombreServicio}</span>
                              <span className="font-semibold text-[#3d2817] whitespace-nowrap">
                                {precioServicio > 0 ? formatearPrecio(precioServicio) : 'N/A'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                
                return null;
              })()}

              {/* Productos con precios */}
              {reservaSeleccionada.productos && reservaSeleccionada.productos.length > 0 && (
                <div className="bg-white/60 rounded-lg p-3 mb-2">
                  <p className="text-xs font-semibold text-stone-600 mb-2">Productos:</p>
                  <div className="space-y-1">
                    {reservaSeleccionada.productos.map((producto: any, idx: number) => {
                      let nombreProducto = '';
                      let precioProducto = 0;
                      let iconoProducto = '📦';
                      
                      // Si es un objeto, usar sus propiedades
                      if (typeof producto === 'object' && producto !== null) {
                        nombreProducto = producto.nombre || producto.id || 'Producto';
                        precioProducto = producto.precio || 0;
                        iconoProducto = producto.icon || '📦';
                      } else {
                        // Si es un string, buscar en las referencias
                        const productoRef = PRODUCTOS_PRECIOS[producto];
                        if (productoRef) {
                          nombreProducto = productoRef.nombre;
                          precioProducto = productoRef.precio;
                          iconoProducto = productoRef.icon;
                        } else {
                          nombreProducto = producto;
                          precioProducto = 0; // Si no se encuentra, precio 0
                        }
                      }
                      
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-stone-700 truncate pr-2">{iconoProducto} {nombreProducto}</span>
                          <span className="font-semibold text-[#3d2817] whitespace-nowrap">
                            {precioProducto > 0 ? formatearPrecio(precioProducto) : 'N/A'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cálculo del subtotal completo incluyendo servicios adicionales y productos */}
              {(() => {
                // Calcular subtotal manualmente para mostrar desglose correcto
                let subtotalTerapias = 0;
                if (reservaSeleccionada.terapias && reservaSeleccionada.terapias.length > 0) {
                  subtotalTerapias = reservaSeleccionada.terapias.reduce((sum: number, t: any) => {
                    return sum + (t?.precio || t?.precioOriginal || 0);
                  }, 0);
                } else if (reservaSeleccionada.precio && !reservaSeleccionada.terapias) {
                  subtotalTerapias = reservaSeleccionada.precio;
                }

                let subtotalServiciosAdicionales = 0;
                // Si hay paquete seleccionado, usar precio del paquete (afiliado o normal)
                if (reservaSeleccionada.paqueteSeleccionado) {
                  subtotalServiciosAdicionales = reservaSeleccionada.esAfiliado 
                    ? PRECIO_PAQUETE_AFILIADO 
                    : PRECIO_PAQUETE_RELAJACION;
                } else if (reservaSeleccionada.serviciosAdicionales && reservaSeleccionada.serviciosAdicionales.length > 0) {
                  // Si no hay paquete, sumar servicios individuales
                  subtotalServiciosAdicionales = reservaSeleccionada.serviciosAdicionales.reduce((sum: number, s: any) => {
                    if (typeof s === 'object' && s !== null) {
                      return sum + (s.precio || s.precioParticular || 0);
                    } else {
                      const servicioRef = SERVICIOS_ADICIONALES_PRECIOS[s];
                      return sum + (servicioRef?.precio || 0);
                    }
                  }, 0);
                }

                let subtotalProductos = 0;
                if (reservaSeleccionada.productos && reservaSeleccionada.productos.length > 0) {
                  subtotalProductos = reservaSeleccionada.productos.reduce((sum: number, p: any) => {
                    if (typeof p === 'object' && p !== null) {
                      return sum + (p.precio || 0);
                    } else {
                      const productoRef = PRODUCTOS_PRECIOS[p];
                      return sum + (productoRef?.precio || 0);
                    }
                  }, 0);
                }

                const subtotalCalculado = subtotalTerapias + subtotalServiciosAdicionales + subtotalProductos;
                const subtotalFinal = reservaSeleccionada.total || reservaSeleccionada.precio || subtotalCalculado;

                return (
                  <>
                    {(subtotalServiciosAdicionales > 0 || subtotalProductos > 0) && (
                      <div className="bg-white/60 rounded-lg p-3 mb-2 border border-amber-200">
                        <p className="text-xs font-semibold text-stone-600 mb-2">Desglose:</p>
                        <div className="space-y-1 text-xs">
                          {subtotalTerapias > 0 && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Terapias:</span>
                              <span className="font-semibold">{formatearPrecio(subtotalTerapias)}</span>
                            </div>
                          )}
                          {subtotalServiciosAdicionales > 0 && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">
                                {reservaSeleccionada.paqueteSeleccionado ? 'Paquete Relajación (Sauna + Jacuzzi + Turco):' : 'Servicios Adicionales:'}
                              </span>
                              <span className="font-semibold">{formatearPrecio(subtotalServiciosAdicionales)}</span>
                            </div>
                          )}
                          {subtotalProductos > 0 && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Productos:</span>
                              <span className="font-semibold">{formatearPrecio(subtotalProductos)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-amber-300">
                      <span className="text-lg font-semibold text-stone-700">Subtotal:</span>
                      <span className="text-lg font-bold text-[#3d2817]">
                        {formatearPrecio(subtotalFinal)}
                      </span>
                    </div>
                  </>
                );
              })()}
              
              {/* Precio Original y Descuentos */}
              {(() => {
                // Calcular subtotal para usar como precio original si no hay total guardado
                let subtotalTerapias = 0;
                if (reservaSeleccionada.terapias && reservaSeleccionada.terapias.length > 0) {
                  subtotalTerapias = reservaSeleccionada.terapias.reduce((sum: number, t: any) => {
                    return sum + (t?.precio || t?.precioOriginal || 0);
                  }, 0);
                } else if (reservaSeleccionada.precio && !reservaSeleccionada.terapias) {
                  subtotalTerapias = reservaSeleccionada.precio;
                }

                // Calcular servicios adicionales ORIGINALES (sin descuentos de afiliado)
                let subtotalServiciosAdicionalesOriginal = 0;
                if (reservaSeleccionada.paqueteSeleccionado) {
                  subtotalServiciosAdicionalesOriginal = PRECIO_PAQUETE_RELAJACION; // $29,900
                } else if (reservaSeleccionada.serviciosAdicionales && reservaSeleccionada.serviciosAdicionales.length > 0) {
                  subtotalServiciosAdicionalesOriginal = reservaSeleccionada.serviciosAdicionales.reduce((sum: number, s: any) => {
                    if (typeof s === 'object' && s !== null) {
                      return sum + (s.precio || s.precioParticular || 0);
                    } else {
                      const servicioRef = SERVICIOS_ADICIONALES_PRECIOS[s];
                      return sum + (servicioRef?.precio || 0);
                    }
                  }, 0);
                }

                let subtotalProductos = 0;
                if (reservaSeleccionada.productos && reservaSeleccionada.productos.length > 0) {
                  subtotalProductos = reservaSeleccionada.productos.reduce((sum: number, p: any) => {
                    if (typeof p === 'object' && p !== null) {
                      return sum + (p.precio || 0);
                    } else {
                      const productoRef = PRODUCTOS_PRECIOS[p];
                      return sum + (productoRef?.precio || 0);
                    }
                  }, 0);
                }

                // PRECIO ORIGINAL (sin ningún descuento): terapias + servicios originales + productos
                const precioTotalOriginal = subtotalTerapias + subtotalServiciosAdicionalesOriginal + subtotalProductos;
                
                // Si es afiliado: cambiar paquete de $29,900 a $13,000 ANTES de calcular el 20%
                let subtotalServiciosAdicionalesConDescuento = subtotalServiciosAdicionalesOriginal;
                if (reservaSeleccionada.esAfiliado && reservaSeleccionada.paqueteSeleccionado) {
                  subtotalServiciosAdicionalesConDescuento = PRECIO_PAQUETE_AFILIADO; // $13,000
                }
                
                // Calcular nuevo total con el paquete a precio afiliado
                const precioTotalConPaqueteDescuento = subtotalTerapias + subtotalServiciosAdicionalesConDescuento + subtotalProductos;
                
                // Descuento del 20% sobre el TOTAL (con el paquete ya ajustado a $13,000 si aplica)
                const descuentoAfiliadoTotal = reservaSeleccionada.esAfiliado ? precioTotalConPaqueteDescuento * 0.20 : 0;
                
                // Precio final: total con paquete ajustado menos el descuento del 20%
                const precioConDescuento = precioTotalConPaqueteDescuento - descuentoAfiliadoTotal;
                
                // Precio mostrado: si ya es afiliado, usar precio con descuento; si no, usar precio original
                const precioMostrado = reservaSeleccionada.esAfiliado ? precioConDescuento : precioTotalOriginal;

                return (
                  <div className="space-y-3 mt-4">
                    {/* Precio Original */}
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-blue-800">💰 Precio Original (sin descuentos):</span>
                        <span className="text-lg font-bold text-blue-900">
                          {formatearPrecio(precioTotalOriginal)}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Precio calculado por los servicios seleccionados
                        {reservaSeleccionada.paqueteSeleccionado && (
                          <span className="block mt-1">• Paquete Relajación: {formatearPrecio(PRECIO_PAQUETE_RELAJACION)}</span>
                        )}
                      </p>
                    </div>

                    {/* Descuento de Afiliado - 20% sobre el Total */}
                    {reservaSeleccionada.esAfiliado && (
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-green-800">👑 Descuento Afiliado (20%):</span>
                            <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                              BENEFICIO APLICADO
                            </span>
                          </div>
                          <span className="text-lg font-bold text-green-700">
                            -{formatearPrecio(descuentoAfiliadoTotal)}
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          ✓ Cliente afiliado - Descuento del 20% aplicado sobre el precio total calculado
                        </p>
                        <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                          <p className="text-xs font-semibold text-green-800">
                            💡 Motivo: El cliente tiene beneficios de afiliado activos
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Precio Final */}
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-amber-400">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#3d2817]">Total a Pagar:</span>
                        {reservaSeleccionada.esAfiliado ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-stone-400 line-through">
                                {formatearPrecio(precioTotalOriginal)}
                              </span>
                              <span className="text-2xl font-bold text-green-700">
                                {formatearPrecio(precioMostrado)}
                              </span>
                            </div>
                            <button
                              onClick={async () => {
                                const confirmado = await showConfirm('¿Estás seguro de que deseas cancelar los beneficios de afiliado? El precio volverá al original.');
                                if (confirmado) {
                                  cancelarBeneficiosAfiliado(reservaSeleccionada.id, precioTotalOriginal);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                              title="Cancelar beneficios de afiliado"
                            >
                              ✕ Cancelar Beneficios
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-green-700">
                              {formatearPrecio(precioMostrado)}
                            </span>
                            <button
                              onClick={() => {
                                setAplicandoDescuentos(true);
                                // Calcular descuentos automáticamente:
                                // 1. Si hay paquete, cambiarlo de $29,900 a $13,000
                                let serviciosConDescuento = subtotalServiciosAdicionalesOriginal;
                                if (reservaSeleccionada.paqueteSeleccionado) {
                                  serviciosConDescuento = PRECIO_PAQUETE_AFILIADO; // $13,000
                                }
                                // 2. Calcular nuevo total con paquete ajustado
                                const precioTotalConPaqueteAjustado = subtotalTerapias + serviciosConDescuento + subtotalProductos;
                                // 3. Aplicar 20% sobre ese total
                                const descuentoTotal = precioTotalConPaqueteAjustado * 0.20;
                                const precioFinalConDescuentos = precioTotalConPaqueteAjustado - descuentoTotal;
                                aplicarDescuentosAfiliado(reservaSeleccionada.id, precioFinalConDescuentos);
                              }}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                              title="Aplicar descuentos de afiliado (20% en terapias y precio especial en servicios adicionales)"
                            >
                              👑 Aplicar Descuentos de Afiliado
                            </button>
                          </div>
                        )}
                      </div>
                      {reservaSeleccionada.esAfiliado && (
                        <div className="mt-2 pt-2 border-t border-amber-300">
                          <p className="text-xs text-amber-800">
                            <strong>Diferencia aplicada:</strong> {formatearPrecio(precioTotalOriginal - precioMostrado)} de descuento por beneficios de afiliado
                            {reservaSeleccionada.paqueteSeleccionado && (
                              <span className="block mt-1">
                                • Paquete ajustado de {formatearPrecio(PRECIO_PAQUETE_RELAJACION)} a {formatearPrecio(PRECIO_PAQUETE_AFILIADO)}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Acciones - Cambiar Estado */}
          <div className="bg-white rounded-xl p-6 border-2 border-stone-300">
            <h3 className="text-lg font-bold text-[#3d2817] mb-4 flex items-center gap-2">
              <span>⚙️</span> Cambiar Estado
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  if (target && target.classList) {
                    target.classList.add('animate-pulse-scale');
                    actualizarEstado(reservaSeleccionada.id, 'pendiente');
                    // La clase se eliminará automáticamente después de la animación (600ms)
                    setTimeout(() => {
                      try {
                        if (target && target.classList && target.classList.contains('animate-pulse-scale')) {
                          target.classList.remove('animate-pulse-scale');
                        }
                      } catch (err) {
                        // Si el elemento ya no existe, ignorar el error
                        console.warn('Error removiendo clase de animación:', err);
                      }
                    }, 600);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-300 transform relative overflow-hidden group ${
                  reservaSeleccionada.estado === 'pendiente'
                    ? 'bg-yellow-300 text-yellow-900 border-yellow-400 cursor-not-allowed opacity-70 shadow-lg'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 hover:scale-105 hover:shadow-md active:scale-95'
                }`}
                disabled={reservaSeleccionada.estado === 'pendiente'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {reservaSeleccionada.estado === 'pendiente' && <span className="text-lg">✓</span>}
                  Pendiente
                </span>
                {reservaSeleccionada.estado !== 'pendiente' && (
                  <span className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  if (target && target.classList) {
                    target.classList.add('animate-pulse-scale');
                    actualizarEstado(reservaSeleccionada.id, 'pendiente de pago');
                    setTimeout(() => {
                      try {
                        if (target && target.classList && target.classList.contains('animate-pulse-scale')) {
                          target.classList.remove('animate-pulse-scale');
                        }
                      } catch (err) {
                        console.warn('Error removiendo clase de animación:', err);
                      }
                    }, 600);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-300 transform relative overflow-hidden group ${
                  reservaSeleccionada.estado === 'pendiente de pago'
                    ? 'bg-orange-300 text-orange-900 border-orange-400 cursor-not-allowed opacity-70 shadow-lg'
                    : 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200 hover:scale-105 hover:shadow-md active:scale-95'
                }`}
                disabled={reservaSeleccionada.estado === 'pendiente de pago'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {reservaSeleccionada.estado === 'pendiente de pago' && <span className="text-lg">✓</span>}
                  Pendiente de Pago
                </span>
                {reservaSeleccionada.estado !== 'pendiente de pago' && (
                  <span className="absolute inset-0 bg-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  if (target && target.classList) {
                    target.classList.add('animate-pulse-scale');
                    actualizarEstado(reservaSeleccionada.id, 'confirmada');
                    setTimeout(() => {
                      try {
                        if (target && target.classList && target.classList.contains('animate-pulse-scale')) {
                          target.classList.remove('animate-pulse-scale');
                        }
                      } catch (err) {
                        console.warn('Error removiendo clase de animación:', err);
                      }
                    }, 600);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-300 transform relative overflow-hidden group ${
                  reservaSeleccionada.estado === 'confirmada'
                    ? 'bg-green-300 text-green-900 border-green-400 cursor-not-allowed opacity-70 shadow-lg'
                    : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:scale-105 hover:shadow-md active:scale-95'
                }`}
                disabled={reservaSeleccionada.estado === 'confirmada'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {reservaSeleccionada.estado === 'confirmada' && <span className="text-lg">✓</span>}
                  Confirmada
                </span>
                {reservaSeleccionada.estado !== 'confirmada' && (
                  <span className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  if (target && target.classList) {
                    target.classList.add('animate-pulse-scale');
                    actualizarEstado(reservaSeleccionada.id, 'completada');
                    setTimeout(() => {
                      try {
                        if (target && target.classList && target.classList.contains('animate-pulse-scale')) {
                          target.classList.remove('animate-pulse-scale');
                        }
                      } catch (err) {
                        console.warn('Error removiendo clase de animación:', err);
                      }
                    }, 600);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-300 transform relative overflow-hidden group ${
                  reservaSeleccionada.estado === 'completada'
                    ? 'bg-blue-300 text-blue-900 border-blue-400 cursor-not-allowed opacity-70 shadow-lg'
                    : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 hover:scale-105 hover:shadow-md active:scale-95'
                }`}
                disabled={reservaSeleccionada.estado === 'completada'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {reservaSeleccionada.estado === 'completada' && <span className="text-lg">✓</span>}
                  Completada
                </span>
                {reservaSeleccionada.estado !== 'completada' && (
                  <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  if (target && target.classList) {
                    target.classList.add('animate-pulse-scale');
                    actualizarEstado(reservaSeleccionada.id, 'cancelada');
                    setTimeout(() => {
                      try {
                        if (target && target.classList && target.classList.contains('animate-pulse-scale')) {
                          target.classList.remove('animate-pulse-scale');
                        }
                      } catch (err) {
                        console.warn('Error removiendo clase de animación:', err);
                      }
                    }, 600);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-300 transform relative overflow-hidden group ${
                  reservaSeleccionada.estado === 'cancelada'
                    ? 'bg-red-300 text-red-900 border-red-400 cursor-not-allowed opacity-70 shadow-lg'
                    : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:scale-105 hover:shadow-md active:scale-95'
                }`}
                disabled={reservaSeleccionada.estado === 'cancelada'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {reservaSeleccionada.estado === 'cancelada' && <span className="text-lg">✓</span>}
                  Cancelada
                </span>
                {reservaSeleccionada.estado !== 'cancelada' && (
                  <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Notificación visual para cambios de estado */}
      {mensajeNotificacion && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-2 animate-fade-in ${
            mensajeNotificacion.tipo === 'success'
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
          style={{
            animation: 'fadeIn 0.3s ease-out, fadeOut 0.3s ease-out 3.7s forwards'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {mensajeNotificacion.tipo === 'success' ? '✅' : '❌'}
            </span>
            <p className="font-semibold text-sm">{mensajeNotificacion.texto}</p>
            <button
              onClick={() => setMensajeNotificacion(null)}
              className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar notificación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        @keyframes pulseScale {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-pulse-scale {
          animation: pulseScale 0.6s ease-out;
        }
      `}</style>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3d2817]">Gestión de Reservas</h2>
            <span className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full text-sm font-bold shadow-md">
              {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'}
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            loadReservas();
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

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-[#3d2817] mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Filtrar por Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="pendiente de pago">Pendiente de Pago</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Filtrar por Fecha (Período)</label>
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
            >
              <option value="todas">Todas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Filtrar por Fecha Específica</label>
            <input
              type="date"
              value={filtroFechaEspecifica}
              onChange={(e) => setFiltroFechaEspecifica(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Buscar por Nombre</label>
            <input
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Ej: Juan, María..."
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Buscar por Teléfono</label>
            <input
              type="text"
              value={filtroTelefono}
              onChange={(e) => setFiltroTelefono(e.target.value)}
              placeholder="Ej: 3001234567..."
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#3d2817] focus:border-[#3d2817] outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroEstado('todas');
                setFiltroFecha('todas');
                setFiltroNombre('');
                setFiltroTelefono('');
                setFiltroFechaEspecifica('');
              }}
              className="w-full px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar Filtros
            </button>
          </div>
        </div>
        
        {(filtroNombre || filtroTelefono || filtroFechaEspecifica || filtroEstado !== 'todas' || filtroFecha !== 'todas') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Filtros activos:</strong> {reservas.length} {reservas.length === 1 ? 'reserva encontrada' : 'reservas encontradas'} de {reservasOriginales.length} totales
            </p>
          </div>
        )}
      </div>

      {/* Lista de Reservas */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2817]"></div>
        </div>
      ) : reservas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-stone-600 text-lg">No hay reservas que mostrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-amber-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setReservaSeleccionada(reserva)}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-bold text-[#3d2817]">
                      {reserva.nombre || reserva.cliente || 'Cliente sin nombre'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${obtenerEstadoColor(reserva.estado)}`}>
                      {reserva.estado?.toUpperCase() || 'PENDIENTE'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-stone-600 mb-3">
                    <div>
                      <span className="font-semibold">📅 Fecha:</span> {formatearFecha(reserva.fecha)}
                    </div>
                    <div>
                      <span className="font-semibold">🕐 Hora:</span> {reserva.horario || reserva.hora || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">💰 Total:</span> {formatearPrecio(reserva.total || reserva.precio || 0)}
                    </div>
                  </div>

                  {/* Resumen de servicios seleccionados */}
                  <div className="mt-3 space-y-2">
                    {reserva.terapias && reserva.terapias.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-stone-500 uppercase">Terapias:</span>
                        {reserva.terapias.slice(0, 3).map((t: any, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                            {t?.nombre || t?.servicio || 'Servicio'}
                          </span>
                        ))}
                        {reserva.terapias.length > 3 && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                            +{reserva.terapias.length - 3} más
                          </span>
                        )}
                      </div>
                    )}

                    {!reserva.terapias && reserva.servicio && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-500 uppercase">Servicio:</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                          {reserva.servicio}
                        </span>
                      </div>
                    )}

                    {reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-stone-500 uppercase block mb-1">Servicios Adicionales:</span>
                        <div className="space-y-1">
                          {reserva.serviciosAdicionales.map((s: any, idx: number) => {
                            const nombre = typeof s === 'string' ? s : (s?.nombre || s?.id);
                            const icon = typeof s === 'object' ? s?.icon : null;
                            const precioParticular = typeof s === 'object' ? (s?.precioParticular || s?.precio || 29900) : 29900;
                            const precioAfiliado = typeof s === 'object' ? (s?.precioAfiliado || 13000) : 13000;
                            const precioAplicado = reserva.esAfiliado ? precioAfiliado : precioParticular;
                            
                            return (
                              <div key={idx} className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                                <div className="flex items-center gap-2">
                                  {icon && <span className="text-lg">{icon}</span>}
                                  <span className="text-sm font-semibold text-amber-900">{nombre}</span>
                                </div>
                                <div className="text-right">
                                  {reserva.esAfiliado && (
                                    <p className="text-xs text-stone-500 line-through">
                                      ${precioParticular.toLocaleString('es-CO')}
                                    </p>
                                  )}
                                  <p className={`text-sm font-bold ${reserva.esAfiliado ? 'text-green-600' : 'text-amber-800'}`}>
                                    ${precioAplicado.toLocaleString('es-CO')}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {reserva.productos && reserva.productos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-stone-500 uppercase">Productos:</span>
                        {reserva.productos.map((p: any, idx: number) => {
                          const nombre = typeof p === 'string' ? p : (p?.nombre || p?.id);
                          return (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                              {nombre}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(reserva.id);
                      setReservaAEliminar(reserva);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    title="Eliminar reserva"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  <div 
                    onClick={() => setReservaSeleccionada(reserva)}
                    className="cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-stone-400 hover:text-[#3d2817] transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && reservaAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#3d2817]">¿Eliminar Reserva?</h3>
                <p className="text-sm text-stone-600 mt-1">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <div className="bg-stone-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-stone-700 mb-3">Reserva a eliminar:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3d2817]">👤 Cliente:</span>
                  <span className="text-sm text-stone-700">{reservaAEliminar.nombre || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3d2817]">📅 Fecha:</span>
                  <span className="text-sm text-stone-700">{formatearFecha(reservaAEliminar.fecha)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3d2817]">🕐 Hora:</span>
                  <span className="text-sm text-stone-700">{reservaAEliminar.hora || reservaAEliminar.horario || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3d2817]">💰 Total:</span>
                  <span className="text-sm text-stone-700 font-semibold">{formatearPrecio(reservaAEliminar.total || reservaAEliminar.precio)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3d2817]">📊 Estado:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${obtenerEstadoColor(reservaAEliminar.estado)}`}>
                    {reservaAEliminar.estado?.toUpperCase() || 'PENDIENTE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-amber-800">
                  <strong>Advertencia:</strong> Al eliminar esta reserva, se eliminará permanentemente de la base de datos. 
                  Esta acción afectará las estadísticas y no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => eliminarReserva(showDeleteModal)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Sí, Eliminar
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(null);
                  setReservaAEliminar(null);
                }}
                className="flex-1 bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-all font-semibold"
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

