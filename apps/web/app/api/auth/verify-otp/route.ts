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

    return NextResponse.json({
      success: true,
      message: 'Akun Anda berhasil diverifikasi. Selamat datang di TEMBOX.',
      user: {
        email,
        name: cleanName,
        verified: true,
      },
    });
  } catch (error: unknown) {
    console.error('Verify OTP server error:', error);
    const message = error instanceof Error ? error.message : 'Gagal memproses verifikasi OTP.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
