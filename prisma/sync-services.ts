import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newServices = [
    {
        servicio_id: "columna",
        nombre: "THERAPY LESIONES DE COLUMNA",
        duracion: 30,
        precio: 70000,
        detalles_tratamiento: "Tu columna soporta el peso del estrés diario. Con nuestro masaje especializado aliviarás tensiones, reducirás dolores de espalda y cuello, mejorarás tu postura y sentirás una profunda relajación desde la primera sesión. Regálale a tu cuerpo el cuidado que merece. ¡Siente la diferencia sin medicación!",
        categoria: "Terapias de Rehabilitación",
        icon: "🦴",
        imagen: "therapy lesiones de columna 2.jpg",
        detalles: ["Masaje especializado de columna", "Alivio de tensión en espalda y cuello", "Corrección postural", "Relajación profunda sin medicación"]
    },
    {
        servicio_id: "brazos",
        nombre: "THERAPY LESIONES MUSCULARES BRAZOS",
        duracion: 30,
        precio: 170000,
        detalles_tratamiento: "Paquete 3 sesiones semanal de terapia física. Técnicas terapéuticas reconfortantes diseñada para aliviar la tensión acumulada después de golpes leves, sobrecarga o periodos de rigidez. A través de movimientos delicados y envolventes, estimulando la circulación y ayudando a que sientas tus brazos más relajados, livianos y flexibles.",
        categoria: "Terapias de Rehabilitación",
        icon: "💪",
        imagen: "lesiones de brazo.jpg",
        detalles: ["Paquete de 3 sesiones semanales", "Técnicas terapéuticas reconfortantes", "Estimulación de la circulación", "Mejora de flexibilidad y ligereza"]
    },
    {
        servicio_id: "piernas",
        nombre: "THERAPY LESIONES MUSCULARES PIERNAS",
        duracion: 30,
        precio: 170000,
        detalles_tratamiento: "Paquete 3 sesiones de terapia física semanal . Técnica terapéutica que estimula la circulación, libera rigidez y mejora la movilidad, dejándote una sensación inmediata de alivio y bienestar.",
        categoria: "Terapias de Rehabilitación",
        icon: "🦵",
        imagen: "masaje de piernas.jpg",
        detalles: ["Paquete de 3 sesiones semanales", "Estimulación circulatoria", "Liberación de rigidez muscular", "Mejora de la movilidad"]
    },
    {
        servicio_id: "trauma-superior",
        nombre: "THERAPY TRAUMA HOMBRO, CODO, MUÑECA",
        duracion: 30,
        precio: 270000,
        detalles_tratamiento: "Paquete de 5 sesiones mensual. Libera tensión, mejora la circulación y recupera la movilidad en hombros, codos, muñecas. Siente ligereza, alivio inmediato y bienestar profundo desde la primera sesión. Tu momento de relajación y recuperación te espera.",
        categoria: "Terapias de Rehabilitación",
        icon: "🤝",
        imagen: "masaje hombro, codo.jpg",
        detalles: ["Paquete de 5 sesiones mensuales", "Tratamiento de hombro, codo y muñeca", "Mejora de la circulación regional", "Recuperación de movilidad articular"]
    },
    {
        servicio_id: "trauma-inferior",
        nombre: "THERAPY TRAUMA CADERA , RODILLA , TOBILLO",
        duracion: 30,
        precio: 270000,
        detalles_tratamiento: "Paquete 5 sesiones mensual de terapia física. Técnica terapéutica encaminada a la liberación de la tensión muscular, mejora la movilidad y favorece una marcha más fluida. Siente alivio, confort y ligereza en cada paso.",
        categoria: "Terapias de Rehabilitación",
        icon: "🦿",
        imagen: "masaje cadera.jpg",
        detalles: ["Paquete de 5 sesiones mensuales", "Liberación de tensión en cadera y rodilla", "Tratamiento de tobillo", "Mejora de la fluidez en la marcha"]
    },
    {
        servicio_id: "skincare-mano",
        nombre: "SKINCARE MANO THERAPY",
        duracion: 20,
        precio: 35000,
        detalles_tratamiento: "El skincare en manos no solo embellece, también hidrata profundamente, rejuvenece la piel y brinda una relajación inmediata. Es un cuidado esencial porque las manos son una de las zonas que más delatan la edad y el estrés.",
        categoria: "Cuidado Facial y Especializado",
        icon: "🤲",
        imagen: "skincare mano.jpg",
        detalles: ["Hidratación profunda de manos", "Protocolo rejuvenecedor de piel", "Relajación inmediata", "Cuidado esencial anti-estrés"]
    },
    {
        servicio_id: "preso-ocular",
        nombre: "PRESO THERAPY OCULAR",
        duracion: 15,
        precio: 25000,
        detalles_tratamiento: "Las gafas de presoterapia relajan profundamente el contorno de ojos, ayudan a desinflamar bolsas y ojeras, mejoran la circulación y aportan una sensación inmediata de descanso y bienestar. Es el complemento ideal para revitalizar la mirada y potenciar la experiencia de relajación integral en el spa.",
        categoria: "Cuidado Facial y Especializado",
        icon: "👁️",
        imagen: "therapy ocular.jpg",
        detalles: ["Gafas de presoterapia ocular", "Desinflamación de bolsas y ojeras", "Revitalización de la mirada", "Mejora de la circulación periorbital"]
    },
    {
        servicio_id: "bienestar-general",
        nombre: "MASAJE BIENESTAR GENERAL",
        duracion: 30,
        precio: 85000,
        detalles_tratamiento: "Regálale a tu cuerpo el descanso que necesita… el masaje general libera el estrés acumulado, relaja cada músculo y te permite desconectar del ritmo diario para sentir una verdadera sensación de paz, renovación y bienestar profundo.",
        categoria: "Tratamientos de Bienestar",
        icon: "🌿",
        imagen: "masaje general.jfif",
        detalles: ["Masaje corporal integrativo", "Liberación de estrés acumulado", "Relajación muscular completa", "Sensación de paz y renovación"]
    },
    {
        servicio_id: "cuello",
        nombre: "MASAJE DE CUELLO",
        duracion: 30,
        precio: 55000,
        detalles_tratamiento: "El masaje terapéutico de cuello libera tensiones acumuladas, reduce el estrés, mejora la circulación y ayuda a aliviar dolores de cabeza y molestias cervicales. Es ideal para quienes pasan mucho tiempo frente al celular o computador y buscan relajación profunda y bienestar inmediato.",
        categoria: "Tratamientos de Bienestar",
        icon: "💆",
        imagen: "masaje cuello.jpg",
        detalles: ["Liberación de tensión cervical", "Alivio de dolores de cabeza tensionales", "Mejora de la circulación sanguínea", "Ideal para usuarios de computador/celular"]
    },
    {
        servicio_id: "facial",
        nombre: "MASAJE FACIAL",
        duracion: 30,
        precio: 55000,
        detalles_tratamiento: "Ayuda a estimular la circulación, relajar los músculos del rostro y favorecer la movilidad facial , mediante técnicas suaves y especializadas. Es un complemento ideal para promover bienestar, relajación profunda brindando una experiencia segura y reconfortante.",
        categoria: "Cuidado Facial y Especializado",
        icon: "✨",
        imagen: "masaje facial.jpg",
        detalles: ["Masaje de músculos faciales", "Técnicas suaves y especializadas", "Estimulación de la circulación facial", "Relajación profunda reconfortante"]
    },
    {
        servicio_id: "espalda",
        nombre: "MASAJE DE ESPALDA",
        duracion: 30,
        precio: 65000,
        detalles_tratamiento: "Si sientes tensión, cansancio o dolor en la espalda, este masaje es justo lo que tu cuerpo necesita. En pocos minutos libera el estrés acumulado, relaja profundamente y te devuelve esa sensación de alivio que llevas tiempo buscando",
        categoria: "Tratamientos de Bienestar",
        icon: "🧘",
        imagen: "masaje de espalda.jpg",
        detalles: ["Alivio de tensión en espalda total", "Liberación de carga muscular", "Relajación profunda en minutos", "Sensación de bienestar inmediato"]
    },
    {
        servicio_id: "hombros-brazos",
        nombre: "MASAJE HOMBROS Y BRAZOS",
        duracion: 30,
        precio: 60000,
        detalles_tratamiento: "Si sientes tensión, pesadez o cansancio en hombros y brazos, este masaje es justo lo que tu cuerpo necesita. Libera el estrés acumulado, relaja profundamente y devuelve esa sensación de ligereza y descanso que te hará sentir renovado desde el primer momento",
        categoria: "Tratamientos de Bienestar",
        icon: "💆",
        imagen: "masaje hombros y brazos.jpg",
        detalles: ["Tratamiento de hombros y brazos", "Eliminación de la pesadez muscular", "Relajación profunda de extremidades", "Sensación de ligereza y descanso"]
    },
    {
        servicio_id: "caderas-rodillas",
        nombre: "MASAJE CADERAS Y RODILLAS",
        duracion: 30,
        precio: 65000,
        detalles_tratamiento: "Si sientes rigidez, cansancio o molestias al caminar o moverte, este masaje en caderas y rodillas es justo lo que necesitas. Libera la tensión acumulada, mejora la movilidad y te ayuda a recuperar esa sensación de ligereza y comodidad que tu cuerpo está pidiendo",
        categoria: "Tratamientos de Bienestar",
        icon: "🦴",
        imagen: "masaje cadera 2.jpg",
        detalles: ["Liberación de rigidez en caderas", "Terapia de movilidad para rodillas", "Alivio de molestias al caminar", "Recuperación de comodidad corporal"]
    },
    {
        servicio_id: "pantorrillas-pies",
        nombre: "MASAJE PANTORRILLAS Y PIES",
        duracion: 30,
        precio: 65000,
        detalles_tratamiento: "Si sientes tus piernas cansadas, pesadas o con tensión después del día a día, este masaje en pantorrillas y pies es justo lo que necesitas. Activa la circulación, libera la fatiga acumulada y te devuelve esa sensación de descanso y ligereza que tu cuerpo está pidiendo",
        categoria: "Tratamientos de Bienestar",
        icon: "🦶",
        imagen: "MASAJE PANTORRILLAS Y PIES.jpg",
        detalles: ["Masaje de pantorrillas y pies", "Activación de la circulación de retorno", "Eliminación de fatiga acumulada", "Sensación de piernas livianas"]
    },
    {
        servicio_id: "deportivo",
        nombre: "MASAJE DEPORTIVO DESCARGA MUSCULAR",
        duracion: 30,
        precio: 80000,
        detalles_tratamiento: "Si entrenas fuerte, tu cuerpo también necesita recuperarse. La descarga muscular libera la tensión acumulada, reduce la fatiga y acelera la recuperación para que vuelvas a rendir mejor, con menos dolor y más energía desde la próxima sesión",
        categoria: "Tratamientos de Bienestar",
        icon: "🏃",
        imagen: "Masaje deportivo descarga muscular.jpg",
        detalles: ["Descarga muscular profunda", "Reducción de fatiga post-entreno", "Aceleración de recuperación muscular", "Optimización del rendimiento físico"]
    },
    {
        servicio_id: "reductor",
        nombre: "MASAJE REDUCTOR",
        duracion: 30,
        precio: 70000,
        detalles_tratamiento: "El masaje reductor ayuda a estimular la circulación y el drenaje linfático, favoreciendo la reducción de medidas, mejorando la apariencia de la piel y ayudando a eliminar líquidos retenidos. Además, tonifica, modela la figura y genera una sensación de bienestar y ligereza corporal.",
        categoria: "Tratamientos de Bienestar",
        icon: "✨",
        imagen: "MASAJE REDUCTOR.jpg",
        detalles: ["Estimulación de drenaje linfático", "Favoroce la reducción de medidas", "Eliminación de líquidos retenidos", "Modelado de la figura y tonificación"]
    },
    {
        servicio_id: "paralisis-facial",
        nombre: "THERAPY PARALISIS FACIAL",
        duracion: 30,
        precio: 55000,
        detalles_tratamiento: "Ayuda a estimular la circulación, activacion nervio trigemino (facia)l, relajar los músculos del rostro y favorecer la movilidad facial , mediante técnicas suaves y especializadas. Es un complemento ideal para promover la recuperacion y el bienestar.",
        categoria: "Terapias de Rehabilitación",
        icon: "✨",
        imagen: "therapy paralisis facial.jpg",
        detalles: ["Activación del nervio trigémino/facial", "Estimulación de la circulación facial", "Técnicas especializadas de movilidad", "Promoción de la recuperación funcional"]
    },
    {
        servicio_id: "piso-pelvico",
        nombre: "THERAPY PISO PELVICO",
        duracion: 30,
        precio: 50000,
        detalles_tratamiento: "La terapia de piso pélvico fortalece y reeduca los músculos que sostienen órganos internos, ayudando a mejorar el control urinario, la estabilidad corporal y la función sexual. Reduce molestias, previene disfunciones y mejora la calidad de vida mediante un tratamiento terapéutico seguro y especializado",
        categoria: "Terapias de Rehabilitación",
        icon: "✨",
        imagen: "Therapy piso pélvico.jpg",
        detalles: ["Fortalecimiento de músculos pélvicos", "Reeducación muscular especializada", "Mejora del control urinario", "Atención terapéutica segura y discreta"]
    },
    {
        servicio_id: "cefalea-migrana",
        nombre: "THERAPY CEFALEA TENSIONAL, MIGRAÑA",
        duracion: 30,
        precio: 60000,
        detalles_tratamiento: "Tratamiento suave y envolvente que alivia la tensión acumulada en cuero cabelludo, cabeza y cuello, promoviendo una sensación inmediata de calma, alivio y relajación.",
        categoria: "Terapias de Rehabilitación",
        icon: "💆",
        imagen: "Therapy cefalta tensional migraña.jpg",
        detalles: ["Masaje de cuero cabelludo y sienes", "Alivio de tensión en cabeza y cuello", "Promoción de calma inmediata", "Tratamiento envolvente anti-migraña"]
    },
    {
        servicio_id: "respiratorio",
        nombre: "THERAPY RESPIRATORIO",
        duracion: 20,
        precio: 65000,
        detalles_tratamiento: "Si sientes que respirar ya no es tan fácil como antes, la terapia respiratoria puede ayudarte a recuperar aire, energía y tranquilidad. Mejora la capacidad pulmonar, facilita la respiración y acelera la recuperación para que vuelvas a sentirte fuerte y seguro en tu día a día.",
        categoria: "Terapias de Rehabilitación",
        icon: "🫁",
        imagen: "therapy respiratorio.jpg",
        detalles: ["Mejora de la capacidad pulmonar", "Facilitación del flujo respiratorio", "Aceleración de recuperación energética", "Ejercicios terapéuticos guiados"]
    },
    {
        servicio_id: "drenaje",
        nombre: "DRENAJE LINFATICO",
        duracion: 30,
        precio: 60000,
        detalles_tratamiento: "Sabemos que el esfuerzo diario y la disciplina dejan huella en el cuerpo. Por eso, el drenaje linfático es una terapia ideal para disminuir la inflamación, aliviar la pesadez digestiva y corporal, favoreciendo el bienestar digestivo y circulatorio.",
        categoria: "Tratamientos de Bienestar",
        icon: "✨",
        imagen: "Drenaje linfatico.jpg",
        detalles: ["Protocolo de disminución de inflamación", "Alivio de pesadez corporal", "Favoroce el sistema circulatorio", "Bienestar digestivo y relajación"]
    }
];

