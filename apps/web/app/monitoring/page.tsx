'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MonitoringView from '../components/MonitoringView';

export default function MonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-view-container" id="appView">
      <Sidebar
        currentTab="monitoring"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <Header
          currentTab="monitoring"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content">
          <MonitoringView />
        </div>
      </main>
    </div>
  );
}

