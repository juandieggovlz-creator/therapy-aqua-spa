export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener toda la configuración
export async function GET() {
  try {
    const configuraciones = await prisma.configuracion.findMany({
      orderBy: { clave: 'asc' }
    });

    return NextResponse.json({
      configuraciones,
      success: true
    });
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva configuración
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clave, valor, tipo, categoria, descripcion } = body;

    const configuracion = await prisma.configuracion.create({
      data: {
        clave,
        valor,
        tipo: tipo || 'string',
        categoria: categoria || 'general',
        descripcion,
        editable_por_gerente: true
      }
    });

    return NextResponse.json({
      configuracion,
      success: true
    });
  } catch (error) {
    console.error('❌ Error creando configuración:', error);
    return NextResponse.json(
      { error: 'Error al crear configuración' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar configuración existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, valor, descripcion } = body;

    const configuracion = await prisma.configuracion.update({
      where: { id },
      data: {
        valor,
        descripcion,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      configuracion,
      success: true
    });
  } catch (error) {
    console.error('❌ Error actualizando configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar configuración
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.configuracion.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('❌ Error eliminando configuración:', error);
    return NextResponse.json(
      { error: 'Error al eliminar configuración' },
      { status: 500 }
    );
  }
}

