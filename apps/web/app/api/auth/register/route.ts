import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';
import { verifyRegistrationToken, signUserJwt } from '../../../../modules/auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, fullName, password, confirmPassword } = body;

    // 1. Verify Google Registration Binding Token
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token verifikasi akun Google wajib disertakan.' },
        { status: 400 }
      );
    }

    const verifiedGoogle = await verifyRegistrationToken(token);
    if (!verifiedGoogle || !verifiedGoogle.google_sub || !verifiedGoogle.email) {
      return NextResponse.json(
        {
          error: 'Sesi verifikasi akun Google tidak valid atau telah kedaluwarsa (15 menit). Silakan verifikasi ulang akun Google Anda.',
          tokenExpired: true,
        },
        { status: 400 }
      );
    }

    const cleanEmail = verifiedGoogle.email.trim().toLowerCase();
    const googleSub = verifiedGoogle.google_sub;
    const cleanName = typeof fullName === 'string' ? fullName.trim() : verifiedGoogle.name || '';

    if (!cleanName) {
      return NextResponse.json(
        { error: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    // 2. Password Strength Validation (Min 8 chars, letters & numbers)
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Konfirmasi password tidak cocok dengan password yang diinput.' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password harus minimal 8 karakter dan merupakan kombinasi huruf serta angka.' },
        { status: 400 }
      );
    }

    // 3. Hash Password using bcrypt (Cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Save to Database (Supabase Auth & profiles table)
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json(
        { error: 'Layanan database belum terkonfigurasi pada server.' },
        { status: 500 }
      );
    }

    const admin = getSupabaseAdmin();

    // Check if google_sub or email is already registered
    const { data: existingUser } = await admin
      .from('profiles')
      .select('id, google_verified')
      .or(`google_sub.eq.${googleSub},email.eq.${cleanEmail}`)
      .maybeSingle();

    if (existingUser && existingUser.google_verified) {
      return NextResponse.json(
        { error: 'Akun dengan identitas Google atau email ini sudah terdaftar. Silakan langsung login.' },
        { status: 409 }
      );
    }

    let userId = existingUser?.id;

    // Create user in Supabase Auth if not already existing
    if (!userId) {
      const { data: createdAuthUser, error: authCreateErr } = await admin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: cleanName,
          google_sub: googleSub,
          google_verified: true,
        },
      });

      if (authCreateErr) {
        // If already exists in auth.users, fetch by email
        console.warn('[Register API] createUser note:', authCreateErr.message);
        const { data: listData } = await admin.auth.admin.listUsers();
        const found = listData?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (found) {
          userId = found.id;
          // Update password in auth.users
          await admin.auth.admin.updateUserById(userId, { password });
        } else {
          return NextResponse.json(
            { error: `Gagal membuat kredensial akun: ${authCreateErr.message}` },
            { status: 500 }
          );
        }
      } else if (createdAuthUser?.user) {
        userId = createdAuthUser.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Gagal mengalokasikan identitas pengguna.' },
        { status: 500 }
      );
    }

    // Upsert into profiles table with google_sub, google_verified = true, and bcrypt password_hash
    const { error: profileErr } = await admin
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash,
          google_sub: googleSub,
          google_verified: true,
          role: 'user',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (profileErr) {
      console.error('[Register API] Error updating profile:', profileErr.message);
      return NextResponse.json(
        { error: `Gagal menyimpan profil akun terverifikasi: ${profileErr.message}` },
        { status: 500 }
      );
    }

    // 5. Issue Production Session Token (HS256 JWT)
    const sessionToken = await signUserJwt({
      sub: userId,
      email: cleanEmail,
      name: cleanName,
      role: 'user',
      google_verified: true,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Akun berhasil didaftarkan dengan verifikasi Google.',
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
        role: 'user',
      },
    });

    // 6. Set HTTP-Only, Secure, SameSite=Lax Cookie
    response.cookies.set('tembox_auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err: unknown) {
    console.error('[Register API Fatal Error]:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses registrasi.' },
      { status: 500 }
    );
  }
}
