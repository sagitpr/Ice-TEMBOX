import React from 'react';

export const ContactHero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '148px',
        paddingBottom: '56px',
        backgroundColor: '#071A27',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container" style={{ maxWidth: '1140px' }}>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#7DDCE8',
            marginBottom: '14px',
          }}
        >
          TEMBOX COMMUNICATION &amp; SUPPORT
        </p>
        <h1
          className="heading-xl"
          style={{
            color: '#FFFFFF',
            fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '18px',
          }}
        >
          Hubungi Tim <span style={{ color: '#7DDCE8' }}>TEMBOX.</span>
        </h1>
        <p
          style={{
            fontSize: '16.5px',
            lineHeight: 1.72,
            color: '#CBD5E1',
            maxWidth: '640px',
            margin: 0,
          }}
        >
          Terhubung dengan kami untuk konsultasi perangkat IoT, kerja sama strategis, atau
          dukungan teknis rantai dingin perikanan maritim.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
