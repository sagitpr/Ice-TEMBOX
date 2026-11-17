'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Thermometer,
  Bell,
  ClipboardList,
  Settings,
  X,
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
    { id: 'monitoring', label: 'Monitoring Suhu', icon: Thermometer, href: '/dashboard#/monitoring' },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell, href: '/dashboard#/notifikasi' },
    { id: 'aktivitas', label: 'Log Aktivitas', icon: ClipboardList, href: '/dashboard#/aktivitas' },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, href: '/dashboard#/pengaturan' },
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
      {/* Mobile Backdrop Overlay (zIndex: 40, below sidebar zIndex: 50) */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        id="appSidebar"
        style={{
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          boxSizing: 'border-box',
          fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
        }}
      >
        {/* Brand Header: Exactly 68px to match Topbar Header */}
        <div
          className="sidebar-header"
          style={{
            height: '68px',
            minHeight: '68px',
            maxHeight: '68px',
            boxSizing: 'border-box',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Link
            href="/dashboard"
            className="sidebar-brand-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              outline: 'none',
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '-0.5px',
                color: '#0B2D42',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              TEMBOX<span style={{ color: '#0284C7' }}>.</span>
            </span>
          </Link>

          {/* Close button only rendered on mobile when drawer is open */}
          {isOpen && (
            <button
              type="button"
              className="sidebar-close-btn"
              id="sidebarCloseBtn"
              onClick={onClose}
              aria-label="Tutup Menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links with soft blue active background */}
        <nav
          className="sidebar-nav"
          style={{
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(item.id, e)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                data-nav={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0284C7' : '#475569',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
              >
                <Icon size={18} color={isActive ? '#0284C7' : '#64748B'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
