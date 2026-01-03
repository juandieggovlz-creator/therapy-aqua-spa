import { NextResponse } from "next/server";

// Simulación de almacenamiento (en producción sería una BD)
let preciosTerapias: Record<string, number> = {
  'columna': 100000,
  'brazos': 60000,
  'piernas': 60000,
  'hombro': 250000,
  'cadera': 250000,
  'mano': 90000,
  'ocular': 80000,
  'bienestar': 140000,
  'facial': 90000,
  'espalda': 120000,
  'hombros': 100000,
  'rodillas': 120000,
  'pies': 120000,
  'deportivo': 100000,
};

export async function GET() {
  try {
    return NextResponse.json({ precios: preciosTerapias }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener precios" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { terapiaId, nuevoPrecio } = body;

    if (!terapiaId || nuevoPrecio === undefined) {
      return NextResponse.json(
        { error: "terapiaId y nuevoPrecio son requeridos" },
        { status: 400 }
      );
    }

    preciosTerapias[terapiaId] = nuevoPrecio;

    return NextResponse.json(
      { success: true, precios: preciosTerapias },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar precio" },
      { status: 500 }
    );
  }
}



