import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PRIMARY_TOPICS,
  COMMODITIES,
  REGIONS,
  FOCUS_TOPICS,
} from '../lib/seo-data';

export const metadata: Metadata = {
  title: 'Direktori Kategori & Solusi Rantai Dingin IoT | TEMBOX',
  description:
    'Jelajahi panduan teknis pemantauan suhu palka ikan, spesifikasi sensor digital DS18B20, dan solusi IoT cold chain untuk berbagai armada kapal nelayan serta komoditas laut.',
  alternates: {
    canonical: 'https://ice-tembox.vercel.app/kategori',
  },
};

export default function KategoriIndexPage() {
  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: 'rgba(7, 26, 39, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(125, 220, 232, 0.15)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <img
              src="/LogoTembox-Horizontal.png"
              alt="TEMBOX"
              width={140}
              height={36}
              style={{ width: '140px', height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/" style={{ color: '#CBD5E1', fontSize: '14px', textDecoration: 'none' }}>Beranda</Link>
            <Link href="/about" style={{ color: '#CBD5E1', fontSize: '14px', textDecoration: 'none' }}>About</Link>
            <Link href="/contact" style={{ color: '#7DDCE8', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '70px 24px 40px', background: 'linear-gradient(180deg, #092233 0%, #071A27 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
            TEMBOX KNOWLEDGE BASE &amp; TOPIC INDEX
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '16px' }}>
            Direktori Solusi Rantai Dingin &amp; IoT Maritim
          </h1>
          <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
            Pilih topik spesifik mengenai manajemen termal palka es, jenis komoditas tangkapan laut, atau sentra pelabuhan perikanan di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Main Directory */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        {/* Section 1: Topik Utama */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PILIHAN UTAMA
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0' }}>
              Panduan Teknis Pilar
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {PRIMARY_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/kategori/${topic.slug}`}
                style={{
                  background: 'rgba(11, 45, 66, 0.45)',
                  border: '1px solid rgba(125, 220, 232, 0.22)',
                  borderRadius: '16px',
                  padding: '28px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#7DDCE8', textTransform: 'uppercase' }}>
                      {topic.category}
                    </span>
                    <span style={{ fontSize: '11px', background: 'rgba(125, 220, 232, 0.15)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                      {topic.optimalTemp}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.35 }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                    {topic.metaDescription}
                  </p>
                </div>
                <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 700, color: '#7DDCE8' }}>
                  Pelajari Lebih Lanjut →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Berdasarkan Jenis Ikan */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              KOMODITAS PERIKANAN
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0' }}>
              Suhu Penyimpanan per Spesies Ikan
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {COMMODITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/monitoring-suhu-palka-${c.slug}`}
                style={{
                  background: 'rgba(7, 26, 39, 0.85)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textDecoration: 'none',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#7DDCE8', margin: '0 0 4px', fontWeight: 600 }}>
                  Suhu: {c.temp}
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                  Masa Segar: {c.shelf}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Berdasarkan Pelabuhan */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              WILAYAH MARITIM
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0' }}>
              Sentra Pendaratan Ikan (TPI &amp; Pelabuhan)
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/kategori/monitoring-suhu-palka-${r.slug}`}
                style={{
                  background: 'rgba(11, 45, 66, 0.35)',
                  border: '1px solid rgba(125, 220, 232, 0.15)',
                  borderRadius: '10px',
                  padding: '16px',
                  textDecoration: 'none',
                }}
              >
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>
                  {r.name}
                </h4>
                <span style={{ fontSize: '12px', color: '#7DDCE8' }}>
                  Provinsi {r.province}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#051420', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '36px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          © 2025 TEMBOX — Maritime IoT Cold Chain System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

