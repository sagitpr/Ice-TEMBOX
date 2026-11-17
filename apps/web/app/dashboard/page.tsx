'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCards from '../components/DashboardCards';
import MarineWeatherBar from '../components/MarineWeatherBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTelemetryRealtime } from '../../hooks/useTelemetryRealtime';

// Dynamic imports for chart and heavy views (SSR false to minimize main-thread blocking)
const SensorChart = dynamic(() => import('../components/SensorChart'), {
  ssr: false,
  loading: () => <SkeletonLoader type="chart" />,
});

const MonitoringView = dynamic(() => import('../components/MonitoringView'), {
  ssr: false,
  loading: () => <SkeletonLoader type="chart" />,
});

const NotifikasiView = dynamic(() => import('../components/NotifikasiView'), {
  ssr: false,
  loading: () => <SkeletonLoader type="table" />,
});

const AktivitasView = dynamic(() => import('../components/AktivitasView'), {
  ssr: false,
  loading: () => <SkeletonLoader type="table" />,
});

const PengaturanView = dynamic(() => import('../components/PengaturanView'), {
  ssr: false,
  loading: () => <SkeletonLoader type="table" />,
});

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Real-time IoT hardware telemetry & Supabase live synchronization
  const telemetry = useTelemetryRealtime();

  // Instant hydration sync with hash
  useEffect(() => {
    setMounted(true);
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan'].includes(hash)) {
      setCurrentTab(hash);
    }

    const handleHash = () => {
      const h = window.location.hash.replace('#/', '').replace('#', '');
      if (['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan'].includes(h)) {
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

  return (
    <div className="app-view-container" id="appView">
      {/* 1. Sidebar on the left */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main content area on the right */}
      <main className="app-main">
        {/* Topbar Header */}
        <Header
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSelectTab={handleSelectTab}
        />

        {/* Dynamic App Content */}
        <div className="app-content">
          {!mounted ? (
            <>
              <SkeletonLoader type="metrics" />
              <div style={{ marginTop: '24px' }}>
                <SkeletonLoader type="chart" />
              </div>
            </>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <section className="app-page active" id="page-dashboard">
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
                    onDeviceChange={telemetry.setSelectedDeviceCode}
                    onPingTested={() => telemetry.testPing()}
                    telemetryLogs={telemetry.telemetryLogs}
                  />
                  <SensorChart
                    onViewAllNotif={() => handleSelectTab('notifikasi')}
                    telemetryLogs={telemetry.telemetryLogs}
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

              {currentTab === 'notifikasi' && <NotifikasiView />}

              {currentTab === 'aktivitas' && <AktivitasView />}

              {currentTab === 'pengaturan' && <PengaturanView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
