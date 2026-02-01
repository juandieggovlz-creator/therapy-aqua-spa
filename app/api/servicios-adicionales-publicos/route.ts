import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener servicios adicionales activos para la página pública
export async function GET() {
  try {
    console.log('📥 GET /api/servicios-adicionales-publicos - Obteniendo servicios adicionales activos...');

    const servicios: any[] = await prisma.$queryRaw`
      SELECT *
      FROM servicios_adicionales
      WHERE activo = true
      ORDER BY orden ASC, nombre ASC
    `;

    const serviciosFormateados = servicios.map((s: any) => ({
      id: s.servicio_id,
      nombre: s.nombre,
      descripcion: s.descripcion,
      precioParticular: Number(s.precio_particular),
      precioAfiliado: Number(s.precio_afiliado),
      icon: s.icon || '💆',
      activo: s.activo
    }));

    console.log(`✅ ${servicios.length} servicios adicionales activos`);

    return NextResponse.json({ 
      servicios: serviciosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo servicios adicionales públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios adicionales' },
      { status: 500 }
    );
  }
}

