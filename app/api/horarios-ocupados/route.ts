export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET - Obtener horarios ocupados para una fecha específica
 * Query params:
 *  - fecha: fecha en formato YYYY-MM-DD
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');

    if (!fecha) {
      return NextResponse.json(
        { error: 'Fecha es requerida' },
        { status: 400 }
      );
    }

    // Normalizar fecha
    const fechaNormalizada = fecha.split('T')[0];
    const fechaInicio = new Date(fechaNormalizada + 'T00:00:00');
    const fechaFin = new Date(fechaNormalizada + 'T23:59:59');

    console.log(`🔍 Buscando horarios ocupados para: ${fechaNormalizada}`);

    // Buscar reservas activas (pendiente o confirmada) para esa fecha
    const reservasActivas = await prisma.$queryRaw<any[]>`
      SELECT 
        horario,
        estado,
        nombre as cliente,
        reservation_id
      FROM reservas
      WHERE fecha::date = ${fechaNormalizada}::date
        AND estado IN ('pendiente', 'confirmada', 'pendiente de pago')
      ORDER BY horario ASC
    `;

    console.log(`✅ Horarios ocupados encontrados: ${reservasActivas.length}`);

    // Formatear respuesta
    const horariosOcupados = reservasActivas.map(reserva => ({
      horario: reserva.horario,
      estado: reserva.estado,
      cliente: reserva.cliente,
      reservationId: reserva.reservation_id
    }));

    return NextResponse.json({
      success: true,
      fecha: fechaNormalizada,
      horariosOcupados,
      totalOcupados: horariosOcupados.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo horarios ocupados:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener horarios ocupados',
        horariosOcupados: []
      },
      { status: 500 }
    );
  }
}

