import React from 'react';

interface SettingsStatusBannerProps {
  deviceCount: number;
}

export const SettingsStatusBanner: React.FC<SettingsStatusBannerProps> = ({ deviceCount }) => {
  return (
    <div
      style={{
        padding: '12px 0',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
          Manajemen Perangkat & Sistem
        </span>
      </div>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '9999px',
          background: deviceCount > 0 ? '#F0FDF4' : '#F1F5F9',
          color: deviceCount > 0 ? '#16A34A' : '#64748B',
          border: `1px solid ${deviceCount > 0 ? '#DCFCE7' : '#E2E8F0'}`,
        }}
      >
        {deviceCount} Perangkat Terdaftar
      </span>
    </div>
  );
};

export default SettingsStatusBanner;
