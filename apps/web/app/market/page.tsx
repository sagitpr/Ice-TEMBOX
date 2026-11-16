'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/ui/PublicHeader';
import { MARKET_PRODUCTS } from '../../modules/market/market.data';

export default function MarketPage() {
  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
              lineHeight: 1.2,
            }}
          >
            Pilih Varian <span style={{ color: '#7DDCE8' }}>TEMBOX</span> untuk Armada Anda
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#94A3B8', maxWidth: '680px', margin: 0 }}>
            Dari perahu nelayan skala kecil hingga armada palka berpendingin multi-kompartemen.
            Seluruh unit dilengkapi sensor presisi industri, proteksi korosi air laut, dan kapabilitas offline-first.
          </p>
        </div>
      </section>

      {/* Catalog List - Open Showcase without heavy card boxes */}
      <section style={{ padding: '64px 20px 88px 20px', flex: 1 }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {MARKET_PRODUCTS.map((prod, idx) => (
            <div
              key={prod.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '48px',
                alignItems: 'center',
                paddingBottom: idx < MARKET_PRODUCTS.length - 1 ? '56px' : '0',
                borderBottom: idx < MARKET_PRODUCTS.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              }}
            >
              {/* Product Visual - Clean open presentation without badge labels */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '28px 20px',
                  position: 'relative',
                }}
              >
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
                      <span>→</span>
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
                      <span>→</span>
                    </Link>
                  )}

                  <Link
                    href="/about#arsitektur"
                    style={{
                      color: '#94A3B8',
                      fontSize: '13.5px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#7DDCE8')}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    Pelajari Arsitektur Teknis →
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
