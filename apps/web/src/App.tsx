'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Three.js atmospheric layer (SSR false to eliminate initial bundle bloat)
const HeroAtmosphere = dynamic(() => import('../app/components/HeroAtmosphere'), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for all below-the-fold content (code-split to slash Total Blocking Time)
const LandingBelowTheFold = dynamic(() => import('../app/components/LandingBelowTheFold'), {
  ssr: true,
});

// Local assets
import logoHorizontalRaw from './assets/LogoTembox-Horizontal.png';
import heroBoatRaw from './assets/hero-boat.jpg';
import heroVideoRaw from './assets/Video/Nelayan-kapal-Horizontal.mp4';

interface StaticAssetLike {
  src?: string;
}

const getSrc = (asset: string | StaticAssetLike | unknown): string => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'src' in asset) return (asset as StaticAssetLike).src || '';
  return '';
};

const logoHorizontal = getSrc(logoHorizontalRaw);
const heroBoat = getSrc(heroBoatRaw) || '/hero-boat.jpg';
const heroVideo = getSrc(heroVideoRaw) || '/Nelayan-kapal-Horizontal.mp4';

export const App: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const handleNav = (view: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadAtmosphere, setLoadAtmosphere] = useState(false);

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
        const idleId = win.requestIdleCallback(() => {
          setLoadAtmosphere(true);
        }, { timeout: 2500 });
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
            <a href="#hero" className="brand-link">
              <img
                src={logoHorizontal}
                alt="TEMBOX"
                className="brand-logo-img"
                width={140}
                height={36}
                fetchPriority="high"
                decoding="sync"
                style={{ width: '140px', height: '36px', objectFit: 'contain' }}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <a href="#vision" className="nav-link">Contact</a>
              <a href="/about" onClick={(e) => handleNav('about', e)} className="nav-link">About</a>
              <div className="nav-divider" />
              <div className="auth-links">
                <a href="/login" onClick={(e) => handleNav('login', e)} className="nav-link">Sign in</a>
                <span className="auth-sep">|</span>
                <a href="/register" onClick={(e) => handleNav('register', e)} className="nav-link">Sign up</a>
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
            <a href="#vision" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a href="/about" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('about', e); }}>About</a>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF3' }} />
            <a href="/login" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('login', e); }}>Sign in</a>
            <a href="/register" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('register', e); }}>Sign up</a>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION
          ================================================== */}
      <section id="hero" className="hero-section" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Background Video Media Backdrop: Absolute position behind text (z-index: 0), pointer-events: none */}
        <div
          className="hero-bg-media"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroBoat}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '72% 52%',
              opacity: 0.76,
              filter: 'brightness(0.85) contrast(0.92) saturate(0.90)',
              pointerEvents: 'none',
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
            {/* Fallback image if video cannot be played */}
            <img
              src={heroBoat}
              alt="Kapal Nelayan Tradisional TEMBOX"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </video>
          {/* Calming marine atmospheric gradient overlay */}
          <div className="hero-overlay-gradient" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
        </div>

        {/* Three.js Atmospheric Canvas deferred to idle */}
        {loadAtmosphere && (
          <div className="hero-canvas-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
            <HeroAtmosphere />
          </div>
        )}

        {/* Soft bottom fade */}
        <div className="hero-bottom-fade" style={{ zIndex: 3 }} />

        {/* Hero Content Container (z-index: 10 strictly above background video) */}
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Shifted slightly left, no Watch Overview, no scroll indicator */}
          <div className="hero-content">
            <span className="eyebrow">SMART MONITORING FOR FRESHER CATCH</span>
            <h1 className="heading-xl hero-heading">
              Keeping Every Catch<br />
              Fresh, with <span className="text-ice">TEMBOX.</span>
            </h1>
            <p className="body-lg hero-description">
              TEMBOX adalah sistem pemantauan suhu dan kondisi penyimpanan
              ikan secara real-time untuk menjaga kualitas hasil tangkapan
              hingga sampai ke tangan Anda.
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
