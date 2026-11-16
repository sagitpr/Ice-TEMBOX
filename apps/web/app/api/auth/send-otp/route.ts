import { NextResponse } from 'next/server';
import { getMailTransporter, buildOtpVerificationEmail } from '../../../../modules/email/email.service';
import { createAndSaveOtp, deleteOtp } from '../../../../modules/auth/otp.service';
import { verifyRecaptchaToken } from '../../../../modules/security/recaptcha.service';

// Memastikan route berjalan di Node.js Serverless Runtime penuh (bukan Edge Runtime)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    // Normalisasi alamat email penerima: huruf kecil dan tanpa spasi
    const cleanEmail = rawEmail.toLowerCase().trim();
    const recipientName = typeof body.recipientName === 'string' ? body.recipientName.trim() : '';
    const recaptchaToken = body.recaptchaToken;

    // 0. Anti-bot validation via Google reCAPTCHA v3 (lewati jika RECAPTCHA_SECRET_KEY tidak disetel)
    if (process.env.RECAPTCHA_SECRET_KEY?.trim()) {
      const recaptchaCheck = await verifyRecaptchaToken(recaptchaToken, 'send_otp');
      if (!recaptchaCheck.success) {
        const errMsg = recaptchaCheck.error || 'Verifikasi keamanan reCAPTCHA gagal.';
        return NextResponse.json(
          { success: false, status: 'recaptcha_failed', error: errMsg, message: errMsg },
          { status: 403 }
        );
      }
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const errMsg = 'Alamat email penerima tidak valid.';
      return NextResponse.json(
        { success: false, status: 'invalid_email', error: errMsg, message: errMsg },
        { status: 400 }
      );
    }

    // 1. Validasi keberadaan konfigurasi SMTP di server sebelum proses pengiriman
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT?.trim() || 465);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

    if (!smtpUser || !smtpPass) {
      const errMsg = 'Konfigurasi email server belum lengkap: SMTP_USER atau SMTP_PASS belum disetel.';
      console.error(`[Send OTP] ${errMsg}`);
      return NextResponse.json(
        { success: false, status: 'smtp_unconfigured', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 2. Simpan record OTP ke tabel otp_verifications di Supabase terlebih dahulu
    let otpCode: string;
    try {
      const otpRecord = await createAndSaveOtp(cleanEmail, 'register');
      otpCode = otpRecord.otpCode;
    } catch (dbErr: unknown) {
      console.error('[Send OTP Database Insert Error]:', dbErr);
      const errMsg = dbErr instanceof Error ? dbErr.message : 'Gagal menyimpan verifikasi OTP ke database Supabase.';
      return NextResponse.json(
        { success: false, status: 'database_failed', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 3. Pengiriman email OTP via Nodemailer dengan transporter Contact
    let info: any;
    try {
      const transporter = getMailTransporter();
      const htmlContent = buildOtpVerificationEmail({ otpCode, recipientName });

      const mailOptions = {
        from: `"TEMBOX Security" <${smtpUser}>`,
        to: cleanEmail,
        subject: 'Kode Verifikasi OTP TEMBOX',
        text: `Halo ${recipientName || 'Pengguna TEMBOX'},\n\nKode verifikasi OTP TEMBOX Anda adalah: ${otpCode}\n\nKode ini berlaku selama 10 menit. Masukkan kode ini pada layar verifikasi untuk mengaktifkan akun Anda.\n\nJangan berikan kode ini kepada siapapun demi keamanan akun Anda.\n\nSalam,\nTim Keamanan TEMBOX`,
        html: htmlContent,
      };

      info = await transporter.sendMail(mailOptions);

      // Safe Diagnostic Logging (Mencatat parameter pengiriman tanpa OTP maupun kredensial)
      console.log('[Send OTP Diagnostic - SMTP Dispatch]:', {
        messageId: info?.messageId,
        accepted: info?.accepted,
        rejected: info?.rejected,
        response: info?.response,
        envelope: info?.envelope,
        smtpHost,
        smtpPort,
      });
    } catch (smtpErr: unknown) {
      const errorObj = smtpErr as Record<string, unknown> | null;
      console.error('[Send OTP Diagnostic - SMTP Failed]:', {
        message: smtpErr instanceof Error ? smtpErr.message : String(smtpErr),
        code: errorObj?.code,
        responseCode: errorObj?.responseCode,
        command: errorObj?.command,
        timeoutType: errorObj?.timeoutType,
        response: errorObj?.response,
      });

      // Rollback: Hapus record OTP dari Supabase karena pengiriman email gagal
      await deleteOtp(cleanEmail, 'register').catch(() => {});
      const errMsg = smtpErr instanceof Error ? smtpErr.message : 'Gagal mengirim email OTP melalui server SMTP.';
      return NextResponse.json(
        {
          success: false,
          status: 'smtp_failed',
          error: errMsg,
          message: errMsg,
        },
        { status: 500 }
      );
    }

    // 4. Validasi apakah alamat email penerima benar-benar diterima oleh server SMTP
    const isAccepted = Array.isArray(info?.accepted) && info.accepted.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );
    const isRejected = Array.isArray(info?.rejected) && info.rejected.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );

    // Kategori: SMTP Menolak Penerima
    if (!isAccepted || isRejected) {
      console.warn('[Send OTP Diagnostic - Recipient Rejected]:', {
        recipient: cleanEmail,
        accepted: info?.accepted,
        rejected: info?.rejected,
        response: info?.response,
      });

      // Rollback record OTP dari Supabase
      await deleteOtp(cleanEmail, 'register').catch(() => {});

      const rejectMsg = isRejected
        ? `Alamat email ${cleanEmail} ditolak oleh server SMTP tujuan.`
        : `Server SMTP tidak menerima alamat penerima ${cleanEmail}.`;

      return NextResponse.json(
        {
          success: false,
          status: 'smtp_rejected',
          error: rejectMsg,
          message: rejectMsg,
          diagnostic: {
            rejected: info?.rejected || [],
            response: info?.response || '',
          },
        },
        { status: 422 }
      );
    }

    // Kategori: SMTP Berhasil Menerima Email (Catatan: Ini adalah bukti server SMTP telah menerima antrean pesan, bukan jaminan email langsung tiba di Inbox tanpa tersaring Spam)
    return NextResponse.json({
      success: true,
      status: 'smtp_accepted',
      message: 'Kode verifikasi telah diterima server SMTP untuk diteruskan ke email Anda. Harap periksa folder Kotak Masuk (Inbox) dan Spam.',
      delivery: {
        messageId: info?.messageId,
        accepted: info?.accepted,
        response: info?.response,
      },
    });
  } catch (error: unknown) {
    console.error('[Send OTP Global Error]:', error);
    const errMsg = error instanceof Error ? error.message : 'Gagal memproses pengiriman OTP.';
    return NextResponse.json(
      { success: false, status: 'server_error', error: errMsg, message: errMsg },
      { status: 500 }
    );
  }
}
