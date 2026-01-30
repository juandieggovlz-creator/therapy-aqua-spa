import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todos los productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { orden: 'asc' },
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

// POST: Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.producto_id || !body.nombre || !body.precio) {
      return NextResponse.json(
        { error: 'Campos requeridos: producto_id, nombre, precio' },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        producto_id: body.producto_id,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        precio: parseFloat(body.precio),
        icon: body.icon || null,
        stock: body.stock ? parseInt(body.stock) : null,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
      },
    });

    return NextResponse.json(
      { producto, message: 'Producto creado exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creando producto:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese ID' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar producto
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    const data: any = {};
    if (updates.nombre !== undefined) data.nombre = updates.nombre;
    if (updates.descripcion !== undefined) data.descripcion = updates.descripcion;
    if (updates.precio !== undefined) data.precio = parseFloat(updates.precio);
    if (updates.icon !== undefined) data.icon = updates.icon;
    if (updates.stock !== undefined) data.stock = updates.stock ? parseInt(updates.stock) : null;
    if (updates.activo !== undefined) data.activo = updates.activo;
    if (updates.orden !== undefined) data.orden = parseInt(updates.orden);

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(
      { producto, message: 'Producto actualizado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando producto:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar producto
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Producto eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error eliminando producto:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

