'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '../src/App';

export default function Page() {
  const router = useRouter();

  // Redirect legacy hash routes (e.g. /#/about -> /about, /#/login -> /login)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
      if (['about', 'tentang'].includes(hash)) {
        router.replace('/about');
      } else if (['contact', 'kontak', 'hubungi'].includes(hash)) {
        router.replace('/contact');
      } else if (['login', 'signin'].includes(hash)) {
        router.replace('/login');
      } else if (['register', 'signup'].includes(hash)) {
        router.replace('/register');
      } else if (['forgot-password', 'reset-password', 'lupa-password'].includes(hash)) {
        router.replace('/forgot-password');
      } else if (['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan'].includes(hash)) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  return <LandingPage />;
}
