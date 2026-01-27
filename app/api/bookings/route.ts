// API de compatibilidad para el sistema de reservas
// Lee/escribe en reservas.json
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVAS_PATH = path.join(process.cwd(), "data", "reservas.json");

// Leer reservas del archivo JSON
function leerReservas() {
  try {
    const fileContent = fs.readFileSync(RESERVAS_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return data.reservas || [];
  } catch (error) {
    console.error("❌ Error leyendo reservas.json:", error);
    return [];
  }
}

// Escribir reservas al archivo JSON
function escribirReservas(reservas: any[]) {
  try {
    const data = {
      reservas: reservas,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(RESERVAS_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ reservas.json actualizado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error escribiendo reservas.json:", error);
    return false;
  }
}

// Función para liberar reservas pendientes expiradas (más de 30 minutos)
function liberarReservasExpiradas(reservas: any[]): any[] {
  const ahora = new Date().getTime();
  const TIEMPO_EXPIRACION = 30 * 60 * 1000; // 30 minutos en milisegundos
  
  return reservas.map(reserva => {
    if (reserva.estado === "pendiente" && reserva.createdAt) {
      const tiempoCreacion = new Date(reserva.createdAt).getTime();
      const tiempoTranscurrido = ahora - tiempoCreacion;
      
      if (tiempoTranscurrido > TIEMPO_EXPIRACION) {
        console.log(`🔓 Liberando reserva expirada: ${reserva.reservationId || reserva.id}`);
        return {
          ...reserva,
          estado: "cancelada",
          updatedAt: new Date().toISOString()
        };
      }
    }
    return reserva;
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const estado = searchParams.get("estado");

    let reservas = leerReservas();
    
    // Liberar reservas expiradas
    const reservasActualizadas = liberarReservasExpiradas(reservas);
    const huboCambios = reservasActualizadas.some((r, i) => 
      reservas[i] && r.estado !== reservas[i].estado
    );
    
    // Guardar solo si hubo liberaciones
    if (huboCambios) {
      escribirReservas(reservasActualizadas);
      console.log("✅ Reservas expiradas liberadas en GET /api/bookings");
    }
    
    reservas = reservasActualizadas;

    // Filtrar por estado si se proporciona
    if (estado) {
      reservas = reservas.filter((b: any) => b.estado === estado);
    }

    // Para fisio, solo mostrar sus citas
    if (role === "fisio") {
      reservas = reservas.filter(
        (b: any) => b.fisio === "Dra. Carolina Trujillo"
      );
    }

    // Compatibilidad: devolver como "bookings" para el frontend
    return NextResponse.json({ bookings: reservas }, { status: 200 });
  } catch (e) {
    console.error("Error en GET /api/bookings:", e);
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.fecha || !body.horario) {
      return NextResponse.json(
        { error: "Fecha y horario son requeridos" },
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
    const margenTiempo = 60 * 60 * 1000; // 1 hora
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

    let reservas = leerReservas();
    
    // Liberar reservas expiradas y guardar el estado actualizado
    const reservasActualizadas = liberarReservasExpiradas(reservas);
    const huboCambios = reservasActualizadas.some((r, i) => 
      reservas[i] && r.estado !== reservas[i].estado
    );
    
    if (huboCambios) {
      escribirReservas(reservasActualizadas);
      console.log("✅ Reservas expiradas liberadas antes de verificar choque");
    }
    
    reservas = reservasActualizadas;

    // Normalizar fecha de la nueva reserva (solo YYYY-MM-DD)
    const fechaNuevaNormalizada = body.fecha.split('T')[0];
    const horarioNuevo = body.horario;
    
    console.log(`🔍 Verificando choque para: ${fechaNuevaNormalizada} ${horarioNuevo}`);
    console.log(`📋 Total de reservas activas: ${reservas.filter((r: any) => 
      r.estado === 'pendiente' || r.estado === 'pendiente de pago' || r.estado === 'confirmada'
    ).length}`);

    // Verificar choque de horarios con normalización correcta
    const reservaConflictiva = reservas.find((b: any) => {
      // Solo considerar reservas activas
      if (b.estado !== 'pendiente' && b.estado !== 'pendiente de pago' && b.estado !== 'confirmada') {
        return false;
      }
      
      // Normalizar fecha de la reserva existente (sin conversión a Date para evitar problemas de timezone)
      const fechaExistenteNormalizada = b.fecha.split('T')[0];
      
      // Comparar fechas normalizadas
      if (fechaExistenteNormalizada !== fechaNuevaNormalizada) {
        return false;
      }
      
      // Comparar horarios (usar tanto 'hora' como 'horario' para compatibilidad)
      const horaExistente = b.hora || b.horario || '';
      
      if (horaExistente === horarioNuevo) {
        console.log(`⚠️ CHOQUE DETECTADO: Reserva ${b.reservationId || b.id} ya ocupa ${fechaExistenteNormalizada} ${horaExistente} [${b.estado}]`);
        return true;
      }
      
      return false;
    });

    if (reservaConflictiva) {
      console.log(`🚫 Rechazando reserva por choque de horario`);
      return NextResponse.json(
        { 
          error: 'Este horario ya está ocupado. Por favor selecciona otra hora.',
          reservaConflictiva: {
            id: reservaConflictiva.reservationId || reservaConflictiva.id,
            fecha: reservaConflictiva.fecha,
            horario: reservaConflictiva.hora || reservaConflictiva.horario,
            estado: reservaConflictiva.estado
          }
        },
        { status: 409 }
      );
    }
    
    console.log(`✅ Horario disponible: ${fechaNuevaNormalizada} ${horarioNuevo}`);
    
    // Crear nueva reserva
    const terapias = body.terapias || [];
    const nombreServicio = terapias.length > 0 
      ? terapias.map((t: any) => t.nombre || t.id).join(', ')
      : 'Servicio';
    const servicioId = terapias.length > 0 ? terapias[0]?.id || '' : '';
    
    const nuevaReserva: any = {
      id: `RES-${Date.now().toString(36).toUpperCase()}`,
      reservationId: `RES-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      cliente: body.nombre || 'Cliente sin nombre',
      nombre: body.nombre || 'Cliente sin nombre',
      telefono: body.telefono || 'Sin teléfono',
      email: body.email || 'Sin email',
      servicio: nombreServicio,
      servicioId: servicioId,
      fisio: "Dra. Carolina Trujillo",
      fecha: body.fecha || '',
      hora: body.horario || '',
      horario: body.horario || '',
      duracion: body.duracionTotal || 0,
      duracionTotal: body.duracionTotal || 0,
      precio: body.total || 0,
      total: body.total || 0,
      estado: "pendiente",
      esAfiliado: body.esAfiliado || false,
      productos: body.productos || [],
      notas: body.notas || '',
      createdAt: new Date().toISOString(),
      terapias: Array.isArray(terapias) && terapias.length > 0 
        ? terapias.filter((t: any) => t !== null && t !== undefined && (t.id || t.nombre))
            .map((t: any) => ({
              id: t.id || t.servicioId || 'desconocido',
              nombre: t.nombre || t.id || 'Servicio sin nombre',
              precio: t.precio || t.precioOriginal || 0,
              precioOriginal: t.precioOriginal || t.precio || 0,
              duracion: t.duracion || 30,
              icon: t.icon || '💆',
              servicioId: t.servicioId || t.id || 'desconocido'
            }))
        : []
    };

    reservas.push(nuevaReserva);
    
    if (!escribirReservas(reservas)) {
      return NextResponse.json(
        { error: "Error al guardar la reserva" },
        { status: 500 }
      );
    }

    console.log('✅ Reserva creada:', nuevaReserva.id);

    return NextResponse.json(
      { 
        success: true, 
        booking: nuevaReserva,
        message: "Reserva creada exitosamente"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/bookings:", error);
    return NextResponse.json(
      { error: "Error al crear cita" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const reservas = leerReservas();
    const index = reservas.findIndex((b: any) => b.id === id || b.reservationId === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la reserva
    reservas[index] = {
      ...reservas[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    if (!escribirReservas(reservas)) {
      return NextResponse.json(
        { error: "Error al actualizar reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, booking: reservas[index] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/bookings:", error);
    return NextResponse.json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Alias para PATCH
  return PATCH(request);
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const reservas = leerReservas();
    const nuevasReservas = reservas.filter((b: any) => b.id !== id && b.reservationId !== id);
    
    if (!escribirReservas(nuevasReservas)) {
      return NextResponse.json(
        { error: "Error al eliminar reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reserva eliminada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/bookings:", error);
    return NextResponse.json(
      { error: "Error al eliminar cita" },
      { status: 500 }
    );
  }
}
