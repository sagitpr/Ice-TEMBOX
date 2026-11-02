'use client';

import React from 'react';
import { Thermometer, Snowflake, Server, Clock } from './Icons';

interface DashboardCardsProps {
  currentTemp?: string;
  tempStatus?: string;
  iceCondition?: string;
  systemStatus?: string;
  systemConnected?: boolean;
  lastUpdate?: string;
  lastUpdateDate?: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  currentTemp = '-- °C',
  tempStatus = 'Menunggu data',
  iceCondition = 'Belum tersedia',
  systemStatus = 'Belum terhubung',
  systemConnected = false,
  lastUpdate = '--',
  lastUpdateDate = '',
}) => {
  return (
    <div className="metrics-row">
      {/* 1. Suhu Sekarang */}
      <div className="metric-card">
        <div className="metric-header">
          <div className="metric-icon-clean">
            <Thermometer size={20} color="#0284C7" />
          </div>
          <span className="metric-label">Suhu Sekarang</span>
        </div>
        <div className="metric-main-value" id="dashTempCurrent">
          {currentTemp}
        </div>
        <div className="metric-footer">
          <span className="badge-status neutral" id="dashTempBadge" style={{ border: 'none', textDecoration: 'none' }}>
            <span className={`status-dot ${systemConnected ? 'online' : 'offline'}`} />
            <span id="dashTempBadgeText">{tempStatus}</span>
          </span>
        </div>
      </div>

      {/* 2. Kondisi Es */}
      <div className="metric-card">
        <div className="metric-header">
          <div className="metric-icon-clean">
            <Snowflake size={20} color="#0284C7" />
          </div>
          <span className="metric-label">Kondisi Es</span>
        </div>
        <div className="metric-main-value" id="dashIceCondition">
          {iceCondition}
        </div>
        <div className="metric-footer">
          <span className="badge-status neutral" id="dashIceBadge" style={{ border: 'none', textDecoration: 'none' }}>
            <span id="dashIceSubtext"></span>
          </span>
        </div>
      </div>

      {/* 3. Status Sistem */}
      <div className="metric-card">
        <div className="metric-header">
          <div className="metric-icon-clean">
            <Server size={20} color="#0284C7" />
          </div>
          <span className="metric-label">Status Sistem</span>
        </div>
        <div className="metric-main-value" id="dashSysStatus">
          {systemStatus}
        </div>
        <div className="metric-footer">
          <span className="badge-status neutral" id="dashSysBadge" style={{ border: 'none', textDecoration: 'none' }}>
            <span className={`status-dot ${systemConnected ? 'online' : 'offline'}`} />
            <span id="dashSysBadgeText">{systemConnected ? 'Online' : 'Offline'}</span>
          </span>
        </div>
      </div>

      {/* 4. Waktu Terakhir */}
      <div className="metric-card">
        <div className="metric-header">
          <div className="metric-icon-clean">
            <Clock size={20} color="#0284C7" />
          </div>
          <span className="metric-label">Waktu Terakhir</span>
        </div>
        <div className="metric-main-value" id="dashLastUpdate">
          {lastUpdate}
        </div>
        <div className="metric-footer">
          <span style={{ color: '#64748B', fontSize: '11.5px' }} id="dashLastUpdateDate">
            {lastUpdateDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;

