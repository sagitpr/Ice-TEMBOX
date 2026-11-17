'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  };
}

export const AktivitasView: React.FC = () => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [selectedDate, setSelectedDate] = useState('24 Sep 2026');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(8); // September
  const [currentYear, setCurrentYear] = useState(2026);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Selected Log Drawer Detail state
  const [selectedLog, setSelectedLog] = useState<ActivityItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const calRef = useRef<HTMLDivElement>(null);

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

  // Mock Comprehensive Activity Log dataset
  const activityData: ActivityItem[] = useMemo(() => [
    {
      id: 'ACT-001',
      uuid: 'e48a1290-781c-4b92-91f6-a3d8b3940121',
      timestamp: '24 Sep 2026, 14:32:10 WIB',
      rtcTimestamp: '2026-09-24T14:32:09.840Z',
      category: 'Koneksi',
      title: 'Telemetri Live ESP32 Diterima',
      description: 'Paket telemetri normal diterima via Wi-Fi/Cellular dengan latensi 34 ms.',
      source: 'ESP32',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-0.4°C',
      snapshotIce: 'Es Padat Terjaga',
      status: 'Berhasil',
      metadata: {
        temperature_c: -0.4,
        humidity_pct: 86,
        battery_pct: 95,
        signal_rssi: -64,
        ping_ms: 34,
        sd_status: 'OK',
        offline_queue_count: 0,
      },
    },
    {
      id: 'ACT-002',
      uuid: '92fb4512-32aa-4c12-8871-bc0981248177',
      timestamp: '24 Sep 2026, 14:15:00 WIB',
      rtcTimestamp: '2026-09-24T14:14:58.200Z',
      category: 'Peringatan',
      title: 'Peringatan Fluktuasi Suhu Box 04',
      description: 'Suhu palka cadangan terdeteksi naik melewati ambang batas waspada (2.6°C > 2.0°C).',
      source: 'ESP32',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '+2.6°C',
      snapshotIce: 'Mulai Mencair',
      status: 'Peringatan',
      metadata: {
        temperature_c: 2.6,
        humidity_pct: 91,
        battery_pct: 94,
        signal_rssi: -67,
        ping_ms: 41,
        sd_status: 'OK',
        offline_queue_count: 0,
      },
    },
    {
      id: 'ACT-003',
      uuid: '18ab9901-4432-47ef-b903-882194883100',
      timestamp: '24 Sep 2026, 13:40:00 WIB',
      rtcTimestamp: '2026-09-24T13:39:59.100Z',
      category: 'MicroSD Sync',
      title: 'Sinkronisasi Batch MicroSD Berhasil',
      description: 'Sebanyak 36 paket telemetri log offline palka berhasil diunggah ke server cloud.',
      source: 'ESP32',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-0.7°C',
      snapshotIce: 'Padat Terjaga',
      status: 'Berhasil',
      metadata: {
        offline_queue_count: 36,
        sd_status: 'OK_SYNCED',
        action_type: 'BATCH_OFFLINE_UPLOAD',
      },
    },
    {
      id: 'ACT-004',
      uuid: '5561a098-1123-41bb-a764-998124876123',
      timestamp: '24 Sep 2026, 12:20:45 WIB',
      rtcTimestamp: '2026-09-24T12:20:45.000Z',
      category: 'Pengaturan',
      title: 'Perubahan Parameter Batas Suhu Palka',
      description: 'Pengguna memperbarui ambang batas bahaya dari 4.5°C menjadi 4.0°C untuk ikan tuna.',
      source: 'Pengguna',
      deviceCode: 'PORTAL-WEB',
      snapshotTemp: '-',
      snapshotIce: '-',
      status: 'Info',
      metadata: {
        triggered_by: 'Sagit Faturrakhman (Admin)',
        action_type: 'UPDATE_THRESHOLD_ALERT',
        ip_address: '180.252.12.84',
      },
    },
    {
      id: 'ACT-005',
      uuid: 'bb124890-aacc-4b88-9121-cc9901247654',
      timestamp: '24 Sep 2026, 11:05:12 WIB',
      rtcTimestamp: '2026-09-24T11:05:11.750Z',
      category: 'Koneksi',
      title: 'Uji Latensi Ping Manual',
      description: 'Test ping operator menghasilkan roundtrip respons 31 ms (koneksi sangat baik).',
      source: 'Sistem',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-0.5°C',
      snapshotIce: 'Padat Terjaga',
      status: 'Berhasil',
      metadata: {
        ping_ms: 31,
        action_type: 'MANUAL_PING_TEST',
      },
    },
    {
      id: 'ACT-006',
      uuid: '44319082-dd12-4cf1-8890-001294871234',
      timestamp: '24 Sep 2026, 09:30:00 WIB',
      rtcTimestamp: '2026-09-24T09:29:58.600Z',
      category: 'MicroSD Sync',
      title: 'Verifikasi Modul RTC DS3231 & MicroSD',
      description: 'Sistem hardware memvalidasi integritas partisi FAT32 kartu SD dan presisi jam RTC.',
      source: 'ESP32',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-0.8°C',
      snapshotIce: 'Padat Terjaga',
      status: 'Berhasil',
      metadata: {
        sd_status: 'HEALTHY',
        action_type: 'HARDWARE_SELF_TEST',
      },
    },
    {
      id: 'ACT-007',
      uuid: '7781a902-12aa-4c77-9912-881240981277',
      timestamp: '24 Sep 2026, 08:15:30 WIB',
      rtcTimestamp: '2026-09-24T08:15:30.000Z',
      category: 'Pengaturan',
      title: 'Pendaftaran Unit ESP32 Baru',
      description: 'Unit ESP32-TEMBOX-01 berhasil diverifikasi dan terhubung ke cold-chain fleet.',
      source: 'Pengguna',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-',
      snapshotIce: '-',
      status: 'Berhasil',
      metadata: {
        triggered_by: 'Sagit Faturrakhman',
        action_type: 'PROVISION_DEVICE',
      },
    },
    {
      id: 'ACT-008',
      uuid: '33219088-ff44-48ee-a123-bb8812490123',
      timestamp: '24 Sep 2026, 06:45:00 WIB',
      rtcTimestamp: '2026-09-24T06:44:59.200Z',
      category: 'Sistem',
      title: 'Inisialisasi Sesi Pelayaran Palka Baru',
      description: 'Kapal bertolak dari Pelabuhan Muara Baru. Palka es diisi 3 ton es balok segar.',
      source: 'Sistem',
      deviceCode: 'TRIP-20260924-01',
      snapshotTemp: '-1.0°C',
      snapshotIce: 'Padat Segar',
      status: 'Info',
      metadata: {
        action_type: 'START_FISHING_TRIP',
        triggered_by: 'Nakhoda & Tim TEMBOX',
      },
    },
    {
      id: 'ACT-009',
      uuid: '66124098-bb33-47ee-9901-aa1290876543',
      timestamp: '23 Sep 2026, 22:10:00 WIB',
      rtcTimestamp: '2026-09-23T22:09:59.000Z',
      category: 'Koneksi',
      title: 'Perpindahan Jaringan ke Offline Logger',
      description: 'Kapal keluar dari jangkauan sinyal seluler; ESP32 otomatis beralih ke MicroSD logger.',
      source: 'ESP32',
      deviceCode: 'ESP32-TEMBOX-01',
      snapshotTemp: '-0.9°C',
      snapshotIce: 'Padat Terjaga',
      status: 'Info',
      metadata: {
        sd_status: 'LOGGING_OFFLINE',
        action_type: 'NETWORK_DROPPED_AUTO_FALLBACK',
      },
    },
    {
      id: 'ACT-010',
      uuid: '88912409-ee22-4abb-8812-771249081266',
      timestamp: '23 Sep 2026, 18:30:15 WIB',
      rtcTimestamp: '2026-09-23T18:30:15.000Z',
      category: 'Pengaturan',
      title: 'Pembaruan Profil Akun Operator',
      description: 'Kontak notifikasi SMS & WhatsApp darurat diperbarui oleh nelayan.',
      source: 'Pengguna',
      deviceCode: 'PORTAL-WEB',
      snapshotTemp: '-',
      snapshotIce: '-',
      status: 'Berhasil',
      metadata: {
        triggered_by: 'Sagit Faturrakhman',
        action_type: 'UPDATE_ACCOUNT_CONTACTS',
      },
    },
  ], []);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activityData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
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
  }, [activityData, selectedCategory, searchQuery]);

  // Paginated activities
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / rowsPerPage));
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredActivities.slice(start, start + rowsPerPage);
  }, [filteredActivities, currentPage]);

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
      `"${act.title}"`,
      `"${act.description}"`,
      `"${act.source}"`,
      `"${act.deviceCode}"`,
      `"${act.snapshotTemp || '-'}"`,
      `"${act.snapshotIce || '-'}"`,
      `"${act.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tembox-log-aktivitas-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="app-page active" id="page-aktivitas" style={{ background: '#FFFFFF' }}>
      {/* ==================================================
          1. STRIP REKAPAN AKTIVITAS DI BAGIAN ATAS (HAIRLINE DIVIDERS)
          ================================================== */}
      <div
        className="flat-boxes-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Kolom 1: Total Aktivitas */}
        <div
          className="flat-box-item"
          style={{
            padding: '16px 20px',
            borderRight: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
            Total Aktivitas
          </span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15, marginBottom: '4px' }}>
            148 Log
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Tercatat pada rentang aktif
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
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', lineHeight: 1.15, marginBottom: '4px' }}>
            3 Kejadian
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Fluktuasi suhu & sinyal
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
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', lineHeight: 1.15, marginBottom: '4px' }}>
            42 Batch
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            100% Integritas RTC DS3231
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
            18 Sesi
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Pengaturan & trip pelayaran
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

          {/* Category Tabs */}
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
                    color: isActive ? '#0284C7' : '#64748B',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 1px 3px rgba(11, 45, 66, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Toolbar: Date Range Selector & Export CSV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Date Picker Button & Popover */}
          <div ref={calRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="topbar-date-btn"
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
                      setSelectedDate('24 Sep 2026');
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

                <div className="calendar-weekdays-grid" style={{ fontSize: '11px', marginBottom: '4px' }}>
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
                        style={{ cursor: 'pointer' }}
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
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="panel-title" style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Daftar Riwayat Aktivitas & Audit
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              ({filteredActivities.length} entri ditemukan)
            </span>
          </div>

          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Klik pada baris untuk memeriksa metadata teknis
          </span>
        </div>

        <div className="data-table-container flat-table-container" style={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}>
          <table className="tembox-table flat-tembox-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
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
              {paginatedActivities.length === 0 ? (
                <tr className="table-empty-row">
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FileText size={32} color="#94A3B8" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                        Tidak ada log aktivitas yang cocok
                      </span>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0' }}>
                        Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
                      </p>
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
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((act) => {
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
                })
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
