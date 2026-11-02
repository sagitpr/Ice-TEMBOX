'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCards from '../components/DashboardCards';
import SensorChart from '../components/SensorChart';
import MonitoringView from '../components/MonitoringView';
import NotifikasiView from '../components/NotifikasiView';
import AktivitasView from '../components/AktivitasView';
import PengaturanView from '../components/PengaturanView';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial smooth load transition (simulating telemetry fetch with zero CLS)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Listen to hash changes if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    handleHash();
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
          {isLoading ? (
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
                  <DashboardCards />
                  <SensorChart onViewAllNotif={() => handleSelectTab('notifikasi')} />
                </section>
              )}

              {currentTab === 'monitoring' && <MonitoringView />}

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

