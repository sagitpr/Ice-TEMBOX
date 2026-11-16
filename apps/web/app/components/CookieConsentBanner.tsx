'use client';

import React, { useState, useEffect } from 'react';

const COOKIE_NAME = 'tembox_cookie_consent';
const MAX_AGE_180_DAYS = 180 * 24 * 60 * 60; // 15,552,000 seconds

export type CookieConsentChoice = 'accepted' | 'essential_only';

/**
 * Reads a cookie value by name on the client.
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Sets the cookie consent choice for 180 days with secure attributes.
 */
function setConsentCookie(choice: CookieConsentChoice) {
  if (typeof document === 'undefined') return;
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${choice}; max-age=${MAX_AGE_180_DAYS}; path=/; SameSite=Lax${secureFlag}`;
  window.dispatchEvent(new CustomEvent('tembox:cookie-consent-updated', { detail: { consent: choice } }));
}

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only display if user has not made a decision yet
    const existing = getCookie(COOKIE_NAME);
    if (!existing) {
      // Delay slightly for smooth non-blocking entry
      const timer = setTimeout(() => {
        setVisible(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsentCookie('accepted');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    setConsentCookie('essential_only');
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      role="region"
      aria-label="Pemberitahuan Cookie dan Privasi"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        maxWidth: '420px',
        width: 'calc(100% - 40px)',
        zIndex: 9999,
        backgroundColor: '#071A27',
        border: '1px solid rgba(125, 220, 232, 0.28)',
        borderRadius: '14px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        padding: '18px 20px',
        color: '#E2E8F0',
        fontFamily: 'inherit',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'fadeInUp 0.3s ease-out forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
          }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px 0' }}>
            Preferensi Cookie &amp; Privasi
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0, lineHeight: 1.55 }}>
            TEMBOX menggunakan cookie esensial untuk sesi login dan cookie analitik (Google Analytics 4) untuk mengoptimalkan keandalan pemantauan rantai dingin palka Anda.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
        <button
          type="button"
          onClick={handleEssentialOnly}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#CBD5E1',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
        >
          Hanya Esensial
        </button>

        <button
          type="button"
          onClick={handleAcceptAll}
          style={{
            backgroundColor: '#0284C7',
            border: 'none',
            color: '#FFFFFF',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = '#0369A1')}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = '#0284C7')}
        >
          Terima Semua
        </button>
      </div>
    </aside>
  );
}

export default CookieConsentBanner;
