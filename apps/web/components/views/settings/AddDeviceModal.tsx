'use client';

import React from 'react';
import { X } from '../../../app/components/Icons';
import { PALKA_OPTIONS } from '../../../hooks/useSettingsLogic';
import type { PalkaPlacement } from '../../../lib/services/dashboardService';

interface AddDeviceModalProps {
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  newDeviceName: string;
  setNewDeviceName: (val: string) => void;
  newDeviceIp: string;
  setNewDeviceIp: (val: string) => void;
  newDevicePlacement: PalkaPlacement;
  setNewDevicePlacement: (val: PalkaPlacement) => void;
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
  newDevicePlacement,
  setNewDevicePlacement,
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
        backdropFilter: addModalOpen ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: addModalOpen ? 'blur(8px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: addModalOpen ? 1 : 0,
        visibility: addModalOpen ? 'visible' : 'hidden',
        pointerEvents: addModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, visibility 0.22s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2EDF4',
          borderRadius: '18px',
          maxWidth: '460px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
          transform: addModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
              REGISTRASI NODE IOT
            </span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0B2D42', margin: '4px 0 0 0' }}>
              Tambah Perangkat TEMBOX
            </h3>
          </div>
          <button
            type="button"
            aria-label="Tutup modal"
            onClick={() => setAddModalOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveDevice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="deviceNameInput" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Nama Perangkat
            </label>
            <input
              id="deviceNameInput"
              type="text"
              placeholder="Contoh: TEMBOX-002"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label htmlFor="deviceIpInput" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Alamat IP / Serial ESP32
            </label>
            <input
              id="deviceIpInput"
              type="text"
              placeholder="Contoh: 192.168.1.24 atau ESP32-9F8A21"
              value={newDeviceIp}
              onChange={(e) => setNewDeviceIp(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Penempatan Palka
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {PALKA_OPTIONS.map((palka) => {
                const selected = newDevicePlacement === palka;
                return (
                  <button
                    key={palka}
                    type="button"
                    onClick={() => setNewDevicePlacement(palka)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: selected ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
                      background: selected ? '#F0F9FF' : '#FFFFFF',
                      color: selected ? '#0369A1' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: selected ? 700 : 500,
                      textAlign: 'center',
                    }}
                  >
                    {palka}
                  </button>
                );
              })}
            </div>
          </div>

          {addFormError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '12.5px', padding: '10px 12px', borderRadius: '8px' }}>
              {addFormError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn-secondary" onClick={() => setAddModalOpen(false)}>
              Batal
            </button>
            <button
              type="submit"
              disabled={savingDevice}
              style={{
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                padding: '9px 20px',
                borderRadius: '8px',
                opacity: savingDevice ? 0.7 : 1,
              }}
            >
              {savingDevice ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
