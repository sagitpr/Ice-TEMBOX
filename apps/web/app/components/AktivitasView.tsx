'use client';

import React from 'react';
import { Calendar } from './Icons';

export const AktivitasView: React.FC = () => {
  return (
    <section className="app-page active" id="page-aktivitas">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button type="button" className="topbar-date-btn">
          <Calendar size={14} color="#0284C7" />
          <span id="activityDateLabel">24 Sep 2026</span>
        </button>
      </div>

      <div className="dashboard-panel-card">
        <div className="data-table-container">
          <table className="tembox-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Suhu</th>
                <th>Kondisi Es</th>
                <th>Status</th>
                <th>Aktivitas</th>
              </tr>
            </thead>
            <tbody id="activityTableBody">
              <tr className="table-empty-row">
                <td colSpan={5}>Belum ada aktivitas tercatat.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pagination-wrap">
          <button type="button" className="page-btn" disabled>&lt;</button>
          <button type="button" className="page-btn active" disabled>1</button>
          <button type="button" className="page-btn" disabled>&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default AktivitasView;

