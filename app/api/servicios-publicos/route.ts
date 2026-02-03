export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener servicios activos para mostrar en la página pública
export async function GET() {
  try {
    // Usar query raw para evitar problemas con Prisma client
    const servicios: any[] = await prisma.$queryRaw`
      SELECT *
      FROM servicios
      WHERE activo = true
      ORDER BY created_at DESC
    `;

    // Convertir Decimal a number y formatear para el frontend
    const serviciosFormateados = servicios.map((s: any) => {
      // ARREGLO: Si imagen es la cadena "null", tratarla como null real
      let imagenDB = s.imagen;
      if (imagenDB === 'null' || imagenDB === null || imagenDB === undefined) {
        imagenDB = '';
      }

      // Procesar la imagen para asegurar que tenga la ruta correcta
      let imagenFinal = imagenDB;

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

      // Calcular precio con descuento
      const precioOriginal = Number(s.precio);
      const descuento = s.descuento || 0;
      const precioConDescuento = descuento > 0
        ? Math.round(precioOriginal * (1 - descuento / 100))
        : precioOriginal;

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
        price: precioConDescuento,
        precio: precioConDescuento,
        precioOriginal: precioOriginal,
        descuento: descuento,
        priceLabel: descuento > 0
          ? `$${precioConDescuento.toLocaleString()}`
          : `$${precioOriginal.toLocaleString()}`,
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

