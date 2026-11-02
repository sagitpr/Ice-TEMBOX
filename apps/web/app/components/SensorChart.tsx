'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, TrendingUp, Bell, ArrowRight } from './Icons';

interface SensorChartProps {
  onViewAllNotif?: () => void;
}

export const SensorChart: React.FC<SensorChartProps> = ({ onViewAllNotif }) => {
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

  return (
    <div className="dashboard-grid-split">
      {/* Left: Real-time Chart Panel */}
      <div className="dashboard-panel-card">
        <div className="panel-header">
          <h2 className="panel-title">Grafik Suhu Real-Time</h2>

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

        <div className="chart-container-box" id="dashChartBox">
          <div className="empty-state-card" id="dashChartEmpty">
            <div className="empty-state-icon">
              <TrendingUp size={24} />
            </div>
            <h3 className="empty-state-title">Belum ada data suhu</h3>
            <p className="empty-state-desc">
              Menunggu data telemetri dari sensor palka kapal melalui server real-time...
            </p>
          </div>
        </div>
      </div>

      {/* Right: Recent Notifications Panel */}
      <div className="dashboard-panel-card">
        <div className="panel-header">
          <h2 className="panel-title">Notifikasi Terbaru</h2>
          <button
            type="button"
            onClick={onViewAllNotif}
            className="panel-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Lihat Semua</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div id="dashNotifContainer">
          <div className="empty-state-card" id="dashNotifEmpty">
            <div className="empty-state-icon">
              <Bell size={24} />
            </div>
            <h3 className="empty-state-title">Belum ada notifikasi</h3>
            <p className="empty-state-desc">
              Pemberitahuan perubahan suhu dan status sistem akan muncul di sini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;

