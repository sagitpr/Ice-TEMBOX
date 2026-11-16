import React from 'react';

export const ContactInfo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Block 1: Official Channels */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
            }}
          >
            SALURAN RESMI
          </span>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(125, 220, 232, 0.12)',
              color: '#7DDCE8',
            }}
          >
            Respon ≤ 24 Jam
          </span>
        </div>

        <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>
          Kontak Langsung
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '16px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
              Email Resmi Layanan
            </span>
            <a
              href="mailto:temboxofficial.id@gmail.com"
              style={{
                fontSize: '15.5px',
                color: '#7DDCE8',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              temboxofficial.id@gmail.com
            </a>
          </div>

          <div
            style={{
              padding: '16px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
              WhatsApp Bisnis &amp; Konsultasi Cepat
            </span>
            <a
              href="https://wa.me/6287833847895"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '15.5px',
                color: '#7DDCE8',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              +62 878-3384-7895
            </a>
          </div>

          <div
            style={{
              padding: '16px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
              Jam Operasional Layanan
            </span>
            <p style={{ fontSize: '14.5px', color: '#E2E8F0', fontWeight: 600, margin: 0 }}>
              Senin – Jumat, 08.00 – 17.00 WIB
            </p>
          </div>
        </div>
      </div>

      {/* Block 2: Institutional Base */}
      <div
        style={{
          paddingTop: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
            }}
          >
            BASIS PENGEMBANGAN INSTITUSIONAL
          </span>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#CBD5E1',
            }}
          >
            Tasikmalaya
          </span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
          Universitas Bakti Tunas Husada
        </h3>
        <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: '#CBD5E1', marginBottom: '8px' }}>
          Fakultas Teknologi dan Bisnis — Program Studi S1 Sistem Informasi
        </p>
        <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
          Jl. Letjen Mashudi No. 20, Kota Tasikmalaya, Jawa Barat 46196, Indonesia.
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
