import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener servicios activos para el público
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        servicio_id: true,
        nombre: true,
        descripcion: true,
        categoria: true,
        duracion: true,
        precio: true,
        icon: true,
        imagen: true,
        orden: true,
        detalles: true,
      },
    });

    return NextResponse.json({ servicios }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

