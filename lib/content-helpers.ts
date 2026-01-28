/**
 * Helpers compartidos para lectura/escritura de contenido
 * Usa Vercel KV en producción y JSON en desarrollo (fallback)
 */

import { getContent, setContent } from "./kv";
import fs from "fs";
import path from "path";

const USE_JSON_FALLBACK = !process.env.REDIS_URL;
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

/**
 * Leer todo el contenido (KV o JSON)
 */
export async function leerContenido() {
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
  
  const content = await getContent();
  return content || {
    lastUpdated: new Date().toISOString(),
    version: 1,
    servicios: [],
    promociones: [],
    productos: [],
    cms: {},
    descuentos: [],
  };
}

/**
 * Escribir contenido completo (KV o JSON)
 */
export async function escribirContenido(contenido: any): Promise<boolean> {
  if (USE_JSON_FALLBACK) {
    try {
      contenido.lastUpdated = new Date().toISOString();
      contenido.version = (contenido.version || 0) + 1;
      fs.writeFileSync(
        CONTENT_PATH,
        JSON.stringify(contenido, null, 2),
        "utf-8"
      );
      console.log(`✅ content.json actualizado (v${contenido.version})`);
      return true;
    } catch (error) {
      console.error("❌ Error escribiendo content.json:", error);
      return false;
    }
  }
  
  return await setContent(contenido);
}

