export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        const where = section ? { section, active: true } : { active: true };

        const content = await prisma.webContent.findMany({
            where,
            orderBy: { key: 'asc' }
        });

        // Convert array to object mapped by key for easy access
        const mappedContent = content.reduce((acc: any, item: any) => {
            acc[item.key] = item;
            return acc;
        }, {});

        return NextResponse.json({ content: mappedContent, success: true });
    } catch (error) {
        console.error('❌ Error fetching public web content:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
