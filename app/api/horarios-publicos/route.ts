export const runtime = "nodejs";
import { NextResponse } from 'next/server';

// GET - Obtener horarios activos para la página pública
export async function GET() {
  try {
    // Horarios disponibles por defecto (Jue-Dom 8:00 AM - 4:00 PM)
    const horariosFormateados = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00'
    ];

    return NextResponse.json({
      horarios: horariosFormateados,
      success: true
    });
  } catch (error) {
    console.error('❌ Error obteniendo horarios públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios' },
      { status: 500 }
    );
  }
}
