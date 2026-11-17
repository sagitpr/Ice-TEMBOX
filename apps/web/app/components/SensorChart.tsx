'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, TrendingUp, Bell, ArrowRight, Thermometer, ShieldCheck } from './Icons';
import type { TelemetryLogItem } from '../../hooks/useTelemetryRealtime';

export interface TelemetryChartPoint {
  temperature_c?: number;
  recorded_at?: string;
  signal_rssi?: number | null;
  ping_ms?: number | null;
}

interface SensorChartProps {
  onViewAllNotif?: () => void;
  telemetryLogs?: TelemetryLogItem[] | TelemetryChartPoint[];
}

export const SensorChart: React.FC<SensorChartProps> = ({ onViewAllNotif, telemetryLogs = [] }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'today' | '24h' | '7d' | '30d'>('today');
  const [selectedLabel, setSelectedLabel] = useState('Hari ini');

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ranges: { id: 'today' | '24h' | '7d' | '30d'; label: string }[] = [
    { id: 'today', label: 'Hari ini' },
    { id: '24h', label: '24 Jam Terakhir' },
    { id: '7d', label: 'Seminggu Terakhir' },
    { id: '30d', label: '30 Hari Terakhir' },
  ];

  const handleSelectRange = (range: 'today' | '24h' | '7d' | '30d', label: string) => {
    setSelectedRange(range);
    setSelectedLabel(label);
    setFilterOpen(false);
  };

  const chartPoints = telemetryLogs && telemetryLogs.length > 0 ? telemetryLogs.slice(0, 16).reverse() : [];
  const hasData = chartPoints.length > 1;

  // Build SVG path
  const svgWidth = 560;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  let pathD = '';
  let areaD = '';
  const coordinatePoints: Array<{ x: number; y: number; temp: number; time: string }> = [];

  if (hasData) {
    const temps = chartPoints.map((p) => p.temperature_c ?? -0.4);
    const minVal = Math.min(-2, Math.floor(Math.min(...temps)));
    const maxVal = Math.max(3, Math.ceil(Math.max(...temps)));
    const rangeVal = maxVal - minVal || 1;

    chartPoints.forEach((p, index) => {
      const temp = p.temperature_c ?? -0.4;
      const x = paddingX + (index / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
      const normalizedY = (temp - minVal) / rangeVal;
      const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);

      const d = p.recorded_at ? new Date(p.recorded_at) : new Date();
      const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      coordinatePoints.push({ x, y, temp, time: timeStr });
    });

    pathD = coordinatePoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const firstX = coordinatePoints[0].x;
    const lastX = coordinatePoints[coordinatePoints.length - 1].x;
    const bottomY = svgHeight - paddingY;
    areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  return (
    <div className="dashboard-grid-split flat-chart-split">
      {/* Left: Real-time Chart Panel (Separated by vertical hairline divider) */}
      <div className="flat-chart-col-left">
        <div className="panel-header flat-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="panel-title">Grafik Suhu Real-Time</h2>
            {hasData && (
              <span style={{ fontSize: '11px', color: '#059669', background: '#ECFDF5', padding: '1px 7px', borderRadius: '4px', fontWeight: 600 }}>
                Live Stream
              </span>
            )}
          </div>

          {/* Time Filter Interactive Dropdown */}
          <div className="chart-filter-dropdown-wrap" ref={filterRef}>
            <button
              type="button"
              className="chart-filter-btn"
              id="dashChartFilterBtn"
              aria-expanded={filterOpen}
              aria-haspopup="true"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Clock size={14} color="#0284C7" />
              <span id="dashChartFilterLabel">{selectedLabel}</span>
              <ChevronDown size={14} color="#64748B" className="filter-chevron" />
            </button>

            <div className={`chart-filter-menu ${filterOpen ? 'open' : ''}`} id="dashChartFilterMenu">
              <div className="filter-menu-header">Rentang Waktu</div>
              {ranges.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`filter-menu-item ${selectedRange === r.id ? 'active' : ''}`}
                  onClick={() => handleSelectRange(r.id, r.label)}
                >
                  <Check size={14} />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container-box flat-chart-container" id="dashChartBox" style={{ minHeight: '260px' }}>
          {hasData ? (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="chart-svg-layer"
                style={{ width: '100%', height: '220px', display: 'block' }}
              >
                <defs>
                  <linearGradient id="palkaTempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#E2E8F0" strokeWidth="1" />

                {/* Shaded Area */}
                <path d={areaD} fill="url(#palkaTempGradient)" />

                {/* Temperature Polyline */}
                <path d={pathD} fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points */}
                {coordinatePoints.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
                    {/* Timestamp label at bottom for selected points */}
                    {idx % 3 === 0 && (
                      <text x={pt.x} y={svgHeight - 10} fontSize="10" fill="#94A3B8" textAnchor="middle">
                        {pt.time}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div className="empty-state-card flat-empty-state" id="dashChartEmpty">
              <div className="empty-state-icon">
                <TrendingUp size={24} />
              </div>
              <h3 className="empty-state-title">Belum ada data suhu</h3>
              <p className="empty-state-desc">
                Menunggu data telemetri dari sensor palka kapal melalui server real-time...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Recent Notifications Panel */}
      <div className="flat-chart-col-right">
        <div className="panel-header flat-panel-header">
          <h2 className="panel-title">Notifikasi Terbaru</h2>
          <button
            type="button"
            onClick={onViewAllNotif}
            className="panel-link"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#0284C7',
            }}
          >
            <span>Lihat Semua</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div id="dashNotifContainer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Real-time status notifications */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 0',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={14} />
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Telemetri Palka Utama Aktif
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                Sensor DS18B20 &amp; ESP32 sinkron dengan server real-time TEMBOX.
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '4px' }}>
                Baru saja
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 0',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Thermometer size={14} />
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Kondisi Es Dipertahankan
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>
                Suhu palka stabil di bawah 0°C untuk menjaga mutu kesegaran ikan.
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '4px' }}>
                15 menit lalu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
