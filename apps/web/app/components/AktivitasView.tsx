'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar,
  Search,
  Download,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  Server,
  User,
  Activity,
  CheckCircle,
} from './Icons';
import type { TelemetryLogItem } from '../../hooks/useTelemetryRealtime';
import { getSupabaseClient } from '../../modules/supabase/supabaseClient';

export interface ActivityItem {
  id: string;
  uuid: string;
  timestamp: string;
  rtcTimestamp: string;
  category: 'Peringatan' | 'MicroSD Sync' | 'Koneksi' | 'Pengaturan' | 'Sistem';
  title: string;
  description: string;
  source: 'ESP32' | 'Sistem' | 'Pengguna';
  deviceCode: string;
  snapshotTemp?: string;
  snapshotIce?: string;
  status: 'Berhasil' | 'Peringatan' | 'Info';
  metadata: {
    temperature_c?: number;
    humidity_pct?: number;
    battery_pct?: number;
    signal_rssi?: number;
    ping_ms?: number;
    sd_status?: string;
    offline_queue_count?: number;
    triggered_by?: string;
    action_type?: string;
    ip_address?: string;
    trigger_value?: string;
    channel_sent?: string;
  };
}

interface AktivitasViewProps {
  telemetryLogs?: TelemetryLogItem[];
}

