'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Existing local assets
import box1ImgRaw from '../../src/assets/Box-1.png';
import box2ImgRaw from '../../src/assets/Box-2.png';
import box3ImgRaw from '../../src/assets/Box-3.png';
import heroVideoRaw from '../../src/assets/Video/Nelayan-kapal-Horizontal.mp4';

interface StaticAssetLike {
  src?: string;
}

const getSrc = (asset: string | StaticAssetLike | unknown): string => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'src' in asset) return (asset as StaticAssetLike).src || '';
  return '';
};

const box1Img = getSrc(box1ImgRaw);
const box2Img = getSrc(box2ImgRaw);
const box3Img = getSrc(box3ImgRaw);
const heroVideo = getSrc(heroVideoRaw);

// Product variants data
const PRODUCTS = [
  {
    id: 'mini',
    name: 'TEMBOX Mini',
    spec: '1 Probe • Kapal Kecil & Coolbox',
    desc: 'Cocok untuk nelayan skala kecil dan penyimpanan sederhana.',
    image: box1Img,
  },
  {
    id: 'pro',
    name: 'TEMBOX Pro',
    spec: 'Dual Probe • Logging RTC + MicroSD',
    desc: 'Untuk usaha menengah dengan fitur lengkap dan konektivitas stabil.',
    image: box2Img,
  },
  {
    id: 'enterprise',
    name: 'TEMBOX Enterprise',
    spec: 'Multi-Palka • Sinkronisasi Armada TPI',
    desc: 'Solusi untuk industri dan rantai distribusi perikanan skala besar.',
    image: box3Img,
  },
];

const TECH_PILLARS = [
  {
    num: '01',
    title: 'Presisi Sensor & Telemetri',
    tag: '-1°C s/d +2°C',
    desc: 'Akurasi pemantauan suhu kontinu probe anti-korosi air laut pada rentang kritis -1°C s/d +2°C.',
  },
  {
    num: '02',
    title: 'Peringatan Dini Multi-Level',
    tag: 'Anjungan Kapal',
    desc: 'Alarm visual lokal di anjungan kapal seketika palka mengalami penurunan kualitas pendinginan.',
  },
  {
    num: '03',
    title: 'Log Historis & Audit Mutu',
    tag: 'Offline RTC Logging',
    desc: 'Pencatatan otomatis via offline RTC logging agar data suhu tetap aman terekam saat kapal berada di luar jangkauan sinyal GSM/seluler.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Sensor Membaca Palka',
    desc: 'Probe suhu DS18B20 tahan air garam membaca kondisi termal di dasar dan tengah palka es secara kontinu.',
  },
  {
    step: '02',
    title: 'Buffering Lokal & Offline RTC',
    desc: 'Mikrokontroler mencatat stempel waktu RTC dan menyimpan log ke MicroSD saat kapal melaut lepas.',
  },
  {
    step: '03',
    title: 'Analisis & Peringatan Dini',
    desc: 'Deteksi anomali kenaikan suhu memicu indikator visual & audio di kapal agar ABK segera menambah es.',
  },
  {
    step: '04',
    title: 'Sinkronisasi & Dasbor TPI',
    desc: 'Saat bersandar di pelabuhan, data tersinkronisasi ke cloud untuk audit mutu oleh pengelola armada dan TPI.',
  },
];

