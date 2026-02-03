export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET - Obtener todas las promociones
export async function GET() {
  try {
    const promociones: any[] = await prisma.$queryRaw`
      SELECT 
        id,
        promocion_id,
        nombre,
        descripcion,
        tipo,
        valor_descuento,
        precio_minimo,
        aplicable_a,
        items_incluidos,
        fecha_inicio,
        fecha_fin,
        dias_validos,
        horario_inicio,
        horario_fin,
        maximo_usos,
        usos_actuales,
        activo,
        prioridad,
        codigo_promocion,
        visible_web,
        created_at,
        updated_at
      FROM promociones
      ORDER BY prioridad DESC, created_at DESC
    `;

    // Transformar fechas y JSON
    const promocionesFormateadas = promociones.map((p: any) => ({
      id: p.promocion_id,
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      tipo: p.tipo,
      valorDescuento: Number(p.valor_descuento),
      precioMinimo: p.precio_minimo ? Number(p.precio_minimo) : null,
      aplicableA: p.aplicable_a,
      itemsIncluidos: Array.isArray(p.items_incluidos) ? p.items_incluidos : [],
      fechaInicio: p.fecha_inicio.toISOString().split('T')[0],
      fechaFin: p.fecha_fin.toISOString().split('T')[0],
      diasValidos: Array.isArray(p.dias_validos) ? p.dias_validos : [1, 2, 3, 4, 5, 6, 0],
      horarioInicio: p.horario_inicio,
      horarioFin: p.horario_fin,
      maximoUsos: p.maximo_usos,
      usosActuales: p.usos_actuales,
      activo: p.activo,
      prioridad: p.prioridad,
      codigoPromocion: p.codigo_promocion,
      visibleWeb: p.visible_web
    }));

    return NextResponse.json({
      promociones: promocionesFormateadas,
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error obteniendo promociones:', error);

    // Si la tabla no existe, retornar array vacío
    if (error?.code === '42P01') {
      return NextResponse.json({
        promociones: [],
        success: true,
        message: 'Tabla promociones no existe aún'
      });
    }

    return NextResponse.json(
      { error: 'Error al obtener promociones', success: false },
      { status: 500 }
    );
  }
}

// POST - Crear nueva promoción
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generar ID único
    const promocionId = `PROMO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Convertir arrays a JSON
    const itemsIncluidos = body.itemsIncluidos || [];
    const diasValidos = body.diasValidos || [1, 2, 3, 4, 5, 6, 0];

    await prisma.$executeRaw`
      INSERT INTO promociones (
        promocion_id,
        nombre,
        descripcion,
        tipo,
        valor_descuento,
        precio_minimo,
        aplicable_a,
        items_incluidos,
        fecha_inicio,
        fecha_fin,
        dias_validos,
        horario_inicio,
        horario_fin,
        maximo_usos,
        usos_actuales,
        activo,
        prioridad,
        codigo_promocion,
        visible_web
      ) VALUES (
        ${promocionId},
        ${body.nombre},
        ${body.descripcion || ''},
        ${body.tipo},
        ${body.valorDescuento}::numeric,
        ${body.precioMinimo || null}::numeric,
        ${body.aplicableA},
        ${JSON.stringify(itemsIncluidos)}::jsonb,
        ${body.fechaInicio}::date,
        ${body.fechaFin}::date,
        ${JSON.stringify(diasValidos)}::jsonb,
        ${body.horarioInicio || null},
        ${body.horarioFin || null},
        ${body.maximoUsos || null}::integer,
        0,
        ${body.activo !== false},
        ${body.prioridad || 1},
        ${body.codigoPromocion || null},
        ${body.visibleWeb !== false}
      )
    `;

    console.log('✅ Promoción creada:', promocionId);

    return NextResponse.json({
      promocion: { id: promocionId },
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error creando promoción:', error);

    if (error?.code === '42P01') {
      return NextResponse.json(
        { error: 'Tabla promociones no existe. Ejecuta la migración de Prisma.', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear promoción', success: false },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar promoción existente
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de promoción requerido', success: false },
        { status: 400 }
      );
    }

    // Construir UPDATE dinámico solo con campos proporcionados
    const updates: string[] = [];
    const values: any[] = [];

    if (body.nombre !== undefined) {
      updates.push(`nombre = $${updates.length + 1}`);
      values.push(body.nombre);
    }
    if (body.descripcion !== undefined) {
      updates.push(`descripcion = $${updates.length + 1}`);
      values.push(body.descripcion);
    }
    if (body.tipo !== undefined) {
      updates.push(`tipo = $${updates.length + 1}`);
      values.push(body.tipo);
    }
    if (body.valorDescuento !== undefined) {
      updates.push(`valor_descuento = $${updates.length + 1}::numeric`);
      values.push(body.valorDescuento);
    }
    if (body.precioMinimo !== undefined) {
      updates.push(`precio_minimo = $${updates.length + 1}::numeric`);
      values.push(body.precioMinimo);
    }
    if (body.aplicableA !== undefined) {
      updates.push(`aplicable_a = $${updates.length + 1}`);
      values.push(body.aplicableA);
    }
    if (body.itemsIncluidos !== undefined) {
      updates.push(`items_incluidos = $${updates.length + 1}::jsonb`);
      values.push(JSON.stringify(body.itemsIncluidos));
    }
    if (body.fechaInicio !== undefined) {
      updates.push(`fecha_inicio = $${updates.length + 1}::date`);
      values.push(body.fechaInicio);
    }
    if (body.fechaFin !== undefined) {
      updates.push(`fecha_fin = $${updates.length + 1}::date`);
      values.push(body.fechaFin);
    }
    if (body.diasValidos !== undefined) {
      updates.push(`dias_validos = $${updates.length + 1}::jsonb`);
      values.push(JSON.stringify(body.diasValidos));
    }
    if (body.horarioInicio !== undefined) {
      updates.push(`horario_inicio = $${updates.length + 1}`);
      values.push(body.horarioInicio);
    }
    if (body.horarioFin !== undefined) {
      updates.push(`horario_fin = $${updates.length + 1}`);
      values.push(body.horarioFin);
    }
    if (body.maximoUsos !== undefined) {
      updates.push(`maximo_usos = $${updates.length + 1}::integer`);
      values.push(body.maximoUsos);
    }
    if (body.activo !== undefined) {
      updates.push(`activo = $${updates.length + 1}`);
      values.push(body.activo);
    }
    if (body.prioridad !== undefined) {
      updates.push(`prioridad = $${updates.length + 1}`);
      values.push(body.prioridad);
    }
    if (body.codigoPromocion !== undefined) {
      updates.push(`codigo_promocion = $${updates.length + 1}`);
      values.push(body.codigoPromocion);
    }
    if (body.visibleWeb !== undefined) {
      updates.push(`visible_web = $${updates.length + 1}`);
      values.push(body.visibleWeb);
    }

    // Agregar updated_at
    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) { // Solo updated_at
      return NextResponse.json({
        success: true,
        message: 'No hay cambios que aplicar'
      });
    }

    values.push(id);
    const query = `
      UPDATE promociones 
      SET ${updates.join(', ')}
      WHERE promocion_id = $${values.length}
    `;

    await prisma.$executeRawUnsafe(query, ...values);

    console.log('✅ Promoción actualizada:', id);

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error actualizando promoción:', error);

    if (error?.code === '42P01') {
      return NextResponse.json(
        { error: 'Tabla promociones no existe', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar promoción', success: false },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar promoción
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: 'ID de promoción requerido', success: false },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      DELETE FROM promociones 
      WHERE promocion_id = ${id}
    `;

    console.log('✅ Promoción eliminada:', id);

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error eliminando promoción:', error);

    if (error?.code === '42P01') {
      return NextResponse.json(
        { error: 'Tabla promociones no existe', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar promoción', success: false },
      { status: 500 }
    );
  }
}