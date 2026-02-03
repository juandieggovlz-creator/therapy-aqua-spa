/**
 * Helpers para gestión de reservas usando Prisma
 */

import prisma from '@/lib/prisma';

export type Reserva = {
  id: number;
  reservation_id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  fecha: Date;
  horario: string;
  servicios: any;
  productos: any;
  total: number;
  estado: string;
  notas: string | null;
  fisioterapeuta: string | null;
  codigo_afiliado: string | null;
  descuento_afiliado: number;
  descuento_individual: number;
  descuento_promocion: number;
  created_at: Date;
  updated_at: Date;
};

/**
 * Obtener todas las reservas
 */
export async function getAllReservas(): Promise<Reserva[]> {
  try {
    const reservas = await prisma.reserva.findMany({
      orderBy: { created_at: 'desc' }
    });
    return reservas as any;
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    return [];
  }
}

/**
 * Crear nueva reserva
 */
export async function createReserva(data: any): Promise<Reserva | null> {
  try {
    const reserva = await prisma.reserva.create({
      data: {
        reservation_id: data.reservation_id,
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        fecha: new Date(data.fecha),
        horario: data.horario,
        servicios: data.servicios,
        productos: data.productos || [],
        total: data.total,
        estado: data.estado || 'pendiente',
        notas: data.notas,
        fisioterapeuta: data.fisioterapeuta,
        codigo_afiliado: data.codigo_afiliado,
        descuento_afiliado: data.descuento_afiliado || 0,
        descuento_individual: data.descuento_individual || 0,
        descuento_promocion: data.descuento_promocion || 0,
      }
    });
    return reserva as any;
  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    return null;
  }
}

/**
 * Actualizar estado de reserva
 */
export async function updateReservaEstado(
  reservationId: string,
  estado: string
): Promise<boolean> {
  try {
    await prisma.reserva.updateMany({
      where: { reservation_id: reservationId },
      data: { estado, updated_at: new Date() }
    });
    return true;
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    return false;
  }
}

/**
 * Actualizar reserva completa
 */
export async function updateReserva(
  reservationId: string,
  updates: any
): Promise<boolean> {
  try {
    console.log(`🔄 updateReserva - ID: ${reservationId}, Updates:`, updates);

    // Obtener la reserva actual para actualizar el JSONB correctamente
    const reservaActual = await prisma.reserva.findFirst({
      where: { reservation_id: reservationId }
    });

    if (!reservaActual) {
      console.error('❌ Reserva no encontrada:', reservationId);
      return false;
    }

    console.log(`✅ Reserva encontrada - Estado actual: ${reservaActual.estado}, Total actual: ${reservaActual.total}`);

    // Separar campos que van directamente en la tabla vs los que van en el JSONB
    const { esAfiliado, duracionTotal, duracion, precio, total, ...otrosUpdates } = updates;

    // Actualizar el campo servicios JSONB si hay cambios relacionados
    let serviciosActualizados = reservaActual.servicios;
    if (esAfiliado !== undefined || duracionTotal !== undefined || duracion !== undefined) {
      serviciosActualizados = {
        ...(typeof reservaActual.servicios === 'object' ? reservaActual.servicios : {}),
        ...(esAfiliado !== undefined && { esAfiliado }),
        ...(duracionTotal !== undefined && { duracionTotal }),
        ...(duracion !== undefined && { duracionTotal: duracion }),
      };
    }

    // Preparar datos para actualización
    const dataToUpdate: any = {
      ...otrosUpdates,
      updated_at: new Date()
    };

    // Si hay precio/total, actualizarlo (priorizar 'total' sobre 'precio')
    if (total !== undefined) {
      dataToUpdate.total = total;
      console.log(`💰 Actualizando total a: ${total}`);
    } else if (precio !== undefined) {
      dataToUpdate.total = precio;
      console.log(`💰 Actualizando total (desde precio) a: ${precio}`);
    }

    // Actualizar servicios JSONB si cambió
    if (serviciosActualizados !== reservaActual.servicios) {
      dataToUpdate.servicios = serviciosActualizados;
      console.log(`📦 Actualizando servicios JSONB`);
    }

    console.log(`📝 Datos finales para actualizar:`, dataToUpdate);

    const result = await prisma.reserva.updateMany({
      where: { reservation_id: reservationId },
      data: dataToUpdate
    });

    console.log(`✅ Reserva actualizada exitosamente. Registros afectados: ${result.count}`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando reserva:', error);
    return false;
  }
}

/**
 * Eliminar reserva
 */
export async function deleteReserva(reservationId: string): Promise<boolean> {
  try {
    await prisma.reserva.deleteMany({
      where: { reservation_id: reservationId }
    });
    return true;
  } catch (error) {
    console.error('❌ Error eliminando reserva:', error);
    return false;
  }
}

/**
 * Verificar conflicto de horario
 */
export async function verificarConflictoHorario(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: any }> {
  try {
    // Liberar reservas expiradas primero
    await liberarReservasExpiradas();

    const fechaNormalizada = fecha.split('T')[0];
    const fechaInicio = new Date(fechaNormalizada + 'T00:00:00');
    const fechaFin = new Date(fechaNormalizada + 'T23:59:59');

    const reservas = await prisma.reserva.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        },
        horario: horario,
        estado: {
          in: ['pendiente', 'pendiente de pago', 'confirmada']
        },
        ...(excludeId && {
          reservation_id: { not: excludeId }
        })
      }
    });

    return {
      hayConflicto: reservas.length > 0,
      reservaConflictiva: reservas[0]
    };
  } catch (error) {
    console.error('❌ Error verificando conflicto:', error);
    return { hayConflicto: false };
  }
}

