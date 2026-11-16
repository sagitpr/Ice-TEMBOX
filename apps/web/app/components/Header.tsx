'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
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
import { useAuthSession, clearStoredAuthSession } from '../../modules/auth/useAuthSession';
import { PublicUserMenu } from '../../components/ui/PublicUserMenu';

const logoHorizontal = '/LogoTembox-Horizontal.png';

export interface HeaderProps {
  currentTab?: string;
  onToggleSidebar?: () => void;
  onSelectTab?: (tab: string) => void;
}

/**
 * Universal Header Component for Ice-TEMBOX.
 * Automatically selects between Public Site Header and Dashboard Topbar based on context.
 */
export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onToggleSidebar,
  onSelectTab,
}) => {
  // If currentTab is provided, render the Dashboard Topbar
  if (currentTab) {
    return (
      <DashboardHeader
        currentTab={currentTab}
        onToggleSidebar={onToggleSidebar}
        onSelectTab={onSelectTab}
      />
    );
  }

  // Otherwise, render the Public Site Header with exact 2-mode color system
  return <PublicSiteHeader />;
};

/**
 * Public Site Header Component.
 * Implements strict 2-mode navigation styling:
 * 1. Mode Transparan / Gelap (useLightText = true)
 * 2. Mode Putih / Terang (useLightText = false)
 */
