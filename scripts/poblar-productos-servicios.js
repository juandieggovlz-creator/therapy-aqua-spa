const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function poblarDatos() {
  try {
    console.log('🔄 POBLANDO PRODUCTOS Y SERVICIOS ADICIONALES\n');
    
    // 1. Verificar si ya existen datos
    const productosExistentes = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM productos
    `);
    
    const serviciosExistentes = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM servicios_adicionales
    `);
    
    console.log(`📊 Estado actual:`);
    console.log(`   Productos: ${productosExistentes[0].count}`);
    console.log(`   Servicios Adicionales: ${serviciosExistentes[0].count}\n`);
    
    // 2. Insertar Servicios Adicionales
    console.log('💆 Insertando Servicios Adicionales...');
    
    const serviciosAdicionales = [
      {
        id: 'servad_jacuzzi',
        nombre: 'Jacuzzi',
        descripcion: 'Sesión de jacuzzi con hidromasaje',
        precioParticular: 29900,
        precioAfiliado: 13000,
        icon: '🛁'
      },
      {
        id: 'servad_turco',
        nombre: 'Baño Turco',
        descripcion: 'Sesión de baño turco con vapor',
        precioParticular: 29900,
        precioAfiliado: 13000,
        icon: '💨'
      },
      {
        id: 'servad_sauna',
        nombre: 'Sauna',
        descripcion: 'Sesión de sauna seca',
        precioParticular: 29900,
        precioAfiliado: 13000,
        icon: '🔥'
      }
    ];
    
    for (const servicio of serviciosAdicionales) {
      // Verificar si ya existe
      const existe = await prisma.$queryRawUnsafe(`
        SELECT servicio_id FROM servicios_adicionales WHERE servicio_id = '${servicio.id}'
      `);
      
      if (existe.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO servicios_adicionales (servicio_id, nombre, descripcion, precio_particular, precio_afiliado, icon, activo, orden, created_at, updated_at)
          VALUES (
            ${servicio.id},
            ${servicio.nombre},
            ${servicio.descripcion},
            ${servicio.precioParticular},
            ${servicio.precioAfiliado},
            ${servicio.icon},
            true,
            0,
            NOW(),
            NOW()
          )
        `;
        console.log(`   ✅ ${servicio.nombre} - Particular: $${servicio.precioParticular.toLocaleString()} | Afiliado: $${servicio.precioAfiliado.toLocaleString()}`);
      } else {
        console.log(`   ⏭️  ${servicio.nombre} (ya existe)`);
      }
    }
    
    console.log('');
    
    // 3. Insertar Productos
    console.log('📦 Insertando Productos...');
    
    const productos = [
      {
        id: 'prod_ropa_interior',
        nombre: 'Kit ropa interior desechable',
        descripcion: 'Kit completo de ropa interior desechable',
        precio: 8000,
        icon: '👕'
      },
      {
        id: 'prod_candado',
        nombre: 'Candado para locker',
        descripcion: 'Candado de seguridad para guardar pertenencias',
        precio: 15000,
        icon: '🔒'
      }
    ];
    
    for (const producto of productos) {
      // Verificar si ya existe
      const existe = await prisma.$queryRawUnsafe(`
        SELECT producto_id FROM productos WHERE producto_id = '${producto.id}'
      `);
      
      if (existe.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO productos (producto_id, nombre, descripcion, precio, icon, activo, orden, created_at, updated_at)
          VALUES (
            ${producto.id},
            ${producto.nombre},
            ${producto.descripcion},
            ${producto.precio},
            ${producto.icon},
            true,
            0,
            NOW(),
            NOW()
          )
        `;
        console.log(`   ✅ ${producto.nombre} - $${producto.precio.toLocaleString()}`);
      } else {
        console.log(`   ⏭️  ${producto.nombre} (ya existe)`);
      }
    }
    
    console.log('');
    
    // 4. Verificar final
    const productosFinales = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM productos WHERE activo = true
    `);
    
    const serviciosFinales = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM servicios_adicionales WHERE activo = true
    `);
    
    console.log('📊 Resultado final:');
    console.log(`   ✅ Productos activos: ${productosFinales[0].count}`);
    console.log(`   ✅ Servicios Adicionales activos: ${serviciosFinales[0].count}`);
    console.log('');
    console.log('✅ DATOS POBLADOS EXITOSAMENTE!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

poblarDatos();

