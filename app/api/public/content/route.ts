export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const [content, faqs] = await Promise.all([
            prisma.webContent.findMany({ where: { active: true } }),
            prisma.fAQ.findMany({ where: { active: true }, orderBy: { order: 'asc' } })
        ]);

        // Transform content array to object for easier consumption
        const contentMap = content.reduce((acc: any, item: any) => {
            acc[item.key] = item;
            return acc;
        }, {});

        return NextResponse.json({
            content: contentMap,
            faqs,
            success: true
        });
    } catch (error) {
        console.error('❌ Error obteniendo contenido público:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
