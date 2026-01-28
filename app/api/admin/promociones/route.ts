import { NextResponse } from "next/server";
import { leerContenido, escribirContenido } from "@/lib/content-helpers";

export async function GET() {
  try {
    const content = await leerContenido();
    const ahora = new Date().toISOString();
    
    // Filtrar promociones activas y válidas
    const promocionesActivas = content.promociones.filter((p: any) => 
      p.activa && 
      !p.pausada && 
      p.fechaInicio <= ahora && 
      p.fechaFin >= ahora
    );

    // Si hay múltiples, retornar la más reciente o la de mayor descuento
    const promocionActiva = promocionesActivas.length > 0 
      ? promocionesActivas.sort((a: any, b: any) => {
          if (a.tipo === 'porcentaje' && b.tipo === 'porcentaje') {
            return b.valor - a.valor; // Mayor porcentaje primero
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })[0]
      : null;

    return NextResponse.json({ 
      promocion: promocionActiva,
      todas: content.promociones 
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener promociones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();
    
    const nuevaPromocion = {
      id: `promo-${Date.now()}`,
      tipo: body.tipo || 'porcentaje',
      tipoAplicacion: body.tipoAplicacion || 'todos',
      valor: body.valor,
      montoMinimo: body.tipoAplicacion === 'monto_minimo' ? (body.montoMinimo || 0) : undefined,
      serviciosIds: body.tipoAplicacion === 'servicios_especificos' ? (body.serviciosIds || []) : undefined,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      activa: body.activa !== undefined ? body.activa : false,
      pausada: false,
      usoLimitado: body.usoLimitado !== undefined ? body.usoLimitado : true,
      titulo: body.titulo,
      descripcion: body.descripcion || '',
      textoPromocional: body.textoPromocional || body.titulo,
      imagen: body.imagen || '',
      createdAt: new Date().toISOString()
    };

    content.promociones.push(nuevaPromocion);
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al guardar promoción" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, promocion: nuevaPromocion },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al crear promoción" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de promoción requerido" },
        { status: 400 }
      );
    }

    const content = await leerContenido();
    const index = content.promociones.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Promoción no encontrada" },
        { status: 404 }
      );
    }

    content.promociones[index] = { ...content.promociones[index], ...updates };
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al actualizar promoción" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, promocion: content.promociones[index] },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar promoción" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID de promoción requerido" },
        { status: 400 }
      );
    }

    const content = await leerContenido();
    content.promociones = content.promociones.filter((p: any) => p.id !== id);
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al eliminar promoción" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Promoción eliminada" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al eliminar promoción" },
      { status: 500 }
    );
  }
}
