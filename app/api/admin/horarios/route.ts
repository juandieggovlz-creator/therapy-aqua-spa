import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todos los horarios
export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      orderBy: { orden: 'asc' },
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

// POST: Crear nuevo horario
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.hora) {
      return NextResponse.json(
        { error: 'Campo requerido: hora' },
        { status: 400 }
      );
    }

    const horario = await prisma.horario.create({
      data: {
        hora: body.hora,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
      },
    });

    return NextResponse.json(
      { horario, message: 'Horario creado exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creando horario:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe ese horario' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear horario' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar horario
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del horario es requerido' },
        { status: 400 }
      );
    }

    const data: any = {};
    if (updates.hora !== undefined) data.hora = updates.hora;
    if (updates.activo !== undefined) data.activo = updates.activo;
    if (updates.orden !== undefined) data.orden = parseInt(updates.orden);

    const horario = await prisma.horario.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(
      { horario, message: 'Horario actualizado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando horario:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Horario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar horario' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar horario
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del horario es requerido' },
        { status: 400 }
      );
    }

    await prisma.horario.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Horario eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error eliminando horario:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Horario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar horario' },
      { status: 500 }
    );
  }
}

