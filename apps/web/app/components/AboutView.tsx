'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Static public assets (Direct root path for Next.js public directory)
const logoHorizontal = '/LogoTembox-Horizontal.png';

export const AboutView: React.FC<{ onNavigate?: (view: string) => void }> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroBg, setHeroBg] = useState('/Penangkap-ikan.jpg');
  const [devPhoto, setDevPhoto] = useState('/sagit.png');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTextColor = scrolled ? '#0F172A' : '#FFFFFF';
  const navTextMuted = scrolled ? '#64748B' : '#E2E8F0';

  return (
    <div className="tembox-app" style={{ backgroundColor: '#FFFFFF', color: '#0F172A', minHeight: '100vh' }}>
      {/* ==================================================
          1. HEADER (Adaptive: Transparent over Hero, Frosted White on Scroll)
          ================================================== */}
      <header
        className={`site-header ${scrolled ? 'scrolled' : ''}`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid #E2E8F0' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(11, 45, 66, 0.05)' : 'none',
          willChange: 'transform',
        }}
      >
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="brand-link">
              <Image
                src={logoHorizontal}
                alt="TEMBOX"
                className="brand-logo-img"
                width={140}
                height={36}
                priority
                style={{
                  width: '140px',
                  height: '36px',
                  objectFit: 'contain',
                  filter: scrolled ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <Link
                href="/contact"
                className="nav-link"
                style={{ color: navTextMuted, fontWeight: 500 }}
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="nav-link"
                style={{ color: '#0284C7', fontWeight: 700 }}
              >
                About
              </Link>
              <div className="nav-divider" style={{ backgroundColor: scrolled ? '#CBD5E1' : 'rgba(255, 255, 255, 0.25)' }} />
              <div className="auth-links" style={{ color: navTextColor }}>
                <Link
                  href="/login"
                  className="nav-link"
                  style={{ color: navTextColor, fontWeight: 600 }}
                >
                  Sign in
                </Link>
                <span className="auth-sep" style={{ color: scrolled ? '#94A3B8' : 'rgba(255, 255, 255, 0.4)' }}>|</span>
                <Link
                  href="/register"
                  className="nav-link"
                  style={{ color: navTextColor, fontWeight: 600 }}
                >
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
              <span style={{ background: navTextColor }} />
              <span style={{ background: navTextColor }} />
              <span style={{ background: navTextColor }} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-menu"
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#1E293B' }}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#0284C7', fontWeight: 700 }}
            >
              About
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0' }} />
            <Link
              href="/login"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#1E293B' }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#0284C7', fontWeight: 600 }}
            >
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION: Penangkap-ikan.jpg with Natural Vertical Gradient (Dark-to-Light)
          ================================================== */}
      <section
        id="about-hero"
        style={{
          position: 'relative',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '150px',
          paddingBottom: '120px',
          overflow: 'hidden',
          backgroundColor: '#071A27',
        }}
      >
        {/* Backdrop Image with Reliable Fallback and Priority Loading */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <Image
            src={heroBg}
            alt="Nelayan Tradisional Sedang Mempersiapkan Jaring di Perahu"
            fill
            priority
            sizes="100vw"
            onError={() => {
              if (heroBg === '/Penangkap-ikan.jpg') {
                setHeroBg('/Penangkap-Ikan.jpg');
              } else if (heroBg !== '/hero-boat.jpg') {
                setHeroBg('/hero-boat.jpg');
              }
            }}
            style={{
              objectFit: 'cover',
              objectPosition: 'center 35%',
              opacity: 0.78,
              filter: 'brightness(0.95) contrast(1.05)',
            }}
          />

          {/* Natural Top-to-Bottom Vertical Gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(7, 26, 39, 0.42) 0%, rgba(7, 26, 39, 0.58) 55%, rgba(7, 26, 39, 0.85) 80%, #FFFFFF 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '720px' }}>
            <h1
              className="heading-xl"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(2.4rem, 4.4vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '22px',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)',
              }}
            >
              Merevolusi Rantai Pasok Maritim Melalui{' '}
              <span style={{ color: '#7DDCE8' }}>Kecerdasan IoT.</span>
            </h1>
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#E2E8F0',
                maxWidth: '640px',
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.65)',
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
          3. SECTION: VISI & PENGANTAR KORPORAT (Borderless Numbered Editorial List)
          ================================================== */}
      <section style={{ padding: '96px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'start' }}>
            <div>
              <span className="eyebrow" style={{ color: '#0284C7', marginBottom: '12px' }}>
                VISI &amp; PENGANTAR KORPORAT
              </span>
              <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, marginBottom: '20px' }}>
                Menjaga Nilai Luhur Nelayan Nusantara di Era Digital
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#475569', marginBottom: '16px' }}>
                Di era transformasi digital yang bergerak masif, sektor kelautan dan perikanan Indonesia memegang peran
                fundamental dalam ketahanan pangan serta perekonomian nasional. Namun, tantangan klasik dalam distribusi
                hasil tangkapan laut—khususnya penanganan pasca-penangkapan (<em>post-harvest handling</em>)—masih
                menghadapi kendala efisiensi rantai dingin (<em>cold chain logistics</em>).
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#475569', margin: 0 }}>
                Kami berkomitmen menghadirkan solusi teknologi mutakhir yang inklusif, dapat dijangkau oleh nelayan skala
                kecil hingga menengah, tanpa merombak armada kapal yang telah mereka miliki selama puluhan tahun.
              </p>
            </div>

            {/* Numbered Features List with Neutral Hairline Dividers */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  padding: '24px 0',
                  borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', paddingTop: '3px', flexShrink: 0 }}>
                  01
                </span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '6px' }}>
                    INTEGRITAS MUTU TANGKAPAN
                  </p>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Pengawasan Termal Presisi Tinggi
                  </h3>
                  <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                    Mencegah degradasi histamin dan pembusukan dini pada ikan dengan pengawasan termal presisi tinggi secara terus menerus sepanjang pelayaran.
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '24px 0',
                  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', paddingTop: '3px', flexShrink: 0 }}>
                  02
                </span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '6px' }}>
                    DAMPAK EKONOMI MARITIM
                  </p>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Dampak Ekonomi Berkelanjutan
                  </h3>
                  <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                    Meningkatkan nilai jual lelang ikan di Tempat Pelelangan Ikan (TPI) berkat bukti riwayat suhu dingin terverifikasi dan dapat dipertanggungjawabkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SECTION: LATAR BELAKANG & SOLUSI INOVATIF (Dark Breathable Split, Subtle Hairlines)
          ================================================== */}
      <section style={{ padding: '96px 0', background: '#071A27', color: '#E2E8F0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
            <span className="eyebrow" style={{ color: '#7DDCE8' }}>
              LATAR BELAKANG &amp; SOLUSI INOVATIF
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Dari Kerentanan Manual ke Kepastian Terukur
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
            }}
          >
            {/* 01: Tantangan Industri (No Card Box) */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '28px',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>
                01 / TANTANGAN INDUSTRI
              </p>
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
                Fluktuasi Suhu Palka Es Konvensional
              </h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#CBD5E1', marginBottom: '14px' }}>
                Secara geografis, Indonesia merupakan negara kepulauan dengan potensi maritim luar biasa. Namun, nelayan
                tradisional masih sangat bergantung pada metode penyimpanan es manual di dalam kotak palka tanpa sistem pemantauan terukur.
              </p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#94A3B8', margin: 0 }}>
                Selama pelayaran yang panjang, es mencair dan suhu naik secara perlahan tanpa disadari. Nelayan baru mengetahui
                penurunan mutu ketika pembusukan telah terjadi saat bersandar di pelabuhan, mengakibatkan kerugian ekonomi yang fatal.
              </p>
            </div>

            {/* 02: Solusi Modular TEMBOX (No Card Box) */}
            <div
              style={{
                borderTop: '1px solid rgba(125, 220, 232, 0.45)',
                paddingTop: '28px',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7DDCE8', marginBottom: '10px' }}>
                02 / SOLUSI MODULAR TEMBOX
              </p>
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
                Perangkat Tambahan Pintar (Retrofit Device)
              </h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#CBD5E1', marginBottom: '14px' }}>
                Kami tidak berupaya menggantikan es sebagai media pendingin utama, melainkan menghadirkan <strong style={{ color: '#FFFFFF' }}>TEMBOX (Temperature Box)</strong> sebagai perangkat tambahan modular cerdas.
              </p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#94A3B8', margin: 0 }}>
                Perangkat ini dipasang langsung pada wadah penyimpanan ikan yang sudah dimiliki nelayan tanpa perlu merombak fisik kapal. Memantau suhu secara real-time, memberi peringatan dini visual &amp; audio, serta mencatat data telemetri secara terukur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. SECTION: ARSITEKTUR SISTEM & CARA KERJA (Horizontal Numbered List, Subtle Dividers)
          ================================================== */}
      <section style={{ padding: '96px 0', background: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: '#0284C7' }}>
              ARSITEKTUR SISTEM &amp; CARA KERJA
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
              Hardware to Cloud: Andal Tanpa Sinyal Internet
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', marginBottom: 0 }}>
              Dirancang dengan kapabilitas <em>Offline-First</em> yang tangguh untuk menghadapi kondisi ekstrem di tengah samudra.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '32px',
              borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              paddingTop: '36px',
            }}
          >
            {/* Step 1 */}
            <div>
              <p style={{ color: '#0284C7', fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                01 / INPUT TELEMETRI
              </p>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                Sensor DS18B20 &amp; ESP32
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                Sensor industri tahan air (probe DS18B20 presisi tinggi ±0.5°C) membaca temperatur palka secara berkala. Pemrosesan awal dilakukan lokal oleh mikrokontroler ESP32 hemat energi.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <p style={{ color: '#0284C7', fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                02 / INDIKATOR LOKAL
              </p>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                Display LCD &amp; Alarm Peringatan
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                Layar LCD 16x2 I2C menampilkan nilai suhu seketika pada awak kapal di palka. Buzzer audio aktif dan indikator visual memberi peringatan instan jika suhu melampaui batas aman.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <p style={{ color: '#0284C7', fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                03 / OFFLINE-FIRST
              </p>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                Pencatatan RTC &amp; MicroSD
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                Modul RTC DS3231 memberi penanda waktu presisi tanpa internet, sementara slot MicroSD FAT32 menyimpan riwayat data secara kontinu tanpa risiko kehilangan data saat melaut lepas.
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <p style={{ color: '#0284C7', fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                04 / CLOUD SYNC
              </p>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                Sinkronisasi Cloud &amp; Next.js
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                Saat kapal bersandar dan mendeteksi jaringan Wi-Fi/Hotspot pelabuhan, data batch tersinkronisasi otomatis ke cloud. Pengelola TPI dapat memantau grafik tren 24 jam via web.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. SECTION: CORE TECHNOLOGY STACK (Clean Hairline Spec List)
          ================================================== */}
      <section style={{ padding: '96px 0', background: '#F8FAFC', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: '#0284C7' }}>
              CORE TECHNOLOGY STACK &amp; CLOUD ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
              Fondasi Performa &amp; Keandalan Skala Industri
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', marginBottom: 0 }}>
              Arsitektur hibrida modern yang menggabungkan keandalan komputasi tepi (<em>edge hardware</em>) dengan skalabilitas komputasi awan.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '36px',
            }}
          >
            <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
                01 / FRONTEND ARCHITECTURE
              </p>
              <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
                Next.js 15 App Router &amp; Server Components
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                Fondasi aplikasi web performa tinggi dengan React Server Components (RSC) untuk streaming telemetri instan, code-splitting dinamis, serta optimasi bundle yang mengeliminasi Total Blocking Time (TBT).
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
                02 / DATABASE &amp; REAL-TIME
              </p>
              <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
                Supabase &amp; Real-Time Data Pipeline
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                Infrastruktur basis data relasional enterprise berbasis PostgreSQL yang dilengkapi otentikasi aman berbasis Row Level Security (RLS) serta channel WebSocket real-time untuk pembaruan suhu otomatis.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
                03 / EDGE COMPUTING
              </p>
              <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
                Dual-Mode IoT Firmware (ESP32)
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                Firmware C++ mikrokontroler teroptimasi dengan mekanisme fault-tolerance tinggi: pencatatan lokal pada MicroSD saat di luar jangkauan jaringan, dan transmisi batch otomatis saat bersandar.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
                04 / DESIGN SYSTEM
              </p>
              <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
                Calibrated Maritime Visual System
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                Antarmuka visual terkalibrasi dengan tipografi modern Plus Jakarta Sans, menjamin keterbacaan data grafik telemetri tetap tajam dan ergonomis di bawah terik matahari pantai maupun pencahayaan minim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          7. SECTION: THE ENGINEERING TEAM (Clean Editorial Profile)
          ================================================== */}
      <section style={{ padding: '96px 0', background: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span className="eyebrow" style={{ color: '#0284C7' }}>
              THE ENGINEERING TEAM
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
              Profil Pengembang Utama
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px' }}>
              Dedikasi rekayasa perangkat lunak dan teknologi IoT untuk kemandirian sektor maritim Indonesia.
            </p>
          </div>

          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
              padding: '40px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left: 3:4 Portrait Image */}
            <div
              style={{
                position: 'relative',
                minHeight: '420px',
                borderRadius: '16px',
                background: '#F1F5F9',
                overflow: 'hidden',
              }}
            >
              <Image
                src={devPhoto}
                alt="Sagit Faturrakhman - Full-Stack & IoT Engineer"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                loading="lazy"
                onError={() => {
                  if (devPhoto !== '/Sagit-Faturrakhman.jpg') {
                    setDevPhoto('/Sagit-Faturrakhman.jpg');
                  }
                }}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 40%',
                }}
              />
            </div>

            {/* Right: Bio & Profile Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '20px' }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0284C7',
                    marginBottom: '8px',
                  }}
                >
                  FULL-STACK &amp; IOT ENGINEER
                </p>
                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Sagit Faturrakhman
                </h3>
                <p style={{ fontSize: '14px', color: '#334155', fontWeight: 600, marginBottom: '2px' }}>
                  NPM: <strong>12046124006</strong> • S1 Sistem Informasi
                </p>
                <p style={{ fontSize: '13.5px', color: '#64748B' }}>
                  Fakultas Teknologi dan Bisnis — Universitas Bakti Tunas Husada Tasikmalaya
                </p>
              </div>

              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#475569', marginBottom: '16px' }}>
                Menggabungkan pemahaman mendalam antara logika bisnis sistem informasi korporat, pengembangan antarmuka
                web modern (Next.js 15, Supabase, Tailwind CSS), hingga perancangan integrasi mikrokontroler dan telemetri data sensor IoT.
              </p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#475569', marginBottom: '24px' }}>
                Berdedikasi penuh untuk menghadirkan solusi teknologi terapan yang memberikan dampak nyata bagi pemberdayaan nelayan dan peningkatan kualitas hasil tangkapan laut nasional.
              </p>

              {/* Motto Quote */}
              <div
                style={{
                  borderLeft: '3px solid #0284C7',
                  paddingLeft: '18px',
                }}
              >
                <p style={{ fontSize: '15.5px', fontStyle: 'italic', fontWeight: 700, color: '#0369A1', margin: 0 }}>
                  &ldquo;Untuk Nelayan, Untuk Laut Kita.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. FOOTER (Consistent Corporate Dark Navy Anchor)
          ================================================== */}
      <footer className="site-footer" style={{ background: '#071A27', color: '#E2E8F0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
              <p className="footer-tagline" style={{ color: '#94A3B8' }}>Fresh Catch, Better Tomorrow.</p>
            </div>

            <div className="footer-nav">
              <Link href="/kategori/monitoring-suhu-palka-ikan" className="footer-link" style={{ color: '#CBD5E1' }}>
                Kategori
              </Link>
              <Link href="/contact" className="footer-link" style={{ color: '#CBD5E1' }}>
                Contact
              </Link>
              <Link href="/about" className="footer-link" style={{ color: '#7DDCE8' }}>
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

          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ color: '#64748B' }}>© 2025 TEMBOX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutView;
