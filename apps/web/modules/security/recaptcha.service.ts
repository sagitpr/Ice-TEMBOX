/**
 * Google reCAPTCHA v3 Server-Side Verification Service.
 * Validates reCAPTCHA tokens against Google's siteverify API.
 * If RECAPTCHA_SECRET_KEY is not configured, safely bypasses validation
 * to ensure development and local testing proceed without friction.
 */

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
  bypassed?: boolean;
}

export async function verifyRecaptchaToken(
  token?: string | null,
  expectedAction?: string
): Promise<RecaptchaVerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY?.trim();

  // If secret key is not set, safely bypass (graceful dev fallback)
  if (!secretKey) {
    return {
      success: true,
      score: 1.0,
      bypassed: true,
    };
  }

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return {
      success: false,
      error: 'Token reCAPTCHA tidak ditemukan atau tidak valid.',
    };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token.trim());

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      // 5-second timeout to prevent serverless function hangs
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Google reCAPTCHA API mengembalikan status HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      const errorCodes = Array.isArray(data['error-codes'])
        ? data['error-codes'].join(', ')
        : 'Verifikasi token ditolak oleh Google';
      return {
        success: false,
        error: `Verifikasi reCAPTCHA gagal (${errorCodes})`,
      };
    }

    const score = typeof data.score === 'number' ? data.score : 1.0;
    const action = data.action;

    // reCAPTCHA v3 score threshold (0.0 to 1.0, >= 0.5 is considered legitimate user traffic)
    if (score < 0.5) {
      console.warn(`[reCAPTCHA] Bot suspected. Score: ${score}, action: ${action}`);
      return {
        success: false,
        score,
        action,
        error: 'Aktivitas mencurigakan terdeteksi oleh sistem keamanan bot (skor terlalu rendah).',
      };
    }

    if (expectedAction && action && action !== expectedAction) {
      console.warn(`[reCAPTCHA] Action mismatch. Expected: ${expectedAction}, got: ${action}`);
      return {
        success: false,
        score,
        action,
        error: `Action reCAPTCHA tidak sesuai (diharapkan: ${expectedAction}, diterima: ${action})`,
      };
    }

    return {
      success: true,
      score,
      action,
    };
  } catch (err: unknown) {
    console.error('[reCAPTCHA Service Error]:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Gagal menghubungi server verifikasi reCAPTCHA.',
    };
  }
}
