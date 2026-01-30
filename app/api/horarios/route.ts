import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener horarios activos para el público
export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        hora: true,
        orden: true,
      },
    });

    return NextResponse.json({ horarios }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios' },
      { status: 500 }
    );
  }
}

