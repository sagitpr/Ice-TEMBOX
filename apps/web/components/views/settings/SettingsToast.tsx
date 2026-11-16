'use client';

import React from 'react';
import { Check, X } from '../../../app/components/Icons';
import type { ToastMessage } from '../../../hooks/useSettingsLogic';

interface SettingsToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const SettingsToast: React.FC<SettingsToastProps> = ({ toast, onClose }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={toast ? '' : 'pointer-events-none'}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        pointerEvents: toast ? 'auto' : 'none',
        opacity: toast ? 1 : 0,
        transform: toast ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      {toast && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#0B2D42',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '12px',
            borderLeft: `4px solid ${toast.type === 'warning' ? '#F59E0B' : '#7DDCE8'}`,
            boxShadow: '0 14px 35px rgba(7, 26, 39, 0.3)',
            fontSize: '13px',
            fontWeight: 600,
            maxWidth: '380px',
          }}
        >
          <Check size={16} color="#7DDCE8" />
          <span>{toast.text}</span>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={onClose}
            style={{ color: '#94A3B8', marginLeft: '6px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsToast;
