'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AktivitasView from '../components/AktivitasView';

export default function AktivitasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        currentTab="aktivitas"
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
          currentTab="aktivitas"
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
          <AktivitasView />
        </div>
      </main>
    </div>
  );
}
