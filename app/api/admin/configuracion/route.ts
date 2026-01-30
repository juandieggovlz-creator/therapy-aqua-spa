import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener toda la configuración
export async function GET() {
  try {
    const configuraciones = await prisma.configuracion.findMany({
      orderBy: { categoria: 'asc' }
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
    
    const nuevaConfig = await prisma.configuracion.create({
      data: {
        clave: body.clave,
        valor: body.valor,
        descripcion: body.descripcion || '',
        tipo: body.tipo || 'text',
        categoria: body.categoria || 'general',
        editable_por_gerente: body.editable_por_gerente !== undefined ? body.editable_por_gerente : true,
      }
    });

    console.log('✅ Configuración creada:', nuevaConfig.clave);

    return NextResponse.json({ 
      configuracion: nuevaConfig,
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
    const { id, clave, ...updates } = body;

    if (!id && !clave) {
      return NextResponse.json(
        { error: 'ID o clave es requerido' },
        { status: 400 }
      );
    }

    let configActualizada;
    
    if (id) {
      configActualizada = await prisma.configuracion.update({
        where: { id: parseInt(id) },
        data: updates
      });
    } else {
      configActualizada = await prisma.configuracion.update({
        where: { clave },
        data: updates
      });
    }

    console.log('✅ Configuración actualizada:', configActualizada.clave);

    return NextResponse.json({ 
      configuracion: configActualizada,
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    await prisma.configuracion.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Configuración eliminada:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando configuración:', error);
    return NextResponse.json(
      { error: 'Error al eliminar configuración' },
      { status: 500 }
    );
  }
}

