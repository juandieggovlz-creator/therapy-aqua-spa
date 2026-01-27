import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Usar content.json como fuente de datos
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

// Helper para leer content.json
function readContent() {
  try {
    const data = fs.readFileSync(CONTENT_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo content.json:", error);
    return {
      lastUpdated: new Date().toISOString(),
      version: 1,
      servicios: [],
      descuentos: {},
      promociones: [],
      cms: {}
    };
  }
}

// Helper para escribir content.json
function writeContent(content: any) {
  try {
    content.lastUpdated = new Date().toISOString();
    content.version = (content.version || 0) + 1;
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf8");
    console.log(`✅ content.json actualizado (v${content.version})`);
    return true;
  } catch (error) {
    console.error("Error escribiendo content.json:", error);
    return false;
  }
}

export async function GET() {
  try {
    const content = readContent();
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
    const content = readContent();
    
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
    
    if (!writeContent(content)) {
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
