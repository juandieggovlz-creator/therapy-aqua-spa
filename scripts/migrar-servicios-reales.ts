import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Servicios ORIGINALES del código (app/page.tsx línea 28-137)
const serviciosOriginales = [
  {
    servicio_id: 'columna',
    nombre: 'THERAPY LESIONES DE COLUMNA',
    descripcion: 'Tratamiento especializado para dolor lumbar, cervical y dorsalgia. Recupera tu movilidad y alivia el dolor crónico.',
    categoria: 'Terapias de Rehabilitación',
    precio: 100000,
    duracion: 30,
    icon: '🦴',
    imagen: '/image/therapy%20lesiones%20de%20columna%202.jpg',
    activo: true,
    orden: 1,
    detalles: [
      'Evaluación postural completa',
      'Terapia manual especializada',
      'Ejercicios de fortalecimiento',
      'Técnicas de alivio del dolor',
      'Plan de seguimiento personalizado'
    ]
  },
  {
    servicio_id: 'bienestar-general',
    nombre: 'MASAJE BIENESTAR GENERAL',
    descripcion: 'Masaje corporal completo que combina técnicas de relajación profunda para reducir estrés y tensión muscular.',
    categoria: 'Tratamientos de Bienestar',
    precio: 140000,
    duracion: 45,
    icon: '🌿',
    imagen: '/image/masaje%20general.jfif',
    activo: true,
    orden: 2,
    detalles: [
      'Masaje corporal completo',
      'Aromaterapia relajante',
      'Música terapéutica',
      'Técnicas de relajación profunda',
      'Mejora de circulación sanguínea'
    ]
  },
  {
    servicio_id: 'deportivo',
    nombre: 'MASAJE THERAPY DEPORTIVO',
    descripcion: 'Ideal para atletas y personas activas. Previene lesiones y mejora el rendimiento físico.',
    categoria: 'Terapias de Rehabilitación',
    precio: 100000,
    duracion: 40,
    icon: '🏃',
    imagen: '/image/masaje%20deportivo.jpg',
    activo: true,
    orden: 3,
    detalles: [
      'Preparación pre-competencia',
      'Recuperación post-entrenamiento',
      'Liberación de tensión muscular',
      'Mejora de flexibilidad',
      'Prevención de lesiones deportivas'
    ]
  },
  {
    servicio_id: 'preso-ocular',
    nombre: 'PRESO THERAPY OCULAR',
    descripcion: 'Tratamiento innovador para ojos cansados, ojeras y tensión ocular. Refresca y revitaliza tu mirada.',
    categoria: 'Cuidado Facial y Especializado',
    precio: 80000,
    duracion: 30,
    icon: '👁️',
    imagen: '/image/therapy%20ocular.jpg',
    activo: true,
    orden: 4,
    detalles: [
      'Masaje de contorno de ojos',
      'Reducción de ojeras',
      'Desinflamación de párpados',
      'Alivio de tensión ocular',
      'Efecto lifting natural'
    ]
  },
  {
    servicio_id: 'skincare-mano',
    nombre: 'SKINCARE MANO THERAPY',
    descripcion: 'Rejuvenecimiento de manos con exfoliación, hidratación profunda y masaje especializado.',
    categoria: 'Cuidado Facial y Especializado',
    precio: 90000,
    duracion: 30,
    icon: '🤲',
    imagen: '/image/skincare%20mano.jpg',
    activo: true,
    orden: 5,
    detalles: [
      'Exfoliación suave',
      'Masaje de manos y antebrazos',
      'Hidratación profunda',
      'Tratamiento anti-edad',
      'Nutrición de uñas y cutículas'
    ]
  },
  {
    servicio_id: 'facial',
    nombre: 'MASAJE FACIAL',
    descripcion: 'Masaje facial con técnicas lifting que mejoran la circulación y tonifican los músculos faciales.',
    categoria: 'Cuidado Facial y Especializado',
    precio: 90000,
    duracion: 30,
    icon: '✨',
    imagen: '/image/masaje%20facial.jpg',
    activo: true,
    orden: 6,
    detalles: [
      'Limpieza facial profunda',
      'Masaje linfático facial',
      'Técnicas de lifting natural',
      'Hidratación intensiva',
      'Rejuvenecimiento de la piel'
    ]
  }
];

async function migrarServiciosReales() {
  try {
    console.log('🔥 ELIMINANDO servicios inventados...\n');

    // Eliminar TODOS los servicios actuales
    await prisma.$executeRaw`TRUNCATE TABLE servicios CASCADE`;
    console.log('✅ Servicios inventados eliminados\n');

    console.log('🌱 MIGRANDO servicios ORIGINALES del código...\n');

    for (const servicio of serviciosOriginales) {
      try {
        await prisma.$executeRaw`
          INSERT INTO servicios (
            servicio_id, nombre, descripcion, categoria, precio, duracion, 
            icon, imagen, activo, orden, detalles, created_at, updated_at
          )
          VALUES (
            ${servicio.servicio_id},
            ${servicio.nombre},
            ${servicio.descripcion},
            ${servicio.categoria},
            ${servicio.precio},
            ${servicio.duracion},
            ${servicio.icon},
            ${servicio.imagen},
            ${servicio.activo},
            ${servicio.orden},
            ${JSON.stringify(servicio.detalles)}::jsonb,
            NOW(),
            NOW()
          )
        `;

        console.log(`✅ ${servicio.nombre} - $${servicio.precio.toLocaleString()} (${servicio.duracion} min)`);
      } catch (error: any) {
        console.error(`❌ Error con "${servicio.nombre}":`, error.message);
      }
    }

    console.log('\n🎉 Migración completada!');
    console.log('\n📊 Verificando servicios REALES en la base de datos...\n');

    const servicios: any[] = await prisma.$queryRaw`
      SELECT servicio_id, nombre, precio, duracion, activo
      FROM servicios
      ORDER BY orden ASC
    `;

    console.log(`Total de servicios: ${servicios.length}\n`);
    servicios.forEach((s, i) => {
      console.log(`${i + 1}. ${s.nombre}`);
      console.log(`   💵 $${Number(s.precio).toLocaleString()} | ⏱️ ${s.duracion} min | ${s.activo ? '✅ Activo' : '❌ Inactivo'}\n`);
    });

    console.log('✨ Los servicios ORIGINALES están ahora en la base de datos');
    console.log('🔗 Visibles en: http://localhost:3000');
    console.log('🔗 Panel Admin: http://localhost:3000/login/afiliados/admin\n');

  } catch (error: any) {
    console.error('\n❌ Error en migración:', error);
    console.error('Detalles:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrarServiciosReales();

