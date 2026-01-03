import { NextResponse } from "next/server";

// Simulación de almacenamiento (en producción sería una BD)
let promocionActiva = {
  activa: true,
  descuento: 40,
  fechaLimite: '2025-12-31T23:59:59',
  titulo: '40% OFF Masajes Personalizados',
  descripcion: '¡Tu momento de relajación al mejor precio del año!',
};

export async function GET() {
  try {
    return NextResponse.json({ promocion: promocionActiva }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener promoción" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { activa, descuento, fechaLimite, titulo, descripcion } = body;

    if (activa !== undefined) {
      promocionActiva.activa = activa;
    }
    if (descuento !== undefined) {
      promocionActiva.descuento = descuento;
    }
    if (fechaLimite !== undefined) {
      promocionActiva.fechaLimite = fechaLimite;
    }
    if (titulo !== undefined) {
      promocionActiva.titulo = titulo;
    }
    if (descripcion !== undefined) {
      promocionActiva.descripcion = descripcion;
    }

    return NextResponse.json(
      { success: true, promocion: promocionActiva },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar promoción" },
      { status: 500 }
    );
  }
}



