import { NextResponse } from 'next/server';
import { sendOtpEmail } from '../../../../modules/email/email.service';
import { createAndSaveOtp } from '../../../../modules/auth/otp.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, recipientName } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Alamat email penerima tidak valid.' },
        { status: 400 }
      );
    }

    // Cryptographically secure hashed OTP generation with 10-minute expiration & attempt throttling
    const { otpCode } = await createAndSaveOtp(email, 'register');

    await sendOtpEmail({
      to: email,
      otpCode,
      recipientName,
    });

    return NextResponse.json({
      success: true,
      message: 'Kode verifikasi OTP berhasil dikirimkan ke email Anda.',
    });
  } catch (error: unknown) {
    console.error('Send OTP error:', error);
    const message = error instanceof Error ? error.message : 'Gagal mengirimkan kode OTP.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
