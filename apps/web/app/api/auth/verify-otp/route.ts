import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';
import { sendWelcomeEmail } from '../../../../modules/email/email.service';
import { verifyAndConsumeOtp } from '../../../../modules/auth/otp.service';
import { signUserJwt } from '../../../../modules/auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const cleanEmail = rawEmail.toLowerCase().trim();
    const recipientName = typeof body.recipientName === 'string' ? body.recipientName.trim() : '';
    const otpCode = typeof body.otpCode === 'string' ? body.otpCode.trim() : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!otpCode || otpCode.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Masukkan 6 digit kode OTP verifikasi yang lengkap.' },
        { status: 400 }
      );
    }

    // 1. Verify OTP against stored hash, expiry (5 min), max attempts & consumption
    const verification = await verifyAndConsumeOtp(cleanEmail, otpCode, 'register');
    if (!verification.valid) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Kode verifikasi OTP salah atau telah kedaluwarsa.',
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // 2. Update Database: email_verified = true
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let userId = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}`;
    let finalName = recipientName || cleanEmail.split('@')[0] || 'Pengguna TEMBOX';
    let role = 'user';

    if (hasSupabase) {
      const admin = getSupabaseAdmin();
      const { data: profile } = await admin
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profile) {
        userId = profile.id;
        finalName = profile.full_name || finalName;
        role = profile.role || role;

        await admin
          .from('profiles')
          .update({
            email_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);
      }
    }

    // 3. Send Welcome Email in background
    try {
      await sendWelcomeEmail({
        toEmail: cleanEmail,
        recipientName: finalName,
      });
    } catch (emailErr) {
      console.warn('[Verify OTP] Warning sending welcome email:', emailErr);
    }

    // 4. Issue Production HS256 JWT
    const sessionToken = await signUserJwt({
      sub: userId,
      email: cleanEmail,
      name: finalName,
      role,
      google_verified: false,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Akun Anda berhasil diverifikasi. Selamat datang di TEMBOX.',
      user: {
        id: userId,
        email: cleanEmail,
        name: finalName,
        role,
      },
    });

    // 5. Set HTTP-Only, Secure, SameSite=Lax Cookie
    response.cookies.set('tembox_auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    console.error('[Verify OTP Server Error]:', error);
    const message = error instanceof Error ? error.message : 'Gagal memproses verifikasi OTP.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
