import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';
import { createAndSaveOtp } from '../../../../modules/auth/otp.service';
import { verifyRecaptchaToken } from '../../../../modules/auth/verifyRecaptcha';
import { getMailTransporter, buildOtpVerificationEmail } from '../../../../modules/email/email.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fullName, email, password, confirmPassword, recaptchaToken } = body;

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanName = typeof fullName === 'string' ? fullName.trim() : '';

    // 1. Google reCAPTCHA v2 Checkbox Server-Side Validation
    const recaptchaCheck = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaCheck.success) {
      return NextResponse.json(
        { success: false, error: recaptchaCheck.error || 'Verifikasi reCAPTCHA gagal.' },
        { status: 400 }
      );
    }

    // 2. Input Validations
    if (!cleanName) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Konfirmasi password tidak cocok dengan password yang diinput.' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password harus minimal 8 karakter dan merupakan kombinasi huruf serta angka.' },
        { status: 400 }
      );
    }

    // 3. Check Existing Active User in Database
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json(
        { success: false, error: 'Layanan database belum terkonfigurasi pada server.' },
        { status: 500 }
      );
    }

    const admin = getSupabaseAdmin();

    const { data: existingUser } = await admin
      .from('profiles')
      .select('id, email_verified')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser && existingUser.email_verified) {
      return NextResponse.json(
        { success: false, error: 'Email ini sudah terdaftar dan terverifikasi. Silakan langsung masuk ke akun Anda.' },
        { status: 409 }
      );
    }

    // 4. Hash Password (bcrypt 12 cost factor)
    const passwordHash = await bcrypt.hash(password, 12);

    let userId = existingUser?.id;

    // Create or update user in Supabase Auth
    if (!userId) {
      const { data: createdAuthUser, error: authCreateErr } = await admin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: false,
        user_metadata: { full_name: cleanName },
      });

      if (createdAuthUser?.user) {
        userId = createdAuthUser.user.id;
      } else if (authCreateErr) {
        const { data: listData } = await admin.auth.admin.listUsers();
        const found = listData?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (found) {
          userId = found.id;
          await admin.auth.admin.updateUserById(userId, { password });
        }
      }
    }

    // Save profile with email_verified = false until OTP confirmation
    if (userId) {
      await admin.from('profiles').upsert(
        {
          id: userId,
          full_name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash,
          email_verified: false,
          role: 'user',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    }

    // 5. Generate 6-Digit OTP (5 minutes expiry)
    const otpResult = await createAndSaveOtp(cleanEmail, 'register');
    const otpCode = otpResult.otpCode;

    // 6. Send OTP Verification Email via Nodemailer SMTP
    try {
      const smtpUser = process.env.SMTP_USER?.trim();
      const transporter = getMailTransporter();
      const htmlContent = buildOtpVerificationEmail({ otpCode, recipientName: cleanName });

      await transporter.sendMail({
        from: `"TEMBOX Security" <${smtpUser}>`,
        to: cleanEmail,
        subject: 'Kode Verifikasi OTP Pendaftaran TEMBOX',
        text: `Halo ${cleanName},\n\nKode verifikasi OTP TEMBOX Anda adalah: ${otpCode}\n\nKode ini berlaku selama 5 menit. Masukkan kode ini pada layar registrasi untuk mengaktifkan akun Anda.\n\nSalam,\nTim Keamanan TEMBOX`,
        html: htmlContent,
      });
    } catch (smtpErr: unknown) {
      console.error('[Register API SMTP Error]:', smtpErr);
      return NextResponse.json(
        { success: false, error: 'Gagal mengirim email kode OTP. Pastikan konfigurasi email SMTP aktif.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      step: 'otp',
      email: cleanEmail,
      recipientName: cleanName,
      message: `Kode verifikasi OTP 6-digit telah dikirim ke ${cleanEmail}. Berlaku selama 5 menit.`,
    });
  } catch (err: unknown) {
    console.error('[Register API Fatal Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses registrasi.' },
      { status: 500 }
    );
  }
}
