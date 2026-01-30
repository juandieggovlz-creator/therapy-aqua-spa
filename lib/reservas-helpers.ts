/**
 * Helpers para gestión de reservas con Prisma
 */

import { PrismaClient } from '@prisma/client';
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const USE_JSON_FALLBACK = !process.env.POSTGRES_URL;
const RESERVAS_PATH = path.join(process.cwd(), "data", "reservas.json");

/**
 * Leer reservas (Prisma o JSON)
 */
export async function leerReservas(): Promise<any[]> {
  if (USE_JSON_FALLBACK) {
    try {
      const fileContent = fs.readFileSync(RESERVAS_PATH, "utf-8");
      const data = JSON.parse(fileContent);
      return data.reservas || [];
    } catch (error) {
      console.error("❌ Error leyendo reservas.json:", error);
      return [];
    }
  }
  
  try {
    const reservas = await prisma.reserva.findMany({
      orderBy: { created_at: 'desc' }
    });
    return reservas;
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    return [];
  }
}

/**
 * Escribir reservas (JSON fallback)
 */
export async function escribirReservas(reservas: any[]): Promise<boolean> {
  if (USE_JSON_FALLBACK) {
    try {
      const data = {
        reservas: reservas,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(RESERVAS_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log("✅ reservas.json actualizado (JSON fallback)");
      return true;
    } catch (error) {
      console.error("❌ Error escribiendo reservas.json:", error);
      return false;
    }
  }
  
  console.log("⚠️ escribirReservas llamado en modo Prisma (no es necesario)");
  return true;
}

/**
 * Crear nueva reserva (Prisma o JSON)
 */
export async function crearReserva(reserva: any): Promise<any | null> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      reservas.push(reserva);
      await escribirReservas(reservas);
      return reserva;
    } catch (error) {
      console.error("❌ Error creando reserva:", error);
      return null;
    }
  }
  
  try {
    // Combinar servicios en el campo JSONB
    const serviciosCombinados = {
      terapias: reserva.terapias || reserva.servicios || [],
      serviciosAdicionales: reserva.serviciosAdicionales || [],
      productos: reserva.productos || [],
      esAfiliado: reserva.esAfiliado || false,
      duracionTotal: reserva.duracionTotal || reserva.duracion || 0
    };
    
    const nuevaReserva = await prisma.reserva.create({
      data: {
        reservation_id: reserva.reservationId || reserva.id,
        nombre: reserva.nombre,
        telefono: reserva.telefono,
        email: reserva.email,
        fecha: new Date(reserva.fecha),
        horario: reserva.horario,
        servicios: serviciosCombinados,
        productos: reserva.productos || [],
        total: parseFloat(reserva.total) || 0,
        estado: reserva.estado || 'pendiente',
        notas: reserva.notas || null,
        fisioterapeuta: reserva.fisioterapeuta || null,
        codigo_afiliado: reserva.codigoAfiliado || reserva.afiliadoNombre || null,
        descuento_afiliado: parseFloat(reserva.descuentoAfiliado) || 0,
        descuento_individual: parseFloat(reserva.descuentoIndividual) || 0,
        descuento_promocion: parseFloat(reserva.descuentoPromocion) || 0,
      },
    });
    
    console.log('✅ Reserva creada:', nuevaReserva.reservation_id);
    return nuevaReserva;
  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    return null;
  }
}

/**
 * Actualizar estado de reserva (Prisma o JSON)
 */
export async function actualizarEstadoReserva(
  reservationId: string,
  nuevoEstado: string
): Promise<boolean> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      const index = reservas.findIndex((r: any) => 
        r.reservationId === reservationId || r.id === reservationId
      );
      
      if (index !== -1) {
        reservas[index].estado = nuevoEstado;
        reservas[index].updatedAt = new Date().toISOString();
        await escribirReservas(reservas);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Error actualizando estado:", error);
      return false;
    }
  }
  
  try {
    await prisma.reserva.update({
      where: { reservation_id: reservationId },
      data: { estado: nuevoEstado }
    });
    console.log(`✅ Estado actualizado: ${reservationId} → ${nuevoEstado}`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    return false;
  }
}

/**
 * Actualizar reserva completa (Prisma o JSON)
 */
