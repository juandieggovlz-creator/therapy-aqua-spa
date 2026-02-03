export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener promociones activas y vigentes para mostrar en la web pública
export async function GET() {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const diaSemana = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    const promociones: any[] = await prisma.$queryRaw`
      SELECT 
        promocion_id,
        nombre,
        descripcion,
        tipo,
        valor_descuento,
        precio_minimo,
        aplicable_a,
        items_incluidos,
        codigo_promocion,
        prioridad
      FROM promociones
      WHERE activo = true
        AND visible_web = true
        AND fecha_inicio <= ${hoy}::date
        AND fecha_fin >= ${hoy}::date
        AND (
          dias_validos IS NULL 
          OR dias_validos::jsonb @> ${JSON.stringify([diaSemana])}::jsonb
        )
        AND (
          maximo_usos IS NULL 
          OR usos_actuales < maximo_usos
        )
      ORDER BY prioridad DESC, created_at DESC
    `;

    // Transformar al formato esperado
    const promocionesFormateadas = promociones.map((p: any) => ({
      id: p.promocion_id,
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      tipo: p.tipo,
      valorDescuento: Number(p.valor_descuento),
      precioMinimo: p.precio_minimo ? Number(p.precio_minimo) : null,
      aplicableA: p.aplicable_a,
      itemsIncluidos: Array.isArray(p.items_incluidos) ? p.items_incluidos : [],
      codigoPromocion: p.codigo_promocion,
      prioridad: p.prioridad
    }));

    return NextResponse.json({
      promociones: promocionesFormateadas,
      success: true
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    console.error('❌ Error obteniendo promociones públicas:', error);

    // Si la tabla no existe, retornar array vacío
    if (error?.code === '42P01') {
      return NextResponse.json({
        promociones: [],
        success: true
      });
    }

    return NextResponse.json(
      { error: 'Error al obtener promociones', success: false },
      { status: 500 }
    );
  }
}

