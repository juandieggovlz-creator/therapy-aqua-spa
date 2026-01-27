import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Ruta al archivo JSON de reservas
const RESERVAS_PATH = path.join(process.cwd(), "data", "reservas.json");

// Tipos
interface Reserva {
  reservationId: string;
  nombre: string;
  telefono: string;
  email: string;
  fecha: string; // YYYY-MM-DD
  horario: string; // HH:MM
  terapias: any[];
  productos?: any[];
  fisio?: string;
  estado: "pendiente" | "pendiente de pago" | "confirmada" | "cancelada" | "completada";
  createdAt: string;
  updatedAt?: string;
  duracionTotal?: number;
  total?: number;
  notas?: string;
}

interface ReservasData {
  reservas: Reserva[];
  lastUpdated: string;
}

// Función helper para leer reservas
function leerReservas(): ReservasData {
  try {
    const fileContent = fs.readFileSync(RESERVAS_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("❌ Error leyendo reservas.json:", error);
    return {
      reservas: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

// Función helper para escribir reservas
function escribirReservas(data: ReservasData): boolean {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(
      RESERVAS_PATH,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log("✅ reservas.json actualizado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error escribiendo reservas.json:", error);
    return false;
  }
}

// Función para liberar reservas pendientes expiradas (más de 30 minutos)
function liberarReservasExpiradas(reservas: Reserva[]): Reserva[] {
  const ahora = new Date().getTime();
  const TIEMPO_EXPIRACION = 30 * 60 * 1000; // 30 minutos en milisegundos
  
  return reservas.map(reserva => {
    // Solo verificar reservas en estado "pendiente"
    if (reserva.estado === "pendiente") {
      const tiempoCreacion = new Date(reserva.createdAt).getTime();
      const tiempoTranscurrido = ahora - tiempoCreacion;
      
      // Si han pasado más de 30 minutos, cancelar automáticamente
      if (tiempoTranscurrido > TIEMPO_EXPIRACION) {
        console.log(`🔓 Liberando reserva expirada: ${reserva.reservationId}`);
        return {
          ...reserva,
          estado: "cancelada" as const,
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    return reserva;
  });
}

// Función para verificar choque de horarios
function verificarChoqueHorarios(
  fecha: string, 
  horario: string, 
  reservas: Reserva[], 
  excludeId?: string
): { hayChoque: boolean; reservaConflictiva?: Reserva } {
  // Normalizar fecha (solo YYYY-MM-DD)
  const fechaNormalizada = fecha.split('T')[0];
  
  console.log(`🔍 Verificando choque para: ${fechaNormalizada} ${horario}`);
  console.log(`📋 Total de reservas a revisar: ${reservas.length}`);
  
  // Filtrar reservas del mismo día y horario con estado activo
  const reservasMismoDia = reservas.filter(r => {
    const fechaReservaNormalizada = r.fecha.split('T')[0];
    return fechaReservaNormalizada === fechaNormalizada;
  });
  
  console.log(`📅 Reservas para ${fechaNormalizada}: ${reservasMismoDia.length}`);
  reservasMismoDia.forEach(r => {
    console.log(`   - ${r.reservationId}: ${r.horario} [${r.estado}]`);
  });
  
  // Buscar reservas que bloqueen el horario
  const reservaConflictiva = reservas.find(r => {
    // Excluir la reserva que se está editando
    if (excludeId && r.reservationId === excludeId) {
      console.log(`   ⏭️ Excluyendo reserva actual: ${r.reservationId}`);
      return false;
    }
    
    // Solo bloquear si está pendiente, pendiente de pago o confirmada
    if (r.estado !== "pendiente" && r.estado !== "pendiente de pago" && r.estado !== "confirmada") {
      return false;
    }
    
    // Comparar fecha (normalizada)
    const fechaReservaNormalizada = r.fecha.split('T')[0];
    if (fechaReservaNormalizada !== fechaNormalizada) {
      return false;
    }
    
    // Comparar horario exacto
    if (r.horario !== horario) {
      return false;
    }
    
    console.log(`   ⚠️ CHOQUE DETECTADO con reserva ${r.reservationId}`);
    return true;
  });
  
  const resultado = {
    hayChoque: !!reservaConflictiva,
    reservaConflictiva
  };
  
  console.log(`✅ Resultado verificación:`, resultado.hayChoque ? "⛔ HAY CHOQUE" : "✅ DISPONIBLE");
  
  return resultado;
}

/**
 * GET /api/reservas
 * Obtener todas las reservas (con filtros opcionales)
 * Query params:
 *   - estado: filtrar por estado
 *   - fecha: filtrar por fecha específica
 *   - fisio: filtrar por fisioterapeuta
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtroEstado = searchParams.get("estado");
    const filtroFecha = searchParams.get("fecha");
    const filtroFisio = searchParams.get("fisio");
    
    const data = leerReservas();
    let { reservas } = data;
    
    // Liberar reservas expiradas antes de retornar
    const reservasActualizadas = liberarReservasExpiradas(reservas);
    const huboCambios = reservasActualizadas.some((r, i) => r.estado !== reservas[i].estado);
    
    if (huboCambios) {
      data.reservas = reservasActualizadas;
      escribirReservas(data);
      console.log("✅ Reservas expiradas liberadas en GET");
    }
    
    reservas = reservasActualizadas;
    
    // Aplicar filtros
    if (filtroEstado) {
      reservas = reservas.filter(r => r.estado === filtroEstado);
    }
    
    if (filtroFecha) {
      const fechaNormalizada = filtroFecha.split('T')[0];
      reservas = reservas.filter(r => r.fecha.split('T')[0] === fechaNormalizada);
    }
    
    if (filtroFisio) {
      reservas = reservas.filter(r => r.fisio === filtroFisio);
    }
    
    // Ordenar por fecha y hora (más recientes primero)
    reservas.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.horario).getTime();
      const fechaB = new Date(b.fecha + 'T' + b.horario).getTime();
      return fechaB - fechaA;
    });
    
    return NextResponse.json(
      { 
        reservas,
        total: reservas.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/reservas:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservas
 * Crear una nueva reserva
 * Validaciones:
 *   - Campos requeridos
 *   - Fecha y hora no en el pasado (con margen de 1 hora)
 *   - No choque de horarios
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.telefono || !body.email || !body.fecha || !body.horario) {
      return NextResponse.json(
        { error: "Campos requeridos: nombre, telefono, email, fecha, horario" },
        { status: 400 }
      );
    }
    
    if (!body.terapias || body.terapias.length === 0) {
      return NextResponse.json(
        { error: "Debe seleccionar al menos una terapia" },
        { status: 400 }
      );
    }
    
    // Validar que la fecha y hora no sean en el pasado (con margen de 1 hora)
    const fechaHoraReserva = new Date(body.fecha + 'T' + body.horario + ':00');
    const ahora = new Date();
    const margenTiempo = 60 * 60 * 1000; // 1 hora en milisegundos
    const ahoraConMargen = new Date(ahora.getTime() + margenTiempo);
    
    if (fechaHoraReserva < ahoraConMargen) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaSoloFecha = new Date(body.fecha + 'T00:00:00');
      fechaSoloFecha.setHours(0, 0, 0, 0);
      
      const esFuturo = fechaSoloFecha > hoy;
      const mensaje = esFuturo 
        ? 'Este horario requiere al menos 1 hora de anticipación. Por favor selecciona otro horario.'
        : 'No se pueden hacer reservas en el pasado. Por favor selecciona una fecha futura.';
      
      return NextResponse.json(
        { error: mensaje },
        { status: 400 }
      );
    }
    
    // Leer reservas existentes
    const data = leerReservas();
    
    // Liberar reservas expiradas y guardar el estado actualizado
    const reservasActualizadas = liberarReservasExpiradas(data.reservas);
    const huboCambios = reservasActualizadas.some((r, i) => r.estado !== data.reservas[i].estado);
    
    if (huboCambios) {
      data.reservas = reservasActualizadas;
      escribirReservas(data);
      console.log("✅ Reservas expiradas liberadas antes de verificar choque");
    }
    
    // Verificar choque de horarios con las reservas actualizadas
    const { hayChoque, reservaConflictiva } = verificarChoqueHorarios(
      body.fecha,
      body.horario,
      data.reservas
    );
    
    if (hayChoque) {
      console.log(`🚫 Choque detectado en ${body.fecha} ${body.horario}:`, reservaConflictiva);
      return NextResponse.json(
        { 
          error: "Este horario ya está reservado. Por favor selecciona otro horario.",
          reservaConflictiva: {
            reservationId: reservaConflictiva?.reservationId,
            fecha: reservaConflictiva?.fecha,
            horario: reservaConflictiva?.horario,
            estado: reservaConflictiva?.estado
          }
        },
        { status: 409 } // 409 Conflict
      );
    }
    
    // Crear nueva reserva
    const nuevaReserva: Reserva = {
      reservationId: `RES-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email,
      fecha: body.fecha.split('T')[0], // Normalizar fecha
      horario: body.horario,
      terapias: body.terapias || [],
      productos: body.productos || [],
      fisio: body.fisio || "Dra. Carolina Trujillo",
      duracionTotal: body.duracionTotal || 0,
      total: body.total || 0,
      notas: body.notas || "",
      estado: "pendiente",
      createdAt: new Date().toISOString()
    };
    
    // Agregar a la lista
    data.reservas.push(nuevaReserva);
    
    // Guardar
    const exito = escribirReservas(data);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al guardar la reserva" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        reserva: nuevaReserva,
        message: "Reserva creada exitosamente"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/reservas:", error);
    return NextResponse.json(
      { error: "Error al crear reserva" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/reservas
 * Actualizar una reserva existente
 * Body debe incluir: reservationId
 * Permite cambiar estado, fecha, horario, etc.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.reservationId) {
      return NextResponse.json(
        { error: "reservationId es requerido" },
        { status: 400 }
      );
    }
    
    const data = leerReservas();
    
    // Liberar reservas expiradas
    data.reservas = liberarReservasExpiradas(data.reservas);
    
    // Buscar la reserva
    const index = data.reservas.findIndex(r => r.reservationId === body.reservationId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }
    
    const reservaActual = data.reservas[index];
    
    // Si se está cambiando la fecha u horario, verificar choques
    if (body.fecha || body.horario) {
      const nuevaFecha = body.fecha || reservaActual.fecha;
      const nuevoHorario = body.horario || reservaActual.horario;
      
      // Validar que no sea en el pasado (con margen de 1 hora)
      const fechaHoraReserva = new Date(nuevaFecha + 'T' + nuevoHorario + ':00');
      const ahora = new Date();
      const margenTiempo = 60 * 60 * 1000; // 1 hora
      const ahoraConMargen = new Date(ahora.getTime() + margenTiempo);
      
      if (fechaHoraReserva < ahoraConMargen) {
        return NextResponse.json(
          { error: "No se puede cambiar a un horario pasado o muy próximo (requiere 1 hora de anticipación)" },
          { status: 400 }
        );
      }
      
      // Verificar choque de horarios (excluyendo la reserva actual)
      const { hayChoque } = verificarChoqueHorarios(
        nuevaFecha,
        nuevoHorario,
        data.reservas,
        body.reservationId
      );
      
      if (hayChoque) {
        return NextResponse.json(
          { error: "El nuevo horario ya está reservado. Por favor selecciona otro." },
          { status: 409 }
        );
      }
    }
    
    // Actualizar la reserva (merge de campos)
    data.reservas[index] = {
      ...reservaActual,
      ...body,
      reservationId: reservaActual.reservationId, // No cambiar el ID
      createdAt: reservaActual.createdAt, // No cambiar fecha de creación
      updatedAt: new Date().toISOString()
    };
    
    // Guardar
    const exito = escribirReservas(data);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al actualizar la reserva" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        reserva: data.reservas[index],
        message: "Reserva actualizada exitosamente"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PUT /api/reservas:", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reservas
 * Eliminar una reserva (cambiar a estado "cancelada")
 * Query param: reservationId
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservationId");
    
    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId es requerido" },
        { status: 400 }
      );
    }
    
    const data = leerReservas();
    
    // Buscar la reserva
    const index = data.reservas.findIndex(r => r.reservationId === reservationId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }
    
    // Cambiar estado a "cancelada" en lugar de eliminar
    data.reservas[index] = {
      ...data.reservas[index],
      estado: "cancelada",
      updatedAt: new Date().toISOString()
    };
    
    // Guardar
    const exito = escribirReservas(data);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al cancelar la reserva" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: "Reserva cancelada exitosamente"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/reservas:", error);
    return NextResponse.json(
      { error: "Error al cancelar reserva" },
      { status: 500 }
    );
  }
}


