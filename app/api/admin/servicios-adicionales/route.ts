import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todos los servicios adicionales
export async function GET() {
  try {
    const servicios = await prisma.servicioAdicional.findMany({
      orderBy: { orden: 'asc' },
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

// POST: Crear nuevo servicio adicional
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.servicio_id || !body.nombre || !body.precio_particular || !body.precio_afiliado) {
      return NextResponse.json(
        { error: 'Campos requeridos: servicio_id, nombre, precio_particular, precio_afiliado' },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicioAdicional.create({
      data: {
        servicio_id: body.servicio_id,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        precio_particular: parseFloat(body.precio_particular),
        precio_afiliado: parseFloat(body.precio_afiliado),
        icon: body.icon || null,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
      },
    });

    return NextResponse.json(
      { servicio, message: 'Servicio adicional creado exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creando servicio adicional:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un servicio adicional con ese ID' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear servicio adicional' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar servicio adicional
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del servicio adicional es requerido' },
        { status: 400 }
      );
    }

    const data: any = {};
    if (updates.nombre !== undefined) data.nombre = updates.nombre;
    if (updates.descripcion !== undefined) data.descripcion = updates.descripcion;
    if (updates.precio_particular !== undefined) data.precio_particular = parseFloat(updates.precio_particular);
    if (updates.precio_afiliado !== undefined) data.precio_afiliado = parseFloat(updates.precio_afiliado);
    if (updates.icon !== undefined) data.icon = updates.icon;
    if (updates.activo !== undefined) data.activo = updates.activo;
    if (updates.orden !== undefined) data.orden = parseInt(updates.orden);

    const servicio = await prisma.servicioAdicional.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(
      { servicio, message: 'Servicio adicional actualizado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando servicio adicional:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Servicio adicional no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar servicio adicional' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar servicio adicional
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del servicio adicional es requerido' },
        { status: 400 }
      );
    }

    await prisma.servicioAdicional.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Servicio adicional eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error eliminando servicio adicional:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Servicio adicional no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar servicio adicional' },
      { status: 500 }
    );
  }
}

