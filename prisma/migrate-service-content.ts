import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hardcodedData = [
    {
        key: "columna",
        nombre: "THERAPY LESIONES DE COLUMNA",
        descripcion: "Tratamiento especializado para dolor lumbar, cervical y dorsalgia. Recupera tu movilidad y alivia el dolor crónico.",
        detalles: [
            "Evaluación postural completa",
            "Terapia manual especializada",
            "Ejercicios de fortalecimiento",
            "Técnicas de alivio del dolor",
            "Plan de seguimiento personalizado"
        ]
    },
    {
        key: "brazos",
        nombre: "THERAPY LESIONES MUSCULARES BRAZOS",
        descripcion: "Masaje profundo de tejidos y liberación miofascial para aliviar tensiones y mejorar la movilidad en brazos.",
        detalles: [
            "Masaje profundo de tejidos",
            "Liberación miofascial",
            "Estiramientos terapéuticos",
            "Fortalecimiento muscular",
            "Reducción de tensión"
        ]
    },
    {
        key: "piernas",
        nombre: "THERAPY LESIONES MUSCULARES PIERNAS",
        descripcion: "Terapia focused en tejidos blandos y movilización articular para la recuperación de lesiones en miembros inferiores.",
        detalles: [
            "Terapia de tejidos blandos",
            "Movilización articular",
            "Ejercicios de rehabilitación",
            "Mejora de flexibilidad",
            "Prevención de lesiones"
        ]
    },
    {
        key: "hombro",
        nombre: "THERAPY TRAUMA HOMBRO, CODO, MUÑECA",
        descripcion: "Evaluación biomecánica y terapia manual avanzada para traumas en extremidades superiores.",
        detalles: [
            "Evaluación biomecánica",
            "Terapia manual avanzada",
            "Movilización pasiva y activa",
            "Fortalecimiento progresivo",
            "Reeducación del movimiento"
        ]
    },
    {
        key: "cadera",
        nombre: "THERAPY TRAUMA CADERA, RODILLA, TOBILLO",
        descripcion: "Evaluación funcional y ejercicios de propiocepción para la recuperación completa de traumas en extremidades inferiores.",
        detalles: [
            "Evaluación funcional",
            "Terapia de estabilización",
            "Ejercicios de propiocepción",
            "Fortalecimiento muscular",
            "Mejora del equilibrio"
        ]
    },
    {
        key: "bienestar-general",
        nombre: "MASAJE BIENESTAR GENERAL",
        descripcion: "Masaje corporal completo que combina técnicas de relajación profunda para reducir estrés y tensión muscular.",
        detalles: [
            "Masaje corporal completo",
            "Aromaterapia relajante",
            "Música terapéutica",
            "Técnicas de relajación profunda",
            "Mejora de circulación sanguínea"
        ]
    },
    {
        key: "cuello",
        nombre: "MASAJE DE CUELLO",
        descripcion: "Masaje descontracturante enfocado en la zona cervical, ideal para aliviar tensiones por estrés.",
        detalles: [
            "Masaje relajante",
            "Masaje descontracturante",
            "Masaje activador",
            "Limpieza, exfoliación e hidratación de piel",
            "Vibración, percusión y estiramiento articular y muscular",
            "Masajeador capilar y piedras volcánicas",
            "Musicoterapia y aromaterapia"
        ]
    },
    {
        key: "deportivo",
        nombre: "MASAJE THERAPY DEPORTIVO",
        descripcion: "Ideal para atletas y personas activas. Previene lesiones y mejora el rendimiento físico.",
        detalles: [
            "Preparación pre-competencia",
            "Recuperación post-entrenamiento",
            "Liberación de tensión muscular",
            "Mejora de flexibilidad",
            "Prevención de lesiones deportivas"
        ]
    },
    {
        key: "espalda",
        nombre: "MASAJE DE ESPALDA",
        descripcion: "Masaje profundo que libera nudos musculares y alivia contracturas en toda la espalda.",
        detalles: [
            "Masaje profundo de espalda",
            "Liberación de nudos musculares",
            "Alivio de contracturas",
            "Mejora de postura",
            "Reducción de estrés"
        ]
    },
    {
        key: "hombros",
        nombre: "MASAJE HOMBROS Y BRAZOS",
        descripcion: "Combinación de técnicas para liberar la tensión cervical y descontracturar los hombros.",
        detalles: [
            "Liberación de tensión cervical",
            "Masaje de cuello y hombros",
            "Descontractura muscular",
            "Alivio de dolor de brazos",
            "Mejora de movilidad"
        ]
    },
    {
        key: "rodillas",
        nombre: "MASAJE CADERAS Y RODILLAS",
        descripcion: "Enfocado en miembros inferiores para liberar tensión articular y mejorar la circulación.",
        detalles: [
            "Masaje de miembros inferiores",
            "Liberación de tensión articular",
            "Mejora de circulación",
            "Alivio de rigidez",
            "Fortalecimiento muscular"
        ]
    },
    {
        key: "pies",
        nombre: "MASAJE PANTORRILLAS Y PIES",
        descripcion: "Reflexología podal y masaje de pantorrillas para liberar la fatiga acumulada.",
        detalles: [
            "Reflexología podal",
            "Masaje de pantorrillas",
            "Liberación de fatiga",
            "Estimulación de puntos reflejos",
            "Relajación profunda"
        ]
    },
    {
        key: "facial",
        nombre: "MASAJE FACIAL",
        descripcion: "Masaje facial con técnicas lifting que mejoran la circulación y tonifican los músculos faciales.",
        detalles: [
            "Limpieza facial profunda",
            "Masaje linfático facial",
            "Técnicas de lifting natural",
            "Hidratación intensiva",
            "Rejuvenecimiento de la piel"
        ]
    },
    {
        key: "skincare-mano",
        nombre: "SKINCARE MANO THERAPY",
        descripcion: "Rejuvenecimiento de manos con exfoliación, hidratación profunda y masaje especializado.",
        detalles: [
            "Exfoliación suave",
            "Masaje de manos y antebrazos",
            "Hidratación profunda",
            "Tratamiento anti-edad",
            "Nutrición de uñas y cutículas"
        ]
    },
    {
        key: "preso-ocular",
        nombre: "PRESO THERAPY OCULAR",
        descripcion: "Tratamiento innovador para ojos cansados, ojeras y tensión ocular. Refresca y revitaliza tu mirada.",
        detalles: [
            "Masaje de contorno de ojos",
            "Reducción de ojeras",
            "Desinflamación de párpados",
            "Alivio de tensión ocular",
            "Efecto lifting natural"
        ]
    }
];

