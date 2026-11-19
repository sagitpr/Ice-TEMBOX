import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAndConsumeOtp } from '../../../../modules/auth/otp.service';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/reset-password
 * Handles verifying the OTP and updating the user's password.
 */
export async function POST(request: Request) {
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
    console.error('[Reset Password Error]:', err);
    const errMsg = err instanceof Error ? err.message : 'Gagal memperbarui password akun.';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
