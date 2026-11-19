import { NextResponse } from 'next/server';
import { getMailTransporter } from '../../../../modules/email/email.service';
import { buildOtpVerificationEmail } from '../../../../modules/email/otpEmail.template';
import { createAndSaveOtp, deleteOtp } from '../../../../modules/auth/otp.service';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/resend-otp
 * Handles resending OTP for both registration and forgot-password flows.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const cleanEmail = rawEmail.toLowerCase().trim();
    const purpose: 'register' | 'reset_password' =
      body.purpose === 'reset_password' ? 'reset_password' : 'register';
    const recipientName = typeof body.recipientName === 'string' ? body.recipientName.trim() : cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const errMsg = 'Masukkan alamat email yang valid.';
      return NextResponse.json(
        { success: false, status: 'invalid_email', error: errMsg, message: errMsg },
        { status: 400 }
      );
    }

    // Check account existence if resending for reset_password
    if (purpose === 'reset_password') {
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      if (hasSupabase) {
        const admin = getSupabaseAdmin();
        const { data: profile, error: profileErr } = await admin
          .from('profiles')
          .select('id, email, email_verified')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (profileErr) {
          console.error('[Resend OTP] Profile query error:', profileErr.message);
          return NextResponse.json(
            { error: 'Terjadi gangguan sistem saat memeriksa akun.' },
            { status: 500 }
          );
        }

        if (!profile) {
          return NextResponse.json(
            { error: 'Email tidak terdaftar dalam sistem.' },
            { status: 404 }
          );
        }

        if (profile.email_verified === false) {
          return NextResponse.json(
            { error: 'Akun belum diaktivasi. Silakan selesaikan verifikasi pendaftaran.' },
            { status: 403 }
          );
        }
      }
    }

    // 1. Validate SMTP credentials
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

    if (!smtpUser || !smtpPass) {
      const errMsg = 'Konfigurasi email server belum lengkap: SMTP_USER atau SMTP_PASS belum disetel.';
      console.error(`[Resend OTP] ${errMsg}`);
      return NextResponse.json(
        { success: false, status: 'smtp_unconfigured', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 2. Generate new OTP and save to Supabase
    let otpCode: string;
    try {
      const otpRecord = await createAndSaveOtp(cleanEmail, purpose);
      otpCode = otpRecord.otpCode;
    } catch (dbErr: unknown) {
      console.error('[Resend OTP - Database Insert Error]:', dbErr);
      const errMsg = dbErr instanceof Error ? dbErr.message : 'Gagal menyimpan verifikasi OTP ke database Supabase.';
      return NextResponse.json(
        { success: false, status: 'database_failed', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 3. Dispatch branded email with new OTP code
    let info: any;
    try {
      const transporter = getMailTransporter();
      const isReset = purpose === 'reset_password';
      const htmlContent = buildOtpVerificationEmail({
        otpCode,
        recipientName,
        purposeTitle: isReset ? 'Reset Password' : 'Verifikasi Akun',
        purposeMessage: isReset
          ? 'Kami mengirimkan ulang kode One-Time Password (OTP) untuk mengatur ulang password akun Anda di TEMBOX:'
          : 'Kami mengirimkan ulang kode One-Time Password (OTP) untuk menyelesaikan verifikasi akun Anda di TEMBOX:',
      });

      const mailOptions = {
        from: `"TEMBOX Security" <${smtpUser}>`,
        to: cleanEmail,
        subject: isReset ? 'Kode OTP Baru Reset Password TEMBOX' : 'Kode OTP Baru Verifikasi Akun TEMBOX',
        text: `Halo ${recipientName},\n\nKode OTP baru Anda adalah: ${otpCode}\n\nKode ini berlaku selama 10 menit. Masukkan kode ini pada layar verifikasi.\n\nDemi keamanan akun Anda, jangan berikan kode ini kepada siapa pun.\n\nSalam,\nTim Keamanan TEMBOX`,
        html: htmlContent,
      };

      info = await transporter.sendMail(mailOptions);

      console.log('[Resend OTP - SMTP Dispatched]:', {
        recipient: cleanEmail,
        purpose,
        messageId: info?.messageId,
      });
    } catch (smtpErr: unknown) {
      console.error('[Resend OTP - SMTP Failed]:', smtpErr);
      await deleteOtp(cleanEmail, purpose).catch(() => {});
      const errMsg = smtpErr instanceof Error ? smtpErr.message : 'Gagal mengirim ulang kode OTP melalui server SMTP.';
      return NextResponse.json(
        { success: false, status: 'smtp_failed', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 4. Check recipient acceptance
    const isAccepted = Array.isArray(info?.accepted) && info.accepted.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );
    const isRejected = Array.isArray(info?.rejected) && info.rejected.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );

    if (!isAccepted || isRejected) {
      await deleteOtp(cleanEmail, purpose).catch(() => {});
      const rejectMsg = isRejected
        ? `Alamat email ${cleanEmail} ditolak oleh server SMTP.`
        : `Server SMTP tidak menerima alamat penerima ${cleanEmail}.`;
      return NextResponse.json(
        { success: false, status: 'smtp_rejected', error: rejectMsg, message: rejectMsg },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Kode OTP baru telah berhasil dikirim ke ${cleanEmail}.`,
    });
  } catch (err: unknown) {
    console.error('[Resend OTP Error]:', err);
    const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan pada server saat mengirim ulang kode OTP.';
    return NextResponse.json(
      { success: false, error: errMsg, message: errMsg },
      { status: 500 }
    );
  }
}
