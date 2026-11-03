'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Static public assets
const logoHorizontal = '/LogoTembox-Horizontal.png';

interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryOption {
  id: string;
  title: string;
  badge: string;
  description: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'Konsultasi Perangkat',
    title: 'Konsultasi Perangkat TEMBOX',
    badge: 'Hardware & Armada',
    description: 'Spesifikasi teknis alat, instalasi retrofit palka es, dan adaptasi untuk berbagai tipe kapal nelayan.',
  },
  {
    id: 'Pertanyaan Teknis IoT',
    title: 'Pertanyaan Teknis IoT & Sensor',
    badge: 'Firmware & Telemetri',
    description: 'Protokol sensor suhu DS18B20, RTC DS3231, logging offline MicroSD, dan integrasi transmisi cloud.',
  },
  {
    id: 'Kemitraan Strategis',
    title: 'Kemitraan Strategis & TPI',
    badge: 'Institusi & Bisnis',
    description: 'Kerja sama Tempat Pelelangan Ikan (TPI), koperasi nelayan, korporasi logistik, dan dinas perikanan.',
  },
  {
    id: 'Dukungan Pelanggan',
    title: 'Dukungan Pelanggan & Pengguna',
    badge: 'Layanan Bantuan',
    description: 'Bantuan penggunaan aplikasi web, kendala otentikasi akun, pemantauan dasbor, dan laporan telemetri.',
  },
];

const FAQS: FAQItem[] = [
  {
    question: 'Bagaimana cara kerja perangkat saat kapal berlayar di tengah laut tanpa sinyal internet?',
    answer:
      'TEMBOX dirancang dengan kapabilitas Offline-First yang tangguh. Saat berada di luar jangkauan sinyal seluler/internet, modul RTC DS3231 terus mencatat stempel waktu akurat dan seluruh data telemetri suhu disimpan lokal di kartu MicroSD berformat FAT32. Begitu kapal bersandar di dermaga dan mendeteksi jaringan Wi-Fi/Hotspot pelabuhan, data secara otomatis disinkronkan secara batch ke server cloud tanpa ada data yang hilang.',
  },
  {
    question: 'Apakah pemasangan TEMBOX memerlukan modifikasi atau perombakan fisik kapal?',
    answer:
      'Tidak sama sekali. TEMBOX merupakan perangkat tambahan pintar modular (modular retrofit). Perangkat ini dipasang langsung pada kotak palka es atau coolbox yang sudah dimiliki nelayan tanpa perlu mengubah struktur kapal maupun mengganti wadah penyimpanan yang ada.',
  },
  {
    question: 'Bagaimana jika suhu palka es melampaui ambang batas aman di tengah pelayaran?',
    answer:
      'Sistem dilengkapi mekanisme peringatan ganda di tingkat lokal: layar LCD 16x2 I2C menampilkan pembacaan suhu terkini secara seketika, sementara LED RGB visual dan Buzzer audio aktif akan berbunyi kencang untuk memperingatkan awak kapal (ABK) agar segera menambah es batu sebelum kualitas ikan menurun.',
  },
  {
    question: 'Siapa saja yang dapat mengakses dasbor analitik dan riwayat suhu web?',
    answer:
      'Aplikasi web Ice-TEMBOX dirancang untuk pengelola Tempat Pelelangan Ikan (TPI), pengepul, pemilik armada kapal, dan koperasi nelayan. Melalui otentikasi aman berbasis peran, pengguna dapat memantau grafik tren suhu 24 jam, mengunduh laporan kesegaran ikan, serta menerima notifikasi anomali termal.',
  },
];