/**
 * Liberar reservas expiradas (más de 30 minutos en estado pendiente)
 */
export async function liberarReservasExpiradas(): Promise<number> {
  try {
    const ahora = new Date();
    const tiempoExpiracion = new Date(ahora.getTime() - 30 * 60 * 1000); // 30 minutos

    const result = await prisma.reserva.updateMany({
      where: {
        estado: 'pendiente',
        created_at: {
          lt: tiempoExpiracion
        }
      },
      data: {
        estado: 'cancelada',
        updated_at: ahora
      }
    });

    if (result.count > 0) {
      console.log(`🔓 ${result.count} reserva(s) expirada(s) liberada(s)`);
    }

    return result.count;
  } catch (error) {
    console.error('❌ Error liberando reservas:', error);
    return 0;
  }
}

/**
 * Obtener reservas activas
 */
export async function getReservasActivas(): Promise<Reserva[]> {
  try {
    await liberarReservasExpiradas();

    const reservas = await prisma.reserva.findMany({
      where: {
        estado: {
          in: ['pendiente', 'pendiente de pago', 'confirmada']
        }
      },
      orderBy: { fecha: 'asc' }
    });

    return reservas as any;
  } catch (error) {
    console.error('❌ Error obteniendo reservas activas:', error);
    return [];
  }
}

/**
 * Leer reservas (alias para compatibilidad)
 */
export async function leerReservas(): Promise<any[]> {
  return getAllReservas();
}

/**
 * Crear reserva (alias para compatibilidad)
 */
export async function crearReserva(reserva: any): Promise<any | null> {
  // Combinar servicios si vienen separados
  const serviciosCombinados = {
    terapias: reserva.terapias || reserva.servicios || [],
    serviciosAdicionales: reserva.serviciosAdicionales || [],
    productos: reserva.productos || [],
    esAfiliado: reserva.esAfiliado || false,
    duracionTotal: reserva.duracionTotal || reserva.duracion || 0
  };

  return createReserva({
    reservation_id: reserva.reservationId || reserva.id,
    nombre: reserva.nombre,
    telefono: reserva.telefono,
    email: reserva.email,
    fecha: reserva.fecha,
    horario: reserva.horario,
    servicios: serviciosCombinados,
    productos: reserva.productos || [],
    total: reserva.total || 0,
    estado: reserva.estado || 'pendiente',
    notas: reserva.notas,
    fisioterapeuta: reserva.fisioterapeuta,
    codigo_afiliado: reserva.codigoAfiliado || reserva.afiliadoNombre,
    descuento_afiliado: reserva.descuentoAfiliado || 0,
    descuento_individual: reserva.descuentoIndividual || 0,
    descuento_promocion: reserva.descuentoPromocion || 0,
  });
}

/**
 * Actualizar estado (alias para compatibilidad)
 */
export async function actualizarEstadoReserva(
  reservationId: string,
  nuevoEstado: string
): Promise<boolean> {
  return updateReservaEstado(reservationId, nuevoEstado);
}

/**
 * Actualizar reserva (alias para compatibilidad)
 */
export async function actualizarReserva(
  reservationId: string,
  updates: any
): Promise<boolean> {
  return updateReserva(reservationId, updates);
}

/**
 * Eliminar reserva (alias para compatibilidad)
 */
export async function eliminarReserva(reservationId: string): Promise<boolean> {
  return deleteReserva(reservationId);
}

/**
 * Verificar conflicto (alias para compatibilidad)
 */
export async function verificarConflicto(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: any }> {
  return verificarConflictoHorario(fecha, horario, excludeId);
}

/**
 * Liberar expiradas (alias para compatibilidad)
 */
export async function liberarExpiradas(): Promise<number> {
  return liberarReservasExpiradas();
}

/**
 * Obtener reservas activas (alias para compatibilidad)
 */
export async function obtenerReservasActivas(): Promise<any[]> {
  return getReservasActivas();
}
