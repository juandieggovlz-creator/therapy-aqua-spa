// Script para actualizar precios de servicios adicionales de 13600 a 13000
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function actualizarPrecios() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ Error: POSTGRES_URL no está configurada en .env.local');
    process.exit(1);
  }
  
  const sql = neon(process.env.POSTGRES_URL);
  
  try {
    console.log('🔄 Obteniendo todas las reservas...');
    
    // Obtener todas las reservas
    const reservas = await sql`SELECT * FROM public.reservas`;
    console.log(`📊 Total de reservas encontradas: ${reservas.length}`);
    
    let actualizadas = 0;
    
    for (const reserva of reservas) {
      if (!reserva.servicios) continue;
      
      let servicios = reserva.servicios;
      let cambio = false;
      
      // Si serviciosAdicionales existe y tiene elementos
      if (servicios.serviciosAdicionales && Array.isArray(servicios.serviciosAdicionales)) {
        servicios.serviciosAdicionales = servicios.serviciosAdicionales.map(servicio => {
          if (typeof servicio === 'object' && servicio !== null) {
            // Actualizar precioAfiliado de 13600 a 13000
            if (servicio.precioAfiliado === 13600) {
              servicio.precioAfiliado = 13000;
              cambio = true;
            }
            // Actualizar precioAplicado de 13600 a 13000
            if (servicio.precioAplicado === 13600) {
              servicio.precioAplicado = 13000;
              cambio = true;
            }
          }
          return servicio;
        });
      }
      
      if (cambio) {
        // Actualizar la reserva
        await sql`
          UPDATE public.reservas 
          SET servicios = ${JSON.stringify(servicios)}
          WHERE reservation_id = ${reserva.reservation_id}
        `;
        actualizadas++;
        console.log(`✅ Actualizada reserva ${reserva.reservation_id}`);
      }
    }
    
    console.log(`\n✅ Proceso completado: ${actualizadas} reservas actualizadas`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

actualizarPrecios();

