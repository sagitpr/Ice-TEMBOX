'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root Layout Error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Terjadi Kesalahan Sistem
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '360px', marginBottom: '20px' }}>
          Aplikasi mengalami kendala teknis tak terduga. Silakan coba muat ulang halaman.
        </p>
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
          Muat Ulang
        </button>
      </body>
    </html>
  );
}
