'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const AboutDeveloper: React.FC = () => {
  const [devPhoto, setDevPhoto] = useState('/sagit.png');

  return (
    <section style={{ padding: '96px 0', background: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <span className="eyebrow" style={{ color: '#0284C7' }}>
            THE ENGINEERING TEAM
          </span>
          <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
            Profil Pengembang Utama
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px' }}>
            Dedikasi rekayasa perangkat lunak dan teknologi IoT untuk kemandirian sektor maritim Indonesia.
          </p>
        </div>

        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            padding: '40px 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left: 3:4 Portrait Image */}
          <div
            style={{
              position: 'relative',
              minHeight: '420px',
              borderRadius: '16px',
              background: '#F1F5F9',
              overflow: 'hidden',
            }}
          >
            <Image
              src={devPhoto}
              alt="Sagit Faturrakhman - Full-Stack & IoT Engineer"
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              loading="lazy"
              onError={() => {
                if (devPhoto !== '/Sagit-Faturrakhman.jpg') {
                  setDevPhoto('/Sagit-Faturrakhman.jpg');
                }
              }}
              style={{
                objectFit: 'cover',
                objectPosition: 'center 40%',
              }}
            />
          </div>

          {/* Right: Bio & Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0284C7',
                  marginBottom: '8px',
                }}
              >
                FULL-STACK &amp; IOT ENGINEER
              </p>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Sagit Faturrakhman
              </h3>
              <p style={{ fontSize: '14px', color: '#334155', fontWeight: 600, marginBottom: '2px' }}>
                NPM: <strong>12046124006</strong> • S1 Sistem Informasi
              </p>
              <p style={{ fontSize: '13.5px', color: '#64748B' }}>
                Fakultas Teknologi dan Bisnis — Universitas Bakti Tunas Husada Tasikmalaya
              </p>
            </div>

            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#475569', marginBottom: '16px' }}>
              Menggabungkan pemahaman mendalam antara logika bisnis sistem informasi korporat, pengembangan antarmuka
              web modern (Next.js 15, Supabase, Tailwind CSS), hingga perancangan integrasi mikrokontroler dan telemetri data sensor IoT.
            </p>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#475569', marginBottom: '24px' }}>
              Berdedikasi penuh untuk menghadirkan solusi teknologi terapan yang memberikan dampak nyata bagi pemberdayaan nelayan dan peningkatan kualitas hasil tangkapan laut nasional.
            </p>

            {/* Motto Quote */}
            <div
              style={{
                borderLeft: '3px solid #0284C7',
                paddingLeft: '18px',
              }}
            >
              <p style={{ fontSize: '15.5px', fontStyle: 'italic', fontWeight: 700, color: '#0369A1', margin: 0 }}>
                &ldquo;Untuk Nelayan, Untuk Laut Kita.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
