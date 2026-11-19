interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

const loginAttemptsStore = new Map<string, RateLimitEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const entry = loginAttemptsStore.get(identifier);

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Expired window check
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttemptsStore.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfterSec = Math.ceil((entry.firstAttemptAt + WINDOW_MS - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_FAILED_ATTEMPTS - entry.count,
  };
}

export function recordFailedLogin(identifier: string): number {
  const now = Date.now();
  const entry = loginAttemptsStore.get(identifier);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttemptsStore.set(identifier, { count: 1, firstAttemptAt: now });
    return 1;
  }

  entry.count += 1;
  return entry.count;
}

export function resetLoginAttempts(identifier: string): void {
  loginAttemptsStore.delete(identifier);
}
