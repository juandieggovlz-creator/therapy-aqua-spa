import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Solo proteger rutas que empiezan con /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');

        // Si no hay sesión, redirigir al login
        if (!session) {
            return NextResponse.redirect(new URL('/login/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
