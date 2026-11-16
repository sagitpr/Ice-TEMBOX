import { NextResponse } from 'next/server';
import { sendOtpEmail } from '../../../../modules/email/email.service';
import { createAndSaveOtp } from '../../../../modules/auth/otp.service';
import { verifyRecaptchaToken } from '../../../../modules/security/recaptcha.service';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, recipientName, recaptchaToken } = body;

    // 0. Anti-bot validation via Google reCAPTCHA v3 (lewati jika RECAPTCHA_SECRET_KEY tidak disetel)
    if (process.env.RECAPTCHA_SECRET_KEY?.trim()) {
      const recaptchaCheck = await verifyRecaptchaToken(recaptchaToken, 'send_otp');
      if (!recaptchaCheck.success) {
        const errMsg = recaptchaCheck.error || 'Verifikasi keamanan reCAPTCHA gagal.';
        return NextResponse.json(
          { success: false, error: errMsg, message: errMsg },
          { status: 403 }
        );
      }
    }

    if (!email || !email.includes('@')) {
      const errMsg = 'Alamat email penerima tidak valid.';
      return NextResponse.json(
        { success: false, error: errMsg, message: errMsg },
        { status: 400 }
      );
    }

    // 1. Validasi keberadaan konfigurasi SMTP di server sebelum proses pengiriman
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

    if (!smtpUser || !smtpPass) {
      const errMsg = 'Konfigurasi email server belum lengkap: SMTP_USER atau SMTP_PASS belum disetel.';
      console.error(`[Send OTP] ${errMsg}`);
      return NextResponse.json(
        { success: false, error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 2. Cryptographically secure hashed OTP generation with 10-minute expiration & attempt throttling
    const { otpCode } = await createAndSaveOtp(email, 'register');

    // 3. Wajib await proses pengiriman email OTP secara eksplisit sebelum return response
    try {
      const mailInfo = await sendOtpEmail({
        to: email.trim(),
        otpCode,
        recipientName,
      });
      console.log(`[Send OTP] Email OTP berhasil dikirim ke ${email}:`, mailInfo?.messageId);
    } catch (smtpErr: unknown) {
      console.error('[Send OTP SMTP Error]:', smtpErr);
      const errMsg = smtpErr instanceof Error ? smtpErr.message : 'Gagal mengirim email OTP melalui SMTP server.';
      return NextResponse.json(
        { success: false, error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kode verifikasi OTP berhasil dikirimkan ke email Anda.',
    });
  } catch (error: unknown) {
    console.error('[Send OTP Error]:', error);
    const errMsg = error instanceof Error ? error.message : 'Gagal mengirimkan kode OTP ke email.';
    return NextResponse.json(
      { success: false, error: errMsg, message: errMsg },
      { status: 500 }
    );
  }
}
