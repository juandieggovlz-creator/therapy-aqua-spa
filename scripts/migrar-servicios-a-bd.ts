/**
 * Script para migrar los servicios hardcodeados a la base de datos
 * Ejecutar: npx tsx scripts/migrar-servicios-a-bd.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serviciosBase = [
  {
    servicio_id: "columna",
    nombre: "THERAPY LESIONES DE COLUMNA",
    descripcion: "Tratamiento especializado para dolor lumbar, cervical y dorsalgia. Recupera tu movilidad y alivia el dolor crónico.",
    categoria: "Terapia Física",
    precio: 100000,
    duracion: 30,
    icon: "🦴",
    imagen: "/image/therapy%20lesiones%20de%20columna%202.jpg",
    activo: true,
    orden: 1,
    detalles: [
      "Evaluación postural completa",
      "Terapia manual especializada",
      "Ejercicios de fortalecimiento",
      "Técnicas de alivio del dolor",
      "Plan de seguimiento personalizado"
    ]
  },
  {
    servicio_id: "bienestar-general",
    nombre: "MASAJE BIENESTAR GENERAL",
    descripcion: "Masaje corporal completo que combina técnicas de relajación profunda para reducir estrés y tensión muscular.",
    categoria: "Masajes",
    precio: 140000,
    duracion: 45,
    icon: "🌿",
    imagen: "/image/masaje%20general.jfif",
    activo: true,
    orden: 2,
    detalles: [
      "Masaje corporal completo",
      "Aromaterapia relajante",
      "Música terapéutica",
      "Técnicas de relajación profunda",
      "Mejora de circulación sanguínea"
    ]
  },
  {
    servicio_id: "deportivo",
    nombre: "MASAJE THERAPY DEPORTIVO",
    descripcion: "Ideal para atletas y personas activas. Previene lesiones y mejora el rendimiento físico.",
    categoria: "Masajes",
    precio: 100000,
    duracion: 40,
    icon: "🏃",
    imagen: "/image/masaje%20deportivo.jpg",
    activo: true,
    orden: 3,
    detalles: [
      "Preparación pre-competencia",
      "Recuperación post-entrenamiento",
      "Liberación de tensión muscular",
      "Mejora de flexibilidad",
      "Prevención de lesiones deportivas"
    ]
  },
  {
    servicio_id: "preso-ocular",
    nombre: "PRESO THERAPY OCULAR",
    descripcion: "Tratamiento innovador para ojos cansados, ojeras y tensión ocular. Refresca y revitaliza tu mirada.",
    categoria: "Tratamientos Faciales",
    precio: 80000,
    duracion: 30,
    icon: "👁️",
    imagen: "/image/therapy%20ocular.jpg",
    activo: true,
    orden: 4,
    detalles: [
      "Masaje de contorno de ojos",
      "Reducción de ojeras",
      "Desinflamación de párpados",
      "Alivio de tensión ocular",
      "Efecto lifting natural"
    ]
  },
  {
    servicio_id: "skincare-mano",
    nombre: "SKINCARE MANO THERAPY",
    descripcion: "Rejuvenecimiento de manos con exfoliación, hidratación profunda y masaje especializado.",
    categoria: "Cuidado de Piel",
    precio: 90000,
    duracion: 30,
    icon: "🤲",
    imagen: "/image/skincare%20mano.jpg",
    activo: true,
    orden: 5,
    detalles: [
      "Exfoliación suave",
      "Masaje de manos y antebrazos",
      "Hidratación profunda",
      "Tratamiento anti-edad",
      "Nutrición de uñas y cutículas"
    ]
  },
  {
    servicio_id: "facial",
    nombre: "MASAJE FACIAL",
    descripcion: "Masaje facial con técnicas lifting que mejoran la circulación y tonifican los músculos faciales.",
    categoria: "Tratamientos Faciales",
    precio: 90000,
    duracion: 30,
    icon: "✨",
    imagen: "/image/masaje%20facial.jpg",
    activo: true,
    orden: 6,
    detalles: [
      "Limpieza facial profunda",
      "Masaje linfático facial",
      "Técnicas de lifting natural",
      "Hidratación intensiva",
      "Rejuvenecimiento de la piel"
    ]
  }
];

async function migrarServicios() {
  try {
    console.log('🚀 Iniciando migración de servicios a la base de datos...\n');
    
    // Verificar si ya existen servicios
    const serviciosExistentes: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM servicios
    `;
    
    const count = Number(serviciosExistentes[0].count);
    
    if (count > 0) {
      console.log(`⚠️  Ya existen ${count} servicios en la base de datos.`);
      console.log('❓ ¿Deseas continuar? Esto agregará los servicios que no existan.\n');
    }
    
    let insertados = 0;
    let omitidos = 0;
    
    for (const servicio of serviciosBase) {
      try {
        // Verificar si el servicio ya existe
        const existe: any[] = await prisma.$queryRaw`
          SELECT servicio_id FROM servicios WHERE servicio_id = ${servicio.servicio_id}
        `;
        
        if (existe.length > 0) {
          console.log(`⏭️  Omitiendo "${servicio.nombre}" (ya existe)`);
          omitidos++;
          continue;
        }
        
        // Insertar servicio
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
        
        console.log(`✅ Insertado: "${servicio.nombre}"`);
        insertados++;
      } catch (error: any) {
        console.error(`❌ Error insertando "${servicio.nombre}":`, error.message);
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Insertados: ${insertados}`);
    console.log(`   ⏭️  Omitidos: ${omitidos}`);
    console.log(`   📦 Total: ${serviciosBase.length}`);
    
    // Mostrar servicios finales
    const serviciosFinales: any[] = await prisma.$queryRaw`
      SELECT servicio_id, nombre, precio, activo
      FROM servicios
      ORDER BY orden ASC
    `;
    
    console.log(`\n✅ Servicios en la base de datos (${serviciosFinales.length}):\n`);
    serviciosFinales.forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.nombre} - $${Number(s.precio).toLocaleString()} ${s.activo ? '✅' : '❌'}`);
    });
    
    await prisma.$disconnect();
    console.log('\n🎉 Migración completada exitosamente!');
  } catch (error) {
    console.error('\n❌ Error en la migración:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

migrarServicios();

