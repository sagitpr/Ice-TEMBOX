import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';
import { signUserJwt } from '../../../../modules/auth/jwt';
import { checkLoginRateLimit, recordFailedLogin, resetLoginAttempts } from '../../../../modules/auth/rateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(request: Request): string {
  const xForwarded = request.headers.get('x-forwarded-for');
  if (xForwarded) {
    return xForwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimitKey = `${clientIp}:${email}`;

    // 1. Check Rate Limiter
    const rateLimitStatus = checkLoginRateLimit(rateLimitKey);
    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Silakan tunggu ${rateLimitStatus.retryAfterSec || 900} detik sebelum mencoba lagi.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimitStatus.retryAfterSec || 900) },
        }
      );
    }

    // 2. Strict Database Verification (No mock / No fallback)
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json(
        { error: 'Layanan autentikasi database belum terkonfigurasi pada server.' },
        { status: 500 }
      );
    }

    const admin = getSupabaseAdmin();

    // Look up user profile
    const { data: profile, error: profileErr } = await admin
      .from('profiles')
      .select('id, full_name, email, role, password_hash, google_verified')
      .eq('email', email)
      .maybeSingle();

    if (profileErr) {
      console.error('[Login API] Error querying profile:', profileErr.message);
      return NextResponse.json(
        { error: 'Terjadi gangguan saat memverifikasi akun.' },
        { status: 500 }
      );
    }

    if (!profile) {
      recordFailedLogin(rateLimitKey);
      return NextResponse.json(
        { error: 'Email atau password salah.' },
        { status: 401 }
      );
    }

    // 3. Check Google Verification Binding
    if (!profile.google_verified) {
      return NextResponse.json(
        {
          error: 'Akun Anda belum menyelesaikan verifikasi Google. Silakan lengkapi pendaftaran akun Anda terlebih dahulu.',
          unverified: true,
        },
        { status: 403 }
      );
    }

    // 4. Validate Password against Hash
    let isPasswordValid = false;

    if (profile.password_hash) {
      isPasswordValid = await bcrypt.compare(password, profile.password_hash);
    } else {
      // Fall back to native Supabase Auth password verification
      const { data: authData, error: authErr } = await admin.auth.signInWithPassword({
        email,
        password,
      });

      if (!authErr && authData?.user) {
        isPasswordValid = true;
        // Self-heal: store bcrypt hash in profiles for high-performance direct checking
        try {
          const newHash = await bcrypt.hash(password, 12);
          await admin.from('profiles').update({ password_hash: newHash }).eq('id', profile.id);
        } catch {}
      }
    }

    if (!isPasswordValid) {
      const attempts = recordFailedLogin(rateLimitKey);
      const remaining = Math.max(0, 5 - attempts);
      return NextResponse.json(
        {
          error: remaining > 0
            ? `Email atau password salah. Sisa percobaan: ${remaining} kali.`
            : 'Email atau password salah. Batas percobaan tercapai.',
        },
        { status: 401 }
      );
    }

    // 5. Reset Rate Limit on Successful Password Match
    resetLoginAttempts(rateLimitKey);

    // 6. Issue Cryptographic HS256 JWT
    const token = await signUserJwt({
      sub: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.role || 'user',
      google_verified: true,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role || 'user',
      },
    });

    // 7. Set HTTP-Only, Secure, SameSite=Lax Cookie
    response.cookies.set('tembox_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    console.error('[Login API Fatal Error]:', error);
    return NextResponse.json(
      { error: 'Gagal memproses permintaan login.' },
      { status: 500 }
    );
  }
}
