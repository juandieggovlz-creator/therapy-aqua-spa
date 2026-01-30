import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener toda la configuración o una específica
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');
    const categoria = searchParams.get('categoria');

    if (clave) {
      const config = await prisma.configuracion.findUnique({
        where: { clave },
      });

      if (!config) {
        return NextResponse.json(
          { error: 'Configuración no encontrada' },
          { status: 404 }
        );
      }

      return NextResponse.json({ configuracion: config }, { status: 200 });
    }

    let configuraciones;
    if (categoria) {
      configuraciones = await prisma.configuracion.findMany({
        where: { categoria },
        orderBy: { clave: 'asc' },
      });
    } else {
      configuraciones = await prisma.configuracion.findMany({
        orderBy: { categoria: 'asc' },
      });
    }

    return NextResponse.json({ configuraciones }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// POST: Crear nueva configuración
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.clave || !body.valor || !body.tipo || !body.categoria) {
      return NextResponse.json(
        { error: 'Campos requeridos: clave, valor, tipo, categoria' },
        { status: 400 }
      );
    }

    const config = await prisma.configuracion.create({
      data: {
        clave: body.clave,
        valor: body.valor,
        tipo: body.tipo,
        descripcion: body.descripcion || null,
        categoria: body.categoria,
        editable_por_gerente: body.editable_por_gerente !== undefined ? body.editable_por_gerente : true,
      },
    });

    return NextResponse.json(
      { configuracion: config, message: 'Configuración creada exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creando configuración:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una configuración con esa clave' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear configuración' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar configuración
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la configuración es requerido' },
        { status: 400 }
      );
    }

    const data: any = {};
    if (updates.valor !== undefined) data.valor = updates.valor;
    if (updates.descripcion !== undefined) data.descripcion = updates.descripcion;
    if (updates.editable_por_gerente !== undefined) data.editable_por_gerente = updates.editable_por_gerente;

    const config = await prisma.configuracion.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(
      { configuracion: config, message: 'Configuración actualizada exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando configuración:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar configuración
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la configuración es requerido' },
        { status: 400 }
      );
    }

    await prisma.configuracion.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Configuración eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error eliminando configuración:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar configuración' },
      { status: 500 }
    );
  }
}

