import { NextResponse } from "next/server";

// Simulación de almacenamiento (en producción sería una BD)
let descuentosServicios: Record<string, number> = {}; // { servicioId: porcentajeDescuento }

export async function GET() {
  try {
    return NextResponse.json({ descuentos: descuentosServicios }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener descuentos" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { servicioId, descuento } = body;

    if (!servicioId || descuento === undefined) {
      return NextResponse.json(
        { error: "servicioId y descuento son requeridos" },
        { status: 400 }
      );
    }

    if (descuento === 0 || descuento === null) {
      // Eliminar descuento
      delete descuentosServicios[servicioId];
    } else {
      descuentosServicios[servicioId] = descuento;
    }

    return NextResponse.json(
      { success: true, descuentos: descuentosServicios },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar descuento" },
      { status: 500 }
    );
  }
}



