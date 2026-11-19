import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../../modules/supabase/supabaseAdmin';
import { signRegistrationToken } from '../../../../../modules/auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/register?error=${encodeURIComponent('Verifikasi Google dibatalkan atau ditolak.')}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/register?error=${encodeURIComponent('Kode otorisasi Google tidak ditemukan.')}`
    );
  }

  try {
    const callbackUrl = `${origin}/api/auth/verify-google/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    let googleSub = '';
    let googleEmail = '';
    let googleName = '';
    let isEmailVerified = false;

    // Path A: Standard Direct Google OAuth 2.0
    if (clientId && clientSecret) {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        console.error('[Google Callback] Token exchange failed:', tokenData);
        return NextResponse.redirect(
          `${origin}/register?error=${encodeURIComponent('Gagal menukar kode otorisasi dengan token Google.')}`
        );
      }

      // Fetch verified profile from Google UserInfo
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userInfo = await userInfoRes.json();

      if (!userInfoRes.ok || !userInfo.sub || !userInfo.email) {
        return NextResponse.redirect(
          `${origin}/register?error=${encodeURIComponent('Gagal mengambil data akun Google terverifikasi.')}`
        );
      }

      googleSub = userInfo.sub;
      googleEmail = userInfo.email.trim().toLowerCase();
      googleName = userInfo.name || '';
      isEmailVerified = Boolean(userInfo.email_verified);
    } else {
      // Path B: Supabase Auth Code Exchange
      const admin = getSupabaseAdmin();
      const { data: sessionData, error: sessionErr } = await admin.auth.exchangeCodeForSession(code);

      if (sessionErr || !sessionData?.user) {
        console.error('[Google Callback] Supabase exchange failed:', sessionErr);
        return NextResponse.redirect(
          `${origin}/register?error=${encodeURIComponent('Gagal memverifikasi sesi Google via Supabase.')}`
        );
      }

      const user = sessionData.user;
      googleSub = user.id;
      googleEmail = (user.email || '').trim().toLowerCase();
      googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      isEmailVerified = Boolean(user.email_confirmed_at || user.confirmed_at);
    }

    if (!isEmailVerified) {
      return NextResponse.redirect(
        `${origin}/register?error=${encodeURIComponent('Email Google Anda belum berstatus verified oleh Google.')}`
      );
    }

    // Check if google_sub or email is already registered in database
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (hasSupabase) {
      const admin = getSupabaseAdmin();
      const { data: existingProfile } = await admin
        .from('profiles')
        .select('id, email, google_verified')
        .or(`google_sub.eq.${googleSub},email.eq.${googleEmail}`)
        .maybeSingle();

      if (existingProfile && existingProfile.google_verified) {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent('Akun Google ini sudah terdaftar. Silakan langsung masuk dengan password Anda.')}`
        );
      }
    }

    // Sign cryptographic short-lived registration token (15 mins)
    const regToken = await signRegistrationToken({
      google_sub: googleSub,
      email: googleEmail,
      name: googleName,
    });

    const targetUrl = new URL(`${origin}/register`);
    targetUrl.searchParams.set('token', regToken);
    targetUrl.searchParams.set('email', googleEmail);
    if (googleName) {
      targetUrl.searchParams.set('name', googleName);
    }

    return NextResponse.redirect(targetUrl.toString());
  } catch (err: unknown) {
    console.error('[Google Callback Fatal Error]:', err);
    return NextResponse.redirect(
      `${origin}/register?error=${encodeURIComponent('Terjadi kesalahan internal saat memproses verifikasi Google.')}`
    );
  }
}
