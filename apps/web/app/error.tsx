'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TEMBOX Application Error:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '22px',
          fontWeight: 800,
          color: '#DC2626',
        }}
      >
        !
      </div>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
        Terjadi Kesalahan Sistem
      </h1>
      <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
        Sistem mendeteksi kendala saat memuat halaman. Silakan muat ulang komponen atau kembali ke dashboard.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '8px 18px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Coba Lagi
        </button>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 18px',
            backgroundColor: '#F1F5F9',
            color: '#334155',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid #CBD5E1',
          }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
