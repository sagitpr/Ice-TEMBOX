import { NextResponse } from 'next/server';

/**
 * Server-Side Session Synchronization Endpoint.
 * Manages secure HttpOnly session cookies for middleware and server route guards.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { user, token } = body;

    const email = user?.email || '';
    const cleanUserId = (email.split('@')[0] || user?.userId || 'user')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    const sessionToken =
      token || `tbx_token_${cleanUserId}_${Date.now().toString(36)}`;

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      token: sessionToken,
    });

    // Set secure HttpOnly cookie for server middleware
    response.cookies.set('tembox_auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: unknown) {
    console.error('[Session API Error]:', error);
    return NextResponse.json(
      { error: 'Gagal mengatur cookie sesi server.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Sesi server berhasil dihapus.',
  });

  // Clear session cookie
  response.cookies.delete({
    name: 'tembox_auth_token',
    path: '/',
  });

  return response;
}
