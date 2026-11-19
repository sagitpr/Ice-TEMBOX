import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';

/**
 * Server-Side Cryptographic Route Guard Middleware.
 * Strictly verifies HS256 JWT signature and claims for all protected routes.
 * Evicts invalid or forged cookies and redirects to /login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pengaturan') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/notifikasi') ||
    pathname.startsWith('/aktivitas');

  if (isProtectedPath) {
    const token = request.cookies.get('tembox_auth_token')?.value;
    let isValid = false;

    if (token && process.env.JWT_SECRET) {
      try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey, {
          algorithms: ['HS256'],
        });

        if (payload && payload.sub && payload.email) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(loginUrl);

      // Invalidate forged or expired session cookie
      response.cookies.set('tembox_auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });

      return response;
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
