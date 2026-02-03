export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener productos activos para la página pública
export async function GET() {
  try {
    console.log('📥 GET /api/productos-publicos - Obteniendo productos activos...');

    const productos: any[] = await prisma.$queryRaw`
      SELECT *
      FROM productos
      WHERE activo = true
      ORDER BY orden ASC, nombre ASC
    `;

    const productosFormateados = productos.map((p: any) => ({
      id: p.producto_id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      icon: p.icon || '📦',
      activo: p.activo
    }));

    console.log(`✅ ${productos.length} productos activos`);

    return NextResponse.json({
      productos: productosFormateados,
      success: true
    });
  } catch (error) {
    console.error('❌ Error obteniendo productos públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

