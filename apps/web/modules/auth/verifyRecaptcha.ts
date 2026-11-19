export async function verifyRecaptchaToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return {
      success: false,
      error: 'Silakan centang verifikasi reCAPTCHA ("I\'m not a robot").',
    };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('[reCAPTCHA] RECAPTCHA_SECRET_KEY belum didefinisikan di environment.');
    return {
      success: false,
      error: 'Konfigurasi reCAPTCHA server belum lengkap.',
    };
  }

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await res.json().catch(() => ({}));

    if (data.success === true) {
      return { success: true };
    }

    console.warn('[reCAPTCHA verification failed]:', data['error-codes']);
    return {
      success: false,
      error: 'Verifikasi reCAPTCHA tidak valid. Silakan centang kembali.',
    };
  } catch (err) {
    console.error('[reCAPTCHA network error]:', err);
    return {
      success: false,
      error: 'Gagal menghubungi server verifikasi Google reCAPTCHA.',
    };
  }
}
