'use client';

import React from 'react';

interface ContactToastProps {
  toastOpen: boolean;
  setToastOpen: (open: boolean) => void;
  message?: string;
}

export const ContactToast: React.FC<ContactToastProps> = ({
  toastOpen,
  setToastOpen,
  message = 'Pesan terkirim. Silakan periksa kotak masuk email Anda.',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={toastOpen ? '' : 'pointer-events-none'}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9998,
        pointerEvents: toastOpen ? 'auto' : 'none',
        opacity: toastOpen ? 1 : 0,
        transform: toastOpen ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: '#0B2D42',
          border: '1px solid rgba(52, 211, 153, 0.45)',
          borderRadius: '9999px',
          padding: '10px 18px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.18)',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          ✓
        </span>

        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
          }}
        >
          {message}
        </span>

        <button
          type="button"
          onClick={() => setToastOpen(false)}
          aria-label="Tutup"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '13px',
            padding: '2px 4px',
            marginLeft: '4px',
            lineHeight: 1,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ContactToast;
