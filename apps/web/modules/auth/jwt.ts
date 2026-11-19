import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export interface UserTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  google_verified?: boolean;
}

export interface GoogleRegistrationPayload extends JWTPayload {
  google_sub: string;
  email: string;
  name?: string;
  purpose: 'google_registration_binding';
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error('FATAL: Variabel lingkungan JWT_SECRET belum didefinisikan.');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Signs a production HS256 JWT valid for 24 hours.
 */
export async function signUserJwt(payload: {
  sub: string;
  email: string;
  name: string;
  role?: string;
  google_verified?: boolean;
}): Promise<string> {
  const secretKey = getJwtSecretKey();
  return await new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role || 'user',
    google_verified: payload.google_verified ?? true,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

/**
 * Cryptographically verifies an HS256 JWT.
 */
export async function verifyUserJwt(token: string): Promise<UserTokenPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as UserTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Signs a short-lived (15 minutes) registration token holding verified Google credentials.
 */
export async function signRegistrationToken(payload: {
  google_sub: string;
  email: string;
  name?: string;
}): Promise<string> {
  const secretKey = getJwtSecretKey();
  return await new SignJWT({
    google_sub: payload.google_sub,
    email: payload.email,
    name: payload.name || '',
    purpose: 'google_registration_binding',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.google_sub)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

/**
 * Verifies a short-lived Google registration binding token.
 */
export async function verifyRegistrationToken(
  token: string
): Promise<GoogleRegistrationPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    if (payload.purpose !== 'google_registration_binding' || !payload.google_sub || !payload.email) {
      return null;
    }

    return payload as GoogleRegistrationPayload;
  } catch {
    return null;
  }
}
