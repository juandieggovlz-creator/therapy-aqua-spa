import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // ============================================
  // SERVICIOS (Terapias)
  // ============================================
  console.log('📋 Creando servicios...');
  
  const servicios = [
    { servicio_id: 'columna', nombre: 'THERAPY LESIONES DE COLUMNA', categoria: 'Terapias de Rehabilitación', duracion: 30, precio: 100000, icon: '🦴', orden: 1, detalles: ['Evaluación postural completa', 'Terapia manual especializada', 'Ejercicios de fortalecimiento', 'Técnicas de alivio del dolor', 'Plan de seguimiento personalizado'] },
    { servicio_id: 'brazos', nombre: 'THERAPY LESIONES MUSCULARES BRAZOS', categoria: 'Terapias de Rehabilitación', duracion: 30, precio: 60000, icon: '💪', orden: 2, detalles: ['Masaje profundo de tejidos', 'Liberación miofascial', 'Estiramientos terapéuticos', 'Fortalecimiento muscular', 'Reducción de tensión'] },
    { servicio_id: 'piernas', nombre: 'THERAPY LESIONES MUSCULARES PIERNAS', categoria: 'Terapias de Rehabilitación', duracion: 30, precio: 60000, icon: '🦵', orden: 3, detalles: ['Terapia de tejidos blandos', 'Movilización articular', 'Ejercicios de rehabilitación', 'Mejora de flexibilidad', 'Prevención de lesiones'] },
    { servicio_id: 'hombro', nombre: 'THERAPY TRAUMA HOMBRO, CODO, MUÑECA', categoria: 'Terapias de Rehabilitación', duracion: 30, precio: 250000, icon: '🤝', orden: 4, detalles: ['Evaluación de movilidad', 'Terapia manual especializada', 'Ejercicios de fortalecimiento', 'Técnicas de liberación', 'Recuperación funcional'] },
    { servicio_id: 'cadera', nombre: 'THERAPY TRAUMA CADERA, RODILLA, TOBILLO', categoria: 'Terapias de Rehabilitación', duracion: 30, precio: 250000, icon: '🦿', orden: 5, detalles: ['Análisis biomecánico', 'Terapia manual', 'Fortalecimiento muscular', 'Mejora de movilidad', 'Prevención de lesiones'] },
    { servicio_id: 'mano', nombre: 'SKINCARE MANO THERAPY', categoria: 'Cuidado Especializado', duracion: 30, precio: 90000, icon: '🤲', orden: 6, detalles: ['Hidratación profunda', 'Masaje terapéutico', 'Exfoliación suave', 'Nutrición de cutículas', 'Tratamiento antienvejecimiento'] },
    { servicio_id: 'ocular', nombre: 'PRESO THERAPY OCULAR', categoria: 'Cuidado Especializado', duracion: 30, precio: 80000, icon: '👁️', orden: 7, detalles: ['Reducción de fatiga ocular', 'Mejora de circulación', 'Relajación profunda', 'Reducción de ojeras', 'Efecto revitalizante'] },
    { servicio_id: 'bienestar', nombre: 'MASAJE BIENESTAR GENERAL', categoria: 'Masajes', duracion: 45, precio: 140000, icon: '🌿', orden: 8, detalles: ['Masaje corporal completo', 'Aromaterapia relajante', 'Música terapéutica', 'Técnicas de relajación profunda', 'Mejora de circulación sanguínea'] },
    { servicio_id: 'facial', nombre: 'MASAJE FACIAL', categoria: 'Masajes', duracion: 30, precio: 90000, icon: '✨', orden: 9, detalles: ['Limpieza profunda', 'Tonificación facial', 'Masaje linfático', 'Hidratación intensiva', 'Efecto lifting natural'] },
    { servicio_id: 'espalda', nombre: 'MASAJE DE ESPALDA', categoria: 'Masajes', duracion: 30, precio: 120000, icon: '🧘', orden: 10, detalles: ['Liberación de tensión', 'Masaje profundo', 'Técnicas de relajación', 'Mejora de postura', 'Alivio de dolor'] },
    { servicio_id: 'hombros', nombre: 'MASAJE HOMBROS Y BRAZOS', categoria: 'Masajes', duracion: 30, precio: 100000, icon: '💆', orden: 11, detalles: ['Liberación de tensión', 'Masaje profundo', 'Estiramientos', 'Mejora de movilidad', 'Relajación muscular'] },
    { servicio_id: 'rodillas', nombre: 'MASAJE CADERAS Y RODILLAS', categoria: 'Masajes', duracion: 30, precio: 120000, icon: '🦴', orden: 12, detalles: ['Mejora de movilidad', 'Reducción de dolor', 'Fortalecimiento', 'Flexibilidad', 'Relajación'] },
    { servicio_id: 'pies', nombre: 'MASAJE PANTORRILLAS Y PIES', categoria: 'Masajes', duracion: 30, precio: 120000, icon: '🦶', orden: 13, detalles: ['Reflexología', 'Mejora de circulación', 'Relajación profunda', 'Reducción de hinchazón', 'Revitalización'] },
    { servicio_id: 'deportivo', nombre: 'MASAJE THERAPY DEPORTIVO', categoria: 'Masajes', duracion: 40, precio: 100000, icon: '🏃', orden: 14, detalles: ['Preparación pre-competencia', 'Recuperación post-entrenamiento', 'Liberación de tensión muscular', 'Mejora de flexibilidad', 'Prevención de lesiones deportivas'] },
  ];

  for (const servicio of servicios) {
    await prisma.servicio.upsert({
      where: { servicio_id: servicio.servicio_id },
      update: servicio,
      create: servicio,
    });
  }

  console.log(`✅ ${servicios.length} servicios creados`);

  // ============================================
  // SERVICIOS ADICIONALES
  // ============================================
  console.log('✨ Creando servicios adicionales...');
  
  const serviciosAdicionales = [
    { servicio_id: 'sauna', nombre: 'Sauna', precio_particular: 29900, precio_afiliado: 13000, icon: '🔥', orden: 1, descripcion: 'Experimenta el calor terapéutico del sauna tradicional' },
    { servicio_id: 'jacuzzi', nombre: 'Jacuzzi', precio_particular: 29900, precio_afiliado: 13000, icon: '🛁', orden: 2, descripcion: 'Relájate en nuestro jacuzzi con hidromasaje' },
    { servicio_id: 'turco', nombre: 'Baño Turco', precio_particular: 29900, precio_afiliado: 13000, icon: '💨', orden: 3, descripcion: 'Disfruta del vapor relajante del baño turco' },
  ];

  for (const servicioAdicional of serviciosAdicionales) {
    await prisma.servicioAdicional.upsert({
      where: { servicio_id: servicioAdicional.servicio_id },
      update: servicioAdicional,
      create: servicioAdicional,
    });
  }

  console.log(`✅ ${serviciosAdicionales.length} servicios adicionales creados`);

  // ============================================
  // PRODUCTOS
  // ============================================
  console.log('🛍️ Creando productos...');
  
  const productos = [
    { producto_id: 'candado', nombre: 'Candado para casillero', precio: 5000, icon: '🔐', orden: 1, descripcion: 'Candado de seguridad para tu casillero' },
    { producto_id: 'ropa', nombre: 'Kit ropa interior desechable', precio: 8000, icon: '👕', orden: 2, descripcion: 'Kit completo de ropa interior desechable' },
  ];

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { producto_id: producto.producto_id },
      update: producto,
      create: producto,
    });
  }

  console.log(`✅ ${productos.length} productos creados`);

  // ============================================
  // HORARIOS
  // ============================================
  console.log('🕐 Creando horarios...');
  
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  let ordenHorario = 0;
  for (const hora of horarios) {
    await prisma.horario.upsert({
      where: { hora },
      update: { orden: ordenHorario },
      create: { hora, orden: ordenHorario, activo: true },
    });
    ordenHorario++;
  }

  console.log(`✅ ${horarios.length} horarios creados`);

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  console.log('⚙️ Creando configuración...');
  
  const configuraciones = [
    { clave: 'descuento_afiliado', valor: '0.20', tipo: 'number', categoria: 'descuentos', descripcion: 'Descuento aplicado a clientes afiliados (porcentaje decimal)', editable_por_gerente: true },
    { clave: 'nombre_spa', valor: 'Therapy Aqua Spa', tipo: 'text', categoria: 'general', descripcion: 'Nombre del spa', editable_por_gerente: true },
    { clave: 'telefono_contacto', valor: '+57 300 123 4567', tipo: 'text', categoria: 'contacto', descripcion: 'Teléfono principal de contacto', editable_por_gerente: true },
    { clave: 'email_contacto', valor: 'contacto@therapyspa.com', tipo: 'text', categoria: 'contacto', descripcion: 'Email de contacto', editable_por_gerente: true },
    { clave: 'tiempo_expiracion_reserva', valor: '30', tipo: 'number', categoria: 'reservas', descripcion: 'Tiempo en minutos para expirar reservas pendientes', editable_por_gerente: true },
    { clave: 'politicas_cancelacion', valor: 'Las cancelaciones deben realizarse con al menos 24 horas de anticipación. Cancelaciones tardías pueden generar un cargo del 50% del valor del servicio.', tipo: 'text', categoria: 'politicas', descripcion: 'Políticas de cancelación', editable_por_gerente: true },
  ];

  for (const config of configuraciones) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: config,
      create: config,
    });
  }

  console.log(`✅ ${configuraciones.length} configuraciones creadas`);

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`   - ${servicios.length} servicios`);
  console.log(`   - ${serviciosAdicionales.length} servicios adicionales`);
  console.log(`   - ${productos.length} productos`);
  console.log(`   - ${horarios.length} horarios`);
  console.log(`   - ${configuraciones.length} configuraciones`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

