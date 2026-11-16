'use client';

import { useEffect } from 'react';

export interface GoogleAnalyticsProps {
  gaId?: string;
}

/**
 * Reads a cookie value by name on the client.
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Privacy-Compliant Google Analytics 4 Component.
 * Dynamically loads and activates GA4 into document.head when:
 * 1. gaId is provided (e.g. process.env.NEXT_PUBLIC_GA_ID)
 * 2. User has consented via cookie tembox_cookie_consent === 'accepted'
 *
 * Implemented via direct client DOM injection to ensure 100% type compatibility
 * with Next.js 15 & React 19 without blocking initial page paint.
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    const initGA = () => {
      // Prevent duplicate script injection
      if (document.getElementById('google-analytics-script')) return;

      const script = document.createElement('script');
      script.id = 'google-analytics-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      const win = window as unknown as {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
      };

      win.dataLayer = win.dataLayer || [];
      function gtag(...args: unknown[]) {
        win.dataLayer.push(args);
      }
      win.gtag = gtag;

      gtag('js', new Date());
      gtag('config', gaId, {
        page_path: window.location.pathname,
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
      });
    };

    // Check existing cookie consent
    if (getCookie('tembox_cookie_consent') === 'accepted') {
      initGA();
    }

    // Listen for real-time consent updates from CookieConsentBanner
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail && customEvent.detail.consent === 'accepted') {
        initGA();
      }
    };

    window.addEventListener('tembox:cookie-consent-updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('tembox:cookie-consent-updated', handleConsentUpdate);
    };
  }, [gaId]);

  return null;
}

export default GoogleAnalytics;
