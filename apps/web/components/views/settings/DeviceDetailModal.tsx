'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Server,
  AlertTriangle,
  Search,
  Check,
  CheckCircle,
} from '../../../app/components/Icons';
import type { TemboxDevice, UpdateHardwareConfigPayload, PalkaPlacement } from '../../../lib/services/dashboardService';
import { PALKA_OPTIONS } from '../../../hooks/useSettingsLogic';

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
  restarting,
  handlePingDevice,
  handleRestartTelemetry,
  onSaveHardwareConfig,
  onDisconnectDevice,
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Fallback handled gracefully
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

  // Force MicroSD Sync
  const handleForceSync = async () => {
    if (!selectedDevice || forcingSync) return;
    setForcingSync(true);
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
    } catch {}
    setTimeout(() => {
      setForcingSync(false);
    }, 800);
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

  const serialNumber = selectedDevice?.serialNumber || selectedDevice?.ipOrSerial || 'TEMBOX-ESP32-9F8A21';
  const telemetryTopic = selectedDevice?.mqttTopicTelemetry || `tembox/${serialNumber}/telemetry`;
  const cmdTopic = selectedDevice?.mqttTopicCmd || `tembox/${serialNumber}/cmd`;

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
        backdropFilter: detailModalOpen ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: detailModalOpen ? 'blur(8px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: detailModalOpen ? 1 : 0,
        visibility: detailModalOpen ? 'visible' : 'hidden',
        pointerEvents: detailModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, visibility 0.22s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2EDF4',
          borderRadius: '16px',
          maxWidth: '620px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
          transform: detailModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        {selectedDevice && (
          <>
            {/* Header */}
            <div
              style={{
                padding: '22px 28px 16px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
                  KENDALI IOT & DIAGNOSTIK
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0B2D42', margin: 0 }}>
                    {selectedDevice.name}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: selectedDevice.status === 'online' ? '#ECFDF5' : '#FEF2F2',
                      color: selectedDevice.status === 'online' ? '#059669' : '#DC2626',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: selectedDevice.status === 'online' ? '#10B981' : '#EF4444',
                      }}
                    />
                    {selectedDevice.status === 'online' ? 'MQTT Terhubung' : 'Offline / Siaga'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup detail perangkat"
                onClick={() => setDetailModalOpen(false)}
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

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0',
                padding: '0 28px',
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
                  padding: '12px 14px',
                  border: 'none',
                  borderBottom: activeTab === 'config' ? '2px solid #0284C7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'config' ? '#0284C7' : '#64748B',
                  fontWeight: activeTab === 'config' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Sliders size={14} />
                <span>Konfigurasi & Kendali Hardware</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  border: 'none',
                  borderBottom: activeTab === 'diagnostics' ? '2px solid #0284C7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'diagnostics' ? '#0284C7' : '#64748B',
                  fontWeight: activeTab === 'diagnostics' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={14} />
                <span>Bantuan & Troubleshooting (Vector DB)</span>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: HARDWARE CONFIGURATION & COMMANDS */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* MQTT Broker & Protocol Strip */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Device Serial:</span>
                      <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{serialNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Telemetry Topic:</span>
                      <code style={{ color: '#0284C7' }}>{telemetryTopic}</code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <span style={{ color: '#64748B' }}>Command Topic:</span>
                      <code style={{ color: '#0F172A' }}>{cmdTopic}</code>
                    </div>
                  </div>

                  {/* 1. Interval Telemetri MQTT & MicroSD Offline */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Interval Telemetri MQTT
                      </label>
                      <select
                        value={telemetryInterval}
                        onChange={(e) => setTelemetryInterval(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          color: '#0F172A',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value={5}>5 detik (Uji Lapangan)</option>
                        <option value={15}>15 detik</option>
                        <option value={30}>30 detik (Standar)</option>
                        <option value={60}>60 detik</option>
                        <option value={300}>5 menit (Hemat Daya Pelayaran)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Interval Log Offline MicroSD
                      </label>
                      <select
                        value={sdInterval}
                        onChange={(e) => setSdInterval(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
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

                  {/* 2. Kalibrasi Offset Sensor DS18B20 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Kalibrasi Offset Sensor DS18B20
                      </label>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: tempOffset === 0 ? '#64748B' : tempOffset > 0 ? '#0284C7' : '#DC2626' }}>
                        {tempOffset > 0 ? `+${tempOffset.toFixed(1)}` : tempOffset.toFixed(1)}°C
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                          padding: '4px 8px',
                          fontSize: '11px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        Reset 0.0
                      </button>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Koreksi offset presisi diterapkan di hardware ESP32 sebelum paket dikirim ke broker.
                    </span>
                  </div>

                  {/* 3. Ambang Batas Suhu Alarm & Buzzer */}
                  <div
                    style={{
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '13px',
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
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Buzzer Fisik Toggle */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#F8FAFC',
                        padding: '10px 14px',
                        borderRadius: '8px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                          Buzzer Alarm Fisik di Box Palka
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          Membunyikan nada peringatan saat suhu melebihi batas kritis di laut.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBuzzerEnabled(!buzzerEnabled)}
                        style={{
                          width: '42px',
                          height: '24px',
                          borderRadius: '12px',
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
                            top: '3px',
                            left: buzzerEnabled ? '21px' : '3px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            transition: 'left 0.15s ease',
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {detailActionFeedback && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#065F46',
                        fontSize: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Check size={14} color="#059669" />
                      <span>{detailActionFeedback}</span>
                    </div>
                  )}

                  {/* Field Control Actions Bar */}
                  <div
                    style={{
                      borderTop: '1px solid #E2E8F0',
                      paddingTop: '16px',
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
                          padding: '10px 16px',
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
                        {savingConfig ? 'Menyimpan & Mengirim...' : 'Simpan & Kirim Config ke ESP32'}
                      </button>

                      <button
                        type="button"
                        disabled={pinging}
                        onClick={handlePingDevice}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          color: '#0284C7',
                          border: '1px solid #0284C7',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {pinging ? 'Pinging...' : 'Test Ping MQTT'}
                      </button>

                      <button
                        type="button"
                        disabled={forcingSync}
                        onClick={handleForceSync}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {forcingSync ? 'Menyinkronkan...' : 'Paksa Sync MicroSD'}
                      </button>
                    </div>

                    {/* Disconnect / Delete Danger Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      {confirmDeleteOpen ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600 }}>
                            Cabut token & hapus perangkat ini?
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
                            {isDeleting ? 'Memutuskan...' : 'Ya, Putuskan & Hapus'}
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
                          Putuskan Koneksi / Hapus Perangkat
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: FIELD VECTOR DIAGNOSTICS & TROUBLESHOOTING */}
              {activeTab === 'diagnostics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Automatic Anomaly Detection Banner */}
                  {detectedAnomalies.length > 0 ? (
                    <div
                      style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        padding: '12px 14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B' }}>
                          Anomali Hardware Terdeteksi di Lapangan
                        </span>
                      </div>
                      {detectedAnomalies.map((anom) => (
                        <div key={anom.errorCode} style={{ fontSize: '12px', color: '#B91C1C', marginBottom: '4px' }}>
                          &bull; <strong>{anom.symptomTitle}</strong>: {anom.rootCause}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CheckCircle size={16} color="#059669" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#065F46' }}>
                        Semua modul perangkat ({selectedDevice.name}) terdeteksi sehat dan beroperasi normal.
                      </span>
                    </div>
                  )}

                  {/* Symptom Search Bar */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Pencarian Masalah Lapangan (Knowledge Base / Vector DB)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }}>
                          <Search size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="Ketik gejala (misal: suhu -127, lampu merah, microSD mount, waktu rtc)..."
                          value={diagSearchQuery}
                          onChange={(e) => setDiagSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              fetchDiagnostics(diagSearchQuery);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px 8px 32px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12.5px',
                            outline: 'none',
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
                        {loadingDiagnostics ? 'Mencari...' : 'Cari Solusi'}
                      </button>
                    </div>

                    {/* Quick Diagnostic Pill Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {[
                        { q: '-127', label: 'Suhu -127°C' },
                        { q: '+85', label: 'Suhu +85°C' },
                        { q: 'microSD', label: 'MicroSD Mount Error' },
                        { q: 'rtc', label: 'Jam RTC Reset' },
                        { q: 'mqtt', label: 'Koneksi TLS Putus' },
                        { q: 'buzzer', label: 'Buzzer Bunyi Terus' },
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

                  {/* Troubleshooting Cards List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {diagnosticsResults.map((item) => (
                      <div
                        key={item.errorCode}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '14px',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                            {item.symptomTitle}
                          </span>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#E0F2FE',
                              color: '#0284C7',
                            }}
                          >
                            Modul: {item.hardwareComponent}
                          </span>
                        </div>

                        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                          <strong style={{ color: '#334155' }}>Penyebab: </strong>
                          {item.rootCause}
                        </p>

                        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '10px 12px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                            Langkah Solusi Lapangan:
                          </span>
                          <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
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
