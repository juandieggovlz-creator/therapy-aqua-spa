import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET() {
  try {
    console.log('📥 GET /api/admin/productos - Obteniendo productos...');

    const productos: any[] = await prisma.$queryRaw`
      SELECT *
      FROM productos
      ORDER BY orden ASC, created_at DESC
    `;

    const productosFormateados = productos.map((p: any) => ({
      ...p,
      id: p.producto_id,
      precio: Number(p.precio)
    }));

    console.log(`✅ ${productos.length} productos cargados`);

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
    console.log('📝 POST /api/admin/productos - Crear producto:', body.nombre);

    const productoId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await prisma.$executeRaw`
      INSERT INTO productos (producto_id, nombre, descripcion, precio, icon, activo, orden, created_at, updated_at)
      VALUES (
        ${productoId},
        ${body.nombre},
        ${body.descripcion || ''},
        ${body.precio},
        ${body.icon || '📦'},
        ${body.activo !== false},
        ${body.orden || 0},
        NOW(),
        NOW()
      )
    `;

    console.log(`✅ Producto creado: ${productoId}`);

    return NextResponse.json({ 
      success: true,
      producto_id: productoId,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar producto existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    console.log(`📝 PATCH /api/admin/productos - Actualizar producto: ${id}`);

    if (!id) {
      return NextResponse.json(
        { error: 'ID de producto es requerido' },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      UPDATE productos 
      SET 
        nombre = ${updates.nombre},
        descripcion = ${updates.descripcion || ''},
        precio = ${updates.precio},
        icon = ${updates.icon || '📦'},
        activo = ${updates.activo !== false},
        orden = ${updates.orden || 0},
        updated_at = NOW()
      WHERE producto_id = ${id}
    `;

    console.log(`✅ Producto actualizado: ${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log(`🗑️  DELETE /api/admin/productos - Eliminar producto: ${id}`);

    if (!id) {
      return NextResponse.json(
        { error: 'ID de producto es requerido' },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      DELETE FROM productos 
      WHERE producto_id = ${id}
    `;

    console.log(`✅ Producto eliminado: ${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
