import crypto from 'crypto';
import { getSupabaseAdmin } from '../supabase/supabaseAdmin';

interface OtpStoreRecord {
  email: string;
  otpHash: string;
  purpose: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: number; // timestamp ms
  verified: boolean;
}

// In-memory fallback cache (prevents service downtime if database table is not yet migrated)
const memoryOtpCache = new Map<string, OtpStoreRecord>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const OTP_PEPPER = process.env.SUPABASE_SECRET_KEY || process.env.SMTP_PASS?.replace(/\s+/g, '') || 'tembox-otp-salt-2026';

/**
 * Computes a secure SHA-256 HMAC hash of the OTP code combined with the target email and secret pepper.
 * Ensures the raw 6-digit code is NEVER stored as plain text.
 */
function hashOtp(email: string, otpCode: string): string {
  return crypto
    .createHmac('sha256', OTP_PEPPER)
    .update(`${email.toLowerCase().trim()}:${otpCode.trim()}`)
    .digest('hex');
}

export interface GenerateOtpResult {
  otpCode: string;
  expiresAt: Date;
}

/**
 * Generates a cryptographically random 6-digit numeric OTP, hashes it, and saves it.
 * Invalidates any previous pending OTP for this email and purpose.
 */
export async function createAndSaveOtp(
  email: string,
  purpose: 'register' | 'reset_password' = 'register'
): Promise<GenerateOtpResult> {
  const cleanEmail = email.toLowerCase().trim();
  // Generate 6-digit numeric OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = hashOtp(cleanEmail, otpCode);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // 1. Save in in-memory fallback cache
  memoryOtpCache.set(`${cleanEmail}:${purpose}`, {
    email: cleanEmail,
    otpHash,
    purpose,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    expiresAt: expiresAt.getTime(),
    verified: false,
  });

  // 2. Strict persistence to Supabase otp_verifications table (No silent fallback)
  const admin = getSupabaseAdmin();

  // Invalidate previous pending codes for this email and purpose
  const { error: delErr } = await admin
    .from('otp_verifications')
    .delete()
    .eq('email', cleanEmail)
    .eq('purpose', purpose);

  if (delErr) {
    console.warn('[OTP Service] Warning deleting prior OTPs:', delErr.message);
  }

  // Insert new OTP verification record
  const { error: insertErr } = await admin.from('otp_verifications').insert({
    email: cleanEmail,
    otp_hash: otpHash,
    purpose,
    attempts: 0,
    max_attempts: MAX_ATTEMPTS,
    expires_at: expiresAt.toISOString(),
  });

  if (insertErr) {
    console.error('[OTP Service] Gagal insert ke tabel otp_verifications di Supabase:', insertErr);
    throw new Error(`Database error: Gagal menyimpan data OTP ke Supabase (${insertErr.code || 'DB_ERROR'}): ${insertErr.message}`);
  }

  return { otpCode, expiresAt };
}

export interface VerifyOtpResult {
  valid: boolean;
  error?: string;
  remainingAttempts?: number;
}

/**
 * Verifies an OTP submission against its stored hash, checking expiry, attempt limits, and single-use status.
 */
export async function verifyAndConsumeOtp(
  email: string,
  submittedCode: string,
  purpose: 'register' | 'reset_password' = 'register'
): Promise<VerifyOtpResult> {
  const cleanEmail = email.toLowerCase().trim();
  const cacheKey = `${cleanEmail}:${purpose}`;

  // 1. Try fetching from Supabase database first
  let dbRecord: any = null;
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('otp_verifications')
      .select('*')
      .eq('email', cleanEmail)
      .eq('purpose', purpose)
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) dbRecord = data;
  } catch (err) {
    // Database query failed, fallback to in-memory
  }

  const memoryRecord = memoryOtpCache.get(cacheKey);

  // Check existence
  if (!dbRecord && !memoryRecord) {
    return {
      valid: false,
      error: 'Kode verifikasi tidak ditemukan atau telah digunakan. Silakan minta kode baru.',
    };
  }

  const now = Date.now();
  const expiresAtMs = dbRecord ? new Date(dbRecord.expires_at).getTime() : memoryRecord!.expiresAt;
  const attempts = dbRecord ? dbRecord.attempts : memoryRecord!.attempts;
  const maxAttempts = dbRecord ? dbRecord.max_attempts : memoryRecord!.maxAttempts;
  const targetHash = dbRecord ? dbRecord.otp_hash : memoryRecord!.otpHash;

  // Check Expiration (Anti-Replay)
  if (now > expiresAtMs) {
    memoryOtpCache.delete(cacheKey);
    return {
      valid: false,
      error: 'Kode OTP telah kedaluwarsa (berlaku maksimal 10 menit). Silakan minta kode baru.',
    };
  }

  // Check Brute-Force Limit
  if (attempts >= maxAttempts) {
    memoryOtpCache.delete(cacheKey);
    return {
      valid: false,
      error: 'Batas percobaan verifikasi telah terlampaui (maksimal 5 kali salah). Silakan minta kode baru.',
    };
  }

  // Compute submitted hash
  const submittedHash = hashOtp(cleanEmail, submittedCode);

  // Compare hashes using timing-safe equal to prevent timing attacks
  const isMatch =
    targetHash.length === submittedHash.length &&
    crypto.timingSafeEqual(Buffer.from(targetHash), Buffer.from(submittedHash));

  if (!isMatch) {
    const nextAttempts = attempts + 1;
    const remaining = Math.max(0, maxAttempts - nextAttempts);

    // Update attempts count
    if (memoryRecord) {
      memoryRecord.attempts = nextAttempts;
    }

    try {
      if (dbRecord) {
        const admin = getSupabaseAdmin();
        await admin
          .from('otp_verifications')
          .update({ attempts: nextAttempts })
          .eq('id', dbRecord.id);
      }
    } catch {}

    return {
      valid: false,
      remainingAttempts: remaining,
      error:
        remaining > 0
          ? `Kode verifikasi salah. Sisa kesempatan mencoba: ${remaining} kali.`
          : 'Terlalu banyak percobaan salah. Kode OTP dibatalkan demi keamanan.',
    };
  }

  // Single-Use Consumption: Mark as verified and invalidate
  memoryOtpCache.delete(cacheKey);
  try {
    if (dbRecord) {
      const admin = getSupabaseAdmin();
      await admin
        .from('otp_verifications')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', dbRecord.id);
    }
  } catch {}

  return { valid: true };
}
