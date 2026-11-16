'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthSession } from '../../modules/auth/useAuthSession';

interface PublicUserMenuProps {
  isDark?: boolean;
  useLightText?: boolean;
  navLinkClass?: string;
  sepClass?: string;
}

export function PublicUserMenu({
  isDark = true,
  useLightText,
  navLinkClass,
  sepClass,
}: PublicUserMenuProps) {
  const { user, isAuthenticated, logout } = useAuthSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeLight = typeof useLightText === 'boolean' ? useLightText : isDark;

  const resolvedNavLinkClass =
    navLinkClass ||
    (activeLight
      ? 'text-white font-medium hover:text-sky-300 transition-colors'
      : 'text-[#072538] font-medium hover:text-sky-600 transition-colors');

  const resolvedSepClass =
    sepClass || (activeLight ? 'text-white/40 select-none' : 'text-slate-300 select-none');

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link
          href="/login"
          className={resolvedNavLinkClass}
          style={{
            fontSize: '14.5px',
            textDecoration: 'none',
          }}
        >
          Sign in
        </Link>
        <span className={resolvedSepClass} aria-hidden="true" style={{ fontSize: '13px', padding: '0 2px' }}>
          |
        </span>
        <Link
          href="/register"
          className={resolvedNavLinkClass}
          style={{
            fontSize: '14.5px',
            textDecoration: 'none',
          }}
        >
          Sign up
        </Link>
      </div>
    );
  }

  const userInitial = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={`${resolvedNavLinkClass} inline-flex items-center gap-2`}
        style={{
          background: 'none',
          border: 'none',
          padding: '4px 6px',
          cursor: 'pointer',
          fontSize: '14.5px',
          borderRadius: '9999px',
        }}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {userInitial}
        </div>
        <span>{user.name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: dropdownOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            color: 'currentColor',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '210px',
            backgroundColor: activeLight ? '#0B1C28' : '#FFFFFF',
            borderRadius: '12px',
            border: activeLight ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
            padding: '8px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: '8px 10px',
              borderBottom: activeLight ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
              marginBottom: '4px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: activeLight ? '#FFFFFF' : '#0B2D42' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', wordBreak: 'break-all' }}>
              {user.email}
            </div>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setDropdownOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: activeLight ? '#E2E8F0' : '#1E293B',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeLight ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>Dashboard</span>
          </Link>

          <Link
            href="/pengaturan"
            onClick={() => setDropdownOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: activeLight ? '#E2E8F0' : '#1E293B',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeLight ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>Pengaturan</span>
          </Link>

          <div style={{ borderTop: activeLight ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9', margin: '4px 0' }} />

          <button
            type="button"
            onClick={() => {
              logout();
              setDropdownOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#EF4444',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeLight ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>Keluar</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PublicUserMenu;
