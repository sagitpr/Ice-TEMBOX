import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '../../components/ui/PublicHeader';
import { AboutFooter } from '../../components/views/about/AboutFooter';

export const metadata: Metadata = {
  title: 'Katalog Perangkat IoT Cold-Chain TEMBOX - Spesifikasi Sensor Palka Ikan',
  description:
    'Katalog resmi perangkat retrofit IoT pemantau suhu palka ikan TEMBOX Mini, Pro, dan Enterprise. Sensor digital DS18B20 submersible, display LCD 1602, offline data logger, dan konektivitas maritim real-time.',
  alternates: {
    canonical: 'https://ice-tembox.vercel.app/katalog',
  },
  openGraph: {
    title: 'Katalog Perangkat IoT Cold-Chain TEMBOX - Spesifikasi Sensor Palka Ikan',
    description:
      'Solusi pemantau suhu palka ikan terakreditasi untuk nelayan, cold storage, dan rantai pasok perikanan Indonesia. Cek spesifikasi lengkap TEMBOX Mini, Pro, dan Enterprise.',
    url: 'https://ice-tembox.vercel.app/katalog',
    siteName: 'TEMBOX Cold-Chain Telemetry',
    locale: 'id_ID',
    type: 'website',
  },
};

const PRODUCTS = [
  {
    id: 'mini',
    name: 'TEMBOX Mini',
    badge: 'Kapal 1-5 GT',
    tagline: 'Solusi esensial untuk perahu nelayan tradisional harian & palka berukuran ringkas.',
    price: 1850000,
    priceLabel: 'Rp 1.850.000',
    specs: {
      probes: '1x Probe Digital DS18B20 Stainless (Kabel 2m)',
      display: 'LCD 1602 I2C Backlight Biru',
      connectivity: 'Wi-Fi 2.4GHz + Hotspot Pairing',
      storage: 'Offline Buffer Flash (10.000 titik data)',
      power: '5V USB / 12V DC Converter Aki Kapal',
      enclosure: 'ABS Compact IP65 Weatherproof',
      telemetry: 'Interval kirim tiap 15 menit',
    },
    highlights: [
      'Pemasangan plug-and-play di palka es',
      'Display suhu lokal tanpa butuh HP di laut',
      'Alert lampu indikator saat es mulai cair',
    ],
  },
  {
    id: 'pro',
    name: 'TEMBOX Pro',
    badge: 'Terpopuler — 5-30 GT',
    tagline: 'Performa optimal kapal jelajah multi-hari dengan sinkronisasi seluler & MicroSD.',
    price: 2500000,
    priceLabel: 'Rp 2.500.000',
    popular: true,
    specs: {
      probes: '2x Probe Digital DS18B20 Multi-Point (Kabel 3m)',
      display: 'LCD 1602 I2C dengan Rotasi Status PIN',
      connectivity: 'GSM 4G LTE + Wi-Fi Telemetry',
      storage: 'MicroSD Slot Dedicated (Hingga 32GB CSV)',
      power: '9-24V DC Input Proteksi Lonjakan + Baterai Backup 8 Jam',
      enclosure: 'Industrial Polycarbonate IP67 Anti-Korosi Garam',
      telemetry: 'Interval kirim tiap 5 menit (Real-time)',
    },
    highlights: [
      'Pemantauan multi-palka (Palka Kiri & Kanan)',
      'Otomatis simpan ke MicroSD saat blank spot seluler',
      'Deteksi anomali suhu dini via AI Cloud',
    ],
  },
  {
    id: 'enterprise',
    name: 'TEMBOX Enterprise',
    badge: 'Kapal > 30 GT & Gudang',
    tagline: 'Arsitektur skala industri untuk kapal penangkap tuna, cold storage, dan logistik antar pulau.',
    price: 3950000,
    priceLabel: 'Rp 3.950.000',
    specs: {
      probes: '4x Probe Submersible Stainless Food-Grade (Kabel 5m)',
      display: 'LCD 1602 I2C + LED Array Status Multi-Palka',
      connectivity: '4G LTE Global Band + LoRa Long-Range 15km',
      storage: 'MicroSD Industrial Grade Dual-Storage Mirroring',
      power: '12-36V DC Marine Grade + Baterai LiFePO4 24 Jam',
      enclosure: 'Heavy Duty Die-Cast IP68 Mil-Spec Seal',
      telemetry: 'Interval kirim adaptif 1-3 menit',
    },
    highlights: [
      'Monitoring hingga 4 palka atau zona cold storage',
      'Integrasi LoRa untuk armada konvoi kapal',
      'Sertifikat kalibrasi termal & garansi 2 tahun',
    ],
  },
];

