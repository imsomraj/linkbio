// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from './lib/auth';

const PROTECTED_PATHS = ['/dashboard', '/api/dashboard', '/api/links', '/api/profile', '/api/analytics', '/api/upload'];
const AUTH_PATHS = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const response = NextResponse.next();
    response.headers.set('x-user-id', session.sub);
    response.headers.set('x-username', session.username);
    return response;
  }

  if (isAuthPath) {
    const session = await getSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/dashboard/:path*',
    '/api/links/:path*',
    '/api/profile/:path*',
    '/api/analytics/:path*',
    '/api/upload/:path*',
  ],
};