const IMPACT_METRICS = [
  {
    metric: '25–35%',
    metricLabel: 'MARGIN TERJAGA',
    title: 'Reduksi Susut Nilai Tangkapan',
    before: 'Tanpa kontrol termal, ikan kehilangan mutu sebelum kapal bersandar.',
    after: 'Mencegah penurunan grade kesegaran ikan saat dilelang di Tempat Pelelangan Ikan (TPI), menjaga margin keuntungan nelayan hingga 25-35%.',
  },
  {
    metric: 'Terukur',
    metricLabel: 'LAJU PENCAIRAN ES',
    title: 'Efisiensi Logistik Es',
    before: 'Penambahan balok es selama ini hanya mengandalkan perkiraan visual di dek.',
    after: 'Mengeliminasi tebak-tebakan pemakaian balok es palka melalui pemantauan laju pencairan secara terukur.',
  },
  {
    metric: '100%',
    metricLabel: 'TRACEABILITY MUTU',
    title: 'Transparansi Rantai Dingin',
    before: 'Pembeli dan pasar modern sulit memverifikasi riwayat suhu selama pelayaran.',
    after: 'Memberikan jaminan ketertelusuran (traceability) mutu sejak palka samudra hingga diterima distributor atau pasar modern.',
  },
];

const ECOSYSTEM_PIPELINE = [
  {
    code: '01',
    label: 'Edge Device di Palka',
    tech: 'Probe DS18B20 • ESP32 • LCD & Alarm',
    desc: 'Akuisisi suhu via sensor tahan garam dengan pembacaan lokal instan dan ketahanan penuh terhadap lingkungan laut.',
  },
  {
    code: '02',
    label: 'Data Gateway & Processing',
    tech: 'RTC DS3231 • MicroSD FAT32 • Cloud Sync',
    desc: 'Buffering data lokal saat di luar jangkauan seluler & sinkronisasi otomatis ke cloud server begitu mendeteksi jaringan pelabuhan.',
  },
  {
    code: '03',
    label: 'Telemetri & Dashboard',
    tech: 'Web Analytics • Alert System • Audit Log',
    desc: 'Visualisasi grafik performa palka, peringatan anomali real-time, dan riwayat suhu terverifikasi untuk armada kapal.',
  },
];

