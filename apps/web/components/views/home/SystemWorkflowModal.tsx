'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface SystemWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Pemantauan Palka Real-Time',
    desc: 'Probe sensor suhu anti-korosi air laut (DS18B20 presisi tinggi ±0.5°C) memantau temperatur palka es secara kontinu sepanjang pelayaran.',
  },
  {
    num: '02',
    title: 'Peringatan Dini & Log Offline (RTC)',
    desc: 'Indikator alarm di anjungan kapal menyala jika suhu naik di atas batas aman, sementara modul RTC DS3231 & MicroSD FAT32 mencatat data secara offline tanpa sinyal seluler.',
  },
  {
    num: '03',
    title: 'Sinkronisasi Otomatis di Pelabuhan',
    desc: 'Begitu kapal mendekati daratan dan terhubung ke jaringan Wi-Fi/seluler, seluruh riwayat suhu tersinkronisasi otomatis ke cloud.',
  },
  {
    num: '04',
    title: 'Dashboard & Audit Mutu TPI',
    desc: 'Nelayan dan pengelola TPI dapat memantau grafik suhu serta membuktikan kualitas kesegaran ikan saat pelelangan.',
  },
];

export const SystemWorkflowModal: React.FC<SystemWorkflowModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 28px 18px 28px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0284C7',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              ARSITEKTUR &amp; ALUR KERJA SISTEM
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#072538', margin: 0, lineHeight: 1.25 }}>
              4 Tahapan Pemantauan Palka TEMBOX
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela alur kerja"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '15px',
              flexShrink: 0,
              transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Clean Clean Minimal Steps */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {WORKFLOW_STEPS.map((step, index) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
                paddingBottom: index < WORKFLOW_STEPS.length - 1 ? '18px' : '0',
                borderBottom:
                  index < WORKFLOW_STEPS.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              {/* Plain Bold Number (No card/box around numbers) */}
              <span
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#0284C7',
                  minWidth: '28px',
                  paddingTop: '2px',
                  flexShrink: 0,
                }}
              >
                {step.num}
              </span>

              {/* Step Info without badge boxes */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#072538', margin: '0 0 6px 0' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '14px', lineHeight: 1.68, color: '#475569', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '18px 28px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/about#arsitektur"
            onClick={onClose}
            style={{
              color: '#0284C7',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Pelajari Arsitektur Teknis Lengkap</span>
            <span>→</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 22px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369A1')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284C7')}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemWorkflowModal;
