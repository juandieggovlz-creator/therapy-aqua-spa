import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Ruta al archivo JSON
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

// Función helper para leer el contenido
function leerContenido() {
  try {
    const fileContent = fs.readFileSync(CONTENT_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("❌ Error leyendo content.json:", error);
    // Si no existe, retornar estructura vacía
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

// Función helper para escribir el contenido
function escribirContenido(contenido: any) {
  try {
    // Actualizar timestamp
    contenido.lastUpdated = new Date().toISOString();
    contenido.version = (contenido.version || 0) + 1;
    
    // Escribir al archivo
    fs.writeFileSync(
      CONTENT_PATH,
      JSON.stringify(contenido, null, 2),
      "utf-8"
    );
    
    console.log("✅ content.json actualizado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error escribiendo content.json:", error);
    return false;
  }
}

/**
 * GET /api/content
 * Obtener todo el contenido (servicios, promociones, CMS, etc.)
 * Query params opcionales:
 *   - section: 'servicios' | 'promociones' | 'cms' | 'descuentos' (para obtener solo una sección)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    
    const contenido = leerContenido();
    
    // Si se solicita una sección específica
    if (section && contenido[section]) {
      return NextResponse.json(
        { 
          [section]: contenido[section],
          lastUpdated: contenido.lastUpdated,
          version: contenido.version
        },
        { status: 200 }
      );
    }
    
    // Retornar todo el contenido
    return NextResponse.json(contenido, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/content:", error);
    return NextResponse.json(
      { error: "Error al obtener contenido" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content
 * Actualizar todo el contenido o una sección específica
 * Body:
 *   - section: 'servicios' | 'promociones' | 'cms' | 'descuentos' (opcional)
 *   - data: contenido a actualizar
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    const contenido = leerContenido();
    
    if (section) {
      // Actualizar solo una sección
      contenido[section] = data;
    } else {
      // Actualizar todo (mantener estructura)
      Object.keys(data).forEach(key => {
        if (key !== 'lastUpdated' && key !== 'version') {
          contenido[key] = data[key];
        }
      });
    }
    
    const exito = escribirContenido(contenido);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al guardar contenido" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        contenido: contenido,
        message: section 
          ? `Sección "${section}" actualizada correctamente`
          : "Contenido actualizado correctamente"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/content:", error);
    return NextResponse.json(
      { error: "Error al actualizar contenido" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/content
 * Actualización parcial de contenido (merge)
 * Útil para actualizar campos específicos sin reemplazar todo
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { section, updates } = body;
    
    const contenido = leerContenido();
    
    if (section && contenido[section]) {
      // Merge de la sección específica
      if (typeof contenido[section] === 'object' && !Array.isArray(contenido[section])) {
        contenido[section] = { ...contenido[section], ...updates };
      } else {
        contenido[section] = updates;
      }
    } else {
      // Merge general
      Object.keys(updates).forEach(key => {
        if (key !== 'lastUpdated' && key !== 'version') {
          if (typeof contenido[key] === 'object' && !Array.isArray(contenido[key])) {
            contenido[key] = { ...contenido[key], ...updates[key] };
          } else {
            contenido[key] = updates[key];
          }
        }
      });
    }
    
    const exito = escribirContenido(contenido);
    
    if (!exito) {
      return NextResponse.json(
        { error: "Error al actualizar contenido" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        contenido: contenido,
        message: "Contenido actualizado correctamente"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/content:", error);
    return NextResponse.json(
      { error: "Error al actualizar contenido" },
      { status: 500 }
    );
  }
}




