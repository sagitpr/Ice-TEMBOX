'use client';

import React, { useState } from 'react';
import { BellOff } from './Icons';

export const NotifikasiView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'warning' | 'info' | 'system'>('all');

  return (
    <section className="app-page active" id="page-notifikasi">
      {/* Filter Tabs with Hairline Divider */}
      <div
        className="notif-filter-tabs flat-filter-tabs"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '12px',
          marginBottom: '24px',
        }}
      >
        <button
          type="button"
          className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Semua
        </button>
        <button
          type="button"
          className={`notif-tab ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Peringatan
        </button>
        <button
          type="button"
          className={`notif-tab ${filter === 'info' ? 'active' : ''}`}
          onClick={() => setFilter('info')}
        >
          Informasi
        </button>
        <button
          type="button"
          className={`notif-tab ${filter === 'system' ? 'active' : ''}`}
          onClick={() => setFilter('system')}
        >
          Sistem
        </button>
      </div>

      <div id="notifListContainer">
        <div
          className="empty-state-card flat-empty-state"
          id="notifPageEmpty"
          style={{
            padding: '60px 20px',
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          <div className="empty-state-icon" style={{ width: '56px', height: '56px' }}>
            <BellOff size={26} color="#94A3B8" />
          </div>
          <h3 className="empty-state-title" style={{ fontSize: '15px', color: '#334155', fontWeight: 700 }}>
            Belum ada notifikasi
          </h3>
          <p className="empty-state-desc" style={{ color: '#94A3B8', fontSize: '13px' }}>
            Notifikasi akan muncul ketika sistem menerima kondisi atau perubahan dari perangkat palka TEMBOX.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotifikasiView;
