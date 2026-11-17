'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Thermometer,
  Sliders,
  Download,
  Check,
  Activity,
  Filter,
  Info,
  X,
} from './Icons';

export interface MonitoringViewProps {
  telemetryLogs?: Array<{
    id?: number | string;
    temperature_c?: number;
    signal_rssi?: number;
    ping_ms?: number;
    recorded_at?: string;
    sd_status?: string;
  }>;
  currentTempNum?: number | null;
}

interface TableRecord {
  id: string;
  timestamp: string;
  boxId: string;
  boxName: string;
  temperature: number;
  delta: string;
  iceCondition: string;
  source: 'Live' | 'MicroSD Sync';
  isWarning: boolean;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  telemetryLogs = [],
  currentTempNum = -0.4,
}) => {
  // 1. Toolbar filters state
  const [timeRange, setTimeRange] = useState<'live' | '1h' | '24h' | '7d' | 'date'>('live');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<'all' | 'box1' | 'box2' | 'box3' | 'box4'>('all');
  const [boxDropdownOpen, setBoxDropdownOpen] = useState(false);

  // 2. Date Picker pop-up state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('24 Sep 2026');
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [activePreset, setActivePreset] = useState<'today' | 'yesterday' | 'prev_month' | 'custom'>('today');

  // 3. Threshold popover / settings state
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(2.0); // Target <= 2.0°C
  const [dangerThreshold, setDangerThreshold] = useState(4.0); // Danger > 4.0°C

  // 4. Interactive Chart Legend state (Toggle series visibility)
  const [activeBoxes, setActiveBoxes] = useState<Record<string, boolean>>({
    box1: true,
    box2: true,
    box3: true,
    box4: true,
  });

  // 5. Detail Table filter & pagination state
  const [tableFilter, setTableFilter] = useState<'all' | 'warning'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Refs for outside click dismissal
  const calRef = useRef<HTMLDivElement>(null);
  const boxDropdownRef = useRef<HTMLDivElement>(null);
  const thresholdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (calRef.current && !calRef.current.contains(target)) {
        setCalendarOpen(false);
      }
      if (boxDropdownRef.current && !boxDropdownRef.current.contains(target)) {
        setBoxDropdownOpen(false);
      }
      if (thresholdRef.current && !thresholdRef.current.contains(target)) {
        setThresholdModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar helpers
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = monthNames[currentMonth].substring(0, 3);
    setSelectedDate(`${day} ${monthStr} ${currentYear}`);
    setActivePreset('custom');
    setCalendarOpen(false);
    setTimeRange('date');
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
    setTimeRange('date');
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Box 01-04 Sensor Readings Calculations
  const box1CurrentTemp = currentTempNum !== null && currentTempNum !== undefined ? currentTempNum : -0.4;
  const box2CurrentTemp = 0.3;
  const box3CurrentTemp = 1.8;
  const box4CurrentTemp = 2.6;

  const getStatusZone = (temp: number) => {
    if (isNaN(temp)) return { text: 'Menunggu Sensor', bg: '#F1F5F9', color: '#64748B', isWarn: false };
    if (temp <= warningThreshold) return { text: 'Optimal', bg: '#ECFDF5', color: '#059669', isWarn: false };
    if (temp <= dangerThreshold) return { text: 'Waspada', bg: '#FFFBEB', color: '#D97706', isWarn: true };
    return { text: 'Bahaya', bg: '#FEF2F2', color: '#DC2626', isWarn: true };
  };

  const boxCardsData = [
    {
      id: 'box1',
      slotNum: '01',
      name: 'Palka Utama (Sensor DS18B20 #1)',
      temp: box1CurrentTemp,
      tempStr: `${box1CurrentTemp > 0 ? '+' : ''}${box1CurrentTemp.toFixed(1)}°C`,
      zone: getStatusZone(box1CurrentTemp),
      delta: '+0.1°C/jam',
      deltaType: 'up',
      min: '-0.8°C',
      max: '+0.2°C',
      target: 'Target ≤ 2.0°C',
    },
    {
      id: 'box2',
      slotNum: '02',
      name: 'Palka Depan (Sensor DS18B20 #2)',
      temp: box2CurrentTemp,
      tempStr: `+${box2CurrentTemp.toFixed(1)}°C`,
      zone: getStatusZone(box2CurrentTemp),
      delta: '+0.2°C/jam',
      deltaType: 'up',
      min: '-0.3°C',
      max: '+0.8°C',
      target: 'Target ≤ 2.0°C',
    },
    {
      id: 'box3',
      slotNum: '03',
      name: 'Palka Tengah (Sensor DS18B20 #3)',
      temp: box3CurrentTemp,
      tempStr: `+${box3CurrentTemp.toFixed(1)}°C`,
      zone: getStatusZone(box3CurrentTemp),
      delta: '-0.1°C/jam',
      deltaType: 'down',
      min: '+1.1°C',
      max: '+2.4°C',
      target: 'Target ≤ 2.0°C',
    },
    {
      id: 'box4',
      slotNum: '04',
      name: 'Palka Cadangan (Sensor DS18B20 #4)',
      temp: box4CurrentTemp,
      tempStr: `+${box4CurrentTemp.toFixed(1)}°C`,
      zone: getStatusZone(box4CurrentTemp),
      delta: '+0.4°C/jam',
      deltaType: 'up',
      min: '+1.8°C',
      max: '+3.1°C',
      target: 'Target ≤ 2.0°C',
    },
  ];

  // Toggle Box Series Visibility in Chart
  const toggleBoxSeries = (boxKey: string) => {
    setActiveBoxes((prev) => ({
      ...prev,
      [boxKey]: !prev[boxKey],
    }));
  };

  // Mock / Realistic Table Dataset (24 historical logs)
  const fullTableData: TableRecord[] = useMemo(() => [
    { id: '1', timestamp: 'Hari Ini, 14:32:10 WIB', boxId: 'box1', boxName: 'Box 01 (Palka Utama)', temperature: box1CurrentTemp, delta: '+0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'Live', isWarning: box1CurrentTemp > warningThreshold },
    { id: '2', timestamp: 'Hari Ini, 14:30:00 WIB', boxId: 'box4', boxName: 'Box 04 (Cadangan)', temperature: 2.6, delta: '+0.4°C/jam', iceCondition: 'Mulai Mencair', source: 'Live', isWarning: true },
    { id: '3', timestamp: 'Hari Ini, 14:25:00 WIB', boxId: 'box2', boxName: 'Box 02 (Palka Depan)', temperature: 0.3, delta: '+0.2°C/jam', iceCondition: 'Padat Terjaga', source: 'Live', isWarning: false },
    { id: '4', timestamp: 'Hari Ini, 14:20:00 WIB', boxId: 'box3', boxName: 'Box 03 (Palka Tengah)', temperature: 1.8, delta: '-0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'Live', isWarning: false },
    { id: '5', timestamp: 'Hari Ini, 14:15:00 WIB', boxId: 'box1', boxName: 'Box 01 (Palka Utama)', temperature: -0.5, delta: '0.0°C/jam', iceCondition: 'Padat Terjaga', source: 'Live', isWarning: false },
    { id: '6', timestamp: 'Hari Ini, 14:10:00 WIB', boxId: 'box4', boxName: 'Box 04 (Cadangan)', temperature: 2.5, delta: '+0.3°C/jam', iceCondition: 'Mulai Mencair', source: 'MicroSD Sync', isWarning: true },
    { id: '7', timestamp: 'Hari Ini, 14:05:00 WIB', boxId: 'box2', boxName: 'Box 02 (Palka Depan)', temperature: 0.1, delta: '+0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
    { id: '8', timestamp: 'Hari Ini, 14:00:00 WIB', boxId: 'box1', boxName: 'Box 01 (Palka Utama)', temperature: -0.6, delta: '-0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
    { id: '9', timestamp: 'Hari Ini, 13:55:00 WIB', boxId: 'box3', boxName: 'Box 03 (Palka Tengah)', temperature: 2.1, delta: '+0.3°C/jam', iceCondition: 'Sebagian Mencair', source: 'MicroSD Sync', isWarning: true },
    { id: '10', timestamp: 'Hari Ini, 13:50:00 WIB', boxId: 'box4', boxName: 'Box 04 (Cadangan)', temperature: 2.4, delta: '+0.2°C/jam', iceCondition: 'Mulai Mencair', source: 'MicroSD Sync', isWarning: true },
    { id: '11', timestamp: 'Hari Ini, 13:45:00 WIB', boxId: 'box2', boxName: 'Box 02 (Palka Depan)', temperature: 0.0, delta: '0.0°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
    { id: '12', timestamp: 'Hari Ini, 13:40:00 WIB', boxId: 'box1', boxName: 'Box 01 (Palka Utama)', temperature: -0.7, delta: '-0.2°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
    { id: '13', timestamp: 'Hari Ini, 13:35:00 WIB', boxId: 'box3', boxName: 'Box 03 (Palka Tengah)', temperature: 1.9, delta: '+0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
    { id: '14', timestamp: 'Hari Ini, 13:30:00 WIB', boxId: 'box2', boxName: 'Box 02 (Palka Depan)', temperature: -0.1, delta: '-0.1°C/jam', iceCondition: 'Padat Terjaga', source: 'MicroSD Sync', isWarning: false },
  ], [box1CurrentTemp, warningThreshold]);

  // Filtered Table Rows
  const filteredTableData = useMemo(() => {
    let result = fullTableData;
    if (selectedBoxFilter !== 'all') {
      result = result.filter((item) => item.boxId === selectedBoxFilter);
    }
    if (tableFilter === 'warning') {
      result = result.filter((item) => item.isWarning);
    }
    return result;
  }, [fullTableData, selectedBoxFilter, tableFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTableData.length / rowsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTableData.slice(start, start + rowsPerPage);
  }, [filteredTableData, currentPage]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Waktu (WIB)', 'Unit / Box', 'Suhu (C)', 'Perubahan (dT)', 'Kondisi Es', 'Sumber Data', 'Status Peringatan'];
    const rows = filteredTableData.map((d) => [
      `"${d.timestamp}"`,
      `"${d.boxName}"`,
      d.temperature.toFixed(2),
      `"${d.delta}"`,
      `"${d.iceCondition}"`,
      `"${d.source}"`,
      d.isWarning ? '"Peringatan"' : '"Normal"',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tembox-monitoring-suhu-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SVG Chart Series Coordinates calculation
  // Y-axis scale: range from -2.0°C (bottom y=210) to +6.0°C (top y=25)
  // Height = 240, Width = 760, MarginLeft = 45, MarginRight = 20
  const yMin = -2.0;
  const yMax = 6.0;
  const chartHeight = 220;
  const chartWidth = 750;
  const originX = 45;
  const originY = 25;

  const getYCoord = (temp: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, temp));
    const ratio = (clamped - yMin) / (yMax - yMin);
    return originY + (1 - ratio) * (chartHeight - 40);
  };

  // 8 Time ticks across the X-axis
  const xLabels = ['13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', 'Live'];
  const getXCoord = (index: number) => originX + (index / (xLabels.length - 1)) * (chartWidth - originX - 20);

  // Series points
  const seriesBox1 = [-0.8, -0.7, -0.6, -0.6, -0.5, -0.5, -0.4, box1CurrentTemp];
  const seriesBox2 = [-0.2, -0.1, 0.0, 0.1, 0.1, 0.2, 0.3, 0.3];
  const seriesBox3 = [1.2, 1.4, 1.7, 1.9, 2.1, 2.0, 1.9, 1.8];
  const seriesBox4 = [1.8, 2.0, 2.1, 2.3, 2.4, 2.5, 2.6, 2.6];

  const buildPath = (data: number[]) => {
    return data
      .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getXCoord(idx).toFixed(1)} ${getYCoord(val).toFixed(1)}`)
      .join(' ');
  };

  const dangerY = getYCoord(dangerThreshold);
  const targetY = getYCoord(warningThreshold);

  return (
    <section className="app-page active" id="page-monitoring" style={{ background: '#FFFFFF' }}>
      {/* ==================================================
          1. UNIFIED MONITORING TOOLBAR (HAIRLINE DIVIDER)
          ================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '16px',
          marginBottom: '24px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Left Toolbar: Range Pills & Box Selector */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {/* Time Range Pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#F8FAFC',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            }}
          >
            {(
              [
                { id: 'live', label: 'Live' },
                { id: '1h', label: '1 Jam' },
                { id: '24h', label: '24 Jam' },
                { id: '7d', label: '7 Hari' },
                { id: 'date', label: 'Tanggal' },
              ] as const
            ).map((t) => {
              const isActive = timeRange === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTimeRange(t.id);
                    if (t.id === 'date') setCalendarOpen(true);
                  }}
                  style={{
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0284C7' : '#64748B',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 1px 3px rgba(11, 45, 66, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Date Picker Pop-up (Active when 'Tanggal' selected) */}
          <div className="monitoring-date-wrap" ref={calRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="topbar-date-btn"
              id="monitoringDateBtn"
              aria-expanded={calendarOpen}
              aria-haspopup="true"
              onClick={() => setCalendarOpen(!calendarOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
              }}
            >
              <Calendar size={13} color="#0284C7" />
              <span id="currentDateLabel">{selectedDate}</span>
              <ChevronDown size={12} color="#64748B" />
            </button>

            {calendarOpen && (
              <div
                className="date-picker-popup open"
                id="monitoringDatePickerPopup"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  zIndex: 60,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(11, 45, 66, 0.1)',
                  padding: '14px',
                  width: '280px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    className={`date-preset-pill ${activePreset === 'today' ? 'active' : ''}`}
                    onClick={(e) => handlePreset('today', e)}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    className={`date-preset-pill ${activePreset === 'yesterday' ? 'active' : ''}`}
                    onClick={(e) => handlePreset('yesterday', e)}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Kemarin
                  </button>
                  <button
                    type="button"
                    className={`date-preset-pill ${activePreset === 'prev_month' ? 'active' : ''}`}
                    onClick={(e) => handlePreset('prev_month', e)}
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    Bulan Lalu
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  <button type="button" onClick={handlePrevMonth} style={{ padding: '4px' }}>
                    <ChevronLeft size={13} />
                  </button>
                  <span>
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button type="button" onClick={handleNextMonth} style={{ padding: '4px' }}>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="calendar-weekdays-grid" style={{ fontSize: '11px' }}>
                  <span>Min</span>
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span>Sab</span>
                </div>

                <div className="calendar-days-grid" style={{ fontSize: '11px' }}>
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
            )}
          </div>

          {/* Box Selector Dropdown */}
          <div ref={boxDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setBoxDropdownOpen(!boxDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Filter size={13} color="#64748B" />
              <span>
                {selectedBoxFilter === 'all'
                  ? 'Semua Box (4)'
                  : selectedBoxFilter === 'box1'
                    ? 'Box 01 (Utama)'
                    : selectedBoxFilter === 'box2'
                      ? 'Box 02 (Depan)'
                      : selectedBoxFilter === 'box3'
                        ? 'Box 03 (Tengah)'
                        : 'Box 04 (Cadangan)'}
              </span>
              <ChevronDown size={12} color="#64748B" />
            </button>

            {boxDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  zIndex: 50,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 6px 18px rgba(11, 45, 66, 0.08)',
                  padding: '4px',
                  minWidth: '180px',
                }}
              >
                {[
                  { id: 'all', label: 'Semua Box' },
                  { id: 'box1', label: 'Box 01 (Palka Utama)' },
                  { id: 'box2', label: 'Box 02 (Palka Depan)' },
                  { id: 'box3', label: 'Box 03 (Palka Tengah)' },
                  { id: 'box4', label: 'Box 04 (Palka Cadangan)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedBoxFilter(opt.id as any);
                      setBoxDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '12px',
                      color: selectedBoxFilter === opt.id ? '#0284C7' : '#334155',
                      fontWeight: selectedBoxFilter === opt.id ? 700 : 500,
                      backgroundColor: selectedBoxFilter === opt.id ? '#F0F9FF' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{opt.label}</span>
                    {selectedBoxFilter === opt.id && <Check size={13} color="#0284C7" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar: Live Stream Pill, Batas Suhu, Export CSV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Live Stream Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#059669',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
                display: 'inline-block',
              }}
            />
            <span>Live Stream</span>
          </div>

          {/* Batas Suhu Button & Modal */}
          <div ref={thresholdRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setThresholdModalOpen(!thresholdModalOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Sliders size={13} color="#0284C7" />
              <span>Batas Suhu ({dangerThreshold.toFixed(1)}°C)</span>
            </button>

            {thresholdModalOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 60,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  boxShadow: '0 12px 28px rgba(11, 45, 66, 0.12)',
                  padding: '16px',
                  width: '310px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Parameter Batas Suhu Palka</span>
                  <button type="button" onClick={() => setThresholdModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Target Suhu Optimal:</span>
                    <span style={{ fontWeight: 700 }}>≤ {warningThreshold.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={warningThreshold}
                    onChange={(e) => setWarningThreshold(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>Batas Bahaya (Alert):</span>
                    <span style={{ fontWeight: 700 }}>&gt; {dangerThreshold.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="0.5"
                    value={dangerThreshold}
                    onChange={(e) => setDangerThreshold(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4, margin: 0, padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                  Ikan pelagis (cakalang, tuna) memerlukan suhu palka es tetap di bawah 4.0°C untuk mencegah pembentukan histamin.
                </p>
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Download size={13} color="#FFFFFF" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          2. GRID 4 SLOT SENSOR (HAIRLINE DIVIDERS FLAT)
          ================================================== */}
      <div
        className="flat-boxes-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '32px',
        }}
      >
        {boxCardsData.map((box, idx) => (
          <div
            key={box.id}
            className={`flat-box-item ${idx === 3 ? 'flat-box-last' : ''}`}
            style={{
              padding: '16px 20px',
              borderRight: idx === 3 ? 'none' : '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '-0.2px' }}>
                Suhu Box {box.slotNum}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: box.zone.bg,
                  color: box.zone.color,
                }}
              >
                {box.zone.text}
              </span>
            </div>

            {/* Suhu Angka Utama */}
            <div
              className="box-temp-val"
              id={`box${idx + 1}Temp`}
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                lineHeight: 1.15,
                marginBottom: '6px',
              }}
            >
              {box.tempStr}
            </div>

            {/* Tren Perubahan & Info Batas */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
              <span>Tren: <strong style={{ color: '#0F172A' }}>{box.delta}</strong></span>
              <span style={{ color: '#0284C7', fontWeight: 600 }}>{box.target}</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              Min: {box.min} • Max: {box.max}
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================
          3. GRAFIK PERUBAHAN SUHU (MULTI-BOX SVG GRAPH)
          ================================================== */}
      <div
        className="flat-section"
        style={{
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '32px',
          marginBottom: '32px',
        }}
      >
        <div
          className="panel-header flat-panel-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '14px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 className="panel-title" style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Grafik Perubahan Suhu
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Klik legenda box di bawah untuk menyembunyikan atau menampilkan series.
            </span>
          </div>

          {/* Interactive Legends with Toggle Series */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
            {[
              { id: 'box1', name: 'Box 01 (Utama)', color: '#0284C7' },
              { id: 'box2', name: 'Box 02 (Depan)', color: '#0EA5E9' },
              { id: 'box3', name: 'Box 03 (Tengah)', color: '#F59E0B' },
              { id: 'box4', name: 'Box 04 (Cadangan)', color: '#14B8A6' },
            ].map((b) => {
              const isEnabled = activeBoxes[b.id];
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBoxSeries(b.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isEnabled ? b.color : '#94A3B8',
                    textDecoration: isEnabled ? 'none' : 'line-through',
                    opacity: isEnabled ? 1 : 0.45,
                    fontWeight: isEnabled ? 700 : 500,
                    padding: '2px 4px',
                  }}
                  title={`Klik untuk ${isEnabled ? 'sembunyikan' : 'tampilkan'} ${b.name}`}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: b.color,
                      display: 'inline-block',
                    }}
                  />
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>

          {/* Summary Stats Pill in Corner */}
          <div
            style={{
              fontSize: '11.5px',
              color: '#475569',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            Rata-rata: <strong style={{ color: '#0F172A' }}>+1.1°C</strong> • Min: <strong>-0.8°C</strong> • Max: <strong>+3.1°C</strong>
          </div>
        </div>

        {/* SVG Multi-Line Chart Canvas */}
        <div className="chart-container-box flat-chart-container" id="multiChartBox" style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox="0 0 760 240"
            style={{ width: '100%', minWidth: '600px', height: '220px', display: 'block' }}
          >
            <defs>
              <linearGradient id="box1Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[
              { temp: 6.0, label: '+6°C' },
              { temp: 4.0, label: '+4°C' },
              { temp: 2.0, label: '+2°C' },
              { temp: 0.0, label: '0°C' },
              { temp: -2.0, label: '-2°C' },
            ].map((g) => {
              const y = getYCoord(g.temp);
              return (
                <g key={g.label}>
                  <line x1={originX} y1={y} x2={chartWidth - 20} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={originX - 8} y={y + 3.5} fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="inherit">
                    {g.label}
                  </text>
                </g>
              );
            })}

            {/* Threshold 4°C Line (Batas Bahaya Red Dashed) */}
            <line
              x1={originX}
              y1={dangerY}
              x2={chartWidth - 20}
              y2={dangerY}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <rect x={chartWidth - 145} y={dangerY - 14} width="125" height="15" rx="3" fill="#FEF2F2" stroke="#FECACA" strokeWidth="0.8" />
            <text x={chartWidth - 82} y={dangerY - 3} fill="#DC2626" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="inherit">
              Threshold 4.0°C (Batas Bahaya)
            </text>

            {/* Target 2.0°C Line (Batas Aman Green Dashed) */}
            <line
              x1={originX}
              y1={targetY}
              x2={chartWidth - 20}
              y2={targetY}
              stroke="#10B981"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <rect x={chartWidth - 135} y={targetY - 14} width="115" height="15" rx="3" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="0.8" />
            <text x={chartWidth - 78} y={targetY - 3} fill="#059669" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="inherit">
              Target Aman ≤ 2.0°C
            </text>

            {/* Series Polylines */}
            {activeBoxes.box4 && (
              <path d={buildPath(seriesBox4)} fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {activeBoxes.box3 && (
              <path d={buildPath(seriesBox3)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {activeBoxes.box2 && (
              <path d={buildPath(seriesBox2)} fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {activeBoxes.box1 && (
              <>
                <path
                  d={`${buildPath(seriesBox1)} L ${getXCoord(7)} ${getYCoord(yMin)} L ${getXCoord(0)} ${getYCoord(yMin)} Z`}
                  fill="url(#box1Grad)"
                />
                <path d={buildPath(seriesBox1)} fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Live pulsing dot at latest point */}
                <circle cx={getXCoord(7)} cy={getYCoord(box1CurrentTemp)} r="4.5" fill="#0284C7" />
                <circle cx={getXCoord(7)} cy={getYCoord(box1CurrentTemp)} r="7" fill="none" stroke="#0284C7" strokeWidth="1.5" opacity="0.6" />
              </>
            )}

            {/* X-Axis Tick Labels */}
            {xLabels.map((xl, i) => (
              <text key={xl} x={getXCoord(i)} y={232} fill="#64748B" fontSize="10.5" textAnchor="middle" fontFamily="inherit">
                {xl}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* ==================================================
          4. TABEL DETAIL DATA (LENGKAP & FLAT TABLE)
          ================================================== */}
      <div className="flat-section">
        <div
          className="panel-header flat-panel-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '14px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="panel-title" style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Detail Data Telemetri
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              ({filteredTableData.length} entri tercatat)
            </span>
          </div>

          {/* Filter: Semua Data vs Hanya Peringatan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setTableFilter('all');
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: tableFilter === 'all' ? 700 : 500,
                color: tableFilter === 'all' ? '#0F172A' : '#64748B',
                backgroundColor: tableFilter === 'all' ? '#F1F5F9' : 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Semua Data ({fullTableData.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setTableFilter('warning');
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: tableFilter === 'warning' ? 700 : 500,
                color: tableFilter === 'warning' ? '#DC2626' : '#64748B',
                backgroundColor: tableFilter === 'warning' ? '#FEF2F2' : 'transparent',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Hanya Peringatan ({fullTableData.filter((d) => d.isWarning).length})
            </button>
          </div>
        </div>

        {/* Flat Table Layout */}
        <div className="data-table-container flat-table-container" style={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}>
          <table className="tembox-table flat-tembox-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Waktu (WIB)</th>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Unit / Box</th>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Suhu</th>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Perubahan (ΔT)</th>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Kondisi Es</th>
                <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Sumber Data</th>
              </tr>
            </thead>
            <tbody id="detailDataTableBody">
              {paginatedData.length === 0 ? (
                <tr className="table-empty-row">
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                    Tidak ada data telemetri yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: row.isWarning ? 'rgba(254, 242, 242, 0.35)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 500 }}>
                      {row.timestamp}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#0F172A', fontWeight: 600 }}>
                      {row.boxName}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: row.temperature <= warningThreshold ? '#059669' : row.temperature <= dangerThreshold ? '#D97706' : '#DC2626',
                        }}
                      >
                        {row.temperature > 0 ? `+${row.temperature.toFixed(1)}` : row.temperature.toFixed(1)}°C
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>
                      {row.delta}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: row.iceCondition === 'Padat Terjaga' ? '#ECFDF5' : '#FEF2F2',
                          color: row.iceCondition === 'Padat Terjaga' ? '#059669' : '#DC2626',
                        }}
                      >
                        {row.iceCondition}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: row.source === 'Live' ? '#0284C7' : '#64748B',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: row.source === 'Live' ? '#0284C7' : '#94A3B8',
                          }}
                        />
                        {row.source}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            fontSize: '12px',
            color: '#64748B',
          }}
        >
          <div>
            Menampilkan{' '}
            <strong style={{ color: '#0F172A' }}>
              {filteredTableData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </strong>{' '}
            -{' '}
            <strong style={{ color: '#0F172A' }}>
              {Math.min(currentPage * rowsPerPage, filteredTableData.length)}
            </strong>{' '}
            dari <strong style={{ color: '#0F172A' }}>{filteredTableData.length}</strong> data
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '4px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.45 : 1,
                fontSize: '12px',
              }}
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  style={{
                    minWidth: '28px',
                    height: '28px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: currentPage === p ? '#0F172A' : '#E2E8F0',
                    backgroundColor: currentPage === p ? '#0F172A' : '#FFFFFF',
                    color: currentPage === p ? '#FFFFFF' : '#334155',
                    fontWeight: currentPage === p ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '4px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.45 : 1,
                fontSize: '12px',
              }}
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonitoringView;