export const AktivitasView: React.FC<AktivitasViewProps> = ({ telemetryLogs = [] }) => {
  // Real-time server activities state
  const [serverActivities, setServerActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');

  // Real today's formatted string in ID locale
  const getFormattedToday = () =>
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const [selectedDate, setSelectedDate] = useState<string>(getFormattedToday());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Selected Log Drawer Detail state
  const [selectedLog, setSelectedLog] = useState<ActivityItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const calRef = useRef<HTMLDivElement>(null);

  // Fetch real activities from Supabase & API
  const loadActivities = useCallback(async () => {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.activities)) {
          const mapped: ActivityItem[] = data.activities.map((item: any, idx: number) => {
            const recDate = new Date(item.created_at || item.timestamp);
            const isDateValid = !isNaN(recDate.getTime());
            const timeStr = isDateValid
              ? recDate.toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }) + ' WIB'
              : item.timestamp || '--';

            const temp = item.metadata?.temperature_c !== undefined ? Number(item.metadata.temperature_c) : undefined;
            const isWarn = temp !== undefined && temp > 2.0;
            const isCrit = temp !== undefined && temp > 4.0;
            const iceDesc = temp !== undefined
              ? (temp > 4.0 ? 'Mencair Cepat' : temp > 2.0 ? 'Mulai Mencair' : 'Padat Terjaga')
              : undefined;

            return {
              id: item.id ? `ACT-${String(item.id).substring(0, 8)}` : `ACT-${String(idx + 1).padStart(3, '0')}`,
              uuid: item.uuid || item.id || `act-${idx}`,
              timestamp: timeStr,
              rtcTimestamp: item.rtcTimestamp || item.created_at || item.timestamp || '--',
              category: (item.category as any) || (isCrit || isWarn ? 'Peringatan' : 'Sistem'),
              title: item.title,
              description: item.description || '',
              source: (item.source as any) || 'Sistem',
              deviceCode: item.deviceCode || 'Perangkat TEMBOX',
              snapshotTemp: temp !== undefined ? `${temp > 0 ? '+' : ''}${temp.toFixed(1)}°C` : undefined,
              snapshotIce: iceDesc,
              status: (item.status as any) || (isCrit || isWarn ? 'Peringatan' : 'Berhasil'),
              metadata: item.metadata || {},
            };
          });
          setServerActivities(mapped);
        }
      }
    } catch (err) {
      console.warn('[AktivitasView] Failed to load server activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Supabase Realtime Subscription
  useEffect(() => {
    loadActivities();

    let supabase: any = null;
    let channel: any = null;
    try {
      supabase = getSupabaseClient();
      channel = supabase
        .channel('aktivitas-realtime-feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
          loadActivities();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
          loadActivities();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'telemetry_logs' }, () => {
          loadActivities();
        })
        .subscribe();
    } catch (err) {
      console.warn('[AktivitasView] Realtime subscription not active:', err);
    }

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadActivities]);

  // Outside click for date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
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
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

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
    setDateRange('custom');
    setCalendarOpen(false);
  };

  // Combine server activities + telemetry logs prop (strictly real-time, zero mock fallback)
  const activityData: ActivityItem[] = useMemo(() => {
    const combined: ActivityItem[] = [...serverActivities];
    const seenUuids = new Set(combined.map((c) => c.uuid));

    if (Array.isArray(telemetryLogs)) {
      telemetryLogs.forEach((log, index) => {
        const uuidStr = typeof log.id === 'string' ? log.id : `telemetry-${log.recorded_at}-${index}`;
        if (seenUuids.has(uuidStr)) return;

        const recDate = new Date(log.recorded_at);
        const isDateValid = !isNaN(recDate.getTime());
        const timeStr = isDateValid
          ? recDate.toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) + ' WIB'
          : log.recorded_at || '--';

        const temp = Number(log.temperature_c);
        const isWarn = temp > 2.0;
        const isCrit = temp > 4.0;
        const isSync = log.sd_status === 'OK_SYNCED' || log.sd_status === 'OFFLINE_SYNC';

        const category: ActivityItem['category'] = isCrit || isWarn ? 'Peringatan' : isSync ? 'MicroSD Sync' : 'Koneksi';
        const status: ActivityItem['status'] = isCrit || isWarn ? 'Peringatan' : 'Berhasil';
        const iceDesc = temp > 4.0 ? 'Mencair Cepat' : temp > 2.0 ? 'Mulai Mencair' : 'Padat Terjaga';

        combined.push({
          id: `ACT-${String(log.id || index + 1).padStart(3, '0')}`,
          uuid: uuidStr,
          timestamp: timeStr,
          rtcTimestamp: log.recorded_at,
          category,
          title: isCrit
            ? 'Peringatan Suhu Bahaya (> 4°C)'
            : isWarn
              ? 'Peringatan Fluktuasi Suhu Palka'
              : isSync
                ? 'Sinkronisasi Paket MicroSD'
                : 'Telemetri Live ESP32 Diterima',
          description: `Paket data telemetri tercatat pada suhu ${temp.toFixed(1)}°C (${iceDesc}) dengan latensi ${log.ping_ms ?? '--'} ms.`,
          source: 'ESP32',
          deviceCode: 'Perangkat TEMBOX',
          snapshotTemp: `${temp > 0 ? '+' : ''}${temp.toFixed(1)}°C`,
          snapshotIce: iceDesc,
          status,
          metadata: {
            temperature_c: temp,
            humidity_pct: log.humidity_pct ?? undefined,
            battery_pct: log.battery_pct ?? undefined,
            signal_rssi: log.signal_rssi ?? undefined,
            ping_ms: log.ping_ms ?? undefined,
            sd_status: log.sd_status ?? 'OK',
            offline_queue_count: log.offline_queue_count ?? 0,
          },
        });
        seenUuids.add(uuidStr);
      });
    }

    return combined;
  }, [serverActivities, telemetryLogs]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activityData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }

      // Date Range filter
      if (dateRange === 'today') {
        const itemDateStr = new Date(item.rtcTimestamp).toDateString();
        const todayStr = new Date().toDateString();
        if (itemDateStr !== todayStr && !item.timestamp.includes(new Date().getDate().toString())) {
          // Keep if valid match
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesDevice = item.deviceCode.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDevice && !matchesSource) {
          return false;
        }
      }
      return true;
    });
  }, [activityData, selectedCategory, searchQuery, dateRange]);

  // Paginated activities
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / rowsPerPage));
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredActivities.slice(start, start + rowsPerPage);
  }, [filteredActivities, currentPage]);

  // Aggregate metrics computed dynamically (Displays pure numbers without unit suffix)
  const totalCount = activityData.length;
  const totalCountStr = String(totalCount);
  const warnCount = activityData.filter((a) => a.category === 'Peringatan').length;
  const warnCountStr = String(warnCount);
  const syncCount = activityData.filter((a) => a.category === 'MicroSD Sync').length;
  const syncCountStr = String(syncCount);
  const actionCount = activityData.filter((a) => a.source !== 'ESP32').length;
  const actionCountStr = String(actionCount);

  // Copy UUID handler
  const handleCopyId = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Log ID',
      'UUID',
      'Waktu (WIB)',
      'Timestamp RTC',
      'Kategori',
      'Judul Aktivitas',
      'Keterangan',
      'Sumber',
      'Perangkat',
      'Suhu',
      'Kondisi Es',
      'Status',
    ];

    const rows = filteredActivities.map((act) => [
      `"${act.id}"`,
      `"${act.uuid}"`,
      `"${act.timestamp}"`,
      `"${act.rtcTimestamp}"`,
      `"${act.category}"`,
      `"${act.title.replace(/"/g, '""')}"`,
      `"${act.description.replace(/"/g, '""')}"`,
      `"${act.source}"`,
      `"${act.deviceCode}"`,
      `"${act.snapshotTemp || '-'}"`,
      `"${act.snapshotIce || '-'}"`,
      `"${act.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TEMBOX_Audit_Aktivitas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      className="dashboard-section flat-dashboard-section"
      style={{
        border: 'none',
        background: '#FFFFFF',
        padding: 0,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ==================================================
          1. STRIP REKAPAN 4 KOLOM AGREGAT (HAIRLINE DIVIDER)
          ================================================== */}
      <div
        className="flat-box-row activity-summary-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
        }}
      >
        {/* Kolom 1: Total Log Tercatat */}
        <div
          className="flat-box-item"
          style={{
            padding: '16px 20px',
            borderRight: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
            Total Log Tercatat
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15, marginBottom: '4px' }}>
            {totalCountStr}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {totalCount > 0 ? 'Tercatat pada rentang aktif' : 'Belum ada log tercatat'}
          </span>
        </div>

        {/* Kolom 2: Peringatan & Anomali */}
        <div
          className="flat-box-item"
          style={{
            padding: '16px 20px',
            borderRight: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
            Peringatan & Anomali
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: warnCount > 0 ? '#DC2626' : '#0F172A', lineHeight: 1.15, marginBottom: '4px' }}>
            {warnCountStr}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {warnCount > 0 ? 'Fluktuasi suhu & sinyal' : 'Sistem stabil normal'}
          </span>
        </div>

        {/* Kolom 3: Sinkronisasi MicroSD */}
        <div
          className="flat-box-item"
          style={{
            padding: '16px 20px',
            borderRight: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
            Sinkronisasi MicroSD
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: syncCount > 0 ? '#0284C7' : '#0F172A', lineHeight: 1.15, marginBottom: '4px' }}>
            {syncCountStr}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {syncCount > 0 ? 'Integritas RTC DS3231' : 'Belum ada batch offline'}
          </span>
        </div>

        {/* Kolom 4: Aksi Pengguna & Sistem */}
        <div
          className="flat-box-item flat-box-last"
          style={{
            padding: '16px 20px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
            Aksi Pengguna & Sistem
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15, marginBottom: '4px' }}>
            {actionCountStr}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {actionCount > 0 ? 'Pengaturan & trip pelayaran' : 'Belum ada aksi tercatat'}
          </span>
        </div>
      </div>

      {/* ==================================================
          2. TOOLBAR AUDIT LENGKAP (HAIRLINE DIVIDER)
          ================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Left Toolbar: Search input & Category Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Search Input Box */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              width: '260px',
            }}
          >
            <span style={{ position: 'absolute', left: '10px', color: '#94A3B8', pointerEvents: 'none', display: 'flex' }}>
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Cari aktivitas atau perangkat..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '6px 28px 6px 32px',
                fontSize: '12px',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Tabs with horizontal touch scroll */}
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '2px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#F8FAFC',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                minWidth: 'max-content',
              }}
            >
              {['Semua', 'Peringatan', 'MicroSD Sync', 'Koneksi', 'Pengaturan'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#0F172A' : '#64748B',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Toolbar: Date Filter & Export CSV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Calendar Date Picker Dropdown */}
          <div style={{ position: 'relative' }} ref={calRef}>
            <button
              type="button"
              onClick={() => setCalendarOpen(!calendarOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
              <span id="activityDateLabel">{selectedDate}</span>
              <ChevronDown size={12} color="#64748B" />
            </button>

            {calendarOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
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
                    onClick={() => {
                      setSelectedDate(getFormattedToday());
                      setDateRange('today');
                      setCalendarOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      fontSize: '11px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      backgroundColor: dateRange === 'today' ? '#0F172A' : '#FFFFFF',
                      color: dateRange === 'today' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate('7 Hari Terakhir');
                      setDateRange('7d');
                      setCalendarOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      fontSize: '11px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      backgroundColor: dateRange === '7d' ? '#0F172A' : '#FFFFFF',
                      color: dateRange === '7d' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    7 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate('30 Hari Terakhir');
                      setDateRange('30d');
                      setCalendarOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      fontSize: '11px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      backgroundColor: dateRange === '30d' ? '#0F172A' : '#FFFFFF',
                      color: dateRange === '30d' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    30 Hari
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
                  <button type="button" onClick={handlePrevMonth} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ChevronLeft size={13} />
                  </button>
                  <span>
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button type="button" onClick={handleNextMonth} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="calendar-weekdays-grid" style={{ fontSize: '11px', marginBottom: '4px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', color: '#64748B' }}>
                  <span>Min</span>
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span>Sab</span>
                </div>

                <div className="calendar-days-grid" style={{ fontSize: '11px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '26px' }} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate.startsWith(`${day} `);
                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        style={{
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#0F172A' : 'transparent',
                          color: isSelected ? '#FFFFFF' : '#0F172A',
                          fontWeight: isSelected ? 700 : 400,
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredActivities.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: filteredActivities.length > 0 ? '#0F172A' : '#94A3B8',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: filteredActivities.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Download size={13} color="#FFFFFF" />
            <span>Export Rekapan CSV</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          3. TABEL LOG AKTIVITAS AUDIT (INTERAKTIF & FLAT)
          ================================================== */}
      <div className="flat-section">
        <div
          className="panel-header flat-panel-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '14px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className="panel-title" style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Daftar Riwayat Aktivitas & Audit
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
              ({filteredActivities.length} entri ditemukan)
            </span>
          </div>

          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Klik pada baris untuk memeriksa metadata teknis
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
            <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px', display: 'block' }} />
            Memuat data aktivitas...
          </div>
        ) : paginatedActivities.length === 0 ? (
          <div
            style={{
              padding: '50px 16px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '22px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
              }}
            >
              <FileText size={22} color="#94A3B8" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              {activityData.length === 0 ? 'Belum Ada Log Aktivitas' : 'Tidak Ada Log yang Cocok'}
            </span>
            <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '420px', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              {activityData.length === 0
                ? 'Log aktivitas palka, sinkronisasi offline MicroSD, dan peringatan cold-chain akan tercatat otomatis saat perangkat terhubung.'
                : 'Coba sesuaikan kata kunci pencarian atau ubah filter kategori.'}
            </p>
            {activityData.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="data-table-container flat-table-container" style={{ border: 'none', borderRadius: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%' }}>
            <table className="tembox-table flat-tembox-table" style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, width: '180px' }}>Waktu (WIB)</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, width: '130px' }}>Kategori</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Aktivitas & Keterangan</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, width: '110px' }}>Sumber</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, width: '150px' }}>Snapshot Suhu & Es</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, width: '110px' }}>Status</th>
                </tr>
              </thead>
              <tbody id="activityTableBody">
                {paginatedActivities.map((act) => {
                  const isCatWarn = act.category === 'Peringatan';
                  const isCatSync = act.category === 'MicroSD Sync';
                  const isCatConn = act.category === 'Koneksi';
                  const isCatSet = act.category === 'Pengaturan';

                  return (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedLog(act)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        backgroundColor: selectedLog?.id === act.id ? '#F0F9FF' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLog?.id !== act.id) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLog?.id !== act.id) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Waktu */}
                      <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {act.timestamp}
                      </td>

                      {/* Kategori Badge */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: isCatWarn
                              ? '#FEF2F2'
                              : isCatSync
                                ? '#E0F2FE'
                                : isCatConn
                                  ? '#ECFDF5'
                                  : isCatSet
                                    ? '#F3E8FF'
                                    : '#F1F5F9',
                            color: isCatWarn
                              ? '#DC2626'
                              : isCatSync
                                ? '#0284C7'
                                : isCatConn
                                  ? '#059669'
                                  : isCatSet
                                    ? '#7E22CE'
                                    : '#475569',
                          }}
                        >
                          {act.category}
                        </span>
                      </td>

                      {/* Aktivitas & Keterangan */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                          {act.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.35 }}>
                          {act.description}
                        </div>
                      </td>

                      {/* Sumber */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#334155',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: act.source === 'ESP32' ? '#0284C7' : act.source === 'Pengguna' ? '#10B981' : '#F59E0B',
                            }}
                          />
                          {act.source}
                        </span>
                      </td>

                      {/* Snapshot Suhu & Es */}
                      <td style={{ padding: '12px 14px' }}>
                        {act.snapshotTemp && act.snapshotTemp !== '-' ? (
                          <div>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{act.snapshotTemp}</span>
                            <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>{act.snapshotIce}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: act.status === 'Berhasil' ? '#059669' : act.status === 'Peringatan' ? '#DC2626' : '#0284C7',
                          }}
                        >
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
              {filteredActivities.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </strong>{' '}
            -{' '}
            <strong style={{ color: '#0F172A' }}>
              {Math.min(currentPage * rowsPerPage, filteredActivities.length)}
            </strong>{' '}
            dari <strong style={{ color: '#0F172A' }}>{filteredActivities.length}</strong> aktivitas
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

      {/* ==================================================
          4. PANEL DRAWER DETAIL KEJADIAN (SLIDE-OVER KANAN)
          ================================================== */}
      {selectedLog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedLog(null)}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '90vw',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '-10px 0 30px rgba(11, 45, 66, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Detail Audit Log
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                  {selectedLog.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {/* UUID & ID Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Log ID / UUID</span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(selectedLog.uuid)}
                    style={{
                      fontSize: '11px',
                      color: copiedId ? '#059669' : '#0284C7',
                      background: 'none',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId ? 'Tersalin!' : 'Salin UUID'}
                  </button>
                </div>
                <div style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#0F172A', wordBreak: 'break-all' }}>
                  {selectedLog.uuid}
                </div>
              </div>

              {/* Timing Metadata */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Informasi Waktu
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Waktu Server (WIB):</span>
                    <strong style={{ color: '#0F172A' }}>{selectedLog.timestamp}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Timestamp Hardware RTC:</span>
                    <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: '11.5px' }}>{selectedLog.rtcTimestamp}</strong>
                  </div>
                </div>
              </div>

              {/* Source & Perangkat */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Sumber & Perangkat
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Unit Hardware:</span>
                    <strong style={{ color: '#0284C7' }}>{selectedLog.deviceCode}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Kategori:</span>
                    <strong style={{ color: '#0F172A' }}>{selectedLog.category}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Sumber Event:</span>
                    <strong style={{ color: '#0F172A' }}>{selectedLog.source}</strong>
                  </div>
                </div>
              </div>

              {/* Snapshot Telemetri (Jika ada) */}
              {selectedLog.metadata.temperature_c !== undefined && (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Snapshot Telemetri IoT
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Suhu Palka</span>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>{selectedLog.metadata.temperature_c}°C</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Kekuatan Sinyal</span>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>{selectedLog.metadata.signal_rssi} dBm</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Latensi Ping</span>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>{selectedLog.metadata.ping_ms} ms</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Baterai ESP32</span>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>{selectedLog.metadata.battery_pct}%</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON Payload */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Raw JSON Payload
                </h4>
                <pre
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#38BDF8',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    margin: 0,
                  }}
                >
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tutup Panel Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AktivitasView;
