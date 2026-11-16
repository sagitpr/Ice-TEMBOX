'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  const isDarkPage = !isHeroToWhitePage; // /market, /contact, /checkout, /login, /register, etc.

  // 1. Kelompokkan Halaman Berdasarkan Tema Latar:
  // - Halaman Tema Gelap (isDarkPage: /market, /contact, /checkout, /login, /register):
  //   * Latar <header> WAJIB selalu gelap (bg-[#07131d]/95 backdrop-blur-md border-b border-white/10) baik sebelum maupun sesudah di-scroll.
  //   * SEMUA teks navigasi (Contact, About, Sign in, Sign up, Nama User) wajib selalu putih (useLightText = true).
  // - Halaman Hero-ke-Putih (isHeroToWhitePage: / dan /about):
  //   * Sebelum di-scroll (!isScrolled): Latar transparan (bg-transparent), semua teks putih (useLightText = true).
  //   * Setelah di-scroll (isScrolled): Latar berubah putih (bg-white/95 backdrop-blur-md), semua teks navy gelap (useLightText = false).
  const useLightText = isDarkPage ? true : !isScrolled;

  // Background Header
  const headerBgClass = isDarkPage
    ? 'bg-[#07131d]/95 backdrop-blur-md border-b border-white/10 shadow-md'
    : isScrolled
      ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
      : 'bg-transparent border-b border-transparent';

  // Single unified navigation link class for ALL links (Contact, About, Sign in, Sign up, Nama User)
  const navLinkClass = useLightText
    ? 'text-white font-medium hover:text-sky-300 transition-colors'
    : 'text-[#072538] font-medium hover:text-sky-600 transition-colors';

  const sepClass = useLightText
    ? 'text-white/40 select-none'
    : 'text-slate-300 select-none';

  // Only apply CSS class 'scrolled' on Hero-to-White pages when scrolled,
  // preventing global .site-header.scrolled in index.css from forcing a white background on dark pages!
  const shouldApplyScrolledClass = isHeroToWhitePage && isScrolled;

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass} ${shouldApplyScrolledClass ? 'scrolled' : ''}`}
      style={{
        padding: '14px 20px',
        ...(isDarkPage
          ? {
              backgroundColor: 'rgba(7, 19, 29, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }
          : {}),
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo - Selalu warna asli tanpa filter invert */}
        <Link href="/" className="brand-link flex items-center" style={{ textDecoration: 'none' }}>
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
              transition: 'opacity 0.2s ease',
            }}
          />
        </Link>

        {/* Desktop Navigation - ALL elements share identical navLinkClass */}
        <nav className="header-nav flex items-center gap-6">
          <Link
            href="/contact"
            className={navLinkClass}
            style={{ fontSize: '14.5px', textDecoration: 'none' }}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={navLinkClass}
            style={{ fontSize: '14.5px', textDecoration: 'none' }}
          >
            About
          </Link>

          <span className={sepClass} style={{ fontSize: '13px' }} aria-hidden="true">
            |
          </span>

          {isAuthenticated && user ? (
            <PublicUserMenu
              useLightText={useLightText}
              navLinkClass={navLinkClass}
              sepClass={sepClass}
            />
          ) : (
            <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                href="/login"
                className={navLinkClass}
                style={{ fontSize: '14.5px', textDecoration: 'none' }}
              >
                Sign in
              </Link>
              <span className={sepClass} aria-hidden="true" style={{ fontSize: '13px', padding: '0 2px' }}>
                |
              </span>
              <Link
                href="/register"
                className={navLinkClass}
                style={{ fontSize: '14.5px', textDecoration: 'none' }}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: useLightText ? '#FFFFFF' : '#072538', margin: '4px 0' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: useLightText ? '#FFFFFF' : '#072538', margin: '4px 0' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: useLightText ? '#FFFFFF' : '#072538', margin: '4px 0' }} />
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            backgroundColor: useLightText ? '#07131d' : '#FFFFFF',
            borderTop: useLightText ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F1F5F9',
            padding: '16px 20px',
            marginTop: '12px',
          }}
        >
          <Link
            href="/contact"
            className={navLinkClass}
            style={{ display: 'block', padding: '8px 0', textDecoration: 'none', fontSize: '15px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={navLinkClass}
            style={{ display: 'block', padding: '8px 0', textDecoration: 'none', fontSize: '15px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <hr style={{ border: 'none', borderTop: useLightText ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F1F5F9', margin: '10px 0' }} />
          {isAuthenticated && user ? (
            <>
              <div style={{ padding: '4px 0', color: useLightText ? '#7DDCE8' : '#0284C7', fontSize: '13px', fontWeight: 700 }}>
                {user.name}
              </div>
              <Link
                href="/dashboard"
                className={navLinkClass}
                style={{ display: 'block', padding: '8px 0', textDecoration: 'none', fontSize: '14px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
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
                  padding: '8px 0',
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Keluar
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '6px' }}>
              <Link
                href="/login"
                className={navLinkClass}
                style={{ textDecoration: 'none', fontSize: '14px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <span className={sepClass} aria-hidden="true" style={{ fontSize: '13px', padding: '0 2px' }}>
                |
              </span>
              <Link
                href="/register"
                className={navLinkClass}
                style={{ textDecoration: 'none', fontSize: '14px' }}
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
