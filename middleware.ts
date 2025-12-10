import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicRoutes = ['/', '/login'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Para rotas protegidas, o Supabase Auth gerencia via client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
