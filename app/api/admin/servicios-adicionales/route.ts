import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los servicios adicionales
export async function GET() {
  try {
    console.log('📥 GET /api/admin/servicios-adicionales - Obteniendo servicios adicionales...');

    const servicios: any[] = await prisma.$queryRaw`
      SELECT *
      FROM servicios_adicionales
      ORDER BY orden ASC, created_at DESC
    `;

    const serviciosFormateados = servicios.map((s: any) => ({
      ...s,
      id: s.servicio_id,
      precioParticular: Number(s.precio_particular),
      precioAfiliado: Number(s.precio_afiliado)
    }));

    console.log(`✅ ${servicios.length} servicios adicionales cargados`);

    return NextResponse.json({ 
      servicios: serviciosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo servicios adicionales:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios adicionales' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio adicional
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 POST /api/admin/servicios-adicionales - Crear servicio:', body.nombre);

    const servicioId = `servad_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await prisma.$executeRaw`
      INSERT INTO servicios_adicionales (servicio_id, nombre, descripcion, precio_particular, precio_afiliado, icon, activo, orden, created_at, updated_at)
      VALUES (
        ${servicioId},
        ${body.nombre},
        ${body.descripcion || ''},
        ${body.precioParticular || body.precio_particular || 29900},
        ${body.precioAfiliado || body.precio_afiliado || 13000},
        ${body.icon || '💆'},
        ${body.activo !== false},
        ${body.orden || 0},
        NOW(),
        NOW()
      )
    `;

    console.log(`✅ Servicio adicional creado: ${servicioId}`);

    return NextResponse.json({ 
      success: true,
      servicio_id: servicioId,
      message: 'Servicio adicional creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando servicio adicional:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio adicional' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar servicio adicional existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    console.log(`📝 PATCH /api/admin/servicios-adicionales - Actualizar servicio: ${id}`);

    if (!id) {
      return NextResponse.json(
        { error: 'ID de servicio adicional es requerido' },
        { status: 400 }
      );
    }

    const precioParticular = updates.precioParticular || updates.precio_particular || 29900;
    const precioAfiliado = updates.precioAfiliado || updates.precio_afiliado || 13000;

    await prisma.$executeRaw`
      UPDATE servicios_adicionales 
      SET 
        nombre = ${updates.nombre},
        descripcion = ${updates.descripcion || ''},
        precio_particular = ${precioParticular},
        precio_afiliado = ${precioAfiliado},
        icon = ${updates.icon || '💆'},
        activo = ${updates.activo !== false},
        orden = ${updates.orden || 0},
        updated_at = NOW()
      WHERE servicio_id = ${id}
    `;

    console.log(`✅ Servicio adicional actualizado: ${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Servicio adicional actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando servicio adicional:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio adicional' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio adicional
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log(`🗑️  DELETE /api/admin/servicios-adicionales - Eliminar servicio: ${id}`);

    if (!id) {
      return NextResponse.json(
        { error: 'ID de servicio adicional es requerido' },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      DELETE FROM servicios_adicionales 
      WHERE servicio_id = ${id}
    `;

    console.log(`✅ Servicio adicional eliminado: ${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Servicio adicional eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando servicio adicional:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio adicional' },
      { status: 500 }
    );
  }
}

