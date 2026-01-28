import { NextResponse } from "next/server";
import { leerContenido, escribirContenido } from "@/lib/content-helpers";

export async function GET() {
  try {
    const content = await leerContenido();
    return NextResponse.json({ contenido: content.cms }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al obtener contenido" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const content = await leerContenido();
    
    // Actualizar contenido de forma recursiva
    const actualizarContenido = (obj: any, updates: any) => {
      for (const key in updates) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
          if (!obj[key]) obj[key] = {};
          actualizarContenido(obj[key], updates[key]);
        } else {
          obj[key] = updates[key];
        }
      }
    };

    actualizarContenido(content.cms, body);
    
    if (!(await escribirContenido(content))) {
      return NextResponse.json(
        { error: "Error al actualizar contenido" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, contenido: content.cms },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Error al actualizar contenido" },
      { status: 500 }
    );
  }
}
