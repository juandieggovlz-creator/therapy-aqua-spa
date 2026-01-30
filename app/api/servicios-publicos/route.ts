import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener servicios activos para mostrar en la página pública
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { created_at: 'desc' }
    });

    // Convertir Decimal a number y formatear para el frontend
    const serviciosFormateados = servicios.map((s: any) => {
      // Procesar la imagen para asegurar que tenga la ruta correcta
      let imagenFinal = s.imagen || '';
      if (imagenFinal) {
        if (imagenFinal.startsWith('http')) {
          // URL externa, dejar como está
          imagenFinal = imagenFinal;
        } else if (imagenFinal.startsWith('/image/')) {
          // Ya tiene la ruta, dejar como está
          imagenFinal = imagenFinal;
        } else if (imagenFinal.startsWith('/')) {
          // Tiene /, pero no /image/, dejar como está
          imagenFinal = imagenFinal;
        } else {
          // Solo nombre de archivo, agregar /image/ y codificar
          imagenFinal = `/image/${encodeURIComponent(imagenFinal)}`;
        }
      }
      
      return {
        id: s.servicio_id,
        key: s.servicio_id,
        servicio_id: s.servicio_id,
        title: s.nombre,
        nombre: s.nombre,
        description: s.descripcion,
        descripcion: s.descripcion,
        categoria: s.categoria,
        duration: `${s.duracion} min`,
        duracion: s.duracion,
        price: Number(s.precio),
        precio: Number(s.precio),
        precioOriginal: Number(s.precio),
        priceLabel: `$${Number(s.precio).toLocaleString()}`,
        icon: s.icon || '💆',
        imagen: imagenFinal || '/image/default-service.jpg',
        detalles: s.detalles || [],
        activo: s.activo,
        orden: s.orden
      };
    });

    return NextResponse.json({ 
      servicios: serviciosFormateados,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error obteniendo servicios públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

