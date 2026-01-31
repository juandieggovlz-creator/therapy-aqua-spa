import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarServicios() {
  try {
    console.log('🔍 Verificando servicios en la base de datos...\n');
    
    const servicios: any[] = await prisma.$queryRaw`
      SELECT servicio_id, nombre, precio, duracion, activo, imagen
      FROM servicios
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Total de servicios en BD: ${servicios.length}\n`);
    
    if (servicios.length === 0) {
      console.log('⚠️  NO HAY SERVICIOS EN LA BASE DE DATOS');
      console.log('📝 Necesitas agregar servicios desde el panel admin\n');
    } else {
      console.log('✅ Servicios encontrados:\n');
      servicios.forEach((s, idx) => {
        console.log(`${idx + 1}. ${s.nombre}`);
        console.log(`   ID: ${s.servicio_id}`);
        console.log(`   Precio: $${Number(s.precio).toLocaleString()}`);
        console.log(`   Duración: ${s.duracion} min`);
        console.log(`   Activo: ${s.activo ? '✅' : '❌'}`);
        console.log(`   Imagen: ${s.imagen || '(sin imagen)'}`);
        console.log('');
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verificarServicios();

