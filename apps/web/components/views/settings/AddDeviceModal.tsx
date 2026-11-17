'use client';

import React, { useState, useMemo } from 'react';
import { X, Download, Check, Server, ShieldCheck } from '../../../app/components/Icons';
import { PALKA_OPTIONS } from '../../../hooks/useSettingsLogic';
import type { PalkaPlacement } from '../../../lib/services/dashboardService';

interface AddDeviceModalProps {
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  newDeviceName: string;
  setNewDeviceName: (val: string) => void;
  newDeviceIp: string; // Used as Serial / MAC ID
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
  const [copiedToken, setCopiedToken] = useState(false);

  // Generate deterministic/unique MQTT Provisioning Token & Serial
  const cleanSerial = (newDeviceIp || '').trim() || 'TEMBOX-ESP32-9F8A21';
  const provisioningToken = useMemo(() => {
    return `tbk_live_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).slice(-4)}`;
  }, [addModalOpen]);

  const telemetryTopic = `tembox/${cleanSerial}/telemetry`;
  const cmdTopic = `tembox/${cleanSerial}/cmd`;

  const handleCopyToken = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(provisioningToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Download tembox-config.json for SD Card or ESP32 SPIFFS flashing
  const handleDownloadConfigJson = () => {
    const configData = {
      device_serial: cleanSerial,
      device_name: newDeviceName || 'TEMBOX-NODE',
      placement: newDevicePlacement,
      broker: {
        host: 'mqtt.tembox.id',
        port: 8883,
        protocol: 'mqtts',
        auth_token: provisioningToken,
        telemetry_topic: telemetryTopic,
        cmd_topic: cmdTopic,
      },
      hardware: {
        sensors: ['DS18B20_ONEWIRE_GPIO4', 'RTC_DS3231_I2C', 'MICROSD_SPI_CS5'],
        telemetry_interval_sec: 30,
        sd_interval_sec: 15,
        temp_offset: 0.0,
        warn_threshold: 2.0,
        crit_threshold: 4.0,
        buzzer_enabled: true,
      },
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tembox-config-${cleanSerial.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
          transform: addModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
              REGISTRASI BROKER MQTT
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
              border: 'none',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveDevice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Nama Perangkat */}
          <div>
            <label htmlFor="deviceNameInput" style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Nama Unit / Label Palka
            </label>
            <input
              id="deviceNameInput"
              type="text"
              placeholder="Contoh: TEMBOX-002 (Palka Utama)"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* 2. Device Serial / MAC ID */}
          <div>
            <label htmlFor="deviceIpInput" style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Device Serial / MAC ID Hardware
            </label>
            <input
              id="deviceIpInput"
              type="text"
              placeholder="Contoh: TEMBOX-ESP32-9F8A21"
              value={newDeviceIp}
              onChange={(e) => setNewDeviceIp(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                fontFamily: 'monospace',
                color: '#0F172A',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Tertera pada stiker barcode casing pelindung box palka atau modul ESP32.
            </span>
          </div>

          {/* 3. Penempatan Palka */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Penempatan Posisi Palka
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
                      padding: '8px',
                      borderRadius: '8px',
                      border: selected ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
                      background: selected ? '#F0F9FF' : '#FFFFFF',
                      color: selected ? '#0284C7' : '#475569',
                      fontSize: '12px',
                      fontWeight: selected ? 700 : 500,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {palka}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. MQTT Protocol, Topic, & Provisioning Token Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={14} color="#0284C7" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Konfigurasi Broker: MQTT over TLS (Port 8883)
                </span>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                TLS v1.3 Aktif
              </span>
            </div>

            {/* Generated Topics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Topic Telemetri:</span>
                <code style={{ color: '#0284C7', fontWeight: 600 }}>{telemetryTopic}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Topic Perintah:</span>
                <code style={{ color: '#0F172A', fontWeight: 600 }}>{cmdTopic}</code>
              </div>
            </div>

            {/* Provisioning Token */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Provisioning Token Otentikasi:</span>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: copiedToken ? '#059669' : '#0284C7',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedToken ? (
                    <>
                      <Check size={12} color="#059669" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <span>Salin Token</span>
                  )}
                </button>
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11.5px',
                  fontFamily: 'monospace',
                  color: '#334155',
                  wordBreak: 'break-all',
                }}
              >
                {provisioningToken}
              </div>
            </div>

            {/* Download Config Button */}
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleDownloadConfigJson}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #0284C7',
                  borderRadius: '6px',
                  color: '#0284C7',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={13} color="#0284C7" />
                <span>Unduh tembox-config.json (Flash ke SD / ESP32)</span>
              </button>
            </div>
          </div>

          {addFormError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '12px', padding: '10px 12px', borderRadius: '8px' }}>
              {addFormError}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
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
                cursor: 'pointer',
              }}
            >
              {savingDevice ? 'Mendaftarkan ke Broker...' : 'Daftarkan Perangkat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
