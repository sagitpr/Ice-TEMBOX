'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Thermometer,
  Snowflake,
  Server,
  Clock,
  ShieldCheck,
  TrendingUp,
  Box,
  Check,
  User,
  ArrowRight,
  Info
} from './Icons';

// Static public assets (Direct root path for Next.js public directory, preventing Webpack module resolution failures on Linux/Vercel)
const logoHorizontal = '/LogoTembox-Horizontal.png';
const penangkapIkan = '/Penangkap-ikan.jpg';
const sagitPhoto = '/Sagit-Faturrakhman.jpg';

export const AboutView: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="tembox-app" style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* ==================================================
          1. HEADER (Identical to Main Landing)
          ================================================== */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="brand-link" onClick={(e) => handleNav('home', e)}>
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <Link href="/#vision" onClick={(e) => handleNav('home', e)} className="nav-link">
                Contact
              </Link>
              <Link href="/about" className="nav-link" style={{ color: '#0284C7', fontWeight: 700 }}>
                About
              </Link>
              <div className="nav-divider" />
              <div className="auth-links">
                <Link href="/login" onClick={(e) => handleNav('login', e)} className="nav-link">
                  Sign in
                </Link>
                <span className="auth-sep">|</span>
                <Link href="/register" onClick={(e) => handleNav('register', e)} className="nav-link">
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
            <Link href="/#vision" className="nav-link" onClick={() => { setMobileMenuOpen(false); handleNav('home', {} as any); }}>
              Contact
            </Link>
            <Link href="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid #E2EDF3' }} />
            <Link href="/login" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('login', e); }}>
              Sign in
            </Link>
            <Link href="/register" className="nav-link" onClick={(e) => { setMobileMenuOpen(false); handleNav('register', e); }}>
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION: Penangkap-ikan.jpg with Gradient Blur Overlay
          ================================================== */}
      <section
        id="about-hero"
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '130px',
          paddingBottom: '80px',
          overflow: 'hidden',
          background: '#071A27',
        }}
      >
        {/* Backdrop Image */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Image
            src={penangkapIkan}
            alt="Nelayan Tradisional Sedang Memperbaiki Jaring Tangkap"
            priority
            fill
            sizes="100vw"
            quality={90}
            style={{
              objectFit: 'cover',
              objectPosition: 'center 40%',
              opacity: 0.38,
              filter: 'brightness(0.75) contrast(1.1)',
            }}
          />
          {/* Deep Navy/Black Gradient Overlay for Maximum Text Contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(7, 26, 39, 0.98) 0%, rgba(7, 26, 39, 0.92) 38%, rgba(7, 26, 39, 0.65) 68%, rgba(7, 26, 39, 0.35) 100%)',
              backdropFilter: 'blur(1px)',
              pointerEvents: 'none',
            }}
          />
          {/* Soft Bottom Fade to Content */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              background: 'linear-gradient(to top, #071A27 0%, rgba(7, 26, 39, 0) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '680px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#7DDCE8',
                marginBottom: '16px',
                background: 'rgba(125, 220, 232, 0.1)',
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(125, 220, 232, 0.25)',
              }}
            >
              TENTANG TEMBOX • MARITIME IOT INTELLIGENCE
            </span>
            <h1
              className="heading-xl"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '22px',
              }}
            >
              Merevolusi Rantai Pasok Maritim Melalui{' '}
              <span style={{ color: '#7DDCE8' }}>Kecerdasan IoT.</span>
            </h1>
            <p
              style={{
                fontSize: '16.5px',
                lineHeight: 1.65,
                color: '#CBD5E1',
                maxWidth: '620px',
              }}
            >
              TEMBOX hadir sebagai perwujudan visi masa depan industri perikanan yang cerdas,
              tangguh, dan berkelanjutan. Menjembatani kesenjangan antara nelayan tradisional
              dan teknologi terapan, memastikan setiap gram hasil tangkapan laut tetap berada
              di tingkat kesegaran optimal sejak dari samudra hingga ke konsumen akhir.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. SECTION: VISI & PENGANTAR KORPORAT
          ================================================== */}
      <section style={{ padding: '80px 0', borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ color: '#00A3C4' }}>1. VISI &amp; PENGANTAR KORPORAT</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '18px' }}>
                Menjaga Nilai Luhur Nelayan Nusantara di Era Digital
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94A3B8', marginBottom: '16px' }}>
                Di era transformasi digital yang bergerak masif, sektor kelautan dan perikanan Indonesia memegang peran
                fundamental dalam ketahanan pangan serta perekonomian nasional. Namun, tantangan klasik dalam distribusi
                hasil tangkapan laut—khususnya penanganan pasca-penangkapan (<em>post-harvest handling</em>)—masih
                menghadapi kendala efisiensi rantai dingin (<em>cold chain logistics</em>).
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#94A3B8' }}>
                Kami berkomitmen menghadirkan solusi teknologi mutakhir yang inklusif, dapat dijangkau oleh nelayan skala
                kecil hingga menengah, tanpa merombak armada kapal yang telah mereka miliki selama puluhan tahun.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(15, 38, 54, 0.7)',
                  border: '1px solid rgba(125, 220, 232, 0.18)',
                  borderRadius: '14px',
                  padding: '24px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DDCE8' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Integritas Mutu Tangkapan</h3>
                </div>
                <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                  Mencegah degradasi histamin dan pembusukan dini pada ikan dengan pengawasan termal presisi 24/7.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(15, 38, 54, 0.7)',
                  border: '1px solid rgba(125, 220, 232, 0.18)',
                  borderRadius: '14px',
                  padding: '24px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DDCE8' }}>
                    <TrendingUp size={22} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Dampak Ekonomi Berkelanjutan</h3>
                </div>
                <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                  Meningkatkan nilai jual lelang ikan di Tempat Pelelangan Ikan (TPI) berkat bukti riwayat suhu dingin terverifikasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SECTION: PROBLEM VS SOLUTION (RETROFIT MODULAR)
          ================================================== */}
      <section style={{ padding: '80px 0', background: '#051420', borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ color: '#00A3C4' }}>2. LATAR BELAKANG MASALAH &amp; SOLUSI INOVATIF</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Dari Kerentanan Manual ke Kepastian Terukur
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* The Problem Card */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
                THE PROBLEM (TANTANGAN)
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
                Fluktuasi Suhu Palka Es Konvensional
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94A3B8', marginBottom: '16px' }}>
                Secara geografis, Indonesia merupakan negara kepulauan dengan potensi maritim luar biasa. Namun, nelayan
                tradisional masih sangat bergantung pada metode penyimpanan es manual di dalam kotak palka tanpa sistem pemantauan terukur.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#94A3B8' }}>
                Selama pelayaran yang panjang, es mencair dan suhu naik secara perlahan tanpa disadari. Nelayan baru mengetahui
                penurunan mutu ketika pembusukan telah terjadi saat bersandar di pelabuhan, mengakibatkan kerugian ekonomi yang fatal.
              </p>
            </div>

            {/* The Solution Card */}
            <div
              style={{
                background: 'rgba(11, 45, 66, 0.65)',
                border: '1px solid rgba(125, 220, 232, 0.4)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 163, 196, 0.12)',
              }}
            >
              <div style={{ display: 'inline-block', background: 'rgba(125, 220, 232, 0.2)', color: '#7DDCE8', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
                THE SOLUTION (SOLUSI TEMBOX)
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
                Perangkat Tambahan Pintar (Retrofit Device)
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#D1EAF7', marginBottom: '16px' }}>
                Kami tidak berupaya menggantikan es sebagai media pendingin utama, melainkan menghadirkan <strong>TEMBOX (Temperature Box)</strong> sebagai perangkat tambahan modular.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#D1EAF7' }}>
                Perangkat ini dipasang langsung pada wadah penyimpanan ikan yang sudah dimiliki nelayan tanpa perlu mengganti infrastruktur fisik. Memantau suhu secara real-time, memberi peringatan dini visual &amp; suara, serta mencatat data secara terukur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. SECTION: HARDWARE TO CLOUD ARCHITECTURE
          ================================================== */}
      <section style={{ padding: '80px 0', borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ color: '#00A3C4' }}>3. ARSITEKTUR SISTEM &amp; CARA KERJA</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Hardware to Cloud: Andal Tanpa Sinyal Internet
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', marginTop: '10px' }}>
              Dirancang dengan kapabilitas <em>Offline-First</em> yang kokoh untuk kondisi ekstrem di tengah laut.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Step 1 */}
            <div style={{ background: 'rgba(15, 38, 54, 0.65)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#7DDCE8', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>TAHAP 01</div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Input Sensor DS18B20 &amp; ESP32</h4>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                Sensor industri waterproof DS18B20 membaca suhu palka es secara berkala. Data mentah diproses lokal oleh mikrokontroler ESP32 berkemampuan tinggi.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: 'rgba(15, 38, 54, 0.65)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#7DDCE8', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>TAHAP 02</div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Display LCD &amp; Alarm Peringatan</h4>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                Layar LCD 16x2 I2C menampilkan suhu seketika pada awak kapal. LED RGB dan Buzzer aktif memberi alarm instan jika suhu melampaui ambang batas aman.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: 'rgba(15, 38, 54, 0.65)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#7DDCE8', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>TAHAP 03</div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Pencatatan Offline RTC &amp; MicroSD</h4>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                Modul RTC DS3231 memberi penanda waktu akurat, sementara slot MicroSD menyimpan seluruh riwayat suhu secara lokal saat kapal berlayar tanpa sinyal internet.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ background: 'rgba(15, 38, 54, 0.65)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ color: '#7DDCE8', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>TAHAP 04</div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>Sinkronisasi Cloud &amp; Web Next.js</h4>
              <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                Begitu mendeteksi jaringan Wi-Fi di pelabuhan, data tersinkronisasi otomatis ke cloud. Pengguna memantau grafik tren 24 jam via Dashboard Web Next.js.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. SECTION: CORE TECHNOLOGY STACK
          ================================================== */}
      <section style={{ padding: '70px 0', background: '#051420', borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="eyebrow" style={{ color: '#00A3C4' }}>4. CORE TECHNOLOGY STACK &amp; CDN ARCHITECTURE</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Fondasi Performa &amp; Keandalan Tinggi
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(11, 45, 66, 0.45)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#7DDCE8', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Next.js App Router</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Fondasi aplikasi web performa tinggi dengan Server Components dan code-splitting dinamis (0 CLS, minimal TBT).
              </p>
            </div>

            <div style={{ background: 'rgba(11, 45, 66, 0.45)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#7DDCE8', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Tailwind Styling Engine</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Antarmuka dark-mode korporat yang responsif, terkalibrasi, dan ringan untuk peramban desktop maupun ponsel nelayan.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 45, 66, 0.45)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#7DDCE8', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Inter &amp; Plus Jakarta Sans</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Tipografi standar enterprise dengan keterbacaan tingkat tinggi di bawah terik matahari maupun pencahayaan minim palka.
              </p>
            </div>

            <div style={{ background: 'rgba(11, 45, 66, 0.45)', border: '1px solid rgba(125, 220, 232, 0.15)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#7DDCE8', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Interactive Telemetry</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                Visualisasi tren suhu historis 24 jam dengan filter rentang waktu interaktif untuk evaluasi mutu tangkapan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          7. SECTION: THE ENGINEERING TEAM (SAGIT FATURRAKHMAN)
          ================================================== */}
      <section style={{ padding: '90px 0', borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ color: '#00A3C4' }}>5. THE ENGINEERING TEAM</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Profil Pengembang Utama
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', marginTop: '10px' }}>
              Di balik inovasi arsitektur dan ekosistem digital TEMBOX.
            </p>
          </div>

          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(15, 38, 54, 0.85) 0%, rgba(7, 26, 39, 0.95) 100%)',
              border: '1px solid rgba(125, 220, 232, 0.3)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0',
            }}
          >
            {/* Left: 3:4 Portrait Image */}
            <div
              style={{
                position: 'relative',
                minHeight: '420px',
                background: '#0B2D42',
                overflow: 'hidden',
              }}
            >
              <Image
                src={sagitPhoto}
                alt="Sagit Faturrakhman - Lead Systems Architect & Full-Stack/IoT Engineer"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7, 26, 39, 0.8) 0%, rgba(7, 26, 39, 0) 50%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  background: 'rgba(7, 26, 39, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(125, 220, 232, 0.3)',
                }}
              >
                <span style={{ fontSize: '11px', color: '#7DDCE8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  LEAD SYSTEMS ARCHITECT
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Sagit Faturrakhman
                </h4>
              </div>
            </div>

            {/* Right: Bio & Profile Details */}
            <div style={{ padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '18px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#7DDCE8',
                    background: 'rgba(125, 220, 232, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}
                >
                  FULL-STACK &amp; IOT ENGINEER
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  Sagit Faturrakhman
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                  NPM: <strong>12046124006</strong> • S1 Sistem Informasi
                </p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Fakultas Teknologi dan Bisnis — Universitas Bakti Tunas Husada Tasikmalaya
                </p>
              </div>

              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#CBD5E1', marginBottom: '22px' }}>
                Menggabungkan pemahaman mendalam antara logika bisnis sistem informasi korporat, pengembangan antarmuka
                web modern (Frontend/Backend Next.js), hingga perancangan integrasi mikrokontroler dan telemetri data sensor IoT.
                Berdedikasi penuh untuk menghadirkan solusi teknologi terapan yang memberikan dampak nyata bagi pemberdayaan sektor maritim nasional.
              </p>

              {/* Motto Banner */}
              <div
                style={{
                  background: 'rgba(2, 132, 199, 0.15)',
                  borderLeft: '4px solid #7DDCE8',
                  borderRadius: '0 8px 8px 0',
                  padding: '14px 18px',
                }}
              >
                <p style={{ fontSize: '15px', fontStyle: 'italic', fontWeight: 700, color: '#7DDCE8', margin: 0 }}>
                  &ldquo;Untuk Nelayan, Untuk Laut Kita.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. FOOTER (Strictly Consistent with Landing Page)
          ================================================== */}
      <footer className="site-footer" style={{ borderTop: '1px solid rgba(225, 239, 246, 0.08)' }}>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img
                src={logoHorizontal}
                alt="TEMBOX"
                className="footer-logo-img"
                width={130}
                height={34}
                loading="lazy"
                decoding="async"
                style={{ width: '130px', height: '34px', objectFit: 'contain' }}
              />
              <p className="footer-tagline">Fresh Catch, Better Tomorrow.</p>
            </div>

            <div className="footer-nav">
              <Link href="/#vision" onClick={(e) => handleNav('home', e)} className="footer-link">
                Contact
              </Link>
              <Link href="/about" className="footer-link" style={{ color: '#0284C7' }}>
                About
              </Link>
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

export default AboutView;

