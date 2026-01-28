/**
 * Vercel Postgres - Utilidades para gestión de reservas
 * Gestiona: reservas, conflictos de horarios, estados
 */

import { sql } from '@vercel/postgres';

// Tipos
export interface Reserva {
  id?: number;
  reservation_id: string;
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  horario: string;
  servicios: any[];
  productos?: any[];
  total: number;
  estado: 'pendiente' | 'pendiente de pago' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  fisioterapeuta?: string;
  created_at?: string;
  updated_at?: string;
  codigo_afiliado?: string;
  descuento_afiliado?: number;
  descuento_individual?: number;
  descuento_promocion?: number;
}

/**
 * Inicializar tabla de reservas (solo se ejecuta una vez)
 */
export async function initReservasTable(): Promise<boolean> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        reservation_id VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        horario VARCHAR(10) NOT NULL,
        servicios JSONB NOT NULL,
        productos JSONB DEFAULT '[]',
        total DECIMAL(10, 2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        notas TEXT,
        fisioterapeuta VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        codigo_afiliado VARCHAR(50),
        descuento_afiliado DECIMAL(10, 2) DEFAULT 0,
        descuento_individual DECIMAL(10, 2) DEFAULT 0,
        descuento_promocion DECIMAL(10, 2) DEFAULT 0
      );
      
      CREATE INDEX IF NOT EXISTS idx_fecha_horario ON reservas(fecha, horario);
      CREATE INDEX IF NOT EXISTS idx_estado ON reservas(estado);
      CREATE INDEX IF NOT EXISTS idx_reservation_id ON reservas(reservation_id);
    `;
    
    console.log('✅ Tabla de reservas inicializada');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando tabla de reservas:', error);
    return false;
  }
}

/**
 * Crear nueva reserva
 */
export async function createReserva(reserva: Reserva): Promise<Reserva | null> {
  try {
    const result = await sql`
      INSERT INTO reservas (
        reservation_id, nombre, telefono, email, fecha, horario,
        servicios, productos, total, estado, notas, fisioterapeuta,
        codigo_afiliado, descuento_afiliado, descuento_individual, descuento_promocion
      ) VALUES (
        ${reserva.reservation_id},
        ${reserva.nombre},
        ${reserva.telefono},
        ${reserva.email},
        ${reserva.fecha},
        ${reserva.horario},
        ${JSON.stringify(reserva.servicios)},
        ${JSON.stringify(reserva.productos || [])},
        ${reserva.total},
        ${reserva.estado || 'pendiente'},
        ${reserva.notas || null},
        ${reserva.fisioterapeuta || null},
        ${reserva.codigo_afiliado || null},
        ${reserva.descuento_afiliado || 0},
        ${reserva.descuento_individual || 0},
        ${reserva.descuento_promocion || 0}
      )
      RETURNING *;
    `;
    
    console.log('✅ Reserva creada:', reserva.reservation_id);
    return result.rows[0] as Reserva;
  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    return null;
  }
}

/**
 * Obtener todas las reservas
 */
export async function getAllReservas(): Promise<Reserva[]> {
  try {
    const result = await sql`
      SELECT * FROM reservas
      ORDER BY created_at DESC;
    `;
    
    return result.rows as Reserva[];
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    return [];
  }
}

/**
 * Obtener reserva por ID
 */
export async function getReservaById(reservationId: string): Promise<Reserva | null> {
  try {
    const result = await sql`
      SELECT * FROM reservas
      WHERE reservation_id = ${reservationId}
      LIMIT 1;
    `;
    
    return result.rows[0] as Reserva || null;
  } catch (error) {
    console.error('❌ Error obteniendo reserva:', error);
    return null;
  }
}

/**
 * Actualizar estado de reserva
 */
export async function updateReservaEstado(
  reservationId: string,
  nuevoEstado: Reserva['estado']
): Promise<boolean> {
  try {
    await sql`
      UPDATE reservas
      SET estado = ${nuevoEstado}, updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = ${reservationId};
    `;
    
    console.log(`✅ Estado actualizado: ${reservationId} → ${nuevoEstado}`);
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
  updates: Partial<Reserva>
): Promise<boolean> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.nombre) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(updates.nombre);
    }
    if (updates.telefono) {
      fields.push(`telefono = $${paramIndex++}`);
      values.push(updates.telefono);
    }
    if (updates.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.fecha) {
      fields.push(`fecha = $${paramIndex++}`);
      values.push(updates.fecha);
    }
    if (updates.horario) {
      fields.push(`horario = $${paramIndex++}`);
      values.push(updates.horario);
    }
    if (updates.fisioterapeuta) {
      fields.push(`fisioterapeuta = $${paramIndex++}`);
      values.push(updates.fisioterapeuta);
    }
    if (updates.notas !== undefined) {
      fields.push(`notas = $${paramIndex++}`);
      values.push(updates.notas);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(reservationId);

    const query = `
      UPDATE reservas
      SET ${fields.join(', ')}
      WHERE reservation_id = $${paramIndex}
    `;

    await sql.query(query, values);
    
    console.log(`✅ Reserva actualizada: ${reservationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando reserva:', error);
    return false;
  }
}

