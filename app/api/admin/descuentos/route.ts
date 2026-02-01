import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener descuentos de todos los servicios
export async function GET() {
  try {
    console.log('📥 GET /api/admin/descuentos - Obteniendo descuentos...');
    
    // Obtener todos los servicios con sus descuentos
    const servicios = await prisma.$queryRaw<any[]>`
      SELECT servicio_id, nombre, descuento
      FROM servicios
      WHERE activo = true
    `;

    // Crear objeto con descuentos por servicio_id
    const descuentos: Record<string, number> = {};
    servicios.forEach(s => {
      descuentos[s.servicio_id] = s.descuento || 0;
    });

    console.log(`✅ ${servicios.length} descuentos cargados`);

    return NextResponse.json({ 
      descuentos,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo descuentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener descuentos' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar descuento de un servicio
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { servicioId, descuento } = body;

    console.log(`📝 PATCH /api/admin/descuentos - ServicioId: ${servicioId}, Descuento: ${descuento}%`);

    if (!servicioId) {
      return NextResponse.json(
        { error: 'servicioId es requerido' },
        { status: 400 }
      );
    }

    // Validar descuento
    const descuentoNum = parseInt(descuento) || 0;
    if (descuentoNum < 0 || descuentoNum > 100) {
      return NextResponse.json(
        { error: 'El descuento debe estar entre 0 y 100' },
        { status: 400 }
      );
    }

    // Actualizar descuento en la base de datos
    await prisma.$executeRaw`
      UPDATE servicios 
      SET descuento = ${descuentoNum}, updated_at = NOW()
      WHERE servicio_id = ${servicioId}
    `;

    console.log(`✅ Descuento actualizado: ${servicioId} -> ${descuentoNum}%`);

    return NextResponse.json({ 
      success: true,
      message: `Descuento de ${descuentoNum}% aplicado correctamente`
    });
  } catch (error) {
    console.error('❌ Error actualizando descuento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar descuento' },
      { status: 500 }
    );
  }
}
