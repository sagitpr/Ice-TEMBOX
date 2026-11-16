import React from 'react';
import { Info } from '../../app/components/Icons';

export const SettingsSystemInfo: React.FC = () => {
  return (
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
  );
};

export default SettingsSystemInfo;