/**
 * Verificar conflicto de horarios
 */
export async function verificarConflictoHorario(
  fecha: string,
  horario: string,
  excludeId?: string
): Promise<{ hayConflicto: boolean; reservaConflictiva?: Reserva }> {
  try {
    // Primero liberar reservas pendientes expiradas
    await liberarReservasExpiradas();
    
    // Normalizar fecha
    const fechaNormalizada = fecha.split('T')[0];
    
    let query;
    if (excludeId) {
      query = sql`
        SELECT * FROM reservas
        WHERE DATE(fecha) = ${fechaNormalizada}
        AND horario = ${horario}
        AND estado IN ('pendiente', 'pendiente de pago', 'confirmada')
        AND reservation_id != ${excludeId}
        LIMIT 1;
      `;
    } else {
      query = sql`
        SELECT * FROM reservas
        WHERE DATE(fecha) = ${fechaNormalizada}
        AND horario = ${horario}
        AND estado IN ('pendiente', 'pendiente de pago', 'confirmada')
        LIMIT 1;
      `;
    }
    
    const result = await query;
    const reservaConflictiva = result.rows[0] as Reserva;
    
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
 * Liberar reservas pendientes expiradas (más de 30 minutos)
 */
export async function liberarReservasExpiradas(): Promise<number> {
  try {
    const result = await sql`
      UPDATE reservas
      SET estado = 'cancelada', updated_at = CURRENT_TIMESTAMP
      WHERE estado = 'pendiente'
      AND created_at < NOW() - INTERVAL '30 minutes'
      RETURNING reservation_id;
    `;
    
    const liberadas = result.rows.length;
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
 * Obtener reservas activas (para verificar disponibilidad)
 */
export async function getReservasActivas(): Promise<Reserva[]> {
  try {
    await liberarReservasExpiradas();
    
    const result = await sql`
      SELECT * FROM reservas
      WHERE estado IN ('pendiente', 'pendiente de pago', 'confirmada')
      ORDER BY fecha, horario;
    `;
    
    return result.rows as Reserva[];
  } catch (error) {
    console.error('❌ Error obteniendo reservas activas:', error);
    return [];
  }
}

/**
 * Eliminar reserva (admin)
 */
export async function deleteReserva(reservationId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM reservas
      WHERE reservation_id = ${reservationId};
    `;
    
    console.log(`🗑️ Reserva eliminada: ${reservationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando reserva:', error);
    return false;
  }
}

/**
 * Migrar reservas desde JSON
 */
export async function migrateReservasFromJSON(reservas: any[]): Promise<number> {
  try {
    let migradas = 0;
    
    for (const reserva of reservas) {
      try {
        await createReserva({
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
        migradas++;
      } catch (error) {
        console.error(`❌ Error migrando reserva ${reserva.id}:`, error);
      }
    }
    
    console.log(`✅ ${migradas}/${reservas.length} reservas migradas`);
    return migradas;
  } catch (error) {
    console.error('❌ Error en migración de reservas:', error);
    return 0;
  }
}


