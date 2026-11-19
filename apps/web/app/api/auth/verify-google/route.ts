import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const callbackUrl = `${origin}/api/auth/verify-google/callback`;

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      // If GOOGLE_CLIENT_ID is not configured yet in .env, check if Supabase OAuth can be used
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const supabaseAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(callbackUrl)}&scopes=openid%20email%20profile`;
        return NextResponse.redirect(supabaseAuthUrl);
      }

      return NextResponse.json(
        {
          error: 'GOOGLE_CLIENT_ID belum dikonfigurasi pada server.',
          detail: 'Tambahkan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET pada .env.local untuk mengaktifkan verifikasi Google OAuth.',
        },
        { status: 500 }
      );
    }

    const state = Math.random().toString(36).substring(2);
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', callbackUrl);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent select_account');
    googleAuthUrl.searchParams.set('state', state);

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (err: unknown) {
    console.error('[Verify Google Error]:', err);
    return NextResponse.json(
      { error: 'Gagal menginisiasi verifikasi akun Google.' },
      { status: 500 }
    );
  }
}
