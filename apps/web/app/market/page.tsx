import React from 'react';
import type { Metadata } from 'next';
import { PublicHeader } from '../../components/ui/PublicHeader';
import { MarketCatalogView } from './MarketCatalogView';
import {
  MARKET_PRODUCTS,
  MARKET_FAQS,
} from '../../modules/market/market.data';

export const metadata: Metadata = {
  title: 'Katalog & Pemesanan Box Pendingin Palka Ikan TEMBOX - IoT Cold-Chain',
  description:
    'Pesan perangkat box pemantau suhu palka ikan dan coolbox nelayan TEMBOX Mini, Pro, dan Enterprise. Sensor digital DS18B20 stainless anti-korosi, display LCD 1602 I2C, RTC DS3231 presisi tinggi, dan offline data logger MicroSD.',
  keywords: [
    'ikan',
    'box ikan',
    'palka ikan',
    'box pendingin ikan',
    'coolbox ikan',
    'monitoring suhu ikan',
    'es palka ikan',
    'alat pemantau ikan nelayan',
    'sensor suhu ikan',
    'iot palka ikan',
    'suhu ikan segar',
    'box tembox',
    'tembox',
  ],
  alternates: {
    canonical: 'https://ice-tembox.vercel.app/market',
  },
  openGraph: {
    title: 'Katalog & Pemesanan Box Pendingin Palka Ikan TEMBOX - IoT Cold-Chain',
    description:
      'Solusi teruji monitoring suhu palka dan box es ikan nelayan Indonesia. Menjaga mutu kesegaran ikan dengan sensor DS18B20 dan offline MicroSD logger.',
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
        description: 'Penyedia sistem IoT pemantau suhu rantai dingin maritim, box pendingin, dan palka perikanan tangkap Indonesia.',
      },
      ...MARKET_PRODUCTS.map((prod) => ({
        '@type': 'Product',
        name: prod.name,
        description: prod.tagline,
        image: prod.image ? `https://ice-tembox.vercel.app${prod.image}` : undefined,
        category: 'Alat IoT Palka & Box Pendingin Ikan',
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

      {/* Hero Banner (Clean, Un-boxed Natural Typography) */}
      <section style={{ padding: '64px 20px 32px 20px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            KATALOG RESMI PERANGKAT IOT &amp; BOX PALKA
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
              maxWidth: '720px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Sistem pemantau suhu palka dan box es ikan berbasis mikrokontroler <strong>ESP32</strong>, sensor digital <strong>DS18B20 stainless anti-korosi</strong>, display <strong>LCD 1602 I2C</strong>, modul <strong>RTC DS3231 presisi tinggi</strong>, dan <strong>offline data logger MicroSD</strong> untuk menjaga mutu kesegaran hasil tangkapan Anda.
          </p>
        </div>
      </section>

      {/* Interactive Catalog with Live Filter & Un-boxed Content */}
      <MarketCatalogView />

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
