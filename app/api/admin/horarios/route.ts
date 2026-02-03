export const runtime = "nodejs";
import { NextResponse } from 'next/server';

// GET - Obtener todos los horarios
export async function GET() {
  try {
    // TODO: Implementar cuando la tabla horarios exista en Neon
    const horarios: any[] = [];

    return NextResponse.json({
      horarios,
      success: true
    });
  } catch (error) {
    console.error('❌ Error obteniendo horarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo horario
export async function POST(request: Request) {
  try {
    // TODO: Implementar cuando la tabla horarios exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error creando horario:', error);
    return NextResponse.json(
      { error: 'Error al crear horario' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar horario existente
export async function PATCH(request: Request) {
  try {
    // TODO: Implementar cuando la tabla horarios exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error actualizando horario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar horario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar horario
export async function DELETE(request: Request) {
  try {
    // TODO: Implementar cuando la tabla horarios exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error eliminando horario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar horario' },
      { status: 500 }
    );
  }
}
