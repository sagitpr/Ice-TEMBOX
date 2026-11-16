import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-Side Route Guard Middleware.
 * Protects private areas (/dashboard, /pengaturan, /checkout, /monitoring, /notifikasi)
 * and redirects unauthenticated users to /login?redirect=<pathname> before page rendering.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths regex or prefix checks
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pengaturan') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/notifikasi') ||
    pathname.startsWith('/aktivitas');

  if (isProtectedPath) {
    // 1. Check custom session token cookie
    const temboxToken = request.cookies.get('tembox_auth_token')?.value;

    // 2. Check Authorization header
    const authHeader = request.headers.get('authorization');

    // 3. Check standard Supabase auth cookies (sb-<project>-auth-token or sb-access-token)
    const allCookies = request.cookies.getAll();
    const hasSupabaseCookie = allCookies.some(
      (c) =>
        (c.name.startsWith('sb-') && c.name.endsWith('-auth-token')) ||
        c.name === 'sb-access-token'
    );

    const isAuthenticated = Boolean(
      (temboxToken && temboxToken.trim().length > 0) ||
      (authHeader && authHeader.toLowerCase().startsWith('bearer ') && authHeader.substring(7).trim().length > 0) ||
      hasSupabaseCookie
    );

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pengaturan/:path*',
    '/checkout/:path*',
    '/monitoring/:path*',
    '/notifikasi/:path*',
    '/aktivitas/:path*',
  ],
};
