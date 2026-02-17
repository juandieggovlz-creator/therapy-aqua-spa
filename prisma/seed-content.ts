import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de contenido CMS con datos reales...');

    // --- 1. Seed FAQs (LAS 14 PREGUNTAS REALES DE LA WEB) ---
    console.log('⏳ Cargando FAQs reales...');
    const faqs = [
        {
            question: "¿Cuánto tiempo antes debo llegar a mi cita?",
            answer: "Recomendamos llegar 20 minutos antes de la hora agendada para realizar tu registro, cambiarte con calma y disfrutar la experiencia completa sin contratiempos.",
            order: 1,
            active: true
        },
        {
            question: "¿Qué ropa debo llevar?",
            answer: "👩 Damas: traje de baño de dos piezas.\n👨 Caballeros: pantaloneta de baño.\n\nSi lo prefieres, puedes adquirir en el spa un kit de ropa interior desechable y candado para casillero.",
            order: 2,
            active: true
        },
        {
            question: "¿Qué pasa si llego tarde a mi cita?",
            answer: "Si llegas tarde, tu tiempo de servicio podría verse reducido para no afectar las siguientes reservas. Si el retraso es mayor, se reagendará según disponibilidad.",
            order: 3,
            active: true
        },
        {
            question: "¿Puedo reagendar o cancelar mi cita?",
            answer: "Sí. Puedes hacerlo con un mínimo de 24 horas de anticipación. Pasado ese tiempo, el valor de la sesión se mantiene sin posibilidad de devolución.",
            order: 4,
            active: true
        },
        {
            question: "¿Puedo asistir con acompañante?",
            answer: "Algunos servicios pueden realizarse en pareja o grupo, pero requieren reserva anticipada. Confirma la disponibilidad antes de asistir.",
            order: 5,
            active: true
        },
        {
            question: "¿El spa tiene parqueadero o acceso fácil?",
            answer: "Sí, estamos dentro del Círculo de Suboficiales FF.MM., un espacio seguro, con parqueadero y fácil acceso desde la Calle 138.",
            order: 6,
            active: true
        },
        {
            question: "¿Tienen servicios exclusivos para afiliados?",
            answer: "Sí, contamos con descuentos y beneficios especiales para afiliados. Al iniciar sesión en el portal, podrás acceder a tus tarifas preferenciales.",
            order: 7,
            active: true
        },
        {
            question: "¿Qué medidas de higiene y seguridad manejan?",
            answer: "Cumplimos protocolos de bioseguridad certificados. Cada área es desinfectada antes y después de cada sesión. Además, todos nuestros implementos son esterilizados o desechables.",
            order: 8,
            active: true
        },
        {
            question: "¿Puedo llevar objetos personales?",
            answer: "Sí, disponemos de casilleros individuales para guardar tus pertenencias. Recomendamos no traer objetos de valor.",
            order: 9,
            active: true
        },
        {
            question: "¿Se permite el uso de celular o cámaras durante la sesión?",
            answer: "Por respeto a la privacidad de nuestros usuarios, no se permite grabar ni usar el celular dentro de las zonas húmedas o de terapia.",
            order: 10,
            active: true
        },
        {
            question: "¿Puedo regalar una experiencia en el spa?",
            answer: "¡Claro! Tenemos bonos de regalo personalizados que puedes obsequiar para ocasiones especiales. Pregunta por ellos en recepción o en nuestro WhatsApp oficial.",
            order: 11,
            active: true
        },
        {
            question: "¿Cuál es el horario de atención?",
            answer: "🕗 Lunes: Cerrado\n🕗 Martes: Cerrado\n🕗 Miércoles: Cerrado\n🕗 Jueves a Domingo: 08:00 AM – 04:00 PM",
            order: 12,
            active: true
        },
        {
            question: "¿Dónde están ubicados?",
            answer: "📍 Círculo de Suboficiales FF.MM.\nCalle 138 Nro. 55-38, Bogotá D.C.",
            order: 13,
            active: true
        },
        {
            question: "¿Cómo puedo comunicarme directamente?",
            answer: "📲 WhatsApp directo: wa.me/573014185239 o llámanos al +57 301 4185239\nSiempre hay alguien dispuesto a orientarte y ayudarte con tu reserva.",
            order: 14,
            active: true
        }
    ];

    for (const faq of faqs) {
        const existing = await (prisma as any).fAQ.findFirst({
            where: { question: faq.question }
        });

        if (existing) {
            await (prisma as any).fAQ.update({
                where: { id: existing.id },
                data: { answer: faq.answer, order: faq.order, active: faq.active }
            });
            console.log(`  ✅ Actualizada FAQ: ${faq.question.substring(0, 50)}...`);
        } else {
            await (prisma as any).fAQ.create({ data: faq });
            console.log(`  ✅ Creada FAQ: ${faq.question.substring(0, 50)}...`);
        }
    }

    // --- 2. Seed WebContent (TEXTOS REALES DE HOME Y ABOUT) ---
    console.log('\n⏳ Cargando contenido de páginas...');
    const contents = [
        {
            key: 'home_title',
            title: 'Título Principal Home',
            content: 'Therapy Aqua Spa',
            section: 'home'
        },
        {
            key: 'home_subtitle',
            title: 'Subtítulo Home',
            content: 'Terapia que alivia tu cuerpo',
            section: 'home'
        },
        {
            key: 'home_description',
            title: 'Descripción Home',
            content: 'Fisioterapia profesional y masajes terapéuticos en el corazón de Bogotá. Transformamos tu dolor en bienestar, tu tensión en paz.',
            section: 'home'
        },
        {
            key: 'about_title',
            title: 'Título Sobre Nosotros',
            content: 'Sobre Nosotros',
            section: 'about'
        },
        {
            key: 'about_subtitle',
            title: 'Subtítulo Sobre Nosotros',
            content: 'Bienestar y Relajación',
            section: 'about'
        },
        {
            key: 'about_description',
            title: 'Descripción Sobre Nosotros',
            content: 'En Therapy Aqua Spa nos dedicamos a brindar experiencias únicas de relajación y bienestar. Ubicados en el Círculo de Suboficiales de las Fuerzas Militares, ofrecemos un refugio de paz en medio de la ciudad.',
            section: 'about'
        }
    ];

    for (const item of contents) {
        const existing = await (prisma as any).webContent.findUnique({
            where: { key: item.key }
        });

        if (existing) {
            await (prisma as any).webContent.update({
                where: { key: item.key },
                data: { content: item.content, section: item.section, title: item.title }
            });
            console.log(`  ✅ Actualizado: ${item.key}`);
        } else {
            await (prisma as any).webContent.create({ data: item });
            console.log(`  ✅ Creado: ${item.key}`);
        }
    }

    // --- 3. Seed Configuracion (DATOS REALES DE CONTACTO Y BRANDING) ---
    console.log('\n⏳ Cargando configuración real...');
    const config = [
        {
            clave: 'direccion',
            valor: 'Calle 138 Nro. 55-38, Bogotá D.C.',
            tipo: 'text',
            categoria: 'contacto',
            descripcion: 'Dirección física del spa'
        },
        {
            clave: 'telefono',
            valor: '+57 301 4185239',
            tipo: 'tel',
            categoria: 'contacto',
            descripcion: 'Teléfono de contacto principal'
        },
        {
            clave: 'email',
            valor: 'contacto@therapyspa.com',
            tipo: 'email',
            categoria: 'contacto',
            descripcion: 'Email de contacto'
        },
        {
            clave: 'whatsapp_link',
            valor: 'https://wa.me/573014185239',
            tipo: 'url',
            categoria: 'contacto',
            descripcion: 'Link directo a WhatsApp'
        },
        {
            clave: 'instagram',
            valor: 'https://www.instagram.com/therapyaquaspa',
            tipo: 'url',
            categoria: 'redes_sociales',
            descripcion: 'Perfil de Instagram'
        },
        {
            clave: 'nombre_negocio',
            valor: 'Therapy Aqua Spa',
            tipo: 'text',
            categoria: 'branding',
            descripcion: 'Nombre del negocio'
        },
        {
            clave: 'logo_url',
            valor: '/image/logo-oficial.jpg',
            tipo: 'image',
            categoria: 'branding',
            descripcion: 'URL del logo del negocio'
        }
    ];

    for (const item of config) {
        const existing = await prisma.configuracion.findFirst({
            where: { clave: item.clave }
        });

        if (existing) {
            await prisma.configuracion.update({
                where: { id: existing.id },
                data: {
                    valor: item.valor,
                    categoria: item.categoria,
                    tipo: item.tipo,
                    descripcion: item.descripcion
                }
            });
            console.log(`  ✅ Actualizada config: ${item.clave}`);
        } else {
            await prisma.configuracion.create({ data: item });
            console.log(`  ✅ Creada config: ${item.clave}`);
        }
    }

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${faqs.length} FAQs cargadas`);
    console.log(`   - ${contents.length} contenidos de páginas cargados`);
    console.log(`   - ${config.length} configuraciones cargadas`);
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
