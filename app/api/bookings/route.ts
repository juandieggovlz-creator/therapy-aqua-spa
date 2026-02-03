export const runtime = "nodejs";
// API de compatibilidad para el sistema de reservas
// Usa Vercel Postgres en producción y JSON en desarrollo
import { NextResponse } from "next/server";
import {
  leerReservas,
  crearReserva,
  actualizarEstadoReserva,
  actualizarReserva,
  eliminarReserva,
  verificarConflicto,
  liberarExpiradas,
} from "@/lib/reservas-helpers";



// Función para enviar notificación a Telegram
async function enviarNotificacionTelegram(reserva: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram credentials missing in environment variables");
    return false;
  }

  try {
    const totalFormateado = `$${Number(reserva.total).toLocaleString('es-CO')}`;
    const fechaFormateada = reserva.fecha ? new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'No especificada';

    const terapiasNombres = Array.isArray(reserva.terapias)
      ? reserva.terapias.map((t: any) => `• ${t.nombre}`).join('\n')
      : '• No especificada';

    const mensaje = `¡Nueva Reserva! 🎉
Resumen de reserva:
👤 Nombre: ${reserva.nombre || 'No especificado'}
📞 Teléfono: ${reserva.telefono || 'No especificado'}
📧 Email: ${reserva.email || 'No especificado'}

📅 Fecha: ${fechaFormateada}
⏰ Hora: ${reserva.horario || 'No especificada'}

Servicios:
${terapiasNombres}

💰 Total: ${totalFormateado}`;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensaje,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("❌ Error sending Telegram notification:", error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const estado = searchParams.get("estado");

    // Liberar reservas expiradas
    await liberarExpiradas();

    let reservas = await leerReservas();

    // Normalizar estructura: extraer terapias, serviciosAdicionales y productos del campo JSONB "servicios"
    reservas = reservas.map((reserva: any) => {
      // Convertir fecha a string si es un objeto Date
      const fechaStr = reserva.fecha instanceof Date
        ? reserva.fecha.toISOString().split('T')[0]  // Formato YYYY-MM-DD
        : (reserva.fecha || '');

      const createdAtStr = reserva.created_at instanceof Date
        ? reserva.created_at.toISOString()
        : (reserva.created_at || reserva.createdAt || '');

      // Si servicios es un objeto con estructura { terapias, serviciosAdicionales, productos }
      if (reserva.servicios && typeof reserva.servicios === 'object') {
        return {
          ...reserva,
          // Convertir fechas a string
          fecha: fechaStr,
          createdAt: createdAtStr,
          fechaCreacion: createdAtStr,
          // Extraer campos del JSONB si existen
          terapias: reserva.servicios.terapias || reserva.terapias || [],
          serviciosAdicionales: reserva.servicios.serviciosAdicionales || reserva.serviciosAdicionales || [],
          productos: reserva.servicios.productos || reserva.productos || [],
          // Mantener compatibilidad con código legacy
          servicios: reserva.servicios.terapias || reserva.servicios || [],
          // Mapear campos de DB a formato esperado por frontend
          id: reserva.reservation_id || reserva.reservationId || reserva.id,
          reservationId: reserva.reservation_id || reserva.reservationId || reserva.id,
          cliente: reserva.nombre || reserva.cliente,
          hora: reserva.horario || reserva.hora,
          fisio: reserva.fisioterapeuta || reserva.fisio,
          precio: reserva.total || reserva.precio,
          // Extraer duracionTotal y esAfiliado del JSONB servicios
          duracion: reserva.servicios.duracionTotal || reserva.duracion_total || reserva.duracionTotal || reserva.duracion || 0,
          duracionTotal: reserva.servicios.duracionTotal || reserva.duracion_total || reserva.duracionTotal || reserva.duracion || 0,
          esAfiliado: reserva.servicios.esAfiliado || reserva.es_afiliado || reserva.esAfiliado || false,
          afiliadoNombre: reserva.codigo_afiliado || reserva.afiliadoNombre,
        };
      }

      // Si no tiene la estructura esperada, devolver tal cual con mapeo de campos
      return {
        ...reserva,
        // Convertir fechas a string
        fecha: fechaStr,
        createdAt: createdAtStr,
        fechaCreacion: createdAtStr,
        // Mapeo de campos
        id: reserva.reservation_id || reserva.reservationId || reserva.id,
        reservationId: reserva.reservation_id || reserva.reservationId || reserva.id,
        cliente: reserva.nombre || reserva.cliente,
        hora: reserva.horario || reserva.hora,
        fisio: reserva.fisioterapeuta || reserva.fisio,
        precio: reserva.total || reserva.precio,
        duracion: reserva.duracion_total || reserva.duracionTotal || reserva.duracion || 0,
        duracionTotal: reserva.duracion_total || reserva.duracionTotal || reserva.duracion || 0,
        esAfiliado: reserva.es_afiliado || reserva.esAfiliado || false,
        afiliadoNombre: reserva.codigo_afiliado || reserva.afiliadoNombre,
      };
    });

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
    return NextResponse.json({
      success: true,
      bookings: reservas
    }, { status: 200 });
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

    // Normalizar fecha y verificar conflictos
    const fechaNuevaNormalizada = body.fecha.split('T')[0];
    const horarioNuevo = body.horario;

    console.log(`🔍 Verificando choque para: ${fechaNuevaNormalizada} ${horarioNuevo}`);

    const { hayConflicto, reservaConflictiva } = await verificarConflicto(
      fechaNuevaNormalizada,
      horarioNuevo
    );

    if (hayConflicto) {
      console.log(`🚫 Rechazando reserva por choque de horario`);
      return NextResponse.json(
        {
          error: 'Este horario ya está ocupado. Por favor selecciona otra hora.',
          reservaConflictiva: {
            id: reservaConflictiva?.reservationId || reservaConflictiva?.id,
            fecha: reservaConflictiva?.fecha,
            horario: reservaConflictiva?.hora || reservaConflictiva?.horario,
            estado: reservaConflictiva?.estado
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

    const reservaData: any = {
      reservationId: `RES-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      cliente: body.nombre || 'Cliente sin nombre',
      nombre: body.nombre || 'Cliente sin nombre',
      telefono: body.telefono || 'Sin teléfono',
      email: body.email || 'Sin email',
      servicio: nombreServicio,
      servicioId: servicioId,
      fisioterapeuta: "Dra. Carolina Trujillo",
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
      afiliadoNombre: body.afiliadoNombre || null,
      productos: body.productos || [],
      servicios: Array.isArray(terapias) && terapias.length > 0
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
        : [],
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
        : [],
      serviciosAdicionales: Array.isArray(body.serviciosAdicionales) && body.serviciosAdicionales.length > 0
        ? body.serviciosAdicionales.filter((s: any) => s !== null && s !== undefined && (s.id || s.nombre))
          .map((s: any) => ({
            id: s.id || 'desconocido',
            nombre: s.nombre || 'Servicio sin nombre',
            precio: s.precio || s.precioParticular || 0,
            precioParticular: s.precioParticular || s.precio || 0,
            precioAfiliado: s.precioAfiliado || s.precioParticular || 0,
            precioAplicado: s.precioAplicado || (body.esAfiliado ? s.precioAfiliado : s.precioParticular) || 0,
            icon: s.icon || '✨'
          }))
        : [],
      notas: body.notas || '',
      createdAt: new Date().toISOString(),
    };

    const nuevaReserva = await crearReserva(reservaData);

    if (!nuevaReserva) {
      return NextResponse.json(
        { error: "Error al guardar la reserva" },
        { status: 500 }
      );
    }

    console.log('✅ Reserva creada:', nuevaReserva.reservation_id || nuevaReserva.reservationId);

    // Enviar notificación a Telegram solo después de éxito
    try {
      await enviarNotificacionTelegram(reservaData);
    } catch (telegramError) {
      console.error("⚠️ Error silencioso en Telegram:", telegramError);
      // No bloqueamos el retorno exitoso de la reserva
    }

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

    console.log('📝 PATCH /api/bookings - Body recibido:', { id, updates });

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    // Si solo se está actualizando el estado, usar helper específico
    if (updates.estado && Object.keys(updates).length === 1) {
      console.log(`🔄 Actualizando solo estado de reserva ${id} a: ${updates.estado}`);
      const success = await actualizarEstadoReserva(id, updates.estado);

      if (!success) {
        console.error(`❌ Error al actualizar estado de reserva ${id}`);
        return NextResponse.json(
          { error: "Error al actualizar estado" },
          { status: 500 }
        );
      }

      console.log(`✅ Estado de reserva ${id} actualizado exitosamente`);
      return NextResponse.json(
        { success: true, message: "Estado actualizado" },
        { status: 200 }
      );
    }

    // Actualización completa (estado + otros campos como total)
    console.log(`🔄 Actualizando reserva ${id} con múltiples campos:`, updates);
    const success = await actualizarReserva(id, updates);

    if (!success) {
      console.error(`❌ Error al actualizar reserva ${id}`);
      return NextResponse.json(
        { error: "Error al actualizar reserva" },
        { status: 500 }
      );
    }

    console.log(`✅ Reserva ${id} actualizada exitosamente`);
    return NextResponse.json(
      { success: true, message: "Reserva actualizada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en PATCH /api/bookings:", error);
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

    const success = await eliminarReserva(id);

    if (!success) {
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
