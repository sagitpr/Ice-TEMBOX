'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCards from '../components/DashboardCards';
import MarineWeatherBar from '../components/MarineWeatherBar';
import { useTelemetryRealtime } from '../../hooks/useTelemetryRealtime';
import { fetchHeaderNotifications, type HeaderNotificationItem } from '../../lib/services/dashboardService';

// Lightweight hairline fallbacks to eliminate CLS and prevent stacked icon shimmering
const SensorChart = dynamic(() => import('../components/SensorChart'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '260px', borderBottom: '1px solid #E2E8F0' }} />,
});

const MonitoringView = dynamic(() => import('../components/MonitoringView'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '320px', borderBottom: '1px solid #E2E8F0' }} />,
});

const NotifikasiView = dynamic(() => import('../components/NotifikasiView'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '300px', borderBottom: '1px solid #E2E8F0' }} />,
});

const AktivitasView = dynamic(() => import('../components/AktivitasView'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '300px', borderBottom: '1px solid #E2E8F0' }} />,
});

const PengaturanView = dynamic(() => import('../components/PengaturanView'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '300px', borderBottom: '1px solid #E2E8F0' }} />,
});

const RiwayatPembelianView = dynamic(() => import('../components/RiwayatPembelianView'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '300px', borderBottom: '1px solid #E2E8F0' }} />,
});

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Client Session Verification Gate (Ensures zero rendering until cryptographically verified)
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.authenticated) {
          setIsAuthenticated(true);
          setSessionChecked(true);
        } else {
          const redirect = encodeURIComponent(window.location.pathname + window.location.hash);
          window.location.href = `/login?redirect=${redirect}`;
        }
      })
      .catch(() => {
        if (!isMounted) return;
        window.location.href = '/login';
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time IoT hardware telemetry & Supabase live synchronization
  const telemetry = useTelemetryRealtime();
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);

  // Synchronize notifications with service and global event emitter
  useEffect(() => {
    let isMounted = true;
    fetchHeaderNotifications().then((items) => {
      if (isMounted) setNotifications(items);
    });

    const handleNotifs = (e: Event) => {
      const detail = (e as CustomEvent<HeaderNotificationItem[]>).detail;
      if (Array.isArray(detail)) setNotifications(detail);
    };

    window.addEventListener('tembox:notifications-updated', handleNotifs);
    return () => {
      isMounted = false;
      window.removeEventListener('tembox:notifications-updated', handleNotifs);
    };
  }, []);

  // Instant sync with URL hash
  useEffect(() => {
    const validTabs = ['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan', 'transaksi'];
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (validTabs.includes(hash)) {
      setCurrentTab(hash);
    }

    const handleHash = () => {
      const h = window.location.hash.replace('#/', '').replace('#', '');
      if (validTabs.includes(h)) {
        setCurrentTab(h);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
  };

  if (!sessionChecked || !isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          Memverifikasi sesi aman...
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-view-container"
      id="appView"
      style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* 1. Sidebar on the left (Fixed 240px, White, Hairline Border) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main content area on the right */}
      <main
        className="app-main"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: '100vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Topbar Header (Fixed 68px, White, Hairline Border) */}
        <Header
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSelectTab={handleSelectTab}
        />

        {/* Dynamic App Content rendered directly without stacked skeleton blocking */}
        <div
          className="app-content"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px 32px 48px',
            maxWidth: '1400px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {currentTab === 'dashboard' && (
            <section
              className="app-page active"
              id="page-dashboard"
              style={{
                width: '100%',
                maxWidth: '100%',
                overflowX: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <DashboardCards
                currentTemp={telemetry.currentTemp}
                tempStatus={telemetry.tempStatus}
                iceCondition={telemetry.iceCondition}
                minTemp={telemetry.minTemp}
                maxTemp={telemetry.maxTemp}
                tempDeltaPerHour={telemetry.tempDeltaPerHour}
                iceRemainingHours={telemetry.iceRemainingHours}
                systemStatus={telemetry.systemStatus}
                systemConnected={telemetry.systemConnected}
                pingMs={telemetry.pingMs}
                signalRssi={telemetry.signalRssi}
                lastUpdate={telemetry.lastUpdate}
                lastUpdateDate={telemetry.lastUpdateDate}
                sdStatus={telemetry.sdStatus}
                rtcStatus={telemetry.rtcStatus}
              />
              <MarineWeatherBar
                currentPalkaTemp={telemetry.currentTempNum}
                selectedDeviceCode={telemetry.selectedDeviceCode}
                devicesList={telemetry.devicesList}
                onDeviceChange={telemetry.setSelectedDeviceCode}
                onPingTested={() => telemetry.testPing()}
                telemetryLogs={telemetry.telemetryLogs}
              />
              <SensorChart
                onViewAllNotif={() => handleSelectTab('notifikasi')}
                telemetryLogs={telemetry.telemetryLogs}
                notifications={notifications}
              />
            </section>
          )}

          {currentTab === 'monitoring' && (
            <MonitoringView
              telemetryLogs={telemetry.telemetryLogs}
              currentTempNum={telemetry.currentTempNum}
              pingMs={telemetry.pingMs}
              signalRssi={telemetry.signalRssi}
              systemConnected={telemetry.systemConnected}
              selectedDeviceCode={telemetry.selectedDeviceCode}
              onRefreshTelemetry={telemetry.refreshTelemetry}
            />
          )}

          {currentTab === 'notifikasi' && <NotifikasiView onNavigateTab={handleSelectTab} />}

          {currentTab === 'aktivitas' && <AktivitasView telemetryLogs={telemetry.telemetryLogs} />}

          {currentTab === 'transaksi' && <RiwayatPembelianView />}

          {currentTab === 'pengaturan' && <PengaturanView />}
        </div>
      </main>
    </div>
  );
}
