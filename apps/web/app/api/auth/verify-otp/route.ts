import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../../../modules/email/email.service';
import { verifyAndConsumeOtp } from '../../../../modules/auth/otp.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, recipientName, otpCode } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Alamat email pengguna tidak valid.' },
        { status: 400 }
      );
    }

    if (!otpCode || String(otpCode).trim().length < 6) {
      return NextResponse.json(
        { error: 'Kode OTP 6-digit tidak valid.' },
        { status: 400 }
      );
    }

    // Cryptographic validation against stored hash, expiry, max attempts & single-use consumption
    const verification = await verifyAndConsumeOtp(email, String(otpCode).trim(), 'register');
    if (!verification.valid) {
      return NextResponse.json(
        {
          error: verification.error || 'Verifikasi kode OTP gagal.',
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    const cleanName = (recipientName && String(recipientName).trim()) || email.split('@')[0] || 'Pengguna TEMBOX';

    // Dispatch official welcome email with isolated error boundary so SMTP issues never fail account verification
    try {
      await sendWelcomeEmail({
        toEmail: email,
        recipientName: cleanName,
      });
    } catch (emailErr) {
      console.error('[Verify OTP] Gagal mengirimkan welcome email (verifikasi akun tetap berhasil):', emailErr);
    }

    const cleanUserId = (email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'nelayan';
    const sessionToken = `tbx_token_${cleanUserId}_${Date.now().toString(36)}`;

    const response = NextResponse.json({
      success: true,
      message: 'Akun Anda berhasil diverifikasi. Selamat datang di TEMBOX.',
      user: {
        id: `usr_${cleanUserId}`,
        userId: `usr_${cleanUserId}`,
        email,
        name: cleanName,
        verified: true,
        token: sessionToken,
      },
    });

    // Set secure HttpOnly session cookie for middleware route guards
    response.cookies.set('tembox_auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: unknown) {
    console.error('Verify OTP server error:', error);
    const message = error instanceof Error ? error.message : 'Gagal memproses verifikasi OTP.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