const FAQS = [
  {
    q: 'Bagaimana cara memasang sensor TEMBOX pada palka ikan tradisional?',
    a: 'Pemasangan sangat mudah tanpa merusak dinding palka. Pasang unit utama box di bagian luar palka yang terlindung dari siraman air langsung, lalu masukkan kabel probe sensor stainless DS18B20 melalui celah paking tutup palka langsung ke tumpukan es dan ikan.',
  },
  {
    q: 'Apakah data suhu tetap tercatat saat kapal berada di tengah laut tanpa sinyal?',
    a: 'Ya, seluruh unit TEMBOX dilengkapi sistem offline logging (Flash memory pada varian Mini, dan MicroSD card pada varian Pro & Enterprise). Data suhu tercatat setiap menit dengan penanda waktu presisi RTC DS3231. Saat kapal mendekati dermaga atau mendapat sinyal 4G/Wi-Fi, data otomatis tersinkronisasi ke dashboard cloud.',
  },
  {
    q: 'Berapa akurasi sensor suhu TEMBOX?',
    a: 'Sensor kami menggunakan probe digital DS18B20 berbahan stainless steel 304 food-grade dengan akurasi terkalibrasi ±0.5°C pada rentang kritis perikanan (-10°C hingga +10°C). Sensor kebal terhadap interferensi elektromagnetik motor kapal.',
  },
  {
    q: 'Bagaimana sistem keamanan pairing perangkat ke dashboard akun?',
    a: 'Setiap unit box fisik memuat chip mikrokontroler unik. Saat dinyalakan, layar LCD 1602 di badan box akan menampilkan Device ID acak dan 6-Digit PIN verifikasi. Pengguna cukup memasukkan ID dan PIN tersebut di menu Pengaturan dashboard untuk menghubungkannya secara aman tanpa risiko dibajak.',
  },
];