export function PublicSiteHeader() {
  const pathname = usePathname() || '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthSession();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroToWhitePage = pathname === '/' || pathname === '' || pathname === '/about';
  const isDarkPage = !isHeroToWhitePage; // /contact, /market, /checkout, /login, /register, etc.

  // 1. Aturan Warna Latar & Teks:
  // - Dark-Mode (/contact, /market, /checkout, /login, /register): selalu gelap, teks selalu putih (#FFFFFF)
  // - Beranda (/) & /about:
  //     * Saat di atas (!isScrolled): latar transparan, semua teks putih (#FFFFFF)
  //     * Saat di-scroll (isScrolled): latar putih (#FFFFFF), semua teks navy gelap (#072538)
  const isLightText = isDarkPage ? true : !isScrolled;

  const textColor = isLightText ? '#FFFFFF' : '#072538';
  const mainDividerBg = isLightText ? 'rgba(255, 255, 255, 0.35)' : '#CBD5E1';
  const authDividerBg = isLightText ? 'rgba(255, 255, 255, 0.35)' : '#CBD5E1';

  // Background Header
  const headerBg = isDarkPage
    ? 'rgba(7, 19, 29, 0.95)'
    : isScrolled
      ? 'rgba(255, 255, 255, 0.95)'
      : 'transparent';

  const headerBorder = isDarkPage
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : isScrolled
      ? '1px solid rgba(226, 232, 240, 0.8)'
      : '1px solid transparent';

  const headerShadow = isDarkPage
    ? '0 4px 20px rgba(0, 0, 0, 0.25)'
    : isScrolled
      ? '0 2px 10px rgba(0, 0, 0, 0.05)'
      : 'none';

  const navLinkClass = isLightText
    ? 'text-sm font-medium text-white/95 hover:text-white transition-colors'
    : 'text-sm font-medium text-[#072538] hover:text-sky-600 transition-colors';

  const navLinkBaseStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: textColor,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: headerBg,
        borderBottom: headerBorder,
        boxShadow: headerShadow,
        backdropFilter: isScrolled || isDarkPage ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled || isDarkPage ? 'blur(12px)' : 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo Kiri: Dilindungi dengan flexShrink: 0 dan minWidth: 110px agar tidak mengecil di HP */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
            minWidth: '110px',
          }}
        >
          <Image
            src={logoHorizontal}
            alt="TEMBOX"
            width={140}
            height={36}
            priority
            style={{
              width: '135px',
              height: '35px',
              objectFit: 'contain',
              filter: 'none',
              display: 'block',
              flexShrink: 0,
            }}
          />
        </Link>

        {/* Tata Letak & Jarak Menu Kanan Desktop (Hanya muncul di layar >= 768px) */}
        <nav
          className="header-nav header-nav-desktop"
          style={{
            alignItems: 'center',
          }}
        >
          {/* Kelompok 1: Contact & About dengan jarak 28px */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link
              href="/contact"
              prefetch={false}
              className={navLinkClass}
              style={navLinkBaseStyle}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={navLinkClass}
              style={navLinkBaseStyle}
            >
              About
            </Link>
          </div>

          {/* Garis Pemisah Utama (lebar 1px, tinggi 16px, jarak kiri-kanan 28px) */}
          <span
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: mainDividerBg,
              margin: '0 28px',
              display: 'inline-block',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />

          {/* Kelompok 2: Auth / Profil User */}
          {isAuthenticated && user ? (
            <Link
              href="/dashboard"
              className={navLinkClass}
              style={navLinkBaseStyle}
            >
              {user.name}
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
              <Link
                href="/login"
                prefetch={false}
                className={navLinkClass}
                style={navLinkBaseStyle}
              >
                Sign in
              </Link>
              <span
                style={{
                  width: '1px',
                  height: '14px',
                  backgroundColor: authDividerBg,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <Link
                href="/register"
                prefetch={false}
                className={navLinkClass}
                style={navLinkBaseStyle}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle Button (Hanya tampil di layar HP < 768px) */}
        <button
          type="button"
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup navigasi menu' : 'Buka navigasi menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: textColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? (
            <X size={24} color={textColor} />
          ) : (
            <Menu size={24} color={textColor} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown (< 768px) */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            backgroundColor: isDarkPage
              ? 'rgba(7, 19, 29, 0.98)'
              : isScrolled
                ? '#FFFFFF'
                : 'rgba(7, 26, 39, 0.98)',
            borderTop: isLightText ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
            borderBottom: isLightText ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
            boxShadow: isLightText
              ? '0 14px 28px rgba(0, 0, 0, 0.45)'
              : '0 12px 24px rgba(0, 0, 0, 0.08)',
            borderRadius: '0 0 12px 12px',
            padding: '18px 22px',
            marginTop: '12px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/contact"
              prefetch={false}
              className={navLinkClass}
              style={{
                ...navLinkBaseStyle,
                display: 'block',
                padding: '8px 0',
                fontSize: '15px',
                fontWeight: 600,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={navLinkClass}
              style={{
                ...navLinkBaseStyle,
                display: 'block',
                padding: '8px 0',
                fontSize: '15px',
                fontWeight: 600,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>

          <hr
            style={{
              border: 'none',
              borderTop: isLightText ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
              margin: '14px 0',
            }}
          />

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <Link
                href="/dashboard"
                className={navLinkClass}
                style={{
                  ...navLinkBaseStyle,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard ({user.name})</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 12px',
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '6px',
                }}
              >
                Keluar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '6px' }}>
              <Link
                href="/login"
                prefetch={false}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  border: isLightText ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid #CBD5E1',
                  color: textColor,
                  backgroundColor: 'transparent',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                prefetch={false}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/**
 * Dashboard Topbar Header Component (Active when inside /dashboard, /monitoring, /pengaturan, etc.)
 */
function DashboardHeader({
  currentTab,
  onToggleSidebar,
  onSelectTab,
}: HeaderProps) {
  const router = useRouter();
  const { user } = useAuthSession();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountName, setAccountName] = useState(user?.name || 'Nelayan');
  const [accountEmail, setAccountEmail] = useState(user?.email || 'nelayan@example.com');
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      if (user.name) setAccountName(user.name);
      if (user.email) setAccountEmail(user.email);
    }
  }, [user]);

  const hasUnread = notifications.some((n) => n.unread);

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
      } catch {}
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

  const getHeaderTitles = () => {
    switch (currentTab) {
      case 'monitoring':
        return {
          title: 'Monitoring Suhu',
          subtitle: 'Pantau stabilitas suhu palka kapal dan boks ikan secara real-time.',
        };
      case 'notifikasi':
        return {
          title: 'Pusat Notifikasi',
          subtitle: 'Daftar peringatan termal palka dan riwayat pembaruan perangkat.',
        };
      case 'aktivitas':
        return {
          title: 'Log Aktivitas Armada',
          subtitle: 'Audit trail sinkronisasi sensor palka dan catatan telemetri pelayaran.',
        };
      case 'pengaturan':
        return {
          title: 'Pengaturan Sistem',
          subtitle: 'Konfigurasi perangkat keras palka, batas peringatan, dan profil akun.',
        };
      default:
        return {
          title: 'Dashboard Cold-Chain',
          subtitle: 'Ringkasan operasional dan kondisi penyimpanan palka kapal hari ini.',
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  const handleMarkAllRead = async () => {
    const updated = await markAllHeaderNotificationsRead();
    setNotifications(updated);
  };

  const handleNavClick = (tabId: string, e: React.MouseEvent) => {
    setUserMenuOpen(false);
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tabId);
    }
  };

  return (
    <header className="app-topbar" id="appTopbar">
      <div className="topbar-left">
        {onToggleSidebar && (
          <button
            type="button"
            className="topbar-menu-btn"
            id="sidebarToggleBtn"
            onClick={onToggleSidebar}
            aria-label="Buka Menu Navigasi"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="topbar-title-wrap">
          <h1 className="topbar-page-title" id="pageTitle">
            {title}
          </h1>
          <p className="topbar-page-desc" id="pageSubtitle">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Notifications Dropdown */}
        <div className="topbar-action-item" ref={notifRef}>
          <button
            type="button"
            className="topbar-icon-btn"
            id="notifBtn"
            aria-label="Notifikasi Sistem"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUserMenuOpen(false);
            }}
          >
            <Bell size={18} />
            {hasUnread && <span className="topbar-badge" id="notifBadge" />}
          </button>

          <div
            className={`topbar-dropdown ${notifOpen ? 'open' : 'pointer-events-none'}`}
            id="notifDropdown"
          >
            <div className="dropdown-header">
              <span className="dropdown-title">Notifikasi Sistem</span>
              {hasUnread && (
                <button
                  type="button"
                  className="dropdown-action-btn"
                  id="markAllReadBtn"
                  onClick={handleMarkAllRead}
                >
                  Tandai dibaca
                </button>
              )}
            </div>

            <div className="dropdown-body" id="notifList">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item ${item.severity} ${item.unread ? 'unread' : ''}`}
                >
                  <div className="notif-icon">
                    {item.severity === 'warning' && <Thermometer size={14} />}
                    {item.severity === 'info' && <Info size={14} />}
                    {item.severity === 'success' && <ShieldCheck size={14} />}
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{item.title}</div>
                    <div className="notif-message">{item.message}</div>
                    <div className="notif-time">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Menu */}
        <div className="topbar-action-item" ref={userMenuRef}>
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
            <span className="topbar-username" id="topbarUsername">
              {accountName}
            </span>
            <ChevronDown size={14} color="#64748B" />
          </button>

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
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick('pengaturan', e)}
              className="user-menu-item"
            >
              <User size={15} />
              <span>Profil Saya</span>
            </Link>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick('dashboard', e)}
              className="user-menu-item"
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/pengaturan"
              role="menuitem"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick('pengaturan', e)}
              className="user-menu-item"
            >
              <Settings size={15} />
              <span>Pengaturan</span>
            </Link>
            <Link
              href="/"
              role="menuitem"
              className="user-menu-item"
              onClick={() => setUserMenuOpen(false)}
            >
              <ArrowLeft size={15} />
              <span>Kembali ke Beranda</span>
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
                clearStoredAuthSession();
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
}

export const PublicHeader = PublicSiteHeader;
export default Header;
