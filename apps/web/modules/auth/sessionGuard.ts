/**
 * Centralized Session & Auth Guard
 * Prevents session and device state leakage between multiple users on shared browser sessions.
 */

export interface UserSessionData {
  userId: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
  loginAt: string;
}

const STORAGE_KEYS = [
  'tembox_auth_session',
  'tembox_user_profile',
  'tembox_active_devices',
  'tembox_cart',
  'tembox_last_order',
  'tembox_mqtt_subscriptions',
  'tembox_telemetry_cache',
];

/**
 * Clears all user-specific local storage, device list cache, and active MQTT subscriptions.
 * Must be invoked upon logout or account switching to avoid User A data appearing for User B.
 */
export function clearUserSessionCache(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear explicit TEMBOX storage keys
    STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // 2. Clear any cached notification state
    localStorage.removeItem('tembox_notif_settings');

    // 3. Dispatch an isolation event across browser tabs
    window.dispatchEvent(new CustomEvent('tembox:session_cleared'));
  } catch (error) {
    console.warn('Gagal membersihkan cache sesi pengguna:', error);
  }
}

/**
 * Retrieves the currently active user session from local storage.
 */
export function getCurrentSession(): UserSessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem('tembox_auth_session');
    if (!raw) return null;
    return JSON.parse(raw) as UserSessionData;
  } catch {
    return null;
  }
}

/**
 * Saves a user session securely to local storage.
 */
export function setCurrentSession(session: UserSessionData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('tembox_auth_session', JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('tembox:session_updated', { detail: session }));
  } catch (error) {
    console.warn('Gagal menyimpan sesi pengguna:', error);
  }
}

/**
 * Checks whether an authenticated user is currently present in the browser.
 */
export function isAuthenticated(): boolean {
  const session = getCurrentSession();
  return Boolean(session && session.email);
}
