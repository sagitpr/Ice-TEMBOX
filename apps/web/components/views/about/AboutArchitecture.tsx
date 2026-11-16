import React from 'react';

export const AboutArchitecture: React.FC = () => {
  return (
    <section
      id="arsitektur"
      className="scroll-mt-24"
      style={{ padding: '96px 0', background: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}
    >
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '52px' }}>
          <span className="eyebrow" style={{ color: '#0284C7' }}>
            ARSITEKTUR SISTEM &amp; CARA KERJA
          </span>
          <h2 style={{ fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
            Hardware to Cloud: Andal Tanpa Sinyal Internet
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', marginBottom: 0 }}>
            Dirancang dengan kapabilitas <em>Offline-First</em> yang tangguh untuk menghadapi kondisi ekstrem di tengah samudra.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            paddingTop: '36px',
          }}
        >
          {/* Step 1 */}
          <div>
            <p
              style={{
                color: '#0284C7',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              01 / INPUT TELEMETRI
            </p>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Sensor DS18B20 &amp; ESP32
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
              Sensor industri tahan air (probe DS18B20 presisi tinggi ±0.5°C) membaca temperatur palka secara berkala. Pemrosesan awal dilakukan lokal oleh mikrokontroler ESP32 hemat energi.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <p
              style={{
                color: '#0284C7',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              02 / INDIKATOR LOKAL
            </p>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Display LCD &amp; Alarm Peringatan
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
              Layar LCD 16x2 I2C menampilkan nilai suhu seketika pada awak kapal di palka. Buzzer audio aktif dan indikator visual memberi peringatan instan jika suhu melampaui batas aman.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <p
              style={{
                color: '#0284C7',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              03 / OFFLINE-FIRST
            </p>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Pencatatan RTC &amp; MicroSD
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
              Modul RTC DS3231 memberi penanda waktu presisi tanpa internet, sementara slot MicroSD FAT32 menyimpan riwayat data secara kontinu tanpa risiko kehilangan data saat melaut lepas.
            </p>
          </div>

          {/* Step 4 */}
          <div>
            <p
              style={{
                color: '#0284C7',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              04 / CLOUD SYNC
            </p>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Sinkronisasi Cloud &amp; Next.js
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.68, margin: 0 }}>
              Saat kapal bersandar dan mendeteksi jaringan Wi-Fi/Hotspot pelabuhan, data batch tersinkronisasi otomatis ke cloud. Pengelola TPI dapat memantau grafik tren 24 jam via web.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutArchitecture;
