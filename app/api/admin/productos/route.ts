import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { created_at: 'desc' }
    });

    // Convertir Decimal a number para el frontend y mapear IDs
    const productosFormateados = productos.map((p: any) => ({
      ...p,
      id: p.producto_id, // Usar producto_id como id para el frontend
      precio: Number(p.precio)
    }));

    return NextResponse.json({ 
      productos: productosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generar producto_id único
    const productoId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const nuevoProducto = await prisma.producto.create({
      data: {
        producto_id: productoId,
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        precio: body.precio,
        icon: body.icon || '🛍️',
        stock: body.stock || null,
        activo: body.activo !== undefined ? body.activo : true,
        orden: body.orden || 0,
      }
    });

    console.log('✅ Producto creado:', nuevoProducto.producto_id);

    return NextResponse.json({ 
      producto: {
        ...nuevoProducto,
        id: nuevoProducto.producto_id,
        precio: Number(nuevoProducto.precio)
      },
      success: true 
    });
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
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

    await prisma.producto.delete({
      where: { producto_id: id }
    });

    console.log('✅ Producto eliminado:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

