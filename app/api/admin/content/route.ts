export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Obtener todo el contenido web
export async function GET() {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const content = await prisma.webContent.findMany({
            orderBy: { key: 'asc' }
        });

        return NextResponse.json({ content, success: true });
    } catch (error) {
        console.error('❌ Error obteniendo contenido web:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// POST - Crear o actualizar contenido web
export async function POST(request: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { key, title, content, image, section } = body;

        if (!key || !section) {
            return NextResponse.json({ error: 'Faltan campos requeridos (key, section)' }, { status: 400 });
        }

        const item = await prisma.webContent.upsert({
            where: { key },
            update: {
                title: title || undefined,
                content: content || undefined,
                image: image || undefined,
                section: section || undefined,
                updatedAt: new Date()
            },
            create: {
                key,
                title: title || '',
                content: content || '',
                image: image || '',
                section: section || 'general'
            }
        });

        return NextResponse.json({ item, success: true });
    } catch (error) {
        console.error('❌ Error guardando contenido web:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
