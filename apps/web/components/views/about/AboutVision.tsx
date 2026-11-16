import React from 'react';

export const AboutVision: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', background: '#FFFFFF' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'start',
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: '#0284C7', marginBottom: '12px' }}>
              VISI &amp; PENGANTAR KORPORAT
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.25,
                marginBottom: '20px',
              }}
            >
              Menjaga Nilai Luhur Nelayan Nusantara di Era Digital
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#475569', marginBottom: '16px' }}>
              Di era transformasi digital yang bergerak masif, sektor kelautan dan perikanan Indonesia memegang peran
              fundamental dalam ketahanan pangan serta perekonomian nasional. Namun, tantangan klasik dalam distribusi
              hasil tangkapan laut—khususnya penanganan pasca-penangkapan (<em>post-harvest handling</em>)—masih
              menghadapi kendala efisiensi rantai dingin (<em>cold chain logistics</em>).
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#475569', margin: 0 }}>
              Kami berkomitmen menghadirkan solusi teknologi mutakhir yang inklusif, dapat dijangkau oleh nelayan skala
              kecil hingga menengah, tanpa merombak armada kapal yang telah mereka miliki selama puluhan tahun.
            </p>
          </div>

          {/* Numbered Features List with Neutral Hairline Dividers */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '24px 0',
                borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', paddingTop: '3px', flexShrink: 0 }}>
                01
              </span>
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0284C7',
                    marginBottom: '6px',
                  }}
                >
                  INTEGRITAS MUTU TANGKAPAN
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  Pengawasan Termal Presisi Tinggi
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                  Mencegah degradasi histamin dan pembusukan dini pada ikan dengan pengawasan termal presisi tinggi secara terus menerus sepanjang pelayaran.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: '24px 0',
                borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', paddingTop: '3px', flexShrink: 0 }}>
                02
              </span>
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#0284C7',
                    marginBottom: '6px',
                  }}
                >
                  DAMPAK EKONOMI MARITIM
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  Dampak Ekonomi Berkelanjutan
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
                  Meningkatkan nilai jual lelang ikan di Tempat Pelelangan Ikan (TPI) berkat bukti riwayat suhu dingin terverifikasi dan dapat dipertanggungjawabkan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutVision;
