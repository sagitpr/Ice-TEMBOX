'use client';

import React from 'react';
import { Thermometer, Snowflake, Server, Clock } from './Icons';

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
  tempStatus = 'Menunggu Data',
  iceCondition = 'Menunggu Data',
  minTemp = '--',
  maxTemp = '--',
  tempDeltaPerHour = '--',
  iceRemainingHours = '--',
  systemStatus = 'Menunggu Data',
  systemConnected = false,
  pingMs = null,
  signalRssi = null,
  lastUpdate = '--',
  sdStatus = '--',
}) => {
  const isOnline = systemConnected;
  const isAman = tempStatus === 'Aman';
  const isWaspada = tempStatus === 'Waspada' || tempStatus === 'Bahaya';

  return (
    <div className="metrics-row flat-metrics-row">
      {/* 1. Suhu Palka (Maksimal 3 Baris) */}
      <div className="metric-card metric-item-flat">
        {/* Baris 1: Label Atas */}
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div className="metric-icon-clean">
            <Thermometer size={17} color="#0284C7" />
          </div>
          <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Suhu Palka
          </span>
        </div>

        {/* Baris 2: Nilai Utama Besar */}
        <div className="metric-main-value" id="dashTempCurrent" style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '2px 0 6px 0' }}>
          {currentTemp}
        </div>

        {/* Baris 3: Sub-teks Polos Status & Rentang */}
        <div
          className="metric-footer"
          style={{
            fontSize: '12px',
            color: isAman ? '#059669' : isWaspada ? '#D97706' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isAman ? '#10B981' : isWaspada ? '#F59E0B' : '#94A3B8',
              flexShrink: 0,
            }}
          />
          <span>
            {tempStatus !== 'Menunggu Data'
              ? `${tempStatus} ${minTemp !== '--' ? `(Min ${minTemp} / Max ${maxTemp})` : ''}`
              : 'Menunggu data sensor'}
          </span>
        </div>
      </div>

      {/* 2. Kondisi Es (Maksimal 3 Baris) */}
      <div className="metric-card metric-item-flat">
        {/* Baris 1: Label Atas */}
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div className="metric-icon-clean">
            <Snowflake size={17} color="#0284C7" />
          </div>
          <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Kondisi Es
          </span>
        </div>

        {/* Baris 2: Nilai Utama Besar */}
        <div className="metric-main-value" id="dashIceCondition" style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '2px 0 6px 0', letterSpacing: '-0.02em' }}>
          {iceCondition}
        </div>

        {/* Baris 3: Sub-teks Polos Ketahanan & Laju Suhu */}
        <div className="metric-footer" style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.3 }}>
          <span>
            {iceRemainingHours !== '--' && tempDeltaPerHour !== '--'
              ? `${iceRemainingHours} • ${tempDeltaPerHour}`
              : 'Menunggu telemetri'}
          </span>
        </div>
      </div>

      {/* 3. Status Sistem (Maksimal 3 Baris) */}
      <div className="metric-card metric-item-flat">
        {/* Baris 1: Label Atas */}
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div className="metric-icon-clean">
            <Server size={17} color="#0284C7" />
          </div>
          <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status Sistem
          </span>
        </div>

        {/* Baris 2: Nilai Utama Besar */}
        <div
          className="metric-main-value"
          id="dashSysStatus"
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: isOnline ? '#059669' : '#64748B',
            margin: '2px 0 6px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {systemStatus}
        </div>

        {/* Baris 3: Sub-teks Polos Latensi Ping & Sinyal */}
        <div
          className="metric-footer"
          style={{
            fontSize: '12px',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#10B981' : '#94A3B8',
              flexShrink: 0,
            }}
          />
          <span>
            {isOnline
              ? `${pingMs !== null ? `${pingMs} ms` : '-- ms'} • ${signalRssi !== null ? `${signalRssi} dBm` : '-- dBm'}`
              : '• -- ms • -- dBm'}
          </span>
        </div>
      </div>

      {/* 4. Waktu Terakhir (Maksimal 3 Baris) */}
      <div className="metric-card metric-item-flat metric-item-last">
        {/* Baris 1: Label Atas */}
        <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div className="metric-icon-clean">
            <Clock size={17} color="#0284C7" />
          </div>
          <span className="metric-label" style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Waktu Terakhir
          </span>
        </div>

        {/* Baris 2: Nilai Utama Besar */}
        <div
          className="metric-main-value"
          id="dashLastUpdate"
          suppressHydrationWarning
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '2px 0 6px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {lastUpdate}
        </div>

        {/* Baris 3: Sub-teks Polos Status Hardware */}
        <div className="metric-footer" style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.3 }}>
          <span suppressHydrationWarning>
            {sdStatus !== '--' ? 'MicroSD & RTC Aktif' : 'Menunggu sinkronisasi'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
