export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Obtener FAQs
export async function GET() {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const faqs = await prisma.fAQ.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({ faqs, success: true });
    } catch (error) {
        console.error('❌ Error obteniendo FAQs:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// POST - Crear FAQ
export async function POST(request: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { question, answer, order } = body;

        if (!question || !answer) {
            return NextResponse.json({ error: 'Pregunta y respuesta requeridas' }, { status: 400 });
        }

        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                order: order || 0,
                active: true
            }
        });

        return NextResponse.json({ faq, success: true });
    } catch (error) {
        console.error('❌ Error creando FAQ:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// PATCH - Actualizar FAQ
export async function PATCH(request: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ faq, success: true });
    } catch (error) {
        console.error('❌ Error actualizando FAQ:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// DELETE - Eliminar FAQ
export async function DELETE(request: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        await prisma.fAQ.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error eliminando FAQ:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
