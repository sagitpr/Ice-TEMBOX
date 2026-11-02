'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  BellOff,
  User,
  ChevronDown,
  LayoutDashboard,
  Settings,
  ArrowLeft,
  ArrowRight,
  LogOut
} from './Icons';

interface HeaderProps {
  currentTab: string;
  onToggleSidebar?: () => void;
  onSelectTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onToggleSidebar,
  onSelectTab,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title and subtitle according to the current tab
  const getHeaderTitles = () => {
    switch (currentTab) {
      case 'monitoring':
        return {
          title: 'Monitoring Suhu',
          subtitle: 'Pantau stabilitas suhu palka kapal dan boks ikan secara real-time.',
        };
      case 'notifikasi':
        return {
          title: 'Notifikasi',
          subtitle: 'Semua pemberitahuan kondisi suhu dan sistem TEMBOX.',
        };
      case 'aktivitas':
        return {
          title: 'Log Aktivitas',
          subtitle: 'Riwayat pencatatan kondisi suhu dan telemetri perangkat.',
        };
      case 'pengaturan':
        return {
          title: 'Pengaturan',
          subtitle: 'Konfigurasi perangkat dan akun TEMBOX Anda.',
        };
      default:
        return {
          title: 'Halo, Nelayan',
          subtitle: 'Berikut ringkasan kondisi penyimpanan ikan Anda hari ini.',
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasUnread(false);
  };

  const handleNavClick = (tabId: string, e: React.MouseEvent) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tabId);
    }
    setNotifOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          id="sidebarToggleBtn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title-wrap">
          <h1 className="topbar-greeting" id="topbarGreeting">{title}</h1>
          <p className="topbar-subtitle" id="topbarSubtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Notification Bell & Dropdown Pop-up */}
        <div className="topbar-notif-wrap" ref={notifRef}>
          <button
            type="button"
            className="topbar-icon-btn"
            id="topbarBellBtn"
            aria-label="Lihat Notifikasi"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={18} />
            {hasUnread && <span className="topbar-badge-dot has-unread" id="topbarBellDot" />}
          </button>

          {/* Notification Pop-up Dropdown Menu */}
          <div className={`notif-dropdown-menu ${notifOpen ? 'open' : ''}`} id="notifDropdownMenu">
            <div className="notif-dropdown-header">
              <div className="notif-dropdown-title-row">
                <span className="notif-dropdown-title">Notifikasi</span>
                {hasUnread && (
                  <button
                    type="button"
                    className="notif-mark-read-btn"
                    onClick={handleMarkAllRead}
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
            </div>

            <div className="notif-dropdown-list">
              <div className="notif-dropdown-empty">
                <BellOff size={24} color="#94A3B8" />
                <span>Tidak ada notifikasi baru</span>
              </div>
            </div>

            <div className="notif-dropdown-footer">
              <a
                href="/notifikasi"
                onClick={(e) => handleNavClick('notifikasi', e)}
                className="notif-view-all-link"
              >
                <span>Buka Halaman Notifikasi</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown Pill */}
        <div
          className="topbar-user-pill"
          ref={userMenuRef}
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="topbar-avatar">
            <User size={16} />
          </div>
          <span className="topbar-username">Nelayan</span>
          <ChevronDown size={14} color="#64748B" />

          {/* User Menu Dropdown */}
          <div className={`topbar-user-menu ${userMenuOpen ? 'open' : ''}`} id="topbarUserMenu">
            <a
              href="/dashboard"
              onClick={(e) => handleNavClick('dashboard', e)}
              className="user-menu-item"
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </a>
            <a
              href="/pengaturan"
              onClick={(e) => handleNavClick('pengaturan', e)}
              className="user-menu-item"
            >
              <Settings size={15} />
              <span>Pengaturan</span>
            </a>
            <Link href="/" className="user-menu-item">
              <ArrowLeft size={15} />
              <span>Kembali ke TEMBOX</span>
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF4', margin: '4px 0' }} />
            <button
              type="button"
              className="user-menu-item"
              style={{
                color: '#DC2626',
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={() => {
                window.location.href = '/';
              }}
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

