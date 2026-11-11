'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic import for Three.js atmospheric layer (SSR false to eliminate initial bundle bloat)
const HeroAtmosphere = dynamic(() => import('../app/components/HeroAtmosphere'), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for all below-the-fold content (code-split to slash Total Blocking Time)
const LandingBelowTheFold = dynamic(() => import('../app/components/LandingBelowTheFold'), {
  ssr: true,
});

export const App: React.FC<{ onNavigate?: (view: string) => void }> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadAtmosphere, setLoadAtmosphere] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Page Visibility Listener to prevent GPU memory leaks / lag when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = heroVideoRef.current;
      if (!video) return;
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else {
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (heroVideoRef.current && !heroVideoRef.current.paused) {
        heroVideoRef.current.pause();
      }
    };
  }, []);

  // Scroll detection for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Defer heavy 3D WebGL computation until main thread is idle (drastically reduces TBT)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (win.requestIdleCallback) {
        const idleId = win.requestIdleCallback(
          () => {
            setLoadAtmosphere(true);
          },
          { timeout: 2500 }
        );
        return () => {
          if (win.cancelIdleCallback) win.cancelIdleCallback(idleId);
        };
      } else {
        const timer = setTimeout(() => setLoadAtmosphere(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="tembox-app">
      {/* ==================================================
          1. HEADER (LCP & Speed Index Optimized)
          ================================================== */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="brand-link">
              <Image
                src="/LogoTembox-Horizontal.png"
                alt="TEMBOX"
                className="brand-logo-img"
                width={140}
                height={36}
                priority
                style={{
                  width: '140px',
                  height: '36px',
                  objectFit: 'contain',
                }}
              />
            </Link>

            {/* Desktop Navigation using native Next.js Link with automatic prefetching */}
            <nav className="header-nav">
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
              <div className="nav-divider" />
              <div className="auth-links">
                <Link href="/login" className="nav-link">
                  Sign in
                </Link>
                <span className="auth-sep">|</span>
                <Link href="/register" className="nav-link">
                  Sign up
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF3' }} />
            <Link
              href="/login"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION
          ================================================== */}
      <section
        id="hero"
        className="hero-section"
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#071A27',
        }}
      >
        {/* Maritime Fisherman Boat Background Video */}
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-boat.jpg"
          className="hero-video absolute inset-0 w-full h-full object-cover -z-10"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '72% 52%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
        </video>

        {/* Soft Dark Neutral Overlay (bg-slate-950/40 or bg-slate-900/50 equivalent) */}
        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            background: 'linear-gradient(180deg, rgba(7, 26, 39, 0.45) 0%, rgba(15, 23, 42, 0.40) 50%, rgba(7, 26, 39, 0.65) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Three.js Atmospheric Canvas deferred to idle */}
        {loadAtmosphere && (
          <div
            className="hero-canvas-container"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <HeroAtmosphere />
          </div>
        )}

        {/* Soft bottom fade */}
        <div className="hero-bottom-fade" style={{ zIndex: 3 }} />

        {/* Hero Content Container (strictly above background video) */}
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-content">
            <span className="eyebrow" style={{ color: '#7DDCE8', fontWeight: 700, letterSpacing: '0.18em', textShadow: '0 1px 6px rgba(0, 0, 0, 0.6)' }}>
              SMART MONITORING FOR FRESHER CATCH
            </span>
            <h1 className="heading-xl hero-heading" style={{ color: '#FFFFFF', textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)' }}>
              Keeping Every Catch
              <br />
              Fresh, with <span className="text-ice" style={{ color: '#7DDCE8' }}>TEMBOX.</span>
            </h1>
            <p className="body-lg hero-description" style={{ color: '#E2E8F0', textShadow: '0 1px 8px rgba(0, 0, 0, 0.7)' }}>
              TEMBOX adalah sistem pemantauan suhu dan kondisi penyimpanan ikan
              secara real-time untuk menjaga kualitas hasil tangkapan hingga
              sampai ke tangan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. BELOW THE FOLD SECTIONS (Code-Split via dynamic import)
          ================================================== */}
      <LandingBelowTheFold />
    </div>
  );
};

export default App;
