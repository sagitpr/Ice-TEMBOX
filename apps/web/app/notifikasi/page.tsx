'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotifikasiView from '../components/NotifikasiView';

export default function NotifikasiPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-view-container" id="appView">
      <Sidebar
        currentTab="notifikasi"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <Header
          currentTab="notifikasi"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content">
          <NotifikasiView />
        </div>
      </main>
    </div>
  );
}

