/**
 * Redis - Utilidades para almacenamiento de contenido
 * Gestiona: servicios, productos, CMS, promociones, descuentos
 */

import { createClient } from 'redis';

// Keys para Redis
const KEYS = {
  CONTENT: 'therapy:content',
  VERSION: 'therapy:content:version',
};

// Cliente Redis (singleton)
let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Obtener cliente de Redis (singleton)
 */
async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
    
    await redisClient.connect();
    console.log('✅ Redis conectado');
  }
  
  return redisClient;
}

// Tipo de contenido completo
export interface ContenidoCompleto {
  lastUpdated: string;
  version: number;
  servicios: any[];
  promociones: any[];
  productos: any[];
  cms: any;
  descuentos?: any[];
}

/**
 * Obtener todo el contenido
 */
export async function getContent(): Promise<ContenidoCompleto | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(KEYS.CONTENT);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data) as ContenidoCompleto;
  } catch (error) {
    console.error('❌ Error obteniendo contenido de Redis:', error);
    return null;
  }
}

/**
 * Guardar contenido completo
 */
export async function setContent(content: ContenidoCompleto): Promise<boolean> {
  try {
    content.lastUpdated = new Date().toISOString();
    content.version = (content.version || 0) + 1;
    
    const client = await getRedisClient();
    await client.set(KEYS.CONTENT, JSON.stringify(content));
    await client.set(KEYS.VERSION, content.version.toString());
    
    console.log('✅ Contenido guardado en Redis, versión:', content.version);
    return true;
  } catch (error) {
    console.error('❌ Error guardando contenido en Redis:', error);
    return false;
  }
}

/**
 * Actualizar solo servicios
 */
export async function updateServicios(servicios: any[]): Promise<boolean> {
  try {
    const content = await getContent();
    if (!content) {
      throw new Error('No se pudo obtener el contenido actual');
    }
    
    content.servicios = servicios;
    return await setContent(content);
  } catch (error) {
    console.error('❌ Error actualizando servicios:', error);
    return false;
  }
}

/**
 * Actualizar solo productos
 */
export async function updateProductos(productos: any[]): Promise<boolean> {
  try {
    const content = await getContent();
    if (!content) {
      throw new Error('No se pudo obtener el contenido actual');
    }
    
    content.productos = productos;
    return await setContent(content);
  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
    return false;
  }
}

/**
 * Actualizar solo promociones
 */
export async function updatePromociones(promociones: any[]): Promise<boolean> {
  try {
    const content = await getContent();
    if (!content) {
      throw new Error('No se pudo obtener el contenido actual');
    }
    
    content.promociones = promociones;
    return await setContent(content);
  } catch (error) {
    console.error('❌ Error actualizando promociones:', error);
    return false;
  }
}

/**
 * Actualizar solo CMS
 */
export async function updateCMS(cms: any): Promise<boolean> {
  try {
    const content = await getContent();
    if (!content) {
      throw new Error('No se pudo obtener el contenido actual');
    }
    
    content.cms = cms;
    return await setContent(content);
  } catch (error) {
    console.error('❌ Error actualizando CMS:', error);
    return false;
  }
}

/**
 * Actualizar solo descuentos
 */
export async function updateDescuentos(descuentos: any[]): Promise<boolean> {
  try {
    const content = await getContent();
    if (!content) {
      throw new Error('No se pudo obtener el contenido actual');
    }
    
    content.descuentos = descuentos;
    return await setContent(content);
  } catch (error) {
    console.error('❌ Error actualizando descuentos:', error);
    return false;
  }
}

/**
 * Inicializar contenido desde JSON (migración inicial)
 */
export async function initializeFromJSON(jsonData: ContenidoCompleto): Promise<boolean> {
  try {
    console.log('🔄 Inicializando Redis desde JSON...');
    const success = await setContent(jsonData);
    if (success) {
      console.log('✅ Contenido inicializado en Redis exitosamente');
    }
    return success;
  } catch (error) {
    console.error('❌ Error inicializando Redis desde JSON:', error);
    return false;
  }
}

/**
 * Obtener versión actual
 */
export async function getVersion(): Promise<number> {
  try {
    const client = await getRedisClient();
    const version = await client.get(KEYS.VERSION);
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.error('❌ Error obteniendo versión:', error);
    return 0;
  }
}
