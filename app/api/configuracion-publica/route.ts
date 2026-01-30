import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener configuración pública del sitio
export async function GET() {
  try {
    const configuraciones = await prisma.configuracion.findMany();

    // Convertir array a objeto clave-valor
    const config: Record<string, any> = {};
    configuraciones.forEach((c: any) => {
      config[c.clave] = {
        valor: c.valor,
        descripcion: c.descripcion,
        tipo: c.tipo
      };
    });

    return NextResponse.json({ 
      configuracion: config,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo configuración pública:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

