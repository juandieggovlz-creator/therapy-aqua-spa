import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serviciosEjemplo = [
  {
    servicio_id: 'masaje-relajante',
    nombre: 'Masaje Relajante',
    descripcion: 'Masaje terapéutico diseñado para liberar tensión muscular y promover la relajación profunda',
    categoria: 'Tratamientos de Bienestar',
    precio: 80000,
    duracion: 60,
    icon: '💆',
    imagen: '',
    activo: true,
    orden: 1,
    detalles: JSON.stringify([
      'Masaje de cuerpo completo',
      'Aceites esenciales aromáticos',
      'Música relajante',
      'Ambiente tranquilo',
      'Duración: 60 minutos'
    ])
  },
  {
    servicio_id: 'terapia-columna',
    nombre: 'Terapia de Columna',
    descripcion: 'Tratamiento especializado para aliviar el dolor de espalda y corregir posturas',
    categoria: 'Terapias de Rehabilitación',
    precio: 100000,
    duracion: 45,
    icon: '🦴',
    imagen: '',
    activo: true,
    orden: 2,
    detalles: JSON.stringify([
      'Evaluación postural',
      'Manipulación vertebral',
      'Ejercicios correctivos',
      'Recomendaciones personalizadas',
      'Duración: 45 minutos'
    ])
  },
  {
    servicio_id: 'reflexologia',
    nombre: 'Reflexología Podal',
    descripcion: 'Técnica de masaje en puntos específicos de los pies para estimular órganos y sistemas del cuerpo',
    categoria: 'Tratamientos de Bienestar',
    precio: 70000,
    duracion: 40,
    icon: '🦶',
    imagen: '',
    activo: true,
    orden: 3,
    detalles: JSON.stringify([
      'Masaje de puntos reflejos',
      'Estimulación del sistema nervioso',
      'Mejora la circulación',
      'Reduce el estrés',
      'Duración: 40 minutos'
    ])
  },
  {
    servicio_id: 'terapia-deportiva',
    nombre: 'Terapia Deportiva',
    descripcion: 'Tratamiento especializado para atletas y personas activas',
    categoria: 'Terapias de Rehabilitación',
    precio: 90000,
    duracion: 50,
    icon: '🏃',
    imagen: '',
    activo: true,
    orden: 4,
    detalles: JSON.stringify([
      'Evaluación física',
      'Masaje profundo',
      'Estiramientos asistidos',
      'Prevención de lesiones',
      'Duración: 50 minutos'
    ])
  },
  {
    servicio_id: 'facial-especializado',
    nombre: 'Tratamiento Facial Especializado',
    descripcion: 'Limpieza profunda y rejuvenecimiento facial con productos naturales',
    categoria: 'Cuidado Facial y Especializado',
    precio: 85000,
    duracion: 60,
    icon: '✨',
    imagen: '',
    activo: true,
    orden: 5,
    detalles: JSON.stringify([
      'Limpieza profunda',
      'Exfoliación suave',
      'Mascarilla nutritiva',
      'Masaje facial',
      'Hidratación profunda'
    ])
  },
  {
    servicio_id: 'drenaje-linfatico',
    nombre: 'Drenaje Linfático',
    descripcion: 'Técnica terapéutica para eliminar toxinas y reducir retención de líquidos',
    categoria: 'Tratamientos de Bienestar',
    precio: 95000,
    duracion: 55,
    icon: '💫',
    imagen: '',
    activo: true,
    orden: 6,
    detalles: JSON.stringify([
      'Masaje especializado',
      'Eliminación de toxinas',
      'Reduce hinchazón',
      'Mejora circulación linfática',
      'Duración: 55 minutos'
    ])
  }
];

async function poblarServicios() {
  try {
    console.log('🌱 Poblando base de datos con servicios de ejemplo...\n');

    for (const servicio of serviciosEjemplo) {
      try {
        // Verificar si ya existe
        const existe: any[] = await prisma.$queryRaw`
          SELECT servicio_id FROM servicios WHERE servicio_id = ${servicio.servicio_id}
        `;

        if (existe.length > 0) {
          console.log(`⚠️  Servicio "${servicio.nombre}" ya existe, omitiendo...`);
          continue;
        }

        // Insertar el servicio
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
            ${servicio.detalles}::jsonb,
            NOW(),
            NOW()
          )
        `;

        console.log(`✅ Servicio creado: ${servicio.nombre} - $${servicio.precio.toLocaleString()}`);
      } catch (error: any) {
        console.error(`❌ Error creando "${servicio.nombre}":`, error.message);
      }
    }

    console.log('\n🎉 Proceso completado!');
    console.log('\n📊 Verificando servicios creados...\n');

    const servicios: any[] = await prisma.$queryRaw`
      SELECT servicio_id, nombre, precio, activo
      FROM servicios
      ORDER BY orden ASC
    `;

    console.log(`Total de servicios en la base de datos: ${servicios.length}\n`);
    servicios.forEach((s, i) => {
      console.log(`${i + 1}. ${s.nombre} - $${Number(s.precio).toLocaleString()} (${s.activo ? 'Activo' : 'Inactivo'})`);
    });

    console.log('\n✨ ¡Puedes ver los servicios en el panel admin!');
    console.log('📍 http://localhost:3000/login/afiliados/admin\n');

  } catch (error: any) {
    console.error('\n❌ Error poblando servicios:', error);
    console.error('Detalles:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

poblarServicios();

