'use client';

import React from 'react';
import { Info, Box, UserPlus, User } from './Icons';

export const PengaturanView: React.FC = () => {
  return (
    <section className="app-page active" id="page-pengaturan">
      {/* Persistence Notice */}
      <div
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#0369A1',
          fontSize: '13px',
        }}
      >
        <Info size={18} />
        <span>Backend persistence belum diaktifkan. Mode tampilan frontend.</span>
      </div>

      {/* Section 1: Perangkat */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">
            <Box size={18} color="#0284C7" />
          </div>
          <div>
            <h3 className="settings-section-title">Perangkat</h3>
            <p className="settings-section-desc">Kelola perangkat TEMBOX Anda.</p>
          </div>
        </div>

        <div className="device-config-item">
          <div className="device-config-left">
            <Box size={22} color="#0284C7" />
            <div>
              <div className="device-config-name" id="settingsDeviceId">TEMBOX-001</div>
              <div className="device-config-ip" id="settingsDeviceStatus">
                <span className="status-dot offline" /> Belum terhubung &bull; 192.168.1.18
              </div>
            </div>
          </div>
          <button type="button" className="btn-secondary">Detail</button>
        </div>

        <button type="button" className="btn-primary-outline">
          <UserPlus size={14} />
          <span>Tambah Perangkat</span>
        </button>
      </div>

      {/* Section 2: Akun */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">
            <User size={18} color="#0284C7" />
          </div>
          <div>
            <h3 className="settings-section-title">Akun</h3>
            <p className="settings-section-desc">Kelola informasi akun Anda.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="topbar-avatar" style={{ width: '42px', height: '42px', fontSize: '16px' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-ocean)', fontSize: '14px' }}>Nelayan</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>nelayan@example.com</div>
            </div>
          </div>
          <button type="button" className="btn-secondary">Ubah</button>
        </div>
      </div>

      {/* Section 3: Informasi Sistem */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">
            <Info size={18} color="#0284C7" />
          </div>
          <div>
            <h3 className="settings-section-title">Informasi Sistem</h3>
          </div>
        </div>

        <div>
          <div className="info-table-row">
            <span className="info-table-label">Versi Perangkat</span>
            <span className="info-table-val">1.0.0</span>
          </div>
          <div className="info-table-row">
            <span className="info-table-label">Versi Aplikasi</span>
            <span className="info-table-val">Next.js App Router (15.1.0)</span>
          </div>
          <div className="info-table-row">
            <span className="info-table-label">Protokol Komunikasi</span>
            <span className="info-table-val">WebSocket &amp; REST</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PengaturanView;

