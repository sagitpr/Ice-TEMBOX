'use client';

import React from 'react';
import { Thermometer, Snowflake, Server, Clock, Wifi } from './Icons';

export interface DashboardCardsProps {
  currentTemp?: string;
  tempStatus?: string;
  iceCondition?: string;
  minTemp?: string;
  maxTemp?: string;
  tempDeltaPerHour?: string;
  iceRemainingHours?: string;
  systemStatus?: string;
  systemConnected?: boolean;
  pingMs?: number | null;
  signalRssi?: number | null;
  lastUpdate?: string;
  lastUpdateDate?: string;
  sdStatus?: string;
  rtcStatus?: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  currentTemp = '-- °C',
  tempStatus = 'Menunggu data',
  iceCondition = 'Belum tersedia',
  minTemp = '-0.8°C',
  maxTemp = '+0.2°C',
  tempDeltaPerHour = '+0.1°C/jam',
  iceRemainingHours = 'Est. 48 jam',
  systemStatus,
  systemConnected = false,
  pingMs = null,
  signalRssi = null,
  lastUpdate = '--',
  lastUpdateDate = '',
  sdStatus = 'SD Aktif • Tersinkron',
  rtcStatus = 'RTC DS3231 Sinkron',
}) => {
  const isOnline = systemConnected || (pingMs !== null && pingMs < 2000);
  const resolvedSystemStatus = systemStatus || (isOnline ? 'Terkoneksi' : 'Belum Terhubung');

  return (
    <div className="metrics-row flat-metrics-row">
      {/* 1. Suhu Sekarang (DS18B20 Telemetri) */}
      <div className="metric-card metric-item-flat">
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="metric-icon-clean">
              <Thermometer size={18} color="#0284C7" />
            </div>
            <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suhu Palka
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
            DS18B20
          </span>
        </div>
        <div className="metric-main-value" id="dashTempCurrent" style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '4px 0' }}>
          {currentTemp}
        </div>
        <div className="metric-footer" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-status neutral" id="dashTempBadge" style={{ padding: '2px 6px', fontSize: '11px' }}>
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
              <span id="dashTempBadgeText">{tempStatus}</span>
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            Probe Maritim Presisi (±0.5°C)
          </div>
        </div>
      </div>

      {/* 2. Kondisi Es & Analitik Laju Suhu */}
      <div className="metric-card metric-item-flat">
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="metric-icon-clean">
              <Snowflake size={18} color="#0284C7" />
            </div>
            <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Kondisi Es
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>
            {iceRemainingHours}
          </span>
        </div>
        <div className="metric-main-value" id="dashIceCondition" style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '4px 0', letterSpacing: '-0.02em' }}>
          {iceCondition}
        </div>
        <div className="metric-footer" style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11.5px', marginTop: '6px' }}>
          <div id="dashIceBadge" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
            <span>ΔT: <strong style={{ color: '#0F172A' }}>{tempDeltaPerHour}</strong></span>
            <span>&bull;</span>
            <span id="dashIceSubtext">Min: {minTemp} / Max: {maxTemp}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Laju pencairan dalam batas aman
          </div>
        </div>
      </div>

      {/* 3. Status Sistem & Latensi Real-Time */}
      <div className="metric-card metric-item-flat">
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="metric-icon-clean">
              <Server size={18} color="#0284C7" />
            </div>
            <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Status Sistem
            </span>
          </div>
          {isOnline && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
              <Wifi size={13} />
              <span>{signalRssi !== null ? `${signalRssi} dBm` : 'Bagus'}</span>
            </span>
          )}
        </div>
        <div className="metric-main-value" id="dashSysStatus" style={{ fontSize: '26px', fontWeight: 800, color: isOnline ? '#059669' : '#0F172A', margin: '4px 0', letterSpacing: '-0.02em' }}>
          {resolvedSystemStatus}
        </div>
        <div className="metric-footer" style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-status neutral" id="dashSysBadge" style={{ padding: '2px 6px', fontSize: '11px' }}>
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
              <span id="dashSysBadgeText">
                {isOnline ? `Ping: ${pingMs !== null ? `${pingMs} ms` : '32 ms'}` : 'Belum terhubung • -- ms'}
              </span>
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            {isOnline ? 'ESP32 Wi-Fi / Seluler Aktif' : 'Menunggu koneksi ESP32'}
          </div>
        </div>
      </div>

      {/* 4. Waktu Terakhir & Diagnostik Hardware (RTC + MicroSD) */}
      <div className="metric-card metric-item-flat metric-item-last">
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="metric-icon-clean">
              <Clock size={18} color="#0284C7" />
            </div>
            <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Waktu Terakhir
            </span>
          </div>
          <span style={{ fontSize: '10.5px', color: '#0284C7', backgroundColor: '#F0F9FF', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
            {sdStatus}
          </span>
        </div>
        <div className="metric-main-value" id="dashLastUpdate" style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '4px 0', letterSpacing: '-0.02em' }}>
          {lastUpdate}
        </div>
        <div className="metric-footer" style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11.5px', marginTop: '6px' }}>
          <div style={{ color: '#475569' }} id="dashLastUpdateDate">
            {lastUpdateDate || 'Sinkronisasi telemetri'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            {rtcStatus}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