export async function actualizarReserva(
  reservationId: string,
  updates: any
): Promise<boolean> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      const index = reservas.findIndex((r: any) => 
        r.reservationId === reservationId || r.id === reservationId
      );
      
      if (index !== -1) {
        reservas[index] = { ...reservas[index], ...updates, updatedAt: new Date().toISOString() };
        await escribirReservas(reservas);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Error actualizando reserva:", error);
      return false;
    }
  }
  
  try {
    const data: any = {};
    if (updates.nombre) data.nombre = updates.nombre;
    if (updates.telefono) data.telefono = updates.telefono;
    if (updates.email) data.email = updates.email;
    if (updates.fecha) data.fecha = new Date(updates.fecha);
    if (updates.horario) data.horario = updates.horario;
    if (updates.fisioterapeuta) data.fisioterapeuta = updates.fisioterapeuta;
    if (updates.notas !== undefined) data.notas = updates.notas;
    if (updates.estado) data.estado = updates.estado;

    await prisma.reserva.update({
      where: { reservation_id: reservationId },
      data
    });
    
    console.log(`✅ Reserva actualizada: ${reservationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando reserva:', error);
    return false;
  }
}

/**
 * Eliminar reserva (Prisma o JSON)
 */
export async function eliminarReserva(reservationId: string): Promise<boolean> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      const nuevasReservas = reservas.filter((r: any) => 
        r.reservationId !== reservationId && r.id !== reservationId
      );
      await escribirReservas(nuevasReservas);
      return true;
    } catch (error) {
      console.error("❌ Error eliminando reserva:", error);
      return false;
    }
  }
  
  try {
    await prisma.reserva.delete({
      where: { reservation_id: reservationId }
    });
    console.log(`🗑️ Reserva eliminada: ${reservationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando reserva:', error);
    return false;
  }
}

/**
 * Verificar conflicto de horario (Prisma o JSON)
 */
export async function verificarConflicto(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: any }> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      
      await liberarExpiradas();
      
      const fechaNormalizada = fecha.split('T')[0];
      
      const reservaConflictiva = reservas.find((r: any) => {
        if (excludeId && (r.id === excludeId || r.reservationId === excludeId)) {
          return false;
        }
        
        if (r.estado !== "pendiente" && r.estado !== "pendiente de pago" && r.estado !== "confirmada") {
          return false;
        }
        
        const fechaReservaNormalizada = r.fecha.split('T')[0];
        return fechaReservaNormalizada === fechaNormalizada && r.horario === horario;
      });
      
      return {
        hayConflicto: !!reservaConflictiva,
        reservaConflictiva
      };
    } catch (error) {
      console.error("❌ Error verificando conflicto:", error);
      return { hayConflicto: false };
    }
  }
  
  try {
    await liberarExpiradas();
    
    const fechaNormalizada = fecha.split('T')[0];
    
    const where: any = {
      fecha: new Date(fechaNormalizada),
      horario: horario,
      estado: { in: ['pendiente', 'pendiente de pago', 'confirmada'] }
    };
    
    if (excludeId) {
      where.NOT = { reservation_id: excludeId };
    }
    
    const reservaConflictiva = await prisma.reserva.findFirst({ where });
    
    if (reservaConflictiva) {
      console.log(`⚠️ Conflicto detectado: ${fecha} ${horario}`);
      return { hayConflicto: true, reservaConflictiva };
    }
    
    console.log(`✅ Horario disponible: ${fecha} ${horario}`);
    return { hayConflicto: false };
  } catch (error) {
    console.error('❌ Error verificando conflicto:', error);
    return { hayConflicto: false };
  }
}

/**
 * Liberar reservas expiradas (Prisma o JSON)
 */
export async function liberarExpiradas(): Promise<number> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      const ahora = new Date().getTime();
      const TIEMPO_EXPIRACION = 30 * 60 * 1000;
      
      let liberadas = 0;
      const reservasActualizadas = reservas.map((reserva: any) => {
        if (reserva.estado === "pendiente" && reserva.createdAt) {
          const tiempoCreacion = new Date(reserva.createdAt).getTime();
          if (ahora - tiempoCreacion > TIEMPO_EXPIRACION) {
            liberadas++;
            return { ...reserva, estado: "cancelada", updatedAt: new Date().toISOString() };
          }
        }
        return reserva;
      });
      
      if (liberadas > 0) {
        await escribirReservas(reservasActualizadas);
        console.log(`🔓 ${liberadas} reserva(s) expirada(s) liberada(s)`);
      }
      
      return liberadas;
    } catch (error) {
      console.error("❌ Error liberando reservas:", error);
      return 0;
    }
  }
  
  try {
    const result = await prisma.reserva.updateMany({
      where: {
        estado: 'pendiente',
        created_at: {
          lt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutos atrás
        }
      },
      data: { estado: 'cancelada' }
    });
    
    const liberadas = result.count;
    if (liberadas > 0) {
      console.log(`🔓 ${liberadas} reserva(s) expirada(s) liberada(s)`);
    }
    
    return liberadas;
  } catch (error) {
    console.error('❌ Error liberando reservas expiradas:', error);
    return 0;
  }
}

/**
 * Obtener reservas activas (Prisma o JSON)
 */
export async function obtenerReservasActivas(): Promise<any[]> {
  if (USE_JSON_FALLBACK) {
    await liberarExpiradas();
    const reservas = await leerReservas();
    return reservas.filter((r: any) => 
      r.estado === "pendiente" || r.estado === "pendiente de pago" || r.estado === "confirmada"
    );
  }
  
  try {
    await liberarExpiradas();
    
    const reservas = await prisma.reserva.findMany({
      where: {
        estado: { in: ['pendiente', 'pendiente de pago', 'confirmada'] }
      },
      orderBy: [
        { fecha: 'asc' },
        { horario: 'asc' }
      ]
    });
    
    return reservas;
  } catch (error) {
    console.error('❌ Error obteniendo reservas activas:', error);
    return [];
  }
}
