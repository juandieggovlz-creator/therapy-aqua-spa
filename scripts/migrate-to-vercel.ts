/**
 * Script de migración: JSON → Vercel KV + Postgres
 * 
 * Este script migra los datos existentes desde archivos JSON locales
 * hacia Vercel KV (contenido) y Vercel Postgres (reservas).
 * 
 * Uso:
 *   npm run migrate
 */

import fs from 'fs';
import path from 'path';
import { initializeFromJSON } from '../lib/kv';
import { initReservasTable, migrateReservasFromJSON } from '../lib/db';

async function migrate() {
  console.log('🚀 Iniciando migración a Vercel KV + Postgres...\n');

  try {
    // 1. Leer datos existentes
    console.log('📖 Leyendo datos locales...');
    
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const reservasPath = path.join(process.cwd(), 'data', 'reservas.json');
    
    let contentData = null;
    let reservasData = [];

    // Leer content.json
    if (fs.existsSync(contentPath)) {
      const contentRaw = fs.readFileSync(contentPath, 'utf-8');
      contentData = JSON.parse(contentRaw);
      console.log('  ✅ content.json leído');
    } else {
      console.log('  ⚠️ content.json no encontrado, usando datos por defecto');
      contentData = {
        lastUpdated: new Date().toISOString(),
        version: 1,
        servicios: [],
        promociones: [],
        productos: [],
        cms: {},
        descuentos: [],
      };
    }

    // Leer reservas.json
    if (fs.existsSync(reservasPath)) {
      const reservasRaw = fs.readFileSync(reservasPath, 'utf-8');
      const parsed = JSON.parse(reservasRaw);
      reservasData = parsed.reservas || parsed || [];
      console.log(`  ✅ reservas.json leído (${reservasData.length} reservas)`);
    } else {
      console.log('  ⚠️ reservas.json no encontrado');
    }

    // 2. Migrar contenido a Vercel KV
    console.log('\n📦 Migrando contenido a Vercel KV...');
    const kvSuccess = await initializeFromJSON(contentData);
    
    if (kvSuccess) {
      console.log('  ✅ Contenido migrado a KV exitosamente');
    } else {
      console.log('  ❌ Error migrando contenido a KV');
      throw new Error('Fallo en migración de KV');
    }

    // 3. Inicializar tabla de reservas en Postgres
    console.log('\n🗄️ Inicializando tabla de reservas en Postgres...');
    const dbInit = await initReservasTable();
    
    if (dbInit) {
      console.log('  ✅ Tabla de reservas inicializada');
    } else {
      console.log('  ❌ Error inicializando tabla de reservas');
      throw new Error('Fallo en inicialización de tabla');
    }

    // 4. Migrar reservas a Postgres
    if (reservasData.length > 0) {
      console.log('\n📋 Migrando reservas a Postgres...');
      const migradas = await migrateReservasFromJSON(reservasData);
      console.log(`  ✅ ${migradas}/${reservasData.length} reservas migradas`);
    } else {
      console.log('\n  ℹ️ No hay reservas para migrar');
    }

    // 5. Resumen
    console.log('\n✨ ¡Migración completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`  • Servicios: ${contentData.servicios?.length || 0}`);
    console.log(`  • Productos: ${contentData.productos?.length || 0}`);
    console.log(`  • Promociones: ${contentData.promociones?.length || 0}`);
    console.log(`  • Reservas: ${reservasData.length}`);
    console.log('\n🎯 Próximo paso: Configurar variables de entorno en Vercel');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrate();


