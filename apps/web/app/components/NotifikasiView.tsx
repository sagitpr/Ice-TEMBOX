'use client';

import React, { useState } from 'react';
import { BellOff } from './Icons';

export const NotifikasiView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'warning' | 'info' | 'system'>('all');

  return (
    <section className="app-page active" id="page-notifikasi">
      <div className="notif-filter-tabs">
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
          className="empty-state-card"
          id="notifPageEmpty"
          style={{
            padding: '60px 20px',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E1EFF6',
          }}
        >
          <div className="empty-state-icon" style={{ width: '56px', height: '56px' }}>
            <BellOff size={26} color="#94A3B8" />
          </div>
          <h3 className="empty-state-title" style={{ fontSize: '16px' }}>
            Belum ada notifikasi
          </h3>
          <p className="empty-state-desc">
            Notifikasi akan muncul ketika sistem menerima kondisi atau perubahan dari perangkat TEMBOX.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotifikasiView;

