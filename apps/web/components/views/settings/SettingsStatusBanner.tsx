import React from 'react';
import { Info } from '../../../app/components/Icons';

interface SettingsStatusBannerProps {
  deviceCount: number;
}

export const SettingsStatusBanner: React.FC<SettingsStatusBannerProps> = ({ deviceCount }) => {
  return (
    <div
      style={{
        background: '#F0F9FF',
        border: '1px solid #BAE6FD',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        color: '#0369A1',
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Info size={18} />
        <span>Mode interaktif aktif menggunakan service state lokal (siap dihubungkan ke API backend).</span>
      </div>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '9999px',
          background: '#E0F2FE',
          color: '#0284C7',
        }}
      >
        {deviceCount} Perangkat Terdaftar
      </span>
    </div>
  );
};

export default SettingsStatusBanner;
