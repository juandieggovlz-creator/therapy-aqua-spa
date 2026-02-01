import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODOS los servicios originales del sistema
const serviciosCompletos = [
  { 
    id: 'columna', 
    nombre: 'THERAPY LESIONES DE COLUMNA', 
    duracion: 30, 
    precio: 100000, 
    icon: '🦴',
    categoria: 'Tratamientos de Lesiones',
    descripcion: 'Terapia especializada para lesiones de columna vertebral',
    imagen: '/image/1738359696843_columna.jpg',
    orden: 1
  },
  { 
    id: 'brazos', 
    nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', 
    duracion: 30, 
    precio: 180000, 
    icon: '💪',
    categoria: 'Tratamientos de Lesiones',
    descripcion: 'Terapia para lesiones musculares en brazos',
    imagen: '/image/brazos.jpg',
    orden: 2
  },
  { 
    id: 'piernas', 
    nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', 
    duracion: 30, 
    precio: 180000, 
    icon: '🦵',
    categoria: 'Tratamientos de Lesiones',
    descripcion: 'Terapia para lesiones musculares en piernas',
    imagen: '/image/piernas.jpg',
    orden: 3
  },
  { 
    id: 'hombro', 
    nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', 
    duracion: 30, 
    precio: 250000, 
    icon: '🤕',
    categoria: 'Tratamientos de Trauma',
    descripcion: 'Terapia especializada para traumas en hombro, codo y muñeca',
    imagen: '/image/hombro.jpg',
    orden: 4
  },
  { 
    id: 'cadera', 
    nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', 
    duracion: 30, 
    precio: 250000, 
    icon: '🦿',
    categoria: 'Tratamientos de Trauma',
    descripcion: 'Terapia especializada para traumas en cadera, rodilla y tobillo',
    imagen: '/image/cadera.jpg',
    orden: 5
  },
  { 
    id: 'skincare-mano', 
    nombre: 'SKINCARE MANO THERAPY', 
    duracion: 30, 
    precio: 90000, 
    icon: '🤲',
    categoria: 'Tratamientos de Bienestar',
    descripcion: 'Cuidado especializado para la piel de las manos',
    imagen: '/image/1738359802515_manos.jpg',
    orden: 6
  },
  { 
    id: 'preso-ocular', 
    nombre: 'PRESO THERAPY OCULAR', 
    duracion: 30, 
    precio: 80000, 
    icon: '👁️',
    categoria: 'Tratamientos de Bienestar',
    descripcion: 'Terapia de presión para relajación ocular',
    imagen: '/image/1738359720119_ocular.jpg',
    orden: 7
  },
  { 
    id: 'bienestar-general', 
    nombre: 'MASAJE BIENESTAR GENERAL', 
    duracion: 45, 
    precio: 140000, 
    icon: '🌿',
    categoria: 'Masajes de Bienestar',
    descripcion: 'Masaje relajante de cuerpo completo para bienestar general',
    imagen: '/image/1738359665078_bienestar.jpg',
    orden: 8
  },
  { 
    id: 'cuello', 
    nombre: 'MASAJE DE CUELLO', 
    duracion: 30, 
    precio: 90000, 
    icon: '💆',
    categoria: 'Masajes Focalizados',
    descripcion: 'Masaje terapéutico enfocado en la zona del cuello',
    imagen: '/image/cuello.jpg',
    orden: 9
  },
  { 
    id: 'facial', 
    nombre: 'MASAJE FACIAL', 
    duracion: 30, 
    precio: 90000, 
    icon: '✨',
    categoria: 'Tratamientos de Bienestar',
    descripcion: 'Masaje facial relajante y rejuvenecedor',
    imagen: '/image/1738359798326_facial.jpg',
    orden: 10
  },
  { 
    id: 'espalda', 
    nombre: 'MASAJE DE ESPALDA', 
    duracion: 30, 
    precio: 120000, 
    icon: '🧘',
    categoria: 'Masajes Focalizados',
    descripcion: 'Masaje terapéutico de espalda completa',
    imagen: '/image/espalda.jpg',
    orden: 11
  },
  { 
    id: 'hombros', 
    nombre: 'MASAJE HOMBROS Y BRAZOS', 
    duracion: 30, 
    precio: 100000, 
    icon: '💆',
    categoria: 'Masajes Focalizados',
    descripcion: 'Masaje enfocado en hombros y brazos',
    imagen: '/image/hombros.jpg',
    orden: 12
  },
  { 
    id: 'rodillas', 
    nombre: 'MASAJE CADERAS Y RODILLAS', 
    duracion: 30, 
    precio: 120000, 
    icon: '🦴',
    categoria: 'Masajes Focalizados',
    descripcion: 'Masaje terapéutico de caderas y rodillas',
    imagen: '/image/rodillas.jpg',
    orden: 13
  },
  { 
    id: 'pies', 
    nombre: 'MASAJE PANTORRILLAS Y PIES', 
    duracion: 30, 
    precio: 120000, 
    icon: '🦶',
    categoria: 'Masajes Focalizados',
    descripcion: 'Masaje relajante de pantorrillas y pies',
    imagen: '/image/pies.jpg',
    orden: 14
  },
  { 
    id: 'deportivo', 
    nombre: 'MASAJE THERAPY DEPORTIVO', 
    duracion: 40, 
    precio: 100000, 
    icon: '🏃',
    categoria: 'Masajes Terapéuticos',
    descripcion: 'Masaje deportivo para atletas y personas activas',
    imagen: '/image/1738359632779_deportivo.jpg',
    orden: 15
  },
];

async function migrarServiciosCompletos() {
  try {
    console.log('🔄 Iniciando migración de TODOS los servicios...\n');

    // 1. Eliminar todos los servicios existentes
    console.log('🗑️  Limpiando servicios anteriores...');
    await prisma.$executeRaw`DELETE FROM servicios`;
    console.log('✅ Servicios anteriores eliminados\n');

    // 2. Insertar todos los servicios
    console.log('📝 Insertando 15 servicios completos...\n');
    
    for (const s of serviciosCompletos) {
      await prisma.$executeRaw`
        INSERT INTO servicios (
          servicio_id, nombre, descripcion, categoria, precio, duracion, 
          icon, imagen, activo, orden, created_at, updated_at
        )
        VALUES (
          ${s.id}, 
          ${s.nombre}, 
          ${s.descripcion}, 
          ${s.categoria},
          ${s.precio}, 
          ${s.duracion}, 
          ${s.icon}, 
          ${s.imagen}, 
          true, 
          ${s.orden},
          NOW(), 
          NOW()
        )
      `;
      console.log(`✅ ${s.orden}. ${s.nombre} - $${s.precio.toLocaleString()}`);
    }

    // 3. Verificar inserción
    console.log('\n🔍 Verificando servicios en la base de datos...\n');
    const serviciosVerificados: any[] = await prisma.$queryRaw`
      SELECT servicio_id, nombre, precio, duracion, categoria
      FROM servicios 
      ORDER BY orden ASC
    `;

    console.log(`\n✅ MIGRACIÓN COMPLETADA: ${serviciosVerificados.length} servicios en la base de datos\n`);
    
    serviciosVerificados.forEach((s, i) => {
      console.log(`${i + 1}. ${s.nombre}`);
      console.log(`   💵 $${Number(s.precio).toLocaleString()} | ⏱️ ${s.duracion} min | 📁 ${s.categoria}`);
    });

    console.log('\n🎉 ¡Todos los servicios han sido migrados correctamente!');
    
  } catch (error: any) {
    console.error('❌ Error en la migración:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrarServiciosCompletos();

