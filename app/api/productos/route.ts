import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener productos activos para el público
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        producto_id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        icon: true,
        orden: true,
      },
    });

    return NextResponse.json({ productos }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

