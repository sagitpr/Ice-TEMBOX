'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MARKET_PRODUCTS,
  HARDWARE_SPECS_COMPARISON,
  MARKET_FAQS,
} from '../../modules/market/market.data';
import type { ProductItem } from '../../modules/market/market.types';

export const MarketCatalogView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ikan' | 'box' | 'nelayan' | 'coldstorage'>('all');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return MARKET_PRODUCTS.filter((prod) => {
      // 1. Category Filter Chip
      if (selectedCategory === 'ikan') {
        const matchesIkan =
          prod.name.toLowerCase().includes('ikan') ||
          prod.tagline.toLowerCase().includes('ikan') ||
          prod.recommendedFor.toLowerCase().includes('ikan') ||
          prod.features.some((f) => f.toLowerCase().includes('ikan'));
        if (!matchesIkan) return false;
      } else if (selectedCategory === 'box') {
        const matchesBox =
          prod.name.toLowerCase().includes('box') ||
          prod.tagline.toLowerCase().includes('box') ||
          prod.recommendedFor.toLowerCase().includes('box');
        if (!matchesBox) return false;
      } else if (selectedCategory === 'nelayan') {
        const matchesNelayan =
          (prod.badge || '').toLowerCase().includes('nelayan') ||
          (prod.recommendedFor || '').toLowerCase().includes('nelayan') ||
          prod.tagline.toLowerCase().includes('nelayan');
        if (!matchesNelayan) return false;
      } else if (selectedCategory === 'coldstorage') {
        const matchesColdStorage =
          prod.name.toLowerCase().includes('enterprise') ||
          prod.tagline.toLowerCase().includes('cold storage') ||
          (prod.recommendedFor || '').toLowerCase().includes('cold storage');
        if (!matchesColdStorage) return false;
      }

      // 2. Keyword Search Query
      if (!q) return true;

      const inName = prod.name.toLowerCase().includes(q);
      const inTagline = prod.tagline.toLowerCase().includes(q);
      const inBadge = (prod.badge || '').toLowerCase().includes(q);
      const inProbes = prod.probes.toLowerCase().includes(q);
      const inStorage = prod.storage.toLowerCase().includes(q);
      const inRecommended = (prod.recommendedFor || '').toLowerCase().includes(q);
      const inFeatures = prod.features.some((f) => f.toLowerCase().includes(q));

      // Special semantic aliases:
      // "ikan" matches all marine cold-chain units
      // "box" matches all hardware unit enclosures
      const isIkanQuery = q === 'ikan' || q.includes('ikan') || q.includes('tuna') || q.includes('tongkol');
      const isBoxQuery = q === 'box' || q.includes('box') || q.includes('coolbox') || q.includes('palka');

      return (
        inName ||
        inTagline ||
        inBadge ||
        inProbes ||
        inStorage ||
        inRecommended ||
        inFeatures ||
        (isIkanQuery && (inTagline || inRecommended || inFeatures)) ||
        (isBoxQuery && (inName || inTagline))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      {/* Search & Category Filter Section (Clean, Un-boxed, Subtle) */}
      <section style={{ padding: '0 20px 36px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          {/* Live Search Input Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '640px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ikan, box, palka, coolbox, sensor DS18B20..."
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Categories */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#64748B', marginRight: '4px' }}>Kategori Cepat:</span>
              {[
                { id: 'all', label: 'Semua Unit' },
                { id: 'ikan', label: 'Ikan & Palka' },
                { id: 'box', label: 'Box Pendingin' },
                { id: 'nelayan', label: 'Kapal Nelayan' },
                { id: 'coldstorage', label: 'Cold Storage' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      if (cat.id === 'ikan' && !searchQuery) setSearchQuery('ikan');
                      if (cat.id === 'box' && !searchQuery) setSearchQuery('box');
                      if (cat.id === 'all') setSearchQuery('');
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: isActive ? '#38BDF8' : 'transparent',
                      color: isActive ? '#071A27' : '#CBD5E1',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Match Feedback */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div style={{ fontSize: '13px', color: '#7DDCE8', marginTop: '2px' }}>
                Menampilkan {filteredProducts.length} varian untuk pencarian:{' '}
                <strong>&ldquo;{searchQuery || selectedCategory}&rdquo;</strong>
                {searchQuery.toLowerCase().includes('ikan') && (
                  <span style={{ color: '#94A3B8', marginLeft: '8px' }}>
                    &bull; Seluruh unit dilengkapi probe stainless tahan air laut untuk monitoring kesegaran ikan.
                  </span>
                )}
                {searchQuery.toLowerCase().includes('box') && (
                  <span style={{ color: '#94A3B8', marginLeft: '8px' }}>
                    &bull; Unit box fisik dilengkapi proteksi IP65/IP67 dan display LCD 1602 I2C.
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Product Catalog List (Clean, Natural Typography, Zero Unnecessary Boxes) */}
      <section style={{ padding: '48px 20px 80px 20px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Tidak ditemukan varian untuk &ldquo;{searchQuery}&rdquo;
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '20px' }}>
                Coba gunakan kata kunci umum seperti <strong>ikan</strong>, <strong>box</strong>, <strong>palka</strong>, atau <strong>sensor</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: '1px solid #38BDF8',
                  backgroundColor: 'transparent',
                  color: '#38BDF8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tampilkan Semua Unit
              </button>
            </div>
          ) : (
            filteredProducts.map((prod, idx) => (
              <div
                key={prod.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '48px',
                  alignItems: 'start',
                  paddingBottom: idx < filteredProducts.length - 1 ? '64px' : '0',
                  borderBottom: idx < filteredProducts.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                }}
              >
                {/* Product Visual Presentation */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 0',
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
                        filter: 'drop-shadow(0 16px 24px rgba(0, 0, 0, 0.4))',
                      }}
                    />
                  ) : (
                    <div style={{ width: '280px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7DDCE8', fontWeight: 700 }}>
                      {prod.name}
                    </div>
                  )}
                </div>

                {/* Product Details (Natural Un-boxed Flowing Typography) */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#7DDCE8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    {prod.badge}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                      {prod.name}
                    </h2>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#38BDF8' }}>
                      {prod.priceFormatted}
                    </span>
                  </div>

                  <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.65, margin: '0 0 24px 0' }}>
                    {prod.tagline}
                  </p>

                  {/* Clean Technical Specs List (No nested boxes) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Sensor Probe:</span> {prod.probes}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Penyimpanan:</span> {prod.storage}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Konektivitas:</span> {prod.connectivity}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Catu Daya:</span> {prod.power}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6 }}>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Rekomendasi Armada:</span> {prod.recommendedFor}
                    </div>
                  </div>

                  {/* Clean Bullet Feature Points (No Pill Boxes) */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {prod.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        style={{
                          fontSize: '13.5px',
                          color: '#CBD5E1',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: '#38BDF8', fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    {prod.id === 'enterprise' ? (
                      <Link
                        href="/contact"
                        style={{
                          backgroundColor: '#0284C7',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '12px 24px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
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
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '12px 28px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>Beli {prod.name}</span>
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
                      }}
                    >
                      Bandingkan Spesifikasi &darr;
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Hardware Specifications Comparison Table (THE ONLY BOXED/BORDERED TABLE) */}
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

      {/* FAQ Section (Clean Open Editorial Typography, No Nested Box Cards) */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {MARKET_FAQS.map((faq, fIdx) => (
              <div
                key={fIdx}
                style={{
                  borderBottom: fIdx < MARKET_FAQS.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  paddingBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#7DDCE8', margin: '0 0 8px', lineHeight: 1.4 }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.7, maxWidth: '880px' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketCatalogView;
