import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '../../components/ui/PublicHeader';
import { AboutFooter } from '../../components/views/about/AboutFooter';
import { SOLUTIONS_DATA } from './[kategori]/page';

export const metadata: Metadata = {
  title: 'Solusi IoT Rantai Dingin & Pemantau Mutu Ikan Maritim - TEMBOX',
  description:
    'Rangkaian solusi teknologi IoT pemantau suhu palka ikan, cold storage perikanan, truk logistik termal, dan koperasi nelayan Indonesia untuk meminimalkan susut mutu hasil laut.',
  alternates: {
    canonical: 'https://ice-tembox.vercel.app/solusi',
  },
  openGraph: {
    title: 'Solusi IoT Rantai Dingin & Pemantau Mutu Ikan Maritim - TEMBOX',
    description:
      'Solusi teruji lapangan untuk kapal nelayan tradisional, cold storage, logistik reefer, dan TPI di Indonesia.',
    url: 'https://ice-tembox.vercel.app/solusi',
    siteName: 'TEMBOX Cold-Chain Telemetry',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function SolusiIndexPage() {
  const solutionsList = Object.values(SOLUTIONS_DATA);

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      <main style={{ flex: 1, padding: '48px 20px 80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          {/* Breadcrumb Nav */}
          <nav style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Beranda</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#7DDCE8', fontWeight: 600 }}>Solusi Industri</span>
          </nav>

          {/* Hero Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '36px', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7DDCE8' }}>
              Solusi Terpadu Cold-Chain Maritim
            </span>
            <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#FFFFFF', margin: '12px 0 16px', letterSpacing: '-0.5px' }}>
              Teknologi IoT Menjawab Tantangan Rantai Dingin Indonesia
            </h1>
            <p style={{ fontSize: '15.5px', color: '#94A3B8', maxWidth: '780px', margin: 0, lineHeight: 1.7 }}>
              Dari perahu nelayan 1 GT di perairan terpencil hingga gudang pendingin industri ekspor, TEMBOX menghadirkan pemantauan suhu tanpa putus untuk melindungi nilai ekonomi hasil tangkapan laut.
            </p>
          </div>

          {/* Solutions Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '64px',
            }}
          >
            {solutionsList.map((sol) => (
              <div
                key={sol.slug}
                style={{
                  backgroundColor: '#0B2D42',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7DDCE8', letterSpacing: '0.06em', marginBottom: '10px' }}>
                    {sol.badge}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    {sol.h1}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '0 0 20px 0', lineHeight: 1.6 }}>
                    {sol.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '24px' }}>
                    <strong>Sasaran:</strong> {sol.targetAudience}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/solusi/${sol.slug}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid #38BDF8',
                      color: '#38BDF8',
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Pelajari Solusi Lengkap &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog CTA */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0A253A 0%, #0F3A56 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              Siap Memasang Perangkat IoT di Armada Anda?
            </h3>
            <p style={{ fontSize: '14px', color: '#CBD5E1', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Pilih spesifikasi varian TEMBOX Mini, Pro, atau Enterprise sesuai kapasitas palka kapal dan kebutuhan pemantauan Anda.
            </p>
            <Link
              href="/katalog"
              style={{
                display: 'inline-block',
                backgroundColor: '#38BDF8',
                color: '#071A27',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Buka Katalog &amp; Cek Harga &rarr;
            </Link>
          </div>

        </div>
      </main>

      <AboutFooter />
    </div>
  );
}
