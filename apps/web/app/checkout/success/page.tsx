'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PublicHeader } from '../../../components/ui/PublicHeader';
import type { OrderResult } from '../../../modules/market/market.types';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const orderNumberParam = searchParams.get('orderNumber');

  const [order, setOrder] = useState<OrderResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tembox_last_order');
        if (stored) {
          setOrder(JSON.parse(stored));
        } else {
          setOrder({
            orderId: orderIdParam || 'order_demo_102',
            orderNumber: orderNumberParam || 'INV-TBX-202611-8492',
            status: 'settlement',
            statusLabel: 'Pembayaran DOKU Terverifikasi',
            totalAmount: 1475000,
            paymentMethod: 'doku',
            createdAt: new Date().toISOString(),
            assignedDeviceId: 'TEMBOX-042',
            pairingToken: 'PAIR-8F9A2B',
          });
        }
      } catch {
        // Fallback
      }
    }
  }, [orderIdParam, orderNumberParam]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const assignedDevice = order?.assignedDeviceId || 'TEMBOX-042';
  const pairingToken = order?.pairingToken || 'PAIR-8F9A2B';
  const orderNumber = order?.orderNumber || 'TBX-202611-8492';
  const statusLabel = order?.statusLabel || 'Menunggu Verifikasi Pembayaran';

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Consistent Public Header */}
      <PublicHeader />

      {/* Main Success & Guide Content */}
      <main style={{ padding: '48px 20px 88px 20px', flex: 1 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Status Banner */}
          <div
            style={{
              backgroundColor: '#091A26',
              border: '1px solid rgba(125, 220, 232, 0.3)',
              borderRadius: '20px',
              padding: '36px 32px',
              marginBottom: '40px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7DDCE8',
                  }}
                >
                  STATUS PESANAN
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0 0' }}>
                  Nomor Pesanan: {orderNumber}
                </h1>
              </div>
            </div>

            <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.65, margin: '0 0 24px 0' }}>
              Pesanan Anda telah diproses melalui gateway pembayaran resmi DOKU. Perangkat IoT Anda telah dialokasikan dengan nomor serial dan token keamanan unik untuk aktivasi palka di dashboard.
            </p>

            {/* Credential Cards Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                backgroundColor: '#071520',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Status Transaksi
                </span>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24', margin: '4px 0 0 0' }}>
                  {statusLabel}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Alokasi Serial IoT
                </span>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#38BDF8', margin: '4px 0 0 0', letterSpacing: '0.05em' }}>
                  {assignedDevice}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Token Pairing MQTT
                </span>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#34D399', margin: '4px 0 0 0', letterSpacing: '0.05em' }}>
                  {pairingToken}
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Guide Section */}
          <div style={{ marginBottom: '44px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7DDCE8',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              PANDUAN AKTIVASI ALAT
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Cara Menghubungkan &amp; Mengoperasikan TEMBOX
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', margin: '0 0 28px 0' }}>
              Ikuti 3 langkah mudah berikut saat paket perangkat tiba di dermaga atau kapal Anda:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Step 1 */}
              <div
                style={{
                  backgroundColor: '#091A26',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                    Pemasangan Fisik Probe Sensor &amp; Unit Anjungan
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.68, color: '#CBD5E1', margin: 0 }}>
                    Letakkan ujung probe sensor logam <strong>DS18B20 anti-korosi</strong> di bagian dasar atau tengah palka es (titik paling rentan saat es mencair). Tempelkan unit kontrol utama TEMBOX pada dinding anjungan kapal yang terlindung dari cipratan ombak langsung, lalu hubungkan kabel daya ke soket aki 12V/24V kapal atau aktifkan baterai internal.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                style={{
                  backgroundColor: '#091A26',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                    Konfigurasi Wi-Fi / Hotspot Kapal pada Mode Pairing
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.68, color: '#CBD5E1', margin: 0 }}>
                    Tekan tombol pairing di samping perangkat selama 3 detik hingga LED biru berkedip cepat. Buka smartphone Anda, sambungkan ke Wi-Fi sementara <code>TEMBOX-SETUP</code>, dan tentukan nama Hotspot pelabuhan atau modem kapal Anda agar perangkat otomatis tersambung saat bersandar.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                style={{
                  backgroundColor: '#091A26',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                    Tautkan Serial Number &amp; Token ke Dashboard Akun
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.68, color: '#CBD5E1', margin: 0 }}>
                    Masuk ke halaman <strong>Pengaturan Dashboard (/dashboard#/pengaturan)</strong>, klik tombol <strong>+ Tambah Perangkat</strong>, lalu masukkan Serial Number <code>{assignedDevice}</code> dan pilih penempatan palka (misal: Palka Utama). Data telemetri MQTT akan terisolasi khusus ke akun Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/dashboard"
              style={{
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                padding: '13px 26px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
            >
              <span>Buka Dashboard Perangkat</span>
              <span>→</span>
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#CBD5E1',
                padding: '13px 22px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Unduh Panduan PDF / Cetak</span>
            </button>

            <Link
              href="/market"
              style={{
                color: '#94A3B8',
                fontSize: '13.5px',
                textDecoration: 'none',
                marginLeft: 'auto',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#7DDCE8')}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Pesan Unit Tambahan →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#051420', padding: '24px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>
          &copy; 2026 TEMBOX. Platform Pemantauan Rantai Dingin Maritim &bull; Call Center: 0878-3384-7895
        </p>
      </footer>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Memuat informasi pesanan...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
