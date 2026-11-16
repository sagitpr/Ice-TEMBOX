import { NextResponse } from 'next/server';
import { sendOtpEmail } from '../../../../modules/email/email.service';

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

    // Generate 6-digit OTP
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

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
