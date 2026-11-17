'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MonitoringView from '../components/MonitoringView';
import { useTelemetryRealtime } from '../../hooks/useTelemetryRealtime';

export default function MonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const telemetry = useTelemetryRealtime();

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
      <Sidebar
        currentTab="monitoring"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
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
        <Header
          currentTab="monitoring"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
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
          <MonitoringView
            telemetryLogs={telemetry.telemetryLogs}
            currentTempNum={telemetry.currentTempNum}
            pingMs={telemetry.pingMs}
            signalRssi={telemetry.signalRssi}
            systemConnected={telemetry.systemConnected}
            selectedDeviceCode={telemetry.selectedDeviceCode}
            onRefreshTelemetry={telemetry.refreshTelemetry}
          />
        </div>
      </main>
    </div>
  );
}
