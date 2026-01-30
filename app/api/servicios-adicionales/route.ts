import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener servicios adicionales activos para el público
export async function GET() {
  try {
    const servicios = await prisma.servicioAdicional.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        servicio_id: true,
        nombre: true,
        descripcion: true,
        precio_particular: true,
        precio_afiliado: true,
        icon: true,
        orden: true,
      },
    });

    return NextResponse.json({ servicios }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo servicios adicionales:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios adicionales' },
      { status: 500 }
    );
  }
}

