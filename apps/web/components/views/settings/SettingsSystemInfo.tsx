import React from 'react';
import { Info } from '../../../app/components/Icons';

export const SettingsSystemInfo: React.FC = () => {
  return (
    <div
      className="settings-section-flat"
      style={{
        paddingBottom: '24px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Info size={20} color="#0284C7" />
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Informasi Sistem
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            fontSize: '13.5px',
          }}
        >
          <span style={{ color: '#64748B' }}>Versi Perangkat</span>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>1.0.0</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
            fontSize: '13.5px',
          }}
        >
          <span style={{ color: '#64748B' }}>Versi Aplikasi</span>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>Next.js App Router (15.1.0)</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            fontSize: '13.5px',
          }}
        >
          <span style={{ color: '#64748B' }}>Protokol Komunikasi</span>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>WebSocket &amp; REST</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsSystemInfo;
