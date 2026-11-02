'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, TrendingUp } from './Icons';

export const MonitoringView: React.FC = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('24 Sep 2026');
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [activePreset, setActivePreset] = useState<'today' | 'yesterday' | 'prev_month' | 'custom'>('today');

  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = monthNames[currentMonth].substring(0, 3);
    setSelectedDate(`${day} ${monthStr} ${currentYear}`);
    setActivePreset('custom');
    setCalendarOpen(false);
  };

  const handlePreset = (preset: 'today' | 'yesterday' | 'prev_month', e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePreset(preset);
    if (preset === 'today') {
      setSelectedDate('24 Sep 2026');
      setCurrentMonth(8);
      setCurrentYear(2026);
    } else if (preset === 'yesterday') {
      setSelectedDate('23 Sep 2026');
      setCurrentMonth(8);
      setCurrentYear(2026);
    } else if (preset === 'prev_month') {
      setSelectedDate('24 Agu 2026');
      setCurrentMonth(7);
      setCurrentYear(2026);
    }
    setCalendarOpen(false);
  };

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <section className="app-page active" id="page-monitoring">
      {/* Top Filter Bar: Interactive Calendar Pop-up */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div className="monitoring-date-wrap" ref={calRef}>
          <button
            type="button"
            className="topbar-date-btn"
            id="monitoringDateBtn"
            aria-expanded={calendarOpen}
            aria-haspopup="true"
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <Calendar size={14} color="#0284C7" />
            <span id="currentDateLabel">{selectedDate}</span>
            <ChevronDown size={13} color="#64748B" className="calendar-chevron" />
          </button>

          {/* Interactive Date Picker Pop-up */}
          <div className={`date-picker-popup ${calendarOpen ? 'open' : ''}`} id="monitoringDatePickerPopup">
            <div className="date-presets-row">
              <button
                type="button"
                className={`date-preset-pill ${activePreset === 'today' ? 'active' : ''}`}
                onClick={(e) => handlePreset('today', e)}
              >
                Hari Ini
              </button>
              <button
                type="button"
                className={`date-preset-pill ${activePreset === 'yesterday' ? 'active' : ''}`}
                onClick={(e) => handlePreset('yesterday', e)}
              >
                Kemarin
              </button>
              <button
                type="button"
                className={`date-preset-pill ${activePreset === 'prev_month' ? 'active' : ''}`}
                onClick={(e) => handlePreset('prev_month', e)}
              >
                Bulan Lalu
              </button>
            </div>

            <div className="calendar-nav-header">
              <button
                type="button"
                className="cal-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="cal-month-title">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                className="cal-nav-btn"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="calendar-weekdays-grid">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            <div className="calendar-days-grid">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day-cell empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.startsWith(`${day} `);
                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    className={`cal-day-cell ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Boxes Temperature Cards — CLEAN & EMPTIED OF DUMMY PLACEHOLDERS */}
      <div className="boxes-cards-grid">
        <div className="box-temp-card">
          <span className="box-temp-label">Suhu Box 01</span>
          <div className="box-temp-val" id="box1Temp"></div>
        </div>
        <div className="box-temp-card">
          <span className="box-temp-label">Suhu Box 02</span>
          <div className="box-temp-val" id="box2Temp"></div>
        </div>
        <div className="box-temp-card">
          <span className="box-temp-label">Suhu Box 03</span>
          <div className="box-temp-val" id="box3Temp"></div>
        </div>
        <div className="box-temp-card">
          <span className="box-temp-label">Suhu Box 04</span>
          <div className="box-temp-val" id="box4Temp"></div>
        </div>
      </div>

      {/* Multi-box Temperature History Chart Card */}
      <div className="dashboard-panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <h2 className="panel-title">Grafik Perubahan Suhu</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284C7' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} />
              Box 01
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0EA5E9' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0EA5E9', display: 'inline-block' }} />
              Box 02
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              Box 03
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#14B8A6' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14B8A6', display: 'inline-block' }} />
              Box 04
            </span>
          </div>
        </div>

        <div className="chart-container-box" id="multiChartBox">
          <div className="empty-state-card" id="multiChartEmpty">
            <div className="empty-state-icon">
              <TrendingUp size={24} />
            </div>
            <h3 className="empty-state-title">Belum ada data suhu.</h3>
            <p className="empty-state-desc">
              Hubungkan perangkat sensor untuk memulai pemantauan grafik perubahan suhu.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Data Table Card */}
      <div className="dashboard-panel-card">
        <div className="panel-header">
          <h2 className="panel-title">Detail Data</h2>
        </div>

        <div className="data-table-container">
          <table className="tembox-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Suhu</th>
                <th>Kondisi Es</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="detailDataTableBody">
              <tr className="table-empty-row">
                <td colSpan={4}>Belum ada data suhu.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MonitoringView;

