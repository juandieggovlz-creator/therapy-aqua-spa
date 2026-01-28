/**
 * Helpers para gestión de reservas
 * Usa Vercel Postgres en producción y JSON en desarrollo (fallback)
 */

import {
  getAllReservas,
  createReserva,
  updateReservaEstado,
  updateReserva,
  deleteReserva,
  verificarConflictoHorario,
  liberarReservasExpiradas,
  getReservasActivas,
  type Reserva
} from "./db";
import fs from "fs";
import path from "path";

const USE_JSON_FALLBACK = !process.env.POSTGRES_URL;
const RESERVAS_PATH = path.join(process.cwd(), "data", "reservas.json");

/**
 * Leer reservas (Postgres o JSON)
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
  
  const reservas = await getAllReservas();
  return reservas;
}

/**
 * Escribir reservas (Postgres o JSON)
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
  
  // En Postgres no es necesario "escribir todas" las reservas
  // Las operaciones son individuales (create, update, delete)
  console.log("⚠️ escribirReservas llamado en modo Postgres (no es necesario)");
  return true;
}

/**
 * Crear nueva reserva (Postgres o JSON)
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
  
  const nuevaReserva = await createReserva({
    reservation_id: reserva.reservationId || reserva.id,
    nombre: reserva.nombre,
    telefono: reserva.telefono,
    email: reserva.email,
    fecha: reserva.fecha,
    horario: reserva.horario,
    servicios: reserva.servicios || [],
    productos: reserva.productos || [],
    total: reserva.total || 0,
    estado: reserva.estado || 'pendiente',
    notas: reserva.notas,
    fisioterapeuta: reserva.fisioterapeuta,
    codigo_afiliado: reserva.codigoAfiliado,
    descuento_afiliado: reserva.descuentoAfiliado || 0,
    descuento_individual: reserva.descuentoIndividual || 0,
    descuento_promocion: reserva.descuentoPromocion || 0,
  });
  
  return nuevaReserva;
}

/**
 * Actualizar estado de reserva (Postgres o JSON)
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
  
  return await updateReservaEstado(reservationId, nuevoEstado as any);
}

/**
 * Actualizar reserva completa (Postgres o JSON)
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
  
  return await updateReserva(reservationId, updates);
}

/**
 * Eliminar reserva (Postgres o JSON)
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
  
  return await deleteReserva(reservationId);
}

/**
 * Verificar conflicto de horario (Postgres o JSON)
 */
export async function verificarConflicto(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: any }> {
  if (USE_JSON_FALLBACK) {
    try {
      const reservas = await leerReservas();
      
      // Liberar expiradas primero
      const ahora = new Date().getTime();
      const TIEMPO_EXPIRACION = 30 * 60 * 1000;
      
      const reservasActualizadas = reservas.map((reserva: any) => {
        if (reserva.estado === "pendiente" && reserva.createdAt) {
          const tiempoCreacion = new Date(reserva.createdAt).getTime();
          if (ahora - tiempoCreacion > TIEMPO_EXPIRACION) {
            return { ...reserva, estado: "cancelada", updatedAt: new Date().toISOString() };
          }
        }
        return reserva;
      });
      
      await escribirReservas(reservasActualizadas);
      
      const fechaNormalizada = fecha.split('T')[0];
      
      const reservaConflictiva = reservasActualizadas.find((r: any) => {
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
  
  return await verificarConflictoHorario(fecha, horario, excludeId);
}

/**
 * Liberar reservas expiradas (Postgres o JSON)
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
  
  return await liberarReservasExpiradas();
}

/**
 * Obtener reservas activas (Postgres o JSON)
 */
export async function obtenerReservasActivas(): Promise<any[]> {
  if (USE_JSON_FALLBACK) {
    await liberarExpiradas();
    const reservas = await leerReservas();
    return reservas.filter((r: any) => 
      r.estado === "pendiente" || r.estado === "pendiente de pago" || r.estado === "confirmada"
    );
  }
  
  return await getReservasActivas();
}


