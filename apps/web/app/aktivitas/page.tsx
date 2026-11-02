'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AktivitasView from '../components/AktivitasView';

export default function AktivitasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-view-container" id="appView">
      <Sidebar
        currentTab="aktivitas"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <Header
          currentTab="aktivitas"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content">
          <AktivitasView />
        </div>
      </main>
    </div>
  );
}

