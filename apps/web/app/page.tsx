'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LandingPage from '../src/App';

// Dynamic imports to minimize initial bundle size and eliminate Total Blocking Time (TBT)
const DashboardPage = dynamic(() => import('./dashboard/page'), { ssr: false });
const LoginView = dynamic(() => import('./components/LoginView'), { ssr: false });
const RegisterView = dynamic(() => import('./components/RegisterView'), { ssr: false });

export default function Page() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'dashboard'>('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleHash = () => {
      const hash = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
      if (['login', 'signin'].includes(hash)) {
        setCurrentView('login');
      } else if (['register', 'signup'].includes(hash)) {
        setCurrentView('register');
      } else if (['dashboard', 'monitoring', 'notifikasi', 'aktivitas', 'pengaturan'].includes(hash)) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (!mounted) {
    return (
      <LandingPage
        onNavigate={(view) => {
          if (view === 'login' || view === 'register' || view === 'dashboard' || view === 'home') {
            setCurrentView(view);
          }
        }}
      />
    );
  }

  // 1. Strict Isolation: If on Dashboard, Landing Page is COMPLETELY OMITTED from the DOM
  if (currentView === 'dashboard') {
    return <DashboardPage />;
  }

  // 2. Strict Isolation: If on Login, only LoginView is rendered
  if (currentView === 'login') {
    return (
      <LoginView
        onSuccess={() => {
          window.location.hash = '#/dashboard';
          setCurrentView('dashboard');
        }}
        onNavigateRegister={() => {
          window.location.hash = '#/register';
          setCurrentView('register');
        }}
        onBackHome={() => {
          window.location.hash = '';
          setCurrentView('home');
        }}
      />
    );
  }

  // 3. Strict Isolation: If on Register, only RegisterView is rendered
  if (currentView === 'register') {
    return (
      <RegisterView
        onSuccess={() => {
          window.location.hash = '#/login';
          setCurrentView('login');
        }}
        onNavigateLogin={() => {
          window.location.hash = '#/login';
          setCurrentView('login');
        }}
        onBackHome={() => {
          window.location.hash = '';
          setCurrentView('home');
        }}
      />
    );
  }

  // 4. Default: Render Landing Page ONLY
  return (
    <LandingPage
      onNavigate={(view) => {
        if (view === 'login') {
          window.location.hash = '#/login';
          setCurrentView('login');
        } else if (view === 'register') {
          window.location.hash = '#/register';
          setCurrentView('register');
        } else if (view === 'dashboard') {
          window.location.hash = '#/dashboard';
          setCurrentView('dashboard');
        }
      }}
    />
  );
}
