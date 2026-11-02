'use client';

import React, { useState, useEffect, useRef } from 'react';
// Styles imported globally via app/globals.css

// Existing local assets
import logoHorizontalRaw from './assets/LogoTembox-Horizontal.png';
import box1ImgRaw from './assets/Box-1.png';
import box2ImgRaw from './assets/Box-2.png';
import box3ImgRaw from './assets/Box-3.png';
import heroVideoRaw from './assets/Video/Nelayan-kapal-Horizontal.mp4';

// Helper to resolve string source across both standard bundlers and Next.js StaticImageData
const getSrc = (asset: any): string => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'src' in asset) return asset.src;
  return '';
};

const logoHorizontal = getSrc(logoHorizontalRaw);
const box1Img = getSrc(box1ImgRaw);
const box2Img = getSrc(box2ImgRaw);
const box3Img = getSrc(box3ImgRaw);
const heroVideo = getSrc(heroVideoRaw);

// Product variants data
const PRODUCTS = [
  {
    id: 'mini',
    name: 'TEMBOX Mini',
    desc: 'Cocok untuk nelayan skala kecil dan penyimpanan sederhana.',
    image: box1Img,
  },
  {
    id: 'pro',
    name: 'TEMBOX Pro',
    desc: 'Untuk usaha menengah dengan fitur lengkap dan konektivitas stabil.',
    image: box2Img,
  },
  {
    id: 'enterprise',
    name: 'TEMBOX Enterprise',
    desc: 'Solusi untuk industri dan rantai distribusi perikanan skala besar.',
    image: box3Img,
  },
];