async function main() {
    console.log('🔄 Sincronizando servicios...');

    // Desactivar todos los servicios actuales
    console.log('⚠️ Desactivando servicios antiguos...');
    await prisma.servicio.updateMany({
        data: { activo: false }
    });

    let creados = 0;
    let actualizados = 0;

    for (const data of newServices) {
        // Upsert por servicio_id
        const existing = await prisma.servicio.findUnique({
            where: { servicio_id: data.servicio_id }
        });

        if (existing) {
            await prisma.servicio.update({
                where: { servicio_id: data.servicio_id },
                data: {
                    nombre: data.nombre,
                    duracion: data.duracion,
                    precio: data.precio,
                    detalles_tratamiento: data.detalles_tratamiento,
                    detalles: data.detalles as any, // Mapeado a JSONB
                    categoria: data.categoria,
                    icon: data.icon,
                    imagen: data.imagen,
                    activo: true // Reactivar
                }
            });
            actualizados++;
            console.log(`✅ Actualizado: ${data.nombre}`);
        } else {
            await prisma.servicio.create({
                data: {
                    ...data,
                    detalles: data.detalles as any,
                    activo: true,
                    descripcion: data.detalles_tratamiento
                }
            });
            creados++;
            console.log(`✨ Creado: ${data.nombre}`);
        }
    }

    console.log(`\n🎉 Sincronización finalizada.`);
    console.log(`✅ Creados: ${creados}`);
    console.log(`✅ Actualizados: ${actualizados}`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
