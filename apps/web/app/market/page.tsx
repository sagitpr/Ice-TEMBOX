import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '../../components/ui/PublicHeader';
import {
  MARKET_PRODUCTS,
  HARDWARE_SPECS_COMPARISON,
  MARKET_FAQS,
} from '../../modules/market/market.data';

export const metadata: Metadata = {
  title: 'Katalog & Pemesanan Perangkat IoT Cold-Chain TEMBOX Resmi',
  description:
    'Katalog resmi dan pemesanan hardware IoT pemantau suhu palka ikan TEMBOX Mini, Pro, dan Enterprise. Sensor digital DS18B20 stainless anti-korosi, display LCD 1602 I2C, RTC DS3231 presisi tinggi, dan offline data logger MicroSD.',
  alternates: {
    canonical: 'https://ice-tembox.vercel.app/market',
  },
  openGraph: {
    title: 'Katalog & Pemesanan Perangkat IoT Cold-Chain TEMBOX Resmi',
    description:
      'Pesan perangkat pemantau suhu palka ikan terpercaya untuk nelayan, armada kapal, dan cold storage. Harga transparan, jaminan garansi resmi, dan pengiriman ke seluruh pelabuhan Indonesia.',
    url: 'https://ice-tembox.vercel.app/market',
    siteName: 'TEMBOX Cold-Chain Telemetry',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function MarketPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'TEMBOX',
        url: 'https://ice-tembox.vercel.app',
        logo: 'https://ice-tembox.vercel.app/LogoTembox-Horizontal.png',
        description: 'Penyedia sistem IoT pemantau suhu rantai dingin maritim dan palka perikanan tangkap Indonesia.',
      },
      ...MARKET_PRODUCTS.map((prod) => ({
        '@type': 'Product',
        name: prod.name,
        description: prod.tagline,
        image: prod.image ? `https://ice-tembox.vercel.app${prod.image}` : undefined,
        brand: {
          '@type': 'Brand',
          name: 'TEMBOX',
        },
        offers: {
          '@type': 'Offer',
          price: prod.price,
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
          url: `https://ice-tembox.vercel.app/checkout?product=${prod.id}`,
        },
      })),
      {
        '@type': 'FAQPage',
        mainEntity: MARKET_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Consistent Public Header */}
      <PublicHeader />

      {/* Hero Banner */}
      <section style={{ padding: '64px 20px 48px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            KATALOG RESMI PERANGKAT IOT
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Pilihan Unit Hardware TEMBOX
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Sistem pemantau suhu palka ikan berbasis mikrokontroler <strong>ESP32</strong>, sensor digital <strong>DS18B20 stainless anti-korosi</strong>, display <strong>LCD 1602 I2C</strong>, modul <strong>RTC DS3231 presisi tinggi</strong>, dan <strong>offline data logger MicroSD</strong> untuk menjaga mutu kesegaran hasil tangkapan Anda.
          </p>
        </div>
      </section>

      {/* Product Catalog Cards */}
      <section style={{ padding: '48px 20px 80px 20px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {MARKET_PRODUCTS.map((prod, idx) => (
            <div
              key={prod.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center',
                paddingBottom: idx < MARKET_PRODUCTS.length - 1 ? '56px' : '0',
                borderBottom: idx < MARKET_PRODUCTS.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              }}
            >
              {/* Product Visual */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '28px 20px',
                  position: 'relative',
                }}
              >
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    width={380}
                    height={285}
                    loading="lazy"
                    decoding="async"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45))',
                    }}
                  />
                ) : (
                  <div style={{ width: '280px', height: '220px', backgroundColor: '#0B2D42', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DDCE8', fontWeight: 700 }}>
                    {prod.name}
                  </div>
                )}
              </div>

              {/* Product Details & Actions */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {prod.name}
                  </h2>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#38BDF8' }}>
                    {prod.priceFormatted}
                  </span>
                </div>

                <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.65, marginBottom: '22px' }}>
                  {prod.tagline}
                </p>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Sensor Probe:</strong> {prod.probes}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Penyimpanan:</strong> {prod.storage}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Konektivitas:</strong> {prod.connectivity}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Catu Daya:</strong> {prod.power}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#94A3B8' }}>
                    <strong style={{ color: '#E2E8F0' }}>Rekomendasi Armada:</strong> {prod.recommendedFor}
                  </div>
                </div>

                {/* Features Spec Points */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
                  {prod.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      style={{
                        fontSize: '12.5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#E2E8F0',
                        padding: '5px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {prod.id === 'enterprise' ? (
                    <Link
                      href="/contact"
                      style={{
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        padding: '12px 24px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <span>Hubungi Tim Sales Enterprise</span>
                      <span>&rarr;</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout?product=${prod.id}`}
                      style={{
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        padding: '12px 28px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <span>Beli Sekarang</span>
                      <span>&rarr;</span>
                    </Link>
                  )}

                  <a
                    href="#spesifikasi-teknis"
                    style={{
                      color: '#94A3B8',
                      fontSize: '13.5px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Bandingkan Spesifikasi &darr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Specifications Comparison Table */}
      <section
        id="spesifikasi-teknis"
        style={{
          padding: '64px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#051824',
        }}
      >
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7DDCE8' }}>
              SPESIFIKASI TEKNIS ASLI HARDWARE
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 10px', letterSpacing: '-0.02em' }}>
              Tabel Perbandingan Varian TEMBOX
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
              Seluruh varian unit dirancang menggunakan mikrokontroler <strong>ESP32</strong>, sensor suhu digital <strong>DS18B20 stainless anti-korosi</strong>, display <strong>LCD 1602 I2C</strong>, modul <strong>RTC DS3231 presisi tinggi</strong>, dan <strong>offline data logger MicroSD</strong>.
            </p>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backgroundColor: '#071A27' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0B2D42', borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ padding: '16px 20px', color: '#7DDCE8', fontWeight: 700, width: '28%' }}>Komponen / Fitur</th>
                  <th style={{ padding: '16px 20px', color: '#FFFFFF', fontWeight: 700, width: '24%' }}>TEMBOX Mini (Rp 750.000)</th>
                  <th style={{ padding: '16px 20px', color: '#38BDF8', fontWeight: 700, width: '24%' }}>TEMBOX Pro (Rp 1.450.000)</th>
                  <th style={{ padding: '16px 20px', color: '#FFFFFF', fontWeight: 700, width: '24%' }}>TEMBOX Enterprise (Rp 3.200.000)</th>
                </tr>
              </thead>
              <tbody>
                {HARDWARE_SPECS_COMPARISON.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      borderBottom: rIdx < HARDWARE_SPECS_COMPARISON.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                      backgroundColor: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                    }}
                  >
                    <td style={{ padding: '14px 20px', color: '#E2E8F0', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '14px 20px', color: '#CBD5E1' }}>{row.mini}</td>
                    <td style={{ padding: '14px 20px', color: '#38BDF8', fontWeight: 600 }}>{row.pro}</td>
                    <td style={{ padding: '14px 20px', color: '#CBD5E1' }}>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '64px 20px 80px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ marginBottom: '36px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7DDCE8' }}>
              BANTUAN &amp; PERTANYAAN
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 0', letterSpacing: '-0.02em' }}>
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {MARKET_FAQS.map((faq, fIdx) => (
              <div
                key={fIdx}
                style={{
                  backgroundColor: '#0B2D42',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#7DDCE8', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#051420', padding: '32px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <p style={{ color: '#7DDCE8', fontSize: '13px', fontWeight: 700, margin: '0 0 6px 0' }}>
          Fresh Catch, Better Tomorrow.
        </p>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>
          &copy; 2026 TEMBOX. Seluruh hak cipta dilindungi undang-undang.
        </p>
      </footer>
    </div>
  );
}