export const App: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const handleNav = (view: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1]); // Default to TEMBOX Pro as in reference

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll detection for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js subtle atmospheric hero layer (NO particles/dots - calm subtle depth wave only)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let renderer: any = null;
    let isDisposed = false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initThree = async () => {
      try {
        let THREE: any = (window as any).THREE;
        if (!THREE) {
          THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
        }

        if (isDisposed || !canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.z = 18;

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Subtle undulating depth wave mesh (no particles/dots)
        const waveGeometry = new THREE.PlaneGeometry(38, 14, 32, 24);
        const waveMaterial = new THREE.MeshBasicMaterial({
          color: 0x7DDCE8,
          wireframe: true,
          transparent: true,
          opacity: 0.05,
        });
        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        waveMesh.rotation.x = -Math.PI * 0.38;
        waveMesh.position.y = -6.5;
        waveMesh.position.z = -2;
        scene.add(waveMesh);

        // Smooth mouse parallax lerp damping
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
          if (prefersReducedMotion) return;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = -(e.clientY / window.innerHeight) * 2 + 1;
          targetX = nx * 0.65;
          targetY = ny * 0.45;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Responsive resize
        const handleResize = () => {
          if (!container || !renderer) return;
          const newW = container.clientWidth || window.innerWidth;
          const newH = container.clientHeight || window.innerHeight;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // Animation Loop
        let clock = 0;
        const animate = () => {
          if (isDisposed) return;
          clock += 0.01;

          // Smooth lerp damping for subtle parallax
          currentX += (targetX - currentX) * 0.035;
          currentY += (targetY - currentY) * 0.035;
          camera.position.x = currentX;
          camera.position.y = currentY;
          camera.lookAt(0, 0, 0);

          if (!prefersReducedMotion) {
            // Gentle wave surface undulation
            const wavePos = waveGeometry.attributes.position;
            const waveArray = wavePos.array as Float32Array;
            for (let i = 0; i < wavePos.count; i++) {
              const u = waveArray[i * 3];
              const v = waveArray[i * 3 + 1];
              waveArray[i * 3 + 2] = Math.sin(u * 0.32 + clock * 1.1) * 0.35 + Math.cos(v * 0.38 + clock) * 0.25;
            }
            wavePos.needsUpdate = true;
          }

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('Three.js atmosphere fallback:', err);
      }
    };

    initThree();

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="tembox-app">
      {/* ==================================================
          1. HEADER
          ================================================== */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <a href="#hero" className="brand-link">
              <img src={logoHorizontal} alt="TEMBOX" className="brand-logo-img" />
            </a>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <a href="#vision" className="nav-link">Contact</a>
              <a href="#why" className="nav-link">About</a>
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
            <a href="#why" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF3' }} />
            <a href="/login" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('login', e); }}>Sign in</a>
            <a href="/register" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('register', e); }}>Sign up</a>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION
          ================================================== */}
      <section id="hero" className="hero-section">
        {/* Background Video */}
        <div className="hero-bg-media">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay-gradient" />
        </div>

        {/* Three.js Atmospheric Canvas (Subtle depth wave, zero particle dots) */}
        <div className="hero-canvas-container">
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>

        {/* Soft bottom fade */}
        <div className="hero-bottom-fade" />

        <div className="container" style={{ position: 'relative', zIndex: 4 }}>
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
          3. SECTION: WHY TEMBOX
          ================================================== */}
      <section id="why" className="section-why">
        <div className="container">
          <div className="why-grid">
            <div className="why-left">
              <span className="eyebrow">WHY TEMBOX?</span>
              <h2 className="heading-lg why-heading">
                Teknologi untuk<br />
                Kesegaran yang Lebih Lama
              </h2>
              <p className="body-md why-desc">
                Dengan pemantauan suhu, kondisi es, dan notifikasi real-time,
                TEMBOX membantu nelayan dan pelaku usaha perikanan dalam
                menjaga kualitas ikan sejak dari laut hingga ke pasar.
              </p>
              <a href="#how" className="btn-pill-link">
                <span>Lihat Selengkapnya</span>
                <span>→</span>
              </a>
            </div>

            <div className="why-features-row">
              {/* Feature 1 */}
              <div className="why-card">
                <div className="why-icon-halo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                </div>
                <h3 className="why-card-title">Real-time Monitoring</h3>
                <p className="why-card-desc">Pantau suhu dan kondisi penyimpanan kapan saja.</p>
              </div>

              {/* Feature 2 */}
              <div className="why-card">
                <div className="why-icon-halo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3 className="why-card-title">Smart Notification</h3>
                <p className="why-card-desc">Dapatkan peringatan saat ada kondisi tidak normal.</p>
              </div>

              {/* Feature 3 */}
              <div className="why-card">
                <div className="why-icon-halo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 className="why-card-title">Data & History</h3>
                <p className="why-card-desc">Akses riwayat data untuk analisis yang lebih baik.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SECTION: HOW IT WORKS
          ================================================== */}
      <section id="how" className="section-how">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2 className="heading-lg">
              Cara Kerja<br />
              Sederhana, tapi Berdampak Besar
            </h2>
            <p className="body-md">
              TEMBOX bekerja dengan memantau suhu dan kondisi penyimpanan secara otomatis,
              lalu mengirimkan data ke dashboard dan aplikasi.
            </p>
          </div>

          <div className="how-pipeline">
            {/* Step 1 */}
            <div className="how-step-card">
              <div className="how-icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              </div>
              <h3 className="how-step-num-title">1. Sensor Membaca</h3>
              <p className="how-step-desc">Sensor suhu dan kondisi es bekerja secara real-time.</p>
            </div>

            {/* Step 2 */}
            <div className="how-step-card">
              <div className="how-icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
              </div>
              <h3 className="how-step-num-title">2. Data Diproses</h3>
              <p className="how-step-desc">Data dikirim ke sistem melalui konektivitas IoT.</p>
            </div>

            {/* Step 3 */}
            <div className="how-step-card">
              <div className="how-icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="how-step-num-title">3. Analisis & Notifikasi</h3>
              <p className="how-step-desc">Sistem menganalisis data dan mengirim peringatan jika ada kondisi tidak normal.</p>
            </div>

            {/* Step 4 */}
            <div className="how-step-card">
              <div className="how-icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="how-step-num-title">4. Akses Dashboard</h3>
              <p className="how-step-desc">Pantau semua data melalui web dan aplikasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. SECTION: MANFAAT (BENEFITS)
          ================================================== */}
      <section id="benefits" className="section-benefits">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow">MANFAAT</span>
            <h2 className="heading-lg">Lebih dari Sekadar Monitoring</h2>
            <p className="body-md">
              TEMBOX memberikan banyak manfaat untuk nelayan, pelaku usaha, dan konsumen akhir.
            </p>
          </div>

          <div className="benefits-grid">
            {/* Benefit 1 */}
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h3 className="benefit-title">Kualitas Ikan Terjaga</h3>
              <p className="benefit-desc">Kesegaran dan nilai jual lebih tinggi.</p>
            </div>

            {/* Benefit 2 */}
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <h3 className="benefit-title">Mengurangi Kerugian</h3>
              <p className="benefit-desc">Cegah kerusakan akibat suhu tidak stabil.</p>
            </div>

            {/* Benefit 3 */}
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="benefit-title">Operasional Lebih Efisien</h3>
              <p className="benefit-desc">Pantau dan kelola dengan mudah.</p>
            </div>

            {/* Benefit 4 */}
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="benefit-title">Kepercayaan Konsumen</h3>
              <p className="benefit-desc">Produk lebih aman dan berkualitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. SECTION: ECOSYSTEM
          ================================================== */}
      <section id="ecosystem" className="section-ecosystem">
        <div className="container">
          <div className="section-header-centered">
            <span className="eyebrow">ECOSYSTEM</span>
            <h2 className="heading-lg">
              Ekosistem TEMBOX<br />
              Terhubung dalam Satu Sistem
            </h2>
            <p className="body-md">
              TEMBOX bukan hanya perangkat, tetapi bagian dari ekosistem digital untuk perikanan yang lebih modern dan efisien.
            </p>
          </div>

          <div className="ecosystem-diagram">
            {/* Node 1 */}
            <div className="ecosystem-node">
              <div className="ecosystem-icon-wrapper">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="ecosystem-node-title">Perangkat TEMBOX</h3>
              <p className="ecosystem-node-sub">Sensor & IoT Device</p>
            </div>

            <div className="ecosystem-connector">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            {/* Node 2 */}
            <div className="ecosystem-node">
              <div className="ecosystem-icon-wrapper">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
              </div>
              <h3 className="ecosystem-node-title">Cloud Server</h3>
              <p className="ecosystem-node-sub">Data Processing & Storage</p>
            </div>

            <div className="ecosystem-connector">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            {/* Node 3 */}
            <div className="ecosystem-node">
              <div className="ecosystem-icon-wrapper">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <h3 className="ecosystem-node-title">Dashboard & Mobile App</h3>
              <p className="ecosystem-node-sub">Monitoring & Notification</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          7. SECTION: OUR PRODUCT
          ================================================== */}
      <section id="product" className="section-product">
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <span className="eyebrow">OUR PRODUCT</span>
            <h2 className="heading-lg">Tersedia dalam Berbagai Varian</h2>
            <p className="body-md" style={{ maxWidth: '580px', marginTop: '12px' }}>
              TEMBOX hadir dalam beberapa pilihan produk yang sesuai dengan kebutuhan
              operasional Anda, dari skala kecil hingga besar.
            </p>
          </div>

          <div className="product-layout">
            {/* Left: 3 Product Cards */}
            <div className="product-cards-col">
              {PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className={`product-item-card ${selectedProduct.id === prod.id ? 'active' : ''}`}
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="product-thumb-box">
                    <img src={prod.image} alt={prod.name} />
                  </div>
                  <div className="product-info-box">
                    <h3 className="product-name">{prod.name}</h3>
                    <p className="product-desc">{prod.desc}</p>
                  </div>
                  <span className="product-arrow">→</span>
                </div>
              ))}
            </div>

            {/* Right: Big Showcase */}
            <div className="product-showcase-col">
              <div className="showcase-halo" />
              <div className="showcase-pedestal">
                <img
                  key={selectedProduct.id}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="showcase-main-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. SECTION: OUR VISION
          ================================================== */}
      <section id="vision" className="section-vision">
        <div className="vision-bg-media">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="vision-overlay-gradient" />

        <div className="container">
          <div className="vision-content">
            <span className="eyebrow vision-eyebrow">OUR VISION</span>
            <h2 className="heading-lg vision-heading">
              Masa Depan Perikanan<br />
              yang Lebih Cerdas
            </h2>
            <p className="vision-desc">
              Kami percaya bahwa teknologi dapat menjadi solusi nyata untuk
              menjaga keberlanjutan laut dan meningkatkan kesejahteraan nelayan.
            </p>
            <a href="mailto:info@tembox.id" className="btn-vision-cta">
              <span>Hubungi Kami</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================
          9. FOOTER
          ================================================== */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src={logoHorizontal} alt="TEMBOX" className="footer-logo-img" />
              <p className="footer-tagline">Fresh Catch, Better Tomorrow.</p>
            </div>

            <div className="footer-nav">
              <a href="#vision" className="footer-link">Contact</a>
              <a href="#why" className="footer-link">About</a>
            </div>

            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 TEMBOX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
