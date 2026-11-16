import React from 'react';

export const AboutIndustryChallenge: React.FC = () => {
  return (
    <section
      style={{
        padding: '96px 0',
        background: '#071A27',
        color: '#E2E8F0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
          <span className="eyebrow" style={{ color: '#7DDCE8' }}>
            LATAR BELAKANG &amp; SOLUSI INOVATIF
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.25,
            }}
          >
            Dari Kerentanan Manual ke Kepastian Terukur
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
          }}
        >
          {/* 01: Tantangan Industri (No Card Box) */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '28px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                marginBottom: '10px',
              }}
            >
              01 / TANTANGAN INDUSTRI
            </p>
            <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              Fluktuasi Suhu Palka Es Konvensional
            </h3>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#CBD5E1', marginBottom: '14px' }}>
              Secara geografis, Indonesia merupakan negara kepulauan dengan potensi maritim luar biasa. Namun, nelayan
              tradisional masih sangat bergantung pada metode penyimpanan es manual di dalam kotak palka tanpa sistem pemantauan terukur.
            </p>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#94A3B8', margin: 0 }}>
              Selama pelayaran yang panjang, es mencair dan suhu naik secara perlahan tanpa disadari. Nelayan baru mengetahui
              penurunan mutu ketika pembusukan telah terjadi saat bersandar di pelabuhan, mengakibatkan kerugian ekonomi yang fatal.
            </p>
          </div>

          {/* 02: Solusi Modular TEMBOX (No Card Box) */}
          <div
            style={{
              borderTop: '1px solid rgba(125, 220, 232, 0.45)',
              paddingTop: '28px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#7DDCE8',
                marginBottom: '10px',
              }}
            >
              02 / SOLUSI MODULAR TEMBOX
            </p>
            <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              Perangkat Tambahan Pintar (Retrofit Device)
            </h3>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#CBD5E1', marginBottom: '14px' }}>
              Kami tidak berupaya menggantikan es sebagai media pendingin utama, melainkan menghadirkan{' '}
              <strong style={{ color: '#FFFFFF' }}>TEMBOX (Temperature Box)</strong> sebagai perangkat tambahan modular cerdas.
            </p>
            <p style={{ fontSize: '14.5px', lineHeight: 1.75, color: '#94A3B8', margin: 0 }}>
              Perangkat ini dipasang langsung pada wadah penyimpanan ikan yang sudah dimiliki nelayan tanpa perlu merombak fisik kapal. Memantau suhu secara real-time, memberi peringatan dini visual &amp; audio, serta mencatat data telemetri secara terukur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIndustryChallenge;
