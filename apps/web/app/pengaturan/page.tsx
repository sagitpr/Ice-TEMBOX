'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PengaturanView from '../components/PengaturanView';

export default function PengaturanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-view-container" id="appView">
      <Sidebar
        currentTab="pengaturan"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <Header
          currentTab="pengaturan"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content">
          <PengaturanView />
        </div>
      </main>
    </div>
  );
}

