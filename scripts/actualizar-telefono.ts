import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📱 Actualizando número de teléfono...');

  // Actualizar en la tabla configuracion
  await prisma.configuracion.updateMany({
    where: { clave: 'telefono_contacto' },
    data: { valor: '+57 301 4185239' },
  });

  console.log('✅ Número de teléfono actualizado en la base de datos');
  console.log('   Nuevo número: +57 301 4185239');
  console.log('   Link WhatsApp: https://wa.me/573014185239');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

