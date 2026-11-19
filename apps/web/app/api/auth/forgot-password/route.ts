import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getMailTransporter } from '../../../../modules/email/email.service';
import { buildOtpVerificationEmail } from '../../../../modules/email/otpEmail.template';
import { createAndSaveOtp, deleteOtp, verifyAndConsumeOtp } from '../../../../modules/auth/otp.service';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';
import { verifyRecaptchaToken } from '../../../../modules/auth/verifyRecaptcha';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/forgot-password
 * Handles requesting an OTP for resetting password.
 * Checks account existence & status, generates 6-digit OTP, stores it in Supabase, and dispatches via SMTP.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const cleanEmail = rawEmail.toLowerCase().trim();
    const recaptchaToken = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : '';

    // 0. Verify Google reCAPTCHA v2 Checkbox
    const recaptchaCheck = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaCheck.success) {
      return NextResponse.json(
        { success: false, error: recaptchaCheck.error || 'Verifikasi reCAPTCHA gagal.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const errMsg = 'Masukkan alamat email yang valid.';
      return NextResponse.json(
        { success: false, status: 'invalid_email', error: errMsg, message: errMsg },
        { status: 400 }
      );
    }

    // 1. Verify Database and Check Account Existence & Status
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
    const { data: profile, error: profileErr } = await admin
      .from('profiles')
      .select('id, email, full_name, email_verified')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (profileErr) {
      console.error('[Forgot Password] Profile lookup error:', profileErr.message);
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

    // 2. Verify SMTP server configuration
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');

    if (!smtpUser || !smtpPass) {
      const errMsg = 'Konfigurasi email server belum lengkap: SMTP_USER atau SMTP_PASS belum disetel.';
      console.error(`[Forgot Password] ${errMsg}`);
      return NextResponse.json(
        { success: false, status: 'smtp_unconfigured', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 3. Generate and persist 6-digit OTP into Supabase with 'reset_password' purpose
    let otpCode: string;
    try {
      const otpRecord = await createAndSaveOtp(cleanEmail, 'reset_password');
      otpCode = otpRecord.otpCode;
    } catch (dbErr: unknown) {
      console.error('[Forgot Password - Database Insert Error]:', dbErr);
      const errMsg = dbErr instanceof Error ? dbErr.message : 'Gagal menyimpan verifikasi OTP ke database Supabase.';
      return NextResponse.json(
        { success: false, status: 'database_failed', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 4. Dispatch branded email with OTP code via Nodemailer SMTP
    let info: any;
    try {
      const transporter = getMailTransporter();
      const recipientName = profile.full_name || cleanEmail.split('@')[0];
      const htmlContent = buildOtpVerificationEmail({
        otpCode,
        recipientName,
        purposeTitle: 'Reset Password',
        purposeMessage: 'Kami menerima permintaan untuk mengatur ulang password akun Anda di platform TEMBOX. Gunakan 6 digit kode One-Time Password (OTP) berikut untuk melanjutkan proses reset password:',
      });

      const mailOptions = {
        from: `"TEMBOX Security" <${smtpUser}>`,
        to: cleanEmail,
        subject: 'Kode OTP Reset Password Akun TEMBOX',
        text: `Halo ${recipientName},\n\nKode OTP reset password TEMBOX Anda adalah: ${otpCode}\n\nKode ini berlaku selama 5 menit. Masukkan kode ini untuk mengatur ulang password akun Anda.\n\nDemi keamanan akun Anda, jangan berikan kode ini kepada siapa pun. Jika Anda tidak merasa meminta reset password, abaikan email ini.\n\nSalam,\nTim Keamanan TEMBOX`,
        html: htmlContent,
      };

      info = await transporter.sendMail(mailOptions);

      console.log('[Forgot Password - SMTP Dispatched]:', {
        recipient: cleanEmail,
        messageId: info?.messageId,
        accepted: info?.accepted,
        rejected: info?.rejected,
      });
    } catch (smtpErr: unknown) {
      console.error('[Forgot Password - SMTP Dispatch Failed]:', smtpErr);
      // Rollback OTP record in Supabase so no stale OTP is left
      await deleteOtp(cleanEmail, 'reset_password').catch(() => {});
      const errMsg = smtpErr instanceof Error ? smtpErr.message : 'Gagal mengirim email kode OTP melalui server SMTP.';
      return NextResponse.json(
        { success: false, status: 'smtp_failed', error: errMsg, message: errMsg },
        { status: 500 }
      );
    }

    // 5. Validate recipient acceptance by SMTP
    const isAccepted = Array.isArray(info?.accepted) && info.accepted.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );
    const isRejected = Array.isArray(info?.rejected) && info.rejected.some(
      (addr: string) => String(addr).toLowerCase().trim() === cleanEmail
    );

    if (!isAccepted || isRejected) {
      await deleteOtp(cleanEmail, 'reset_password').catch(() => {});
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
      message: `Kode verifikasi 6 digit telah berhasil dikirim ke ${cleanEmail}.`,
    });
  } catch (err: unknown) {
    console.error('[Forgot Password Error]:', err);
    const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan pada server saat memproses permintaan reset password.';
    return NextResponse.json(
      { success: false, error: errMsg, message: errMsg },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/forgot-password
 * Handles verifying the OTP and updating the user's password.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const cleanEmail = rawEmail.toLowerCase().trim();
    const otpCode = typeof body.otpCode === 'string' ? body.otpCode.trim() : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!otpCode || otpCode.length < 6) {
      return NextResponse.json(
        { error: 'Masukkan 6 digit kode OTP yang lengkap.' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password baru minimal harus 8 karakter.' },
        { status: 400 }
      );
    }

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

    // 1. Check account existence & activation status
    const { data: profile, error: profileErr } = await admin
      .from('profiles')
      .select('id, email, password_hash, email_verified')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (profileErr) {
      console.error('[Reset Password] Profile query error:', profileErr.message);
      return NextResponse.json(
        { error: 'Terjadi kesalahan sistem saat memverifikasi akun.' },
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

    // 2. Cryptographically verify and consume OTP for 'reset_password'
    const verification = await verifyAndConsumeOtp(cleanEmail, otpCode, 'reset_password');
    if (!verification.valid) {
      const errMsg = verification.error || 'Kode OTP tidak valid atau telah kedaluwarsa.';
      return NextResponse.json(
        {
          success: false,
          error: errMsg,
          message: errMsg,
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // 3. Hash new password and update profiles table
    const newHash = await bcrypt.hash(newPassword, 12);
    const { error: updateErr } = await admin
      .from('profiles')
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (updateErr) {
      console.error('[Reset Password] Failed to update password_hash:', updateErr.message);
      return NextResponse.json(
        { error: 'Gagal memperbarui password pada database.' },
        { status: 500 }
      );
    }

    // 4. Also update Supabase Auth user password if exists
    try {
      const { data: usersData } = await admin.auth.admin.listUsers();
      const targetUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase().trim() === cleanEmail
      );

      if (targetUser) {
        await admin.auth.admin.updateUserById(targetUser.id, {
          password: newPassword,
        });
      }
    } catch (authErr) {
      console.warn('[Reset Password] Supabase Auth update warning note:', authErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Password akun Anda berhasil diperbarui. Silakan masuk menggunakan password baru.',
    });
  } catch (err: unknown) {
    console.error('[Forgot Password Reset Error]:', err);
    const errMsg = err instanceof Error ? err.message : 'Gagal memperbarui password akun.';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
