import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserJwt } from '../../../../modules/auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/session
 * Cryptographically verifies current HTTP-Only session cookie.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tembox_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const payload = await verifyUserJwt(token);
    if (!payload || !payload.sub || !payload.email) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role || 'user',
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

/**
 * DELETE /api/auth/session
 * Logs out user by removing the secure HTTP-Only session cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Sesi berhasil diakhiri.',
  });

  response.cookies.set('tembox_auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