export default function KatalogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'TEMBOX',
        url: 'https://ice-tembox.vercel.app',
        logo: 'https://ice-tembox.vercel.app/LogoTembox-Horizontal.png',
        description: 'Penyedia sistem IoT pemantau suhu rantai dingin maritim dan perikanan tangkap Indonesia.',
      },
      ...PRODUCTS.map((prod) => ({
        '@type': 'Product',
        name: prod.name,
        description: prod.tagline,
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
        mainEntity: FAQS.map((faq) => ({
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
      <PublicHeader />

      <main style={{ flex: 1, padding: '48px 20px 80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Breadcrumb */}
          <nav style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Beranda</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#7DDCE8', fontWeight: 600 }}>Katalog Produk IoT</span>
          </nav>

          {/* Hero Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '36px', marginBottom: '48px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7DDCE8' }}>
              Spesifikasi Hardware &amp; Varian Unit
            </span>
            <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#FFFFFF', margin: '12px 0 16px', letterSpacing: '-0.5px' }}>
              Katalog Perangkat IoT Cold-Chain TEMBOX
            </h1>
            <p style={{ fontSize: '15.5px', color: '#94A3B8', maxWidth: '780px', margin: 0, lineHeight: 1.7 }}>
              Solusi telemetri rantai dingin terintegrasi dirancang khusus menghadapi lingkungan laut ekstrem Indonesia. Dilengkapi probe stainless tahan korosi, display lokal LCD 1602, dan penyimpanan offline MicroSD.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '64px',
            }}
          >
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: prod.popular ? '#0A253A' : '#0B2D42',
                  border: prod.popular ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: prod.popular ? '0 12px 30px rgba(56, 189, 248, 0.15)' : 'none',
                }}
              >
                {prod.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '28px',
                      backgroundColor: '#38BDF8',
                      color: '#071A27',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                    }}
                  >
                    Rekomendasi Utama
                  </span>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#7DDCE8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {prod.badge}
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 10px' }}>
                    {prod.name}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94A3B8', minHeight: '44px', margin: 0, lineHeight: 1.5 }}>
                    {prod.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Mulai dari</span>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
                    {prod.priceLabel}
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Termasuk 1x Unit Box + Probe Sensor + Kabel Instalasi</span>
                </div>

                {/* Technical Specs List */}
                <div style={{ flex: 1, marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7DDCE8', marginBottom: '12px', fontWeight: 700 }}>
                    Spesifikasi Hardware:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', fontSize: '13px', lineHeight: 1.8, color: '#CBD5E1' }}>
                    <li><strong>Sensor:</strong> {prod.specs.probes}</li>
                    <li><strong>Layar Fisik:</strong> {prod.specs.display}</li>
                    <li><strong>Jaringan:</strong> {prod.specs.connectivity}</li>
                    <li><strong>Data Logger:</strong> {prod.specs.storage}</li>
                    <li><strong>Daya:</strong> {prod.specs.power}</li>
                    <li><strong>Ketahanan Box:</strong> {prod.specs.enclosure}</li>
                  </ul>

                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7DDCE8', marginBottom: '10px', fontWeight: 700 }}>
                    Keunggulan Unit:
                  </h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                    {prod.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/checkout?product=${prod.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '13px 20px',
                    borderRadius: '9999px',
                    backgroundColor: prod.popular ? '#38BDF8' : 'transparent',
                    border: prod.popular ? 'none' : '1.5px solid #38BDF8',
                    color: prod.popular ? '#071A27' : '#38BDF8',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Pesan {prod.name} &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* Detailed Hardware Specifications Table */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Perbandingan Spesifikasi Teknis Mendalam
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>
              Seluruh varian unit dirancang menggunakan komponen industri maritim dengan ketahanan terhadap korosi air asin.
            </p>

            <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B2D42', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '14px 20px', color: '#7DDCE8', fontWeight: 700 }}>Fitur / Komponen</th>
                    <th style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 700 }}>TEMBOX Mini</th>
                    <th style={{ padding: '14px 20px', color: '#38BDF8', fontWeight: 700 }}>TEMBOX Pro</th>
                    <th style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 700 }}>TEMBOX Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Tipe Mikrokontroler</td>
                    <td style={{ padding: '12px 20px' }}>ESP32 Dual-Core 240MHz</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>ESP32 Dual-Core 240MHz</td>
                    <td style={{ padding: '12px 20px' }}>ESP32 Industrial Grade</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Sensor Suhu Digital</td>
                    <td style={{ padding: '12px 20px' }}>1x DS18B20 Stainless</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>2x DS18B20 Stainless</td>
                    <td style={{ padding: '12px 20px' }}>4x DS18B20 Heavy Duty</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Akurasi Suhu</td>
                    <td style={{ padding: '12px 20px' }}>&plusmn;0.5&deg;C</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>&plusmn;0.5&deg;C</td>
                    <td style={{ padding: '12px 20px' }}>&plusmn;0.3&deg;C (Terkalibrasi)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Display Fisik</td>
                    <td style={{ padding: '12px 20px' }}>LCD 1602 I2C</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>LCD 1602 I2C Auto-Scroll</td>
                    <td style={{ padding: '12px 20px' }}>LCD 1602 + LED Array</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Offline Data Logger</td>
                    <td style={{ padding: '12px 20px' }}>Internal Flash Storage</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>MicroSD Card Slot 16GB</td>
                    <td style={{ padding: '12px 20px' }}>MicroSD Industrial 32GB</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Modul RTC Jam Presisi</td>
                    <td style={{ padding: '12px 20px' }}>DS1307 Standar</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>DS3231 Temperature Comp.</td>
                    <td style={{ padding: '12px 20px' }}>DS3231 Extreme Accuracy</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 20px', color: '#94A3B8', fontWeight: 600 }}>Garansi Resmi</td>
                    <td style={{ padding: '12px 20px' }}>6 Bulan</td>
                    <td style={{ padding: '12px 20px', color: '#38BDF8' }}>1 Tahun Ganti Baru</td>
                    <td style={{ padding: '12px 20px' }}>2 Tahun Full Support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '24px' }}>
              Pertanyaan Seputar Perangkat &amp; Pengiriman (FAQ)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0B2D42',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#7DDCE8', margin: '0 0 10px' }}>
                    {faq.q}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <AboutFooter />
    </div>
  );
}
