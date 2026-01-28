import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/kv";
import fs from "fs";
import path from "path";

// Fallback a JSON en desarrollo si KV no está disponible
const USE_JSON_FALLBACK = !process.env.REDIS_URL;
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

/**
 * Helper: Leer contenido (KV o JSON fallback)
 */
async function leerContenido() {
  if (USE_JSON_FALLBACK) {
    try {
      const fileContent = fs.readFileSync(CONTENT_PATH, "utf-8");
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("❌ Error leyendo content.json:", error);
      return {
        lastUpdated: new Date().toISOString(),
        version: 1,
        servicios: [],
        promociones: [],
        productos: [],
        cms: {},
        descuentos: [],
      };
    }
  }
  
  // Usar Vercel KV
  const content = await getContent();
  if (!content) {
    return {
      lastUpdated: new Date().toISOString(),
      version: 1,
      servicios: [],
      promociones: [],
      productos: [],
      cms: {},
      descuentos: [],
    };
  }
  return content;
}

/**
 * Helper: Escribir contenido (KV o JSON fallback)
 */
async function escribirContenido(contenido: any) {
  if (USE_JSON_FALLBACK) {
    try {
      contenido.lastUpdated = new Date().toISOString();
      contenido.version = (contenido.version || 0) + 1;
      fs.writeFileSync(
        CONTENT_PATH,
        JSON.stringify(contenido, null, 2),
        "utf-8"
      );
      console.log("✅ content.json actualizado (JSON fallback)");
      return true;
    } catch (error) {
      console.error("❌ Error escribiendo content.json:", error);
      return false;
    }
  }
  
  // Usar Vercel KV
  const success = await setContent(contenido);
  return success;
}

/**
 * GET /api/content
 * Obtener todo el contenido (servicios, promociones, CMS, etc.)
 * Query params opcionales:
 *   - section: 'servicios' | 'promociones' | 'cms' | 'descuentos' | 'productos' (para obtener solo una sección)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    
    const contenido = await leerContenido();
    
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
 *   - section: 'servicios' | 'promociones' | 'cms' | 'descuentos' | 'productos' (opcional)
 *   - data: contenido a actualizar
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    const contenido = await leerContenido();
    
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
    
    const exito = await escribirContenido(contenido);
    
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
    
    const contenido = await leerContenido();
    
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
    
    const exito = await escribirContenido(contenido);
    
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
