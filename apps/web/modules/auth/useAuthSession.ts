'use client';

import { useState, useEffect, useCallback } from 'react';
import { clearUserSessionCache } from './sessionGuard';

export interface AuthUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  token?: string;
  loginAt?: string;
}

const STORAGE_KEY = 'tembox_auth_session';
const COOKIE_KEY = 'tembox_auth_token';

/**
 * Safely reads the persistent auth session from browser storage.
 */
export function getStoredAuthSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || (!parsed.email && !parsed.userId && !parsed.id)) return null;

    const id = parsed.id || parsed.userId || `usr_${(parsed.email || 'user').split('@')[0]}`;
    const userId = parsed.userId || parsed.id || id;
    const name = parsed.name || parsed.fullName || (parsed.email ? parsed.email.split('@')[0] : 'Pengguna TEMBOX');

    return {
      id,
      userId,
      name,
      email: parsed.email || '',
      token: parsed.token || '',
      loginAt: parsed.loginAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Persists user session across localStorage, cookies, and broadcasts custom event.
 */
export function setStoredAuthSession(userData: Partial<AuthUser> & { email: string; name?: string }): AuthUser {
  const cleanUserId = (userData.userId || userData.id || userData.email.split('@')[0] || 'user')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase() || 'nelayan';

  const finalId = userData.id || userData.userId || `usr_${cleanUserId}`;
  const finalName = userData.name && userData.name.trim() !== ''
    ? userData.name.trim()
    : userData.email.split('@')[0] || 'Pengguna TEMBOX';

  const session: AuthUser = {
    id: finalId,
    userId: finalId,
    name: finalName,
    email: userData.email,
    token: userData.token || `tbx_token_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`,
    loginAt: userData.loginAt || new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      // Save full profile cache for seamless name retrieval
      localStorage.setItem('tembox_user_profile', JSON.stringify({ fullName: session.name, email: session.email }));
      document.cookie = `${COOKIE_KEY}=${session.token}; path=/; max-age=604800; SameSite=Lax`;

      // Broadcast auth change event to all components & tabs
      window.dispatchEvent(new CustomEvent('tembox:auth-changed', { detail: session }));
      window.dispatchEvent(new CustomEvent('tembox:session_updated', { detail: session }));
    } catch (err) {
      console.warn('Gagal menyimpan sesi browser:', err);
    }
  }

  return session;
}

/**
 * Removes persistent session and cookies, and notifies active subscribers.
 * Only to be executed when user explicitly clicks Logout.
 */
export function clearStoredAuthSession(): void {
  if (typeof window === 'undefined') return;

  try {
    clearUserSessionCache();
    document.cookie = `${COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.dispatchEvent(new CustomEvent('tembox:auth-changed', { detail: null }));
  } catch (err) {
    console.warn('Gagal menghapus sesi auth:', err);
  }
}

/**
 * Centralized, reactive authentication session hook.
 * Synchronizes real-time login state across all public & private pages without race conditions.
 */
export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session hydration
  useEffect(() => {
    const existing = getStoredAuthSession();
    setUser(existing);
    setIsLoading(false);
  }, []);

  // Real-time synchronization across components and browser tabs
  useEffect(() => {
    const handleAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent<AuthUser | null>).detail;
      if (detail && detail.email) {
        setUser(detail);
      } else {
        setUser(null);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUser(getStoredAuthSession());
      }
    };

    window.addEventListener('tembox:auth-changed', handleAuthChanged);
    window.addEventListener('tembox:session_updated', handleAuthChanged);
    window.addEventListener('tembox:session_cleared', () => setUser(null));
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('tembox:auth-changed', handleAuthChanged);
      window.removeEventListener('tembox:session_updated', handleAuthChanged);
      window.removeEventListener('tembox:session_cleared', () => setUser(null));
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = useCallback((userData: Partial<AuthUser> & { email: string; name?: string }) => {
    const session = setStoredAuthSession(userData);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuthSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Partial<AuthUser>) => {
    if (!user) return;
    const updated = setStoredAuthSession({ ...user, ...userData });
    setUser(updated);
  }, [user]);

  return {
    user,
    isAuthenticated: Boolean(user && user.email),
    isLoading,
    login,
    logout,
    updateUser,
  };
}

export default useAuthSession;
