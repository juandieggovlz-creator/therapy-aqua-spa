import { NextResponse } from "next/server";
import { leerContenido, escribirContenido } from "@/lib/content-helpers";

// GET - Obtener todos los descuentos
export async function GET() {
  try {
    const content = await leerContenido();
    return NextResponse.json({ descuentos: content.descuentos }, { status: 200 });
  } catch (error) {
    console.error("Error leyendo descuentos:", error);
    return NextResponse.json(
      { error: "Error al leer descuentos" },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar descuentos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();

    // Actualizar descuentos
    content.descuentos = { ...content.descuentos, ...body };
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al guardar descuentos" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, descuentos: content.descuentos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error actualizando descuentos:", error);
    return NextResponse.json(
      { error: "Error al actualizar descuentos" },
      { status: 500 }
    );
  }
}
