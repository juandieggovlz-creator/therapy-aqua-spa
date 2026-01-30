import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los horarios
export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      orderBy: { hora: 'asc' }
    });

    return NextResponse.json({ 
      horarios,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo horarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo horario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const nuevoHorario = await prisma.horario.create({
      data: {
        hora: body.hora,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
      }
    });

    console.log('✅ Horario creado:', nuevoHorario.hora);

    return NextResponse.json({ 
      horario: nuevoHorario,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error creando horario:', error);
    return NextResponse.json(
      { error: 'Error al crear horario' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar horario existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const horarioActualizado = await prisma.horario.update({
      where: { id: parseInt(id) },
      data: updates
    });

    console.log('✅ Horario actualizado:', id);

    return NextResponse.json({ 
      horario: horarioActualizado,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error actualizando horario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar horario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar horario
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    await prisma.horario.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Horario eliminado:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando horario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar horario' },
      { status: 500 }
    );
  }
}