export const ContactView: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [category, setCategory] = useState('Konsultasi Perangkat');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Accordion State for FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && categoryModalOpen) {
        setCategoryModalOpen(false);
      }
    };
    if (categoryModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoryModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate interactive transmission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFullName('');
    setContactInfo('');
    setCategory('Konsultasi Perangkat');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="tembox-app" style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* ==================================================
          1. HEADER (Sticky Navigation Header)
          ================================================== */}
      <header
        className={`site-header ${scrolled ? 'scrolled' : ''}`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'rgba(7, 26, 39, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(125, 220, 232, 0.15)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.25)' : 'none',
        }}
      >
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
                style={{
                  width: '140px',
                  height: '36px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <Link
                href="/contact"
                className="nav-link"
                style={{ color: '#0284C7', fontWeight: 700 }}
              >
                Contact
              </Link>
              <Link
                href="/about"
                onClick={(e) => handleNav('about', e)}
                className="nav-link"
                style={{ color: '#E2E8F0', fontWeight: 500 }}
              >
                About
              </Link>
              <div className="nav-divider" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
              <div className="auth-links" style={{ color: '#FFFFFF' }}>
                <Link
                  href="/login"
                  onClick={(e) => handleNav('login', e)}
                  className="nav-link"
                  style={{ color: '#FFFFFF', fontWeight: 600 }}
                >
                  Sign in
                </Link>
                <span className="auth-sep" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
                <Link
                  href="/register"
                  onClick={(e) => handleNav('register', e)}
                  className="nav-link"
                  style={{ color: '#FFFFFF', fontWeight: 600 }}
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
              <span style={{ background: '#FFFFFF' }} />
              <span style={{ background: '#FFFFFF' }} />
              <span style={{ background: '#FFFFFF' }} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-menu"
            style={{
              background: '#0B2D42',
              borderBottom: '1px solid rgba(125, 220, 232, 0.2)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#7DDCE8', fontWeight: 700 }}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="nav-link"
              onClick={(e) => { setMobileMenuOpen(false); handleNav('about', e); }}
              style={{ color: '#E2E8F0' }}
            >
              About
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
            <Link
              href="/login"
              className="nav-link"
              onClick={(e) => { setMobileMenuOpen(false); handleNav('login', e); }}
              style={{ color: '#E2E8F0' }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="nav-link"
              onClick={(e) => { setMobileMenuOpen(false); handleNav('register', e); }}
              style={{ color: '#7DDCE8', fontWeight: 600 }}
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
        style={{
          position: 'relative',
          paddingTop: '150px',
          paddingBottom: '60px',
          background: 'linear-gradient(180deg, #071A27 0%, #0B2D42 65%, #071A27 100%)',
          borderBottom: '1px solid rgba(125, 220, 232, 0.12)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
              marginBottom: '14px',
            }}
          >
            TEMBOX COMMUNICATION &amp; SUPPORT
          </p>
          <h1
            className="heading-xl"
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2.3rem, 4.2vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              marginBottom: '18px',
            }}
          >
            Hubungi Tim <span style={{ color: '#7DDCE8' }}>TEMBOX.</span>
          </h1>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.7,
              color: '#CBD5E1',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Terhubung dengan kami untuk konsultasi perangkat IoT, kerja sama strategis, atau
            dukungan teknis rantai dingin perikanan maritim.
          </p>
        </div>
      </section>

      {/* ==================================================
          3. MAIN INTERACTIVE SECTION: Form + Contact Info
          ================================================== */}
      <section style={{ padding: '70px 0', background: '#071A27' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Interactive Contact Form */}
            <div
              style={{
                background: 'rgba(11, 45, 66, 0.45)',
                border: '1px solid rgba(125, 220, 232, 0.22)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ marginBottom: '28px' }}>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7DDCE8',
                    marginBottom: '6px',
                  }}
                >
                  FORMULIR INTERAKTIF
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                  Kirimkan Pesan Anda
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                  Isi formulir di bawah ini. Tim teknis dan kemitraan kami akan menindaklanjuti pesan Anda secara profesional.
                </p>
              </div>

              {submitted ? (
                /* Success Notification Card */
                <div
                  style={{
                    background: 'rgba(125, 220, 232, 0.08)',
                    border: '1px solid rgba(125, 220, 232, 0.35)',
                    borderRadius: '16px',
                    padding: '36px 28px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(125, 220, 232, 0.18)',
                      color: '#7DDCE8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                      fontSize: '24px',
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                    Pesan Berhasil Terkirim!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '24px' }}>
                    Terima kasih telah menghubungi TEMBOX. Pesan Anda telah dicatat oleh sistem kami dan akan ditanggapi melalui email atau WhatsApp dalam 1x24 jam kerja.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      background: '#0284C7',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '12px 28px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0369A1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0284C7';
                    }}
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                /* Contact Input Form */
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#E2E8F0',
                        marginBottom: '8px',
                      }}
                    >
                      Nama Lengkap <span style={{ color: '#7DDCE8' }}>*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(7, 26, 39, 0.85)',
                        border: '1px solid rgba(125, 220, 232, 0.25)',
                        borderRadius: '10px',
                        padding: '13px 16px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Email / WhatsApp */}
                  <div>
                    <label
                      htmlFor="contactInfo"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#E2E8F0',
                        marginBottom: '8px',
                      }}
                    >
                      Email atau Nomor WhatsApp <span style={{ color: '#7DDCE8' }}>*</span>
                    </label>
                    <input
                      id="contactInfo"
                      type="text"
                      required
                      placeholder="Contoh: budi@gmail.com / 081234567890"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(7, 26, 39, 0.85)',
                        border: '1px solid rgba(125, 220, 232, 0.25)',
                        borderRadius: '10px',
                        padding: '13px 16px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Category Selection (Custom Popup / Modal Trigger) */}
                  <div>
                    <label
                      id="category-label"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#E2E8F0',
                        marginBottom: '8px',
                      }}
                    >
                      Kategori Kebutuhan
                    </label>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded={categoryModalOpen}
                      onClick={() => setCategoryModalOpen(true)}
                      style={{
                        width: '100%',
                        background: 'rgba(7, 26, 39, 0.95)',
                        border: '1px solid rgba(125, 220, 232, 0.3)',
                        borderRadius: '10px',
                        padding: '13px 16px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.2s ease, background 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{category}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(125, 220, 232, 0.15)',
                            color: '#7DDCE8',
                          }}
                        >
                          {CATEGORY_OPTIONS.find((c) => c.id === category)?.badge || 'Pilihan'}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#7DDCE8' }}>▼</span>
                    </button>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label
                      htmlFor="message"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#E2E8F0',
                        marginBottom: '8px',
                      }}
                    >
                      Pesan atau Kebutuhan Spesifik <span style={{ color: '#7DDCE8' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Jelaskan kebutuhan armada kapal, pertanyaan telemetri palka, atau topik kerja sama yang ingin didiskusikan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(7, 26, 39, 0.85)',
                        border: '1px solid rgba(125, 220, 232, 0.25)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Submit Button (Flat & Professional Minimalist Design) */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: '#0284C7',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '15px',
                      padding: '14px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                      transition: 'background-color 0.2s ease, opacity 0.2s ease',
                      opacity: submitting ? 0.75 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#0369A1';
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#0284C7';
                    }}
                  >
                    {submitting ? 'Mengirimkan Pesan...' : 'Kirim Pesan Sekarang'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Contact Cards & Operational Base */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Card 1: Direct Official Contact */}
              <div
                style={{
                  background: 'rgba(11, 45, 66, 0.45)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '18px',
                  padding: '30px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7DDCE8',
                    marginBottom: '8px',
                  }}
                >
                  SALURAN RESMI
                </p>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
                  Kontak Langsung
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>
                      Email Resmi Layanan:
                    </span>
                    <a
                      href="mailto:sagitistaratas465@gmail.com"
                      style={{
                        fontSize: '15px',
                        color: '#7DDCE8',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      sagitistaratas465@gmail.com
                    </a>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>
                      WhatsApp Bisnis &amp; Konsultasi Cepat:
                    </span>
                    <a
                      href="https://wa.me/6287833847895"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '15px',
                        color: '#7DDCE8',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      +62 878-3384-7895
                    </a>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>
                      Jam Operasional Layanan:
                    </span>
                    <p style={{ fontSize: '14px', color: '#E2E8F0', fontWeight: 600, margin: 0 }}>
                      Senin – Jumat, 08.00 – 17.00 WIB
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Development Base / University */}
              <div
                style={{
                  background: 'rgba(11, 45, 66, 0.45)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '18px',
                  padding: '30px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7DDCE8',
                    marginBottom: '8px',
                  }}
                >
                  BASIS PENGEMBANGAN INSTITUSIONAL
                </p>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                  Universitas Bakti Tunas Husada
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#CBD5E1', marginBottom: '12px' }}>
                  Fakultas Teknologi dan Bisnis — Program Studi S1 Sistem Informasi
                </p>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                  Jl. Letjen Mashudi No. 20, Kota Tasikmalaya, Jawa Barat 46196, Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SECTION: FAQ CEPAT (Quick Support / Tanya-Jawab Singkat)
          ================================================== */}
      <section
        style={{
          padding: '80px 0',
          background: 'linear-gradient(180deg, #071A27 0%, #0B2D42 50%, #071A27 100%)',
          borderTop: '1px solid rgba(125, 220, 232, 0.12)',
        }}
      >
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#7DDCE8',
                marginBottom: '8px',
              }}
            >
              DUKUNGAN INSTAN
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', marginTop: '10px' }}>
              Jawaban ringkas seputar spesifikasi teknis, mekanisme pemasangan, dan operasional TEMBOX.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(11, 45, 66, 0.45)',
                    border: isOpen
                      ? '1px solid #7DDCE8'
                      : '1px solid rgba(125, 220, 232, 0.18)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '22px 26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 700,
                      gap: '16px',
                    }}
                  >
                    <span>{faq.question}</span>
                    <span
                      style={{
                        fontSize: '18px',
                        color: isOpen ? '#7DDCE8' : '#94A3B8',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease, color 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 26px 24px 26px',
                        fontSize: '14.5px',
                        lineHeight: 1.75,
                        color: '#CBD5E1',
                        borderTop: '1px solid rgba(125, 220, 232, 0.08)',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================
          5. FOOTER (Consistent Corporate Dark Navy)
          ================================================== */}
      <footer className="site-footer" style={{ background: '#051420', color: '#E2E8F0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
              <Link href="/contact" className="footer-link" style={{ color: '#7DDCE8' }}>
                Contact
              </Link>
              <Link href="/about" onClick={(e) => handleNav('about', e)} className="footer-link" style={{ color: '#CBD5E1' }}>
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

      {/* ==================================================
          6. MODAL / POPUP: Custom Interactive Category Selector
          ================================================== */}
      {categoryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setCategoryModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 20, 32, 0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0B2D42',
              border: '1px solid rgba(125, 220, 232, 0.35)',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7DDCE8',
                    marginBottom: '4px',
                  }}
                >
                  PILIHAN KATEGORI
                </p>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Pilih Kategori Kebutuhan
                </h3>
                <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '6px', marginBottom: 0 }}>
                  Tentukan topik konsultasi atau layanan yang paling sesuai dengan keperluan Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                aria-label="Tutup Jendela Kategori"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '15px',
                  lineHeight: 1,
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                ✕
              </button>
            </div>

            {/* Category Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = category === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCategory(opt.id);
                      setCategoryModalOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(125, 220, 232, 0.12)' : 'rgba(7, 26, 39, 0.65)',
                      border: isSelected ? '1.5px solid #7DDCE8' : '1px solid rgba(125, 220, 232, 0.2)',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(125, 220, 232, 0.45)';
                        e.currentTarget.style.backgroundColor = 'rgba(7, 26, 39, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(125, 220, 232, 0.2)';
                        e.currentTarget.style.backgroundColor = 'rgba(7, 26, 39, 0.65)';
                      }
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                          {opt.title}
                        </span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isSelected ? 'rgba(125, 220, 232, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                            color: isSelected ? '#7DDCE8' : '#94A3B8',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>

                    {/* Radio / Check indicator */}
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #7DDCE8' : '2px solid rgba(255, 255, 255, 0.3)',
                        background: isSelected ? '#7DDCE8' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <span style={{ color: '#071A27', fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactView;