export const LandingBelowTheFold: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1]);
  const visionVideoRef = useRef<HTMLVideoElement | null>(null);

  // Page Visibility Listener for Vision background video to prevent idle GPU leaks
  useEffect(() => {
    const video = visionVideoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
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
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, []);

  return (
    <>
      {/* ==================================================
          3. SECTION: WHY TEMBOX (Integrated Narrative + Clean Spec List)
          ================================================== */}
      <section
        id="why"
        style={{
          padding: '112px 0',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2EDF4',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'start',
            }}
          >
            {/* Left Side: Problem Narrative */}
            <div style={{ maxWidth: '520px' }}>
              <span className="eyebrow" style={{ color: '#0284C7', marginBottom: '14px' }}>
                WHY TEMBOX? • TEKNOLOGI KESEGARAN
              </span>
              <h2
                className="heading-lg"
                style={{
                  color: '#0B2D42',
                  marginBottom: '22px',
                  lineHeight: 1.2,
                }}
              >
                Menjawab Titik Rawan Rantai Dingin Kapal Tradisional
              </h2>
              <p
                style={{
                  fontSize: '15.5px',
                  lineHeight: 1.78,
                  color: '#475569',
                  marginBottom: '18px',
                }}
              >
                Di kapal nelayan konvensional, palka es yang mulai mencair di bagian dasar sering kali
                tidak terlihat dari permukaan. Fluktuasi suhu yang tidak terdeteksi selama pelayaran
                berhari-hari memicu perkembangan bakteri pembentuk histamin yang mempercepat
                pembusukan sebelum kapal sempat bersandar.
              </p>
              <p
                style={{
                  fontSize: '15.5px',
                  lineHeight: 1.78,
                  color: '#475569',
                  marginBottom: '32px',
                }}
              >
                TEMBOX menggantikan tebak-tebakan di dek dengan visibilitas termal yang terukur,
                memastikan kualitas tangkapan terjaga sejak di tengah laut hingga pelelangan.
              </p>
              <a href="#how" className="btn-pill-link">
                <span>Lihat Alur Kerja Sistem</span>
                <span>→</span>
              </a>
            </div>

            {/* Right Side: Spec Pillars List (No Individual Cards) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {TECH_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.num}
                  style={{
                    padding: '26px 0',
                    borderTop: idx === 0 ? '1px solid #E2EDF4' : 'none',
                    borderBottom: '1px solid #E2EDF4',
                    display: 'flex',
                    gap: '22px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0284C7',
                      letterSpacing: '0.06em',
                      paddingTop: '4px',
                      flexShrink: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {pillar.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#0B2D42',
                          margin: 0,
                        }}
                      >
                        {pillar.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#0369A1',
                          backgroundColor: '#F0F9FF',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          border: '1px solid #BAE6FD',
                        }}
                      >
                        {pillar.tag}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '14.5px',
                        lineHeight: 1.68,
                        color: '#64748B',
                        margin: 0,
                      }}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SECTION: HOW IT WORKS (Seamless Horizontal Step Strip)
          ================================================== */}
      <section
        id="how"
        style={{
          padding: '104px 0',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2EDF4',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
            <span className="eyebrow" style={{ color: '#0284C7', marginBottom: '12px' }}>
              HOW IT WORKS
            </span>
            <h2 className="heading-lg" style={{ color: '#0B2D42', marginBottom: '14px' }}>
              Cara Kerja Sederhana, Teruji di Laut Lepas
            </h2>
            <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: '#64748B' }}>
              Setiap tahapan dirancang agar tetap beroperasi stabil meski tanpa jaringan internet,
              sehingga nelayan fokus melaut sementara data mutu tetap aman tercatat.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '32px',
              borderTop: '1px solid #CBD5E1',
              paddingTop: '36px',
            }}
          >
            {WORKFLOW_STEPS.map((item) => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#0284C7',
                  }}
                >
                  TAHAP {item.step}
                </span>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#0B2D42',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: '#64748B',
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          5. SECTION: MANFAAT (Before vs After Narrative Grid)
          ================================================== */}
      <section
        id="benefits"
        style={{
          padding: '112px 0',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2EDF4',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <span className="eyebrow" style={{ color: '#0284C7', marginBottom: '12px' }}>
                DAMPAK NYATA &amp; MANFAAT
              </span>
              <h2 className="heading-lg" style={{ color: '#0B2D42', margin: 0 }}>
                Perubahan Terukur Sebelum &amp; Sesudah Menggunakan TEMBOX
              </h2>
            </div>
            <p style={{ maxWidth: '380px', fontSize: '14.5px', lineHeight: 1.68, color: '#64748B', margin: 0 }}>
              Dari asumsi manual menuju kendali rantai dingin yang menjaga nilai ekonomi setiap
              kilogram hasil tangkapan.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '48px',
            }}
          >
            {IMPACT_METRICS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderTop: '2px solid #0B2D42',
                  paddingTop: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                      fontWeight: 800,
                      color: '#0284C7',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {item.metric}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: '#64748B',
                    }}
                  >
                    {item.metricLabel}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#0B2D42',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>

                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #E2EDF4',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                    <strong style={{ color: '#64748B' }}>Sebelum:</strong> {item.before}
                  </p>
                  <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.68, margin: 0 }}>
                    <strong style={{ color: '#0284C7' }}>Dengan TEMBOX:</strong> {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          6. SECTION: ECOSYSTEM (Seamless Flowing Data Pipeline)
          ================================================== */}
      <section
        id="ecosystem"
        style={{
          padding: '112px 0',
          backgroundColor: '#071A27',
          color: '#E2E8F0',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '660px', marginBottom: '64px' }}>
            <span className="eyebrow" style={{ color: '#7DDCE8', marginBottom: '12px' }}>
              ECOSYSTEM ARCHITECTURE
            </span>
            <h2
              className="heading-lg"
              style={{ color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.22 }}
            >
              Arsitektur Alur Data Terhubung dari Palka ke Dasbor
            </h2>
            <p style={{ fontSize: '15.5px', lineHeight: 1.72, color: '#94A3B8', margin: 0 }}>
              Tiga lapisan sistem yang bekerja berkesinambungan—mulai dari akuisisi suhu sensor
              tahan garam, buffering lokal &amp; sinkronisasi cloud, hingga visualisasi performa armada.
            </p>
          </div>

          {/* Flowing Pipeline Visualization */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              position: 'relative',
            }}
          >
            {ECOSYSTEM_PIPELINE.map((node, index) => (
              <div
                key={node.code}
                style={{
                  position: 'relative',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(125, 220, 232, 0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Pipeline node indicator row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: '#7DDCE8',
                      letterSpacing: '0.06em',
                    }}
                  >
                    [ {node.code}. {node.label} ]
                  </span>
                  {index < ECOSYSTEM_PIPELINE.length - 1 && (
                    <span
                      aria-hidden="true"
                      style={{
                        color: 'rgba(125, 220, 232, 0.6)',
                        fontSize: '15px',
                        letterSpacing: '-1px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ───►
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#38BDF8',
                    letterSpacing: '0.04em',
                    margin: 0,
                  }}
                >
                  {node.tech}
                </p>

                <p
                  style={{
                    fontSize: '14.5px',
                    lineHeight: 1.7,
                    color: '#CBD5E1',
                    margin: 0,
                  }}
                >
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          7. SECTION: OUR PRODUCT
          ================================================== */}
      <section id="product" className="section-product">
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <span className="eyebrow">OUR PRODUCT</span>
            <h2 className="heading-lg">Tersedia dalam Berbagai Varian</h2>
            <p className="body-md" style={{ maxWidth: '580px', marginTop: '12px' }}>
              TEMBOX hadir dalam beberapa pilihan produk yang sesuai dengan kebutuhan
              operasional Anda, dari skala kecil hingga besar.
            </p>
          </div>

          <div className="product-layout">
            {/* Left: Clean Interactive Product Selector List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PRODUCTS.map((prod, idx) => {
                const isActive = selectedProduct.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProduct(prod);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '22px 16px',
                      borderTop: idx === 0 ? '1px solid #E2EDF4' : 'none',
                      borderBottom: '1px solid #E2EDF4',
                      borderLeft: isActive ? '3px solid #0284C7' : '3px solid transparent',
                      backgroundColor: isActive ? '#F8FAFD' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '72px',
                        height: '58px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        width={64}
                        height={58}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '64px', height: '58px', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B2D42', margin: 0 }}>
                          {prod.name}
                        </h3>
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0284C7' }}>
                          {prod.spec}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                        {prod.desc}
                      </p>
                    </div>
                    <span style={{ color: isActive ? '#0284C7' : '#94A3B8', fontSize: '18px' }}>
                      →
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Big Showcase with fixed pedestal dimensions */}
            <div className="product-showcase-col">
              <div className="showcase-halo" />
              <div
                className="showcase-pedestal"
                style={{ minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  key={selectedProduct.id}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="showcase-main-img"
                  width={440}
                  height={330}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', maxWidth: '440px', height: 'auto', aspectRatio: '4/3', objectFit: 'contain' }}
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
            ref={visionVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
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
            <Link href="/contact" className="btn-vision-cta">
              <span>Hubungi Kami</span>
              <span>→</span>
            </Link>
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
              <Image
                src="/LogoTembox-Horizontal.png"
                alt="TEMBOX"
                className="footer-logo-img"
                width={130}
                height={34}
                loading="lazy"
                style={{ width: '130px', height: '34px', objectFit: 'contain' }}
              />
              <p className="footer-tagline">Fresh Catch, Better Tomorrow.</p>
            </div>

            <div className="footer-nav">
              <Link href="/kategori/monitoring-suhu-palka-ikan" className="footer-link">Kategori</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
              <Link href="/about" className="footer-link">About</Link>
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
    </>
  );
};

export default LandingBelowTheFold;
