import React from 'react';

export const AboutTechStack: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', background: '#F8FAFC', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '52px' }}>
          <span className="eyebrow" style={{ color: '#0284C7' }}>
            CORE TECHNOLOGY STACK &amp; CLOUD ARCHITECTURE
          </span>
          <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
            Fondasi Performa &amp; Keandalan Skala Industri
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', marginBottom: 0 }}>
            Arsitektur hibrida modern yang menggabungkan keandalan komputasi tepi (<em>edge hardware</em>) dengan skalabilitas komputasi awan.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
          }}
        >
          <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
              01 / FRONTEND ARCHITECTURE
            </p>
            <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
              Next.js 15 App Router &amp; Server Components
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              Fondasi aplikasi web performa tinggi dengan React Server Components (RSC) untuk streaming telemetri instan, code-splitting dinamis, serta optimasi bundle yang mengeliminasi Total Blocking Time (TBT).
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
              02 / DATABASE &amp; REAL-TIME
            </p>
            <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
              Supabase &amp; Real-Time Data Pipeline
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              Infrastruktur basis data relasional enterprise berbasis PostgreSQL yang dilengkapi otentikasi aman berbasis Row Level Security (RLS) serta channel WebSocket real-time untuk pembaruan suhu otomatis.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
              03 / EDGE COMPUTING
            </p>
            <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
              Dual-Mode IoT Firmware (ESP32)
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              Firmware C++ mikrokontroler teroptimasi dengan mekanisme fault-tolerance tinggi: pencatatan lokal pada MicroSD saat di luar jangkauan jaringan, dan transmisi batch otomatis saat bersandar.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0284C7', marginBottom: '8px' }}>
              04 / DESIGN SYSTEM
            </p>
            <h4 style={{ color: '#0F172A', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
              Calibrated Maritime Visual System
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              Antarmuka visual terkalibrasi dengan tipografi modern Plus Jakarta Sans, menjamin keterbacaan data grafik telemetri tetap tajam dan ergonomis di bawah terik matahari pantai maupun pencahayaan minim.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTechStack;
