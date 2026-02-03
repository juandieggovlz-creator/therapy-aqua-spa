export const runtime = "nodejs";
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

// GET /api/reservas - Obtener todas las reservas (Redirige a Prisma)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookings = await leerReservas();

    // Filtros básicos para compatibilidad
    let reservas = bookings || [];
    const filtroEstado = searchParams.get("estado");
    if (filtroEstado) {
      reservas = (reservas as any[]).filter(r => r.estado === filtroEstado);
    }

    return NextResponse.json({
      reservas,
      total: reservas.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/reservas:", error);
    return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 });
  }
}

// POST /api/reservas - Crear reserva (Redirige a Prisma)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevaReserva = await crearReserva(body);

    if (!nuevaReserva) {
      return NextResponse.json({ error: "Error al guardar la reserva" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reserva: nuevaReserva,
      message: "Reserva creada exitosamente"
    }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/reservas:", error);
    return NextResponse.json({ error: "Error al crear reserva" }, { status: 500 });
  }
}

// PUT /api/reservas - Actualizar reserva (Redirige a Prisma)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { reservationId, ...updates } = body;

    if (!reservationId) {
      return NextResponse.json({ error: "reservationId es requerido" }, { status: 400 });
    }

    const success = await actualizarReserva(reservationId, updates);
    if (!success) {
      return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Reserva actualizada exitosamente"
    }, { status: 200 });
  } catch (error) {
    console.error("Error en PUT /api/reservas:", error);
    return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 });
  }
}

// DELETE /api/reservas - Cancelar reserva (Redirige a Prisma)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservationId");

    if (!reservationId) {
      return NextResponse.json({ error: "reservationId es requerido" }, { status: 400 });
    }

    const success = await eliminarReserva(reservationId);
    if (!success) {
      return NextResponse.json({ error: "Error al cancelar reserva" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Reserva cancelada exitosamente"
    }, { status: 200 });
  } catch (error) {
    console.error("Error en DELETE /api/reservas:", error);
    return NextResponse.json({ error: "Error al cancelar reserva" }, { status: 500 });
  }
}
