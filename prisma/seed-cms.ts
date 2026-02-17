import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting CMS seeding with REAL content...');

    // 1. HOME CONTENT
    const homeContent = [
        {
            key: 'home_hero_badge',
            title: 'Hero Badge',
            content: '✨ Bienvenido a tu santuario de bienestar',
            section: 'home'
        },
        {
            key: 'home_hero_title',
            title: 'Hero Title',
            content: 'Therapy Aqua Spa',
            section: 'home'
        },
        {
            key: 'home_hero_subtitle',
            title: 'Hero Subtitle',
            content: 'Terapia que alivia tu cuerpo',
            section: 'home'
        },
        {
            key: 'home_hero_description',
            title: 'Hero Description',
            content: 'Fisioterapia profesional y masajes terapéuticos en el corazón de Bogotá. Transformamos tu dolor en bienestar, tu tensión en paz.',
            section: 'home'
        },
        {
            key: 'home_metrics_clients',
            title: 'Métrica Clientes',
            content: '500+',
            section: 'home'
        },
        {
            key: 'home_metrics_services',
            title: 'Métrica Terapias',
            content: 'Terapias Especializadas',
            section: 'home'
        },
        {
            key: 'home_metrics_rating',
            title: 'Métrica Calificación',
            content: '5★',
            section: 'home'
        }
    ];

    for (const item of homeContent) {
        await prisma.webContent.upsert({
            where: { key: item.key },
            update: item,
            create: item,
        });
    }

    // 2. SOBRE NOSOTROS
    const aboutContent = [
        {
            key: 'about_title',
            title: 'Título Principal',
            content: 'Sobre Nosotros',
            section: 'about'
        },
        {
            key: 'about_subtitle',
            title: 'Subtítulo',
            content: 'Tu refugio de bienestar integral',
            section: 'about'
        },
        {
            key: 'about_description',
            title: 'Descripción General',
            content: 'En Therapy Aqua Spa transformamos la fisioterapia y los tratamientos de bienestar en una experiencia de renovación profunda para cuerpo y mente. Ubicados en el corazón de Bogotá, dentro del Círculo de Suboficiales de las FF.MM. Sede Colina Campestre, ofrecemos un escape de la rutina donde la salud y el relax se encuentran.',
            section: 'about'
        },
        {
            key: 'about_team_title',
            title: 'Título Equipo',
            content: 'Dra. Carolina Trujillo',
            section: 'about'
        },
        {
            key: 'about_team_description',
            title: 'Descripción Equipo',
            content: 'Liderado por la Dra. Carolina Trujillo, especialista en fisioterapia con años de experiencia, nuestro equipo se dedica a restaurar tu movilidad, aliviar dolores crónicos y brindarte el cuidado muscular de alta calidad que mereces.',
            section: 'about'
        }
    ];

    for (const item of aboutContent) {
        await prisma.webContent.upsert({
            where: { key: item.key },
            update: item,
            create: item,
        });
    }

    // 3. CONTACTO (Configuracion table)
    const contactConfigs = [
        { clave: 'contact_whatsapp', valor: '+57 301 4185239', tipo: 'string', categoria: 'contacto', descripcion: 'Número de WhatsApp de contacto directo' },
        { clave: 'contact_email', valor: 'therapyaquaspa@gmail.com', tipo: 'string', categoria: 'contacto', descripcion: 'Correo electrónico oficial' },
        { clave: 'contact_schedule', valor: 'Jueves a Domingo: 08:00 AM – 04:00 PM', tipo: 'string', categoria: 'contacto', descripcion: 'Días y horas de atención' },
        { clave: 'contact_address', valor: 'Calle 138 Nro. 55-38, Bogotá D.C.', tipo: 'string', categoria: 'contacto', descripcion: 'Dirección física del Spa' },
        { clave: 'contact_google_maps', valor: 'https://www.google.com/maps/place/C%C3%ADrculo+de+Suboficiales+de+las+Fuerzas+Militares+Sede+Social+Colina+Campestre/@4.7270293,-74.0630815,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f85166d81d1a9:0x2f6f5f8e86302677!8m2!3d4.727024!4d-74.0605066!16s%2Fg%2F1tj74n8d?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D', tipo: 'string', categoria: 'contacto', descripcion: 'Link a Google Maps' },
        { clave: 'contact_instagram', valor: 'https://www.instagram.com/therapyaquaspa/', tipo: 'string', categoria: 'contacto', descripcion: 'Perfil de Instagram' },
        { clave: 'branding_logo', valor: '/image/logo-oficial.jpg', tipo: 'image', categoria: 'branding', descripcion: 'Logo principal del sitio' }
    ];

    for (const config of contactConfigs) {
        await prisma.configuracion.upsert({
            where: { clave: config.clave },
            update: config,
            create: { ...config, editable_por_gerente: true },
        });
    }

    // 4. FAQs
    const initialFaqs = [
        { question: '🤔 ¿Cuánto tiempo antes debo llegar a mi cita?', answer: '🌅 Recomendamos llegar 20 minutos antes de la hora agendada para realizar tu registro, cambiarte con calma y disfrutar la experiencia completa sin contratiempos.', order: 1 },
        { question: '👙 ¿Qué ropa debo llevar?', answer: 'Damiselas: traje de baño de dos piezas. 🩳 Caballeros: pantaloneta de baño. Si lo prefieres, puedes adquirir en el spa un kit de ropa interior desechable.', order: 2 },
        { question: '⏰ ¿Qué pasa si llego tarde a mi cita?', answer: 'Tu tiempo de servicio podría verse reducido para no afectar las siguientes reservas. Si el retraso es mayor a 15 min, se reagendará según disponibilidad.', order: 3 },
        { question: '🔄 ¿Puedo reagendar o cancelar mi cita?', answer: 'Sí. Puedes hacerlo con un mínimo de 24 horas de anticipación. Pasado ese tiempo, el valor de la sesión se mantiene sin devolución.', order: 4 },
        { question: '👫 ¿Puedo asistir con acompañante?', answer: 'Algunos servicios pueden realizarse en pareja o grupo, pero requieren reserva anticipada. Confirma la disponibilidad antes de asistir.', order: 5 },
        { question: '🚗 ¿El spa tiene parqueadero?', answer: '✅ Sí, estamos dentro del Círculo de Suboficiales FF.MM., contamos con parqueadero vigilado y fácil acceso desde la Calle 138.', order: 6 },
        { question: '💎 ¿Tienen servicios exclusivos para afiliados?', answer: '🎖️ Sí, contamos con descuentos y beneficios especiales para afiliados al Círculo de Suboficiales. Consulta tarifas preferenciales.', order: 7 }
    ];

    for (const faq of initialFaqs) {
        const existing = await prisma.fAQ.findFirst({
            where: { question: faq.question }
        });

        if (existing) {
            await prisma.fAQ.update({
                where: { id: existing.id },
                data: faq
            });
        } else {
            await prisma.fAQ.create({
                data: faq
            });
        }
    }

    console.log('✅ CMS seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
