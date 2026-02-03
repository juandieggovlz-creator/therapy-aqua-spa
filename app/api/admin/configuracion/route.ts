export const runtime = "nodejs";
import { NextResponse } from 'next/server';

// GET - Obtener toda la configuración
export async function GET() {
  try {
    // TODO: Implementar cuando la tabla configuracion exista en Neon
    const configuraciones: any[] = [];

    return NextResponse.json({
      configuraciones,
      success: true
    });
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva configuración
export async function POST(request: Request) {
  try {
    // TODO: Implementar cuando la tabla configuracion exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error creando configuración:', error);
    return NextResponse.json(
      { error: 'Error al crear configuración' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar configuración existente
export async function PATCH(request: Request) {
  try {
    // TODO: Implementar cuando la tabla configuracion exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error actualizando configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar configuración
export async function DELETE(request: Request) {
  try {
    // TODO: Implementar cuando la tabla configuracion exista en Neon
    return NextResponse.json({
      error: 'Funcionalidad no disponible',
      success: false
    }, { status: 501 });
  } catch (error) {
    console.error('❌ Error eliminando configuración:', error);
    return NextResponse.json(
      { error: 'Error al eliminar configuración' },
      { status: 500 }
    );
  }
}

