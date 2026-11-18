'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Search,
  Check,
  CheckCircle,
  Key,
} from '../../../app/components/Icons';
import type { TemboxDevice, UpdateHardwareConfigPayload, PalkaPlacement } from '../../../lib/services/dashboardService';

interface DeviceDetailModalProps {
  detailModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  selectedDevice: TemboxDevice | null;
  detailActionFeedback: string;
  pinging: boolean;
  restarting: boolean;
  handlePingDevice: () => void;
  handleRestartTelemetry: () => void;
  onSaveHardwareConfig?: (payload: UpdateHardwareConfigPayload) => Promise<boolean>;
  onDisconnectDevice?: (deviceId: string) => Promise<boolean>;
  onRotatePin?: (deviceId: string) => Promise<string>;
}

interface DiagnosticResult {
  errorCode: string;
  symptomTitle: string;
  hardwareComponent: string;
  rootCause: string;
  resolutionSteps: string[];
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  detailModalOpen,
  setDetailModalOpen,
  selectedDevice,
  detailActionFeedback,
  pinging,
  handlePingDevice,
  onSaveHardwareConfig,
  onDisconnectDevice,
  onRotatePin,
}) => {
  // Navigation Tabs: 'config' | 'diagnostics'
  const [activeTab, setActiveTab] = useState<'config' | 'diagnostics'>('config');

  // Config Form State
  const [telemetryInterval, setTelemetryInterval] = useState<number>(30);
  const [sdInterval, setSdInterval] = useState<number>(15);
  const [tempOffset, setTempOffset] = useState<number>(0.0);
  const [warnThreshold, setWarnThreshold] = useState<number>(2.0);
  const [critThreshold, setCritThreshold] = useState<number>(4.0);
  const [buzzerEnabled, setBuzzerEnabled] = useState<boolean>(true);
  const [placement, setPlacement] = useState<PalkaPlacement>('Palka Utama');
  const [savingConfig, setSavingConfig] = useState(false);
  const [forcingSync, setForcingSync] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Re-Pairing / Rotate PIN State
  const [rotatingPin, setRotatingPin] = useState(false);
  const [newRotatedPin, setNewRotatedPin] = useState<string | null>(null);

  // Diagnostics Search & Vector State
  const [diagSearchQuery, setDiagSearchQuery] = useState('');
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [diagnosticsResults, setDiagnosticsResults] = useState<DiagnosticResult[]>([]);
  const [detectedAnomalies, setDetectedAnomalies] = useState<DiagnosticResult[]>([]);

  // Sync state with selected device whenever modal opens
  useEffect(() => {
    if (selectedDevice) {
      setTelemetryInterval(selectedDevice.telemetryIntervalSec || 30);
      setSdInterval(selectedDevice.microSdIntervalSec || 15);
      setTempOffset(selectedDevice.tempOffset !== undefined ? selectedDevice.tempOffset : 0.0);
      setWarnThreshold(selectedDevice.warnThreshold !== undefined ? selectedDevice.warnThreshold : 2.0);
      setCritThreshold(selectedDevice.critThreshold !== undefined ? selectedDevice.critThreshold : 4.0);
      setBuzzerEnabled(selectedDevice.buzzerEnabled !== undefined ? selectedDevice.buzzerEnabled : true);
      setPlacement(selectedDevice.placement || 'Palka Utama');
      setConfirmDeleteOpen(false);
      setNewRotatedPin(null);
      setSyncFeedback('');

      // Fetch auto-diagnostics
      fetchDiagnostics('', selectedDevice.lastTemperatureC, selectedDevice.status);
    }
  }, [selectedDevice, detailModalOpen]);

  // Fetch diagnostics from API
  const fetchDiagnostics = async (query = '', currentTemp: number | null = null, status = 'online') => {
    try {
      setLoadingDiagnostics(true);
      const res = await fetch('/api/iot/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          current_temp: currentTemp !== null ? currentTemp : selectedDevice?.lastTemperatureC,
          current_status: status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDetectedAnomalies(data.detectedAnomalies || []);
        setDiagnosticsResults(data.searchResults || []);
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  // Submit Hardware Config Form
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice || !onSaveHardwareConfig) return;
    setSavingConfig(true);
    try {
      await onSaveHardwareConfig({
        deviceId: selectedDevice.id,
        telemetryIntervalSec: telemetryInterval,
        sdIntervalSec: sdInterval,
        tempOffset,
        warnThreshold,
        critThreshold,
        buzzerEnabled,
        placement,
      });
    } finally {
      setSavingConfig(false);
    }
  };

  // Rotate PIN (Re-Pairing)
  const handleRotatePinClick = async () => {
    if (!selectedDevice || !onRotatePin || rotatingPin) return;
    setRotatingPin(true);
    setNewRotatedPin(null);
    try {
      const pin = await onRotatePin(selectedDevice.serialNumber || selectedDevice.id);
      setNewRotatedPin(pin);
    } catch {
      // Handled via toast
    } finally {
      setRotatingPin(false);
    }
  };

  // Force MicroSD Sync
  const handleForceSync = async () => {
    if (!selectedDevice || forcingSync) return;
    setForcingSync(true);
    setSyncFeedback('');
    try {
      await fetch('/api/iot/device-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: selectedDevice.id,
          serialNumber: selectedDevice.serialNumber,
          action: 'FORCE_SYNC',
        }),
      });
      setSyncFeedback('Perintah sinkronisasi MicroSD offline telah dikirim ke perangkat.');
    } catch {
      setSyncFeedback('Gagal mengirim perintah sinkronisasi.');
    } finally {
      setForcingSync(false);
    }
  };

  // Disconnect & Delete Device
  const handleConfirmDisconnect = async () => {
    if (!selectedDevice || !onDisconnectDevice || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDisconnectDevice(selectedDevice.id);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  // Honest connection status: Online ONLY if last_seen_at < 30s ago
  const isOnline = selectedDevice?.lastSeenAt
    ? Date.now() - new Date(selectedDevice.lastSeenAt).getTime() < 30000
    : selectedDevice?.status === 'online';

  const serialNumber = selectedDevice?.serialNumber || selectedDevice?.ipOrSerial || 'TEMBOX-01';

  return (
    <div
      role="dialog"
      aria-modal={detailModalOpen}
      aria-hidden={!detailModalOpen}
      className={detailModalOpen ? '' : 'pointer-events-none'}
      onClick={() => detailModalOpen && setDetailModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(7, 26, 39, 0.55)',
        backdropFilter: detailModalOpen ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: detailModalOpen ? 'blur(6px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        opacity: detailModalOpen ? 1 : 0,
        visibility: detailModalOpen ? 'visible' : 'hidden',
        pointerEvents: detailModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, visibility 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          maxWidth: '580px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
          transform: detailModalOpen ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(8px)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {selectedDevice && (
          <>
            {/* Header */}
            <div
              style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#0284C7',
                    textTransform: 'uppercase',
                  }}
                >
                  DETAIL PERANGKAT
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedDevice.name}
                  </h3>
                  {/* Honest connection indicator */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: isOnline ? '#F0FDF4' : '#F1F5F9',
                      color: isOnline ? '#16A34A' : '#64748B',
                      border: `1px solid ${isOnline ? '#DCFCE7' : '#E2E8F0'}`,
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isOnline ? '#16A34A' : '#94A3B8',
                      }}
                    />
                    {isOnline ? '• Terkoneksi' : '• Belum Terhubung'}
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace', display: 'block', marginTop: '2px' }}>
                  ID: {serialNumber}
                </span>
              </div>
              <button
                type="button"
                aria-label="Tutup detail"
                onClick={() => setDetailModalOpen(false)}
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

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0',
                padding: '0 24px',
                backgroundColor: '#F8FAFC',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '11px 12px',
                  border: 'none',
                  borderBottom: activeTab === 'config' ? '2px solid #0284C7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'config' ? '#0284C7' : '#64748B',
                  fontWeight: activeTab === 'config' ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                }}
              >
                <Sliders size={13} />
                <span>Konfigurasi & Keamanan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '11px 12px',
                  border: 'none',
                  borderBottom: activeTab === 'diagnostics' ? '2px solid #0284C7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'diagnostics' ? '#0284C7' : '#64748B',
                  fontWeight: activeTab === 'diagnostics' ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={13} />
                <span>Diagnostik Lapangan</span>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: CONFIGURATION & SECURITY */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Rotated PIN Banner if active */}
                  {newRotatedPin && (
                    <div
                      style={{
                        backgroundColor: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: '8px',
                        padding: '12px 14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Key size={14} color="#0284C7" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369A1' }}>
                          PIN Baru Berhasil Dibuat
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '20px',
                            fontWeight: 800,
                            letterSpacing: '0.25em',
                            color: '#0284C7',
                            backgroundColor: '#FFFFFF',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            border: '1px solid #93C5FD',
                          }}
                        >
                          {newRotatedPin}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#475569' }}>
                          Masukkan PIN ini ke LCD 1602 perangkat (berlaku 15 menit).
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 1. Interval Kirim MQTT & MicroSD Offline */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Interval Kirim MQTT
                      </label>
                      <select
                        value={telemetryInterval}
                        onChange={(e) => setTelemetryInterval(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px',
                          color: '#0F172A',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value={5}>5 detik</option>
                        <option value={15}>15 detik</option>
                        <option value={30}>30 detik (Standar)</option>
                        <option value={60}>60 detik</option>
                        <option value={300}>5 menit (Hemat Daya)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Interval Log MicroSD (Antrean Offline)
                      </label>
                      <select
                        value={sdInterval}
                        onChange={(e) => setSdInterval(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px',
                          color: '#0F172A',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value={5}>5 detik</option>
                        <option value={15}>15 detik (Standar)</option>
                        <option value={30}>30 detik</option>
                        <option value={60}>60 detik</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Kalibrasi Offset DS18B20 */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Kalibrasi Offset Sensor DS18B20
                      </label>
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: tempOffset === 0 ? '#64748B' : tempOffset > 0 ? '#0284C7' : '#DC2626',
                        }}
                      >
                        {tempOffset > 0 ? `+${tempOffset.toFixed(1)}` : tempOffset.toFixed(1)}°C
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="range"
                        min="-5.0"
                        max="5.0"
                        step="0.1"
                        value={tempOffset}
                        onChange={(e) => setTempOffset(parseFloat(e.target.value))}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <button
                        type="button"
                        onClick={() => setTempOffset(0.0)}
                        style={{
                          padding: '3px 8px',
                          fontSize: '11px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        Reset 0.0
                      </button>
                    </div>
                  </div>

                  {/* 3. Batas Waspada & Kritis */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>
                          Batas Waspada Es (°C)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={warnThreshold}
                          onChange={(e) => setWarnThreshold(parseFloat(e.target.value) || 2.0)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '4px' }}>
                          Batas Kritis Bahaya (°C)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={critThreshold}
                          onChange={(e) => setCritThreshold(parseFloat(e.target.value) || 4.0)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Buzzer Fisik Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                        Buzzer Box Palka Fisik
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Bunyi alarm box jika suhu melebihi batas kritis.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBuzzerEnabled(!buzzerEnabled)}
                      style={{
                        width: '38px',
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: buzzerEnabled ? '#0284C7' : '#CBD5E1',
                        border: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: buzzerEnabled ? '18px' : '2px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          transition: 'left 0.15s ease',
                        }}
                      />
                    </button>
                  </div>

                  {/* Feedback */}
                  {(detailActionFeedback || syncFeedback) && (
                    <div
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        color: '#166534',
                        fontSize: '12px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Check size={14} color="#16A34A" />
                      <span>{detailActionFeedback || syncFeedback}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div
                    style={{
                      borderTop: '1px solid #E2E8F0',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="submit"
                        disabled={savingConfig}
                        style={{
                          flex: 1,
                          minWidth: '140px',
                          padding: '9px 16px',
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          opacity: savingConfig ? 0.7 : 1,
                        }}
                      >
                        {savingConfig ? 'Menyimpan...' : 'Simpan Config'}
                      </button>

                      <button
                        type="button"
                        disabled={rotatingPin}
                        onClick={handleRotatePinClick}
                        style={{
                          padding: '9px 12px',
                          backgroundColor: '#FFFFFF',
                          color: '#0284C7',
                          border: '1px solid #0284C7',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {rotatingPin ? 'Membuat PIN...' : 'Ganti PIN (Re-Pair)'}
                      </button>

                      <button
                        type="button"
                        disabled={forcingSync}
                        onClick={handleForceSync}
                        style={{
                          padding: '9px 12px',
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {forcingSync ? 'Syncing...' : 'Paksa Sync MicroSD'}
                      </button>
                    </div>

                    {/* Disconnect Device */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      {confirmDeleteOpen ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600 }}>
                            Putuskan perangkat ini?
                          </span>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteOpen(false)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '11px',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              cursor: 'pointer',
                            }}
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleConfirmDisconnect}
                            style={{
                              padding: '5px 12px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            {isDeleting ? 'Memutuskan...' : 'Ya, Putuskan'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteOpen(true)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: '#DC2626',
                            background: 'none',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Putuskan Perangkat
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: FIELD DIAGNOSTICS (VECTOR DB) */}
              {activeTab === 'diagnostics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Status Banner */}
                  {detectedAnomalies.length > 0 ? (
                    <div
                      style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        padding: '10px 12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <AlertTriangle size={15} color="#DC2626" />
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#991B1B' }}>
                          Kode Error Hardware Terdeteksi
                        </span>
                      </div>
                      {detectedAnomalies.map((anom) => (
                        <div key={anom.errorCode} style={{ fontSize: '11.5px', color: '#B91C1C' }}>
                          &bull; <strong>{anom.symptomTitle}</strong>: {anom.rootCause}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CheckCircle size={15} color="#16A34A" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>
                        Modul sensor dan komponen palka ({selectedDevice.name}) terdeteksi normal.
                      </span>
                    </div>
                  )}

                  {/* Symptom Search Bar */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Pencarian Masalah Lapangan
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#94A3B8' }}>
                          <Search size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="Ketik gejala (misal: suhu -127, lampu merah, microSD, RTC)..."
                          value={diagSearchQuery}
                          onChange={(e) => setDiagSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              fetchDiagnostics(diagSearchQuery);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px 8px 30px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12.5px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fetchDiagnostics(diagSearchQuery)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: '#0284C7',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {loadingDiagnostics ? '...' : 'Cari'}
                      </button>
                    </div>

                    {/* Quick Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {[
                        { q: '-127', label: '-127°C (Probe Lepas)' },
                        { q: 'microSD', label: 'MicroSD Error' },
                        { q: 'rtc', label: 'RTC DS3231' },
                        { q: 'buzzer', label: 'Buzzer Alarm' },
                      ].map((tag) => (
                        <button
                          key={tag.q}
                          type="button"
                          onClick={() => {
                            setDiagSearchQuery(tag.q);
                            fetchDiagnostics(tag.q);
                          }}
                          style={{
                            padding: '3px 8px',
                            fontSize: '11px',
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            color: '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  {diagnosticsResults.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {diagnosticsResults.map((item) => (
                        <div
                          key={item.errorCode}
                          style={{
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#FFFFFF',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                              {item.symptomTitle}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: '#E0F2FE',
                                color: '#0284C7',
                              }}
                            >
                              {item.hardwareComponent}
                            </span>
                          </div>
                          <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                            <strong>Penyebab: </strong>
                            {item.rootCause}
                          </p>
                          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '8px 10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '3px' }}>
                              Langkah Perbaikan:
                            </span>
                            <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#334155', lineHeight: 1.4 }}>
                              {item.resolutionSteps.map((step, idx) => (
                                <li key={idx} style={{ marginBottom: '2px' }}>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceDetailModal;