async function main() {
    console.log('🔄 Iniciando migración de contenido hardcodeado a la base de datos...');

    let serviciosDB: any[] = [];
    try {
        serviciosDB = await prisma.servicio.findMany();
        console.log(`📊 Encontrados ${serviciosDB.length} servicios en la DB.`);
    } catch (err) {
        console.error('❌ Error al consultar la base de datos:', err);
        return;
    }

    let actualizados = 0;
    let errores = 0;

    for (const data of hardcodedData) {
        try {
            // Intentar encontrar por ID (key) o por nombre
            const servicio = serviciosDB.find(s =>
                s.servicio_id === data.key ||
                s.nombre.toUpperCase() === data.nombre.toUpperCase()
            );

            if (servicio) {
                await prisma.servicio.update({
                    where: { servicio_id: servicio.servicio_id },
                    data: {
                        detalles_tratamiento: data.descripcion,
                        detalles: data.detalles
                    }
                });
                console.log(`✅ Actualizado: ${data.nombre} (${servicio.servicio_id})`);
                actualizados++;
            } else {
                console.warn(`⚠️ No se encontró en DB: ${data.nombre}`);
            }
        } catch (err: any) {
            console.error(`❌ Error al actualizar ${data.nombre}:`, err.message || err);
            errores++;
        }
    }

    console.log(`\n🎉 Migración completada.`);
    console.log(`✅ Exitosos: ${actualizados}`);
    console.log(`❌ Con errores: ${errores}`);
}

main()
    .catch((e) => {
        console.error('❌ Error en migración:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
