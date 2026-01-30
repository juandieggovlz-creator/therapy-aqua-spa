import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todos los servicios
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { orden: 'asc' },
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

// POST: Crear nuevo servicio
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    if (!body.servicio_id || !body.nombre || !body.categoria || !body.precio) {
      return NextResponse.json(
        { error: 'Campos requeridos: servicio_id, nombre, categoria, precio' },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.create({
      data: {
        servicio_id: body.servicio_id,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        categoria: body.categoria,
        duracion: body.duracion || 30,
        precio: parseFloat(body.precio),
        icon: body.icon || null,
        imagen: body.imagen || null,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
        detalles: body.detalles || null,
      },
    });

    return NextResponse.json(
      { servicio, message: 'Servicio creado exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creando servicio:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un servicio con ese ID' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar servicio existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del servicio es requerido' },
        { status: 400 }
      );
    }

    // Preparar datos para actualización
    const data: any = {};
    if (updates.nombre !== undefined) data.nombre = updates.nombre;
    if (updates.descripcion !== undefined) data.descripcion = updates.descripcion;
    if (updates.categoria !== undefined) data.categoria = updates.categoria;
    if (updates.duracion !== undefined) data.duracion = parseInt(updates.duracion);
    if (updates.precio !== undefined) data.precio = parseFloat(updates.precio);
    if (updates.icon !== undefined) data.icon = updates.icon;
    if (updates.imagen !== undefined) data.imagen = updates.imagen;
    if (updates.activo !== undefined) data.activo = updates.activo;
    if (updates.orden !== undefined) data.orden = parseInt(updates.orden);
    if (updates.detalles !== undefined) data.detalles = updates.detalles;

    const servicio = await prisma.servicio.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(
      { servicio, message: 'Servicio actualizado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando servicio:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar servicio
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del servicio es requerido' },
        { status: 400 }
      );
    }

    await prisma.servicio.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Servicio eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error eliminando servicio:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}

