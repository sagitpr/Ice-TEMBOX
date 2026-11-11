'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LogOut,
  ShieldCheck,
  Thermometer,
  Info,
} from './Icons';
import {
  fetchAccount,
  fetchHeaderNotifications,
  markAllHeaderNotificationsRead,
  type HeaderNotificationItem,
  type UserAccount,
} from '../../lib/services/dashboardService';

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
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountName, setAccountName] = useState('Nelayan');
  const [accountEmail, setAccountEmail] = useState('nelayan@example.com');
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const hasUnread = notifications.some((n) => n.unread);

  // Sync account & notifications from centralized dashboardService + reactive store events
  useEffect(() => {
    let isMounted = true;

    const loadHeaderData = async () => {
      try {
        const [acc, notifList] = await Promise.all([
          fetchAccount(),
          fetchHeaderNotifications(),
        ]);
        if (!isMounted) return;
        setAccountName(acc.fullName);
        setAccountEmail(acc.email);
        setNotifications(notifList);
      } catch {
        // Keep defaults on error
      }
    };

    loadHeaderData();

    const handleAccountUpdated = (e: Event) => {
      const detail = (e as CustomEvent<UserAccount>).detail;
      if (detail) {
        setAccountName(detail.fullName);
        setAccountEmail(detail.email);
      }
    };

    const handleNotificationsUpdated = (e: Event) => {
      const detail = (e as CustomEvent<HeaderNotificationItem[]>).detail;
      if (Array.isArray(detail)) {
        setNotifications(detail);
      }
    };

    window.addEventListener('tembox:account-updated', handleAccountUpdated);
    window.addEventListener('tembox:notifications-updated', handleNotificationsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('tembox:account-updated', handleAccountUpdated);
      window.removeEventListener('tembox:notifications-updated', handleNotificationsUpdated);
    };
  }, []);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
          title: `Halo, ${accountName}`,
          subtitle: 'Berikut ringkasan kondisi penyimpanan ikan Anda hari ini.',
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await markAllHeaderNotificationsRead();
    setNotifications(updated);
  };

  const handleNavClick = (tabId: string, e: React.MouseEvent) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tabId);
    }
    setNotifOpen(false);
    setUserMenuOpen(false);
  };

  const getNotifIcon = (severity: HeaderNotificationItem['severity']) => {
    if (severity === 'warning') {
      return {
        bg: '#FFFBEB',
        color: '#D97706',
        icon: <Thermometer size={14} color="#D97706" />,
      };
    }
    if (severity === 'success') {
      return {
        bg: '#ECFDF5',
        color: '#059669',
        icon: <ShieldCheck size={14} color="#059669" />,
      };
    }
    return {
      bg: '#E0F2FE',
      color: '#0284C7',
      icon: <Info size={14} color="#0284C7" />,
    };
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
            className={`topbar-icon-btn ${notifOpen ? 'open' : ''}`}
            id="topbarBellBtn"
            aria-label="Lihat Notifikasi"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUserMenuOpen(false);
            }}
          >
            <Bell size={18} />
            {hasUnread && <span className="topbar-badge-dot has-unread" id="topbarBellDot" />}
          </button>

          {/* Notification Pop-up Dropdown Menu */}
          <div
            className={`notif-dropdown-menu ${notifOpen ? 'open' : 'pointer-events-none'}`}
            id="notifDropdownMenu"
          >
            <div className="notif-dropdown-header">
              <div className="notif-dropdown-title-row">
                <span className="notif-dropdown-title">Peringatan Palka Terbaru</span>
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
              {notifications.length === 0 ? (
                <div className="notif-dropdown-empty">
                  <BellOff size={24} color="#94A3B8" />
                  <span>Tidak ada notifikasi baru</span>
                </div>
              ) : (
                notifications.map((item) => {
                  const visual = getNotifIcon(item.severity);
                  return (
                    <div
                      key={item.id}
                      className={`notif-dropdown-item ${item.unread ? 'unread' : ''}`}
                      onClick={(e) => handleNavClick('notifikasi', e)}
                    >
                      <div
                        className="notif-dropdown-icon"
                        style={{ backgroundColor: visual.bg, color: visual.color }}
                      >
                        {visual.icon}
                      </div>
                      <div className="notif-dropdown-body">
                        <div className="notif-dropdown-item-title">{item.title}</div>
                        <div className="notif-dropdown-item-text">{item.message}</div>
                        <span className="notif-dropdown-item-time">{item.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="notif-dropdown-footer">
              <Link
                href="/notifikasi"
                onClick={(e) => handleNavClick('notifikasi', e)}
                className="notif-view-all-link"
              >
                <span>Buka Halaman Notifikasi</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown Pill */}
        <div className="topbar-user-wrap" ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-user-pill"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
              setNotifOpen(false);
            }}
          >
            <div className="topbar-avatar">
              <User size={16} />
            </div>
            <span className="topbar-username" id="topbarUsername">{accountName}</span>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {/* User Menu Dropdown */}
          <div
            role="menu"
            className={`topbar-user-menu ${userMenuOpen ? 'open' : 'pointer-events-none'}`}
            id="topbarUserMenu"
            style={{ width: '220px' }}
          >
            <div
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '4px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ocean)' }}>
                {accountName}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', wordBreak: 'break-all' }}>
                {accountEmail}
              </div>
            </div>

            <Link
              href="/pengaturan"
              role="menuitem"
              onClick={(e) => handleNavClick('pengaturan', e)}
              className="user-menu-item"
            >
              <User size={15} />
              <span>Profil Saya</span>
            </Link>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={(e) => handleNavClick('dashboard', e)}
              className="user-menu-item"
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/pengaturan"
              role="menuitem"
              onClick={(e) => handleNavClick('pengaturan', e)}
              className="user-menu-item"
            >
              <Settings size={15} />
              <span>Pengaturan</span>
            </Link>
            <Link href="/" role="menuitem" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
              <ArrowLeft size={15} />
              <span>Kembali ke TEMBOX</span>
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF4', margin: '4px 0' }} />
            <button
              type="button"
              role="menuitem"
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
                setUserMenuOpen(false);
                router.push('/login');
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
