'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const AboutHero: React.FC = () => {
  const [heroBg, setHeroBg] = useState('/Penangkap-ikan.jpg');

  return (
    <section
      id="about-hero"
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '150px',
        paddingBottom: '120px',
        overflow: 'hidden',
        backgroundColor: '#071A27',
      }}
    >
      {/* Backdrop Image with Reliable Fallback and Priority Loading */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Image
          src={heroBg}
          alt="Nelayan Tradisional Sedang Mempersiapkan Jaring di Perahu"
          fill
          priority
          sizes="100vw"
          onError={() => {
            if (heroBg === '/Penangkap-ikan.jpg') {
              setHeroBg('/Penangkap-Ikan.jpg');
            } else if (heroBg !== '/hero-boat.jpg') {
              setHeroBg('/hero-boat.jpg');
            }
          }}
          style={{
            objectFit: 'cover',
            objectPosition: 'center 35%',
            opacity: 0.78,
            filter: 'brightness(0.95) contrast(1.05)',
          }}
        />

        {/* Natural Top-to-Bottom Vertical Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(7, 26, 39, 0.42) 0%, rgba(7, 26, 39, 0.58) 55%, rgba(7, 26, 39, 0.85) 80%, #FFFFFF 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '720px' }}>
          <h1
            className="heading-xl"
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2.4rem, 4.4vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '22px',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)',
            }}
          >
            Merevolusi Rantai Pasok Maritim Melalui{' '}
            <span style={{ color: '#7DDCE8' }}>Kecerdasan IoT.</span>
          </h1>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: '#E2E8F0',
              maxWidth: '640px',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.65)',
            }}
          >
            TEMBOX hadir sebagai perwujudan visi masa depan industri perikanan yang cerdas,
            tangguh, dan berkelanjutan. Menjembatani kesenjangan antara nelayan tradisional
            dan teknologi terapan, memastikan setiap gram hasil tangkapan laut tetap berada
            di tingkat kesegaran optimal sejak dari samudra hingga ke konsumen akhir.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
