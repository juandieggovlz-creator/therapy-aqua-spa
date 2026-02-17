export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const configs = await prisma.configuracion.findMany({
            where: {
                // Filtramos solo las que queremos exponer públicamente si fuera necesario, 
                // pero por ahora enviamos todas o las de branding/contacto
                categoria: { in: ['general', 'contacto', 'redes_sociales', 'branding'] }
            }
        });

        // Convertir array a objeto mapeado por clave para fácil acceso en frontend
        const configuracion = configs.reduce((acc: any, item: any) => {
            acc[item.clave] = item;
            return acc;
        }, {});

        return NextResponse.json({ configuracion, success: true });
    } catch (error) {
        console.error('❌ Error obteniendo configuración pública:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
