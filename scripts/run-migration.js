// Script para ejecutar migraciones en Neon
import { sql } from '@vercel/postgres';

async function runMigration() {
  try {
    console.log('🔄 Ejecutando migración: Agregar columnas es_afiliado y duracion_total...');
    
    // Agregar columna es_afiliado
    await sql`
      ALTER TABLE public.reservas 
      ADD COLUMN IF NOT EXISTS es_afiliado BOOLEAN DEFAULT false;
    `;
    console.log('✅ Columna es_afiliado agregada');
    
    // Agregar columna duracion_total
    await sql`
      ALTER TABLE public.reservas 
      ADD COLUMN IF NOT EXISTS duracion_total INTEGER DEFAULT 0;
    `;
    console.log('✅ Columna duracion_total agregada');
    
    // Verificar columnas
    const result = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'reservas' 
      AND column_name IN ('es_afiliado', 'duracion_total');
    `;
    
    console.log('✅ Migración completada. Columnas verificadas:');
    console.table(result.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();


