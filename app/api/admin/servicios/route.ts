import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { created_at: 'desc' }
    });

    // Convertir Decimal a number para el frontend y mapear IDs
    const serviciosFormateados = servicios.map((s: any) => {
      // Procesar la ruta de la imagen
      let imagenUrl = s.imagen || '';
      if (imagenUrl && !imagenUrl.startsWith('http') && !imagenUrl.startsWith('/')) {
        imagenUrl = `/image/${imagenUrl}`;
      }
      
      return {
        ...s,
        id: s.servicio_id, // Usar servicio_id como id para el frontend
        imagen: imagenUrl,
        precio: Number(s.precio),
        descuento: 0, // Campo no existe aún en la DB
        destacado: false // Campo no existe aún en la DB
      };
    });

    return NextResponse.json({ 
      servicios: serviciosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generar servicio_id único
    const servicioId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Procesar la imagen para asegurar formato correcto
    let imagenFinal = body.imagen || '';
    if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
      // Si es solo un nombre de archivo, agregar la ruta /image/
      imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
    }
    
    const nuevoServicio = await prisma.servicio.create({
      data: {
        servicio_id: servicioId,
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        categoria: body.categoria || 'General',
        precio: body.precio,
        duracion: body.duracion || 30,
        icon: body.icon || '💆',
        imagen: imagenFinal,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
        detalles: body.detalles || null,
      }
    });

    console.log('✅ Servicio creado:', nuevoServicio.servicio_id);

    return NextResponse.json({ 
      servicio: {
        ...nuevoServicio,
        id: nuevoServicio.servicio_id,
        precio: Number(nuevoServicio.precio),
        descuento: 0,
        destacado: false
      },
      success: true 
    });
  } catch (error) {
    console.error('❌ Error creando servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar servicio existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, descuento, destacado, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Filtrar solo los campos que existen en la DB
    const validUpdates: any = {};
    if (updates.nombre !== undefined) validUpdates.nombre = updates.nombre;
    if (updates.descripcion !== undefined) validUpdates.descripcion = updates.descripcion;
    if (updates.categoria !== undefined) validUpdates.categoria = updates.categoria;
    if (updates.precio !== undefined) validUpdates.precio = updates.precio;
    if (updates.duracion !== undefined) validUpdates.duracion = updates.duracion;
    if (updates.icon !== undefined) validUpdates.icon = updates.icon;
    if (updates.imagen !== undefined) {
      // Procesar la imagen para asegurar formato correcto
      let imagenFinal = updates.imagen;
      if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/image/')) {
        imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
      }
      validUpdates.imagen = imagenFinal;
    }
    if (updates.activo !== undefined) validUpdates.activo = updates.activo;
    if (updates.orden !== undefined) validUpdates.orden = updates.orden;
    if (updates.detalles !== undefined) validUpdates.detalles = updates.detalles;

    const servicioActualizado = await prisma.servicio.update({
      where: { servicio_id: id },
      data: validUpdates
    });

    console.log('✅ Servicio actualizado:', id);

    return NextResponse.json({ 
      servicio: {
        ...servicioActualizado,
        id: servicioActualizado.servicio_id,
        precio: Number(servicioActualizado.precio),
        descuento: 0,
        destacado: false
      },
      success: true 
    });
  } catch (error) {
    console.error('❌ Error actualizando servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
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

    await prisma.servicio.delete({
      where: { servicio_id: id }
    });

    console.log('✅ Servicio eliminado:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}

