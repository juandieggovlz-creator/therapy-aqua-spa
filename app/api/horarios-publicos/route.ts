import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener horarios activos para la página pública
export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      where: { activo: true },
      orderBy: { hora: 'asc' }
    });

    const horariosFormateados = horarios.map((h: any) => h.hora);

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

