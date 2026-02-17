import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = "nodejs";

export async function GET() {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json({ faqs, success: true });
    } catch (error) {
        console.error('❌ Error obteniendo FAQs públicos:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
