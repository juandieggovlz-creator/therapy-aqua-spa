import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener descuentos de todos los servicios
// NOTA: El campo 'descuento' no existe en la tabla actual de servicios
// Por ahora devolvemos un objeto vacío
export async function GET() {
  try {
    // TODO: Agregar columna 'descuento' a la tabla de servicios
    const descuentos: Record<string, number> = {};

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
// NOTA: El campo 'descuento' no existe en la tabla actual de servicios
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { servicioId, descuento } = body;

    if (!servicioId) {
      return NextResponse.json(
        { error: 'servicioId es requerido' },
        { status: 400 }
      );
    }

    // TODO: Agregar columna 'descuento' a la tabla de servicios
    console.log(`⚠️ Descuento no implementado aún. ServicioId: ${servicioId}, Descuento: ${descuento}%`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error actualizando descuento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar descuento' },
      { status: 500 }
    );
  }
}

