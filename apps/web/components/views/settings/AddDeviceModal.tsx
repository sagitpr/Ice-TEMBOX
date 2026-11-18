'use client';

import React from 'react';
import { X, ShieldCheck } from '../../../app/components/Icons';

interface AddDeviceModalProps {
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  newDeviceName: string;
  setNewDeviceName: (val: string) => void;
  newDeviceIp: string; // Used as Device ID (from LCD 1602)
  setNewDeviceIp: (val: string) => void;
  newDevicePin?: string; // 6-Digit PIN (from LCD 1602)
  setNewDevicePin?: (val: string) => void;
  addFormError: string;
  savingDevice: boolean;
  handleSaveDevice: (e: React.FormEvent) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  addModalOpen,
  setAddModalOpen,
  newDeviceName,
  setNewDeviceName,
  newDeviceIp,
  setNewDeviceIp,
  newDevicePin = '',
  setNewDevicePin,
  addFormError,
  savingDevice,
  handleSaveDevice,
}) => {
  return (
    <div
      role="dialog"
      aria-modal={addModalOpen}
      aria-hidden={!addModalOpen}
      className={addModalOpen ? '' : 'pointer-events-none'}
      onClick={() => addModalOpen && setAddModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(7, 26, 39, 0.55)',
        backdropFilter: addModalOpen ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: addModalOpen ? 'blur(6px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        opacity: addModalOpen ? 1 : 0,
        visibility: addModalOpen ? 'visible' : 'hidden',
        pointerEvents: addModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, visibility 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          maxWidth: '460px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.16)',
          transform: addModalOpen ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(8px)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <ShieldCheck size={14} color="#0284C7" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#0284C7',
                  textTransform: 'uppercase',
                }}
              >
                PAIRING LCD 1602
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Hubungkan Box TEMBOX
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Masukkan Device ID dan 6-Digit PIN dari layar LCD fisik palka.
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup modal"
            onClick={() => setAddModalOpen(false)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#F1F5F9',
              border: 'none',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Pairing Form */}
        <form onSubmit={handleSaveDevice} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* 1. Nama Box / Palka */}
          <div>
            <label
              htmlFor="boxNameInput"
              style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}
            >
              Nama Box / Palka
            </label>
            <input
              id="boxNameInput"
              type="text"
              required
              placeholder="Contoh: Box 01 atau Palka Utama"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                color: '#0F172A',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 2. Device ID (dari LCD 1602) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="deviceIdInput"
                style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}
              >
                Device ID (dari LCD 1602)
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Baris 1 LCD</span>
            </div>
            <input
              id="deviceIdInput"
              type="text"
              required
              placeholder="Contoh: TBX-9F8A21"
              value={newDeviceIp}
              onChange={(e) => setNewDeviceIp(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#0F172A',
                outline: 'none',
                boxSizing: 'border-box',
                textTransform: 'uppercase',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Ketik ID perangkat seperti yang muncul pada LCD saat ESP32 dinyalakan.
            </span>
          </div>

          {/* 3. 6-Digit PIN (dari LCD 1602) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="devicePinInput"
                style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}
              >
                6-Digit PIN (dari LCD 1602)
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Baris 2 LCD</span>
            </div>
            <input
              id="devicePinInput"
              type="text"
              required
              maxLength={6}
              placeholder="Contoh: 849201"
              value={newDevicePin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                if (setNewDevicePin) setNewDevicePin(val);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#0284C7',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              PIN acak 6-digit untuk otentikasi hardware zero-trust & penerbitan kunci HMAC.
            </span>
          </div>

          {addFormError && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                lineHeight: 1.4,
              }}
            >
              {addFormError}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setAddModalOpen(false)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                color: '#475569',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={savingDevice}
              style={{
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                opacity: savingDevice ? 0.7 : 1,
                cursor: savingDevice ? 'not-allowed' : 'pointer',
              }}
            >
              {savingDevice ? 'Memverifikasi...' : 'Hubungkan Perangkat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
