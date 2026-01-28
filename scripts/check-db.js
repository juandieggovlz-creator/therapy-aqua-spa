require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkAndCreateTable() {
  try {
    console.log('🔍 Verificando tabla public.reservas en Neon...');
    
    // Verificar si la tabla existe
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'reservas'
      );
    `;
    
    const tableExists = result.rows[0].exists;
    console.log(`📊 Tabla existe: ${tableExists}`);
    
    if (!tableExists) {
      console.log('🔨 Creando tabla public.reservas...');
      
      await sql`
        CREATE TABLE public.reservas (
          id SERIAL PRIMARY KEY,
          reservation_id VARCHAR(50) UNIQUE NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          telefono VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          fecha DATE NOT NULL,
          horario VARCHAR(10) NOT NULL,
          servicios JSONB NOT NULL,
          productos JSONB DEFAULT '[]',
          total DECIMAL(10, 2) NOT NULL,
          estado VARCHAR(50) DEFAULT 'pendiente',
          notas TEXT,
          fisioterapeuta VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          codigo_afiliado VARCHAR(50),
          descuento_afiliado DECIMAL(10, 2) DEFAULT 0,
          descuento_individual DECIMAL(10, 2) DEFAULT 0,
          descuento_promocion DECIMAL(10, 2) DEFAULT 0
        );
      `;
      
      console.log('📇 Creando índices...');
      
      await sql`CREATE INDEX idx_fecha_horario ON public.reservas(fecha, horario);`;
      await sql`CREATE INDEX idx_estado ON public.reservas(estado);`;
      await sql`CREATE INDEX idx_reservation_id ON public.reservas(reservation_id);`;
      
      console.log('✅ Tabla e índices creados exitosamente');
    } else {
      console.log('✅ La tabla ya existe');
    }
    
    // Listar todas las tablas en el schema public
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\n📋 Tablas en schema public:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndCreateTable();

