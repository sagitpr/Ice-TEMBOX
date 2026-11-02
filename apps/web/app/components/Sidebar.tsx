'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Thermometer,
  Bell,
  ClipboardList,
  Settings,
  X
} from './Icons';

interface SidebarProps {
  currentTab: string;
  onSelectTab?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'monitoring', label: 'Monitoring Suhu', icon: Thermometer, href: '/monitoring' },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell, href: '/notifikasi' },
    { id: 'aktivitas', label: 'Log Aktivitas', icon: ClipboardList, href: '/aktivitas' },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, href: '/pengaturan' },
  ];

  const handleNavClick = (tabId: string, e: React.MouseEvent) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tabId);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 45, 66, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`} id="appSidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-brand-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '-0.5px',
              color: 'var(--color-ocean, #0B2D42)',
              display: 'flex',
              alignItems: 'center',
            }}>
              TEMBOX<span style={{ color: '#0284C7' }}>.</span>
            </span>
          </Link>
          <button
            type="button"
            className="sidebar-close-btn"
            id="sidebarCloseBtn"
            onClick={onClose}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                data-nav={item.id}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
