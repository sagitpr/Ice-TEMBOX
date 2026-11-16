'use client';

import React from 'react';
import { X, RefreshCw, ShieldCheck } from '../../../app/components/Icons';
import type { TemboxDevice } from '../../../lib/services/dashboardService';

interface DeviceDetailModalProps {
  detailModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  selectedDevice: TemboxDevice | null;
  detailActionFeedback: string;
  pinging: boolean;
  restarting: boolean;
  handlePingDevice: () => void;
  handleRestartTelemetry: () => void;
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
}) => {
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
          borderRadius: '18px',
          maxWidth: '500px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
          transform: detailModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {selectedDevice && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
                  DIAGNOSTIK HARDWARE
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2D42', margin: 0 }}>
                    {selectedDevice.name}
                  </h3>
                  <span
                    className={`badge-status ${selectedDevice.status === 'online' ? 'safe' : 'menunggu'}`}
                  >
                    <span className={`status-dot ${selectedDevice.status === 'online' ? 'online' : 'offline'}`} />
                    {selectedDevice.status === 'online' ? 'Terhubung' : 'Offline / Siaga'}
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
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', marginBottom: '20px' }}>
              <div className="info-table-row">
                <span className="info-table-label">Penempatan Palka</span>
                <span className="info-table-val">{selectedDevice.placement}</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-label">Alamat IP / Serial ESP32</span>
                <span className="info-table-val">{selectedDevice.ipOrSerial}</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-label">Firmware ESP32</span>
                <span className="info-table-val">{selectedDevice.firmwareEsp32}</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-label">Sensor DS18B20</span>
                <span className="info-table-val">{selectedDevice.firmwareDs18b20}</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-label">Interval Log MicroSD</span>
                <span className="info-table-val">Setiap {selectedDevice.microSdIntervalSec} detik</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-label">Sinkronisasi Terakhir</span>
                <span className="info-table-val">{selectedDevice.lastSyncAt}</span>
              </div>
            </div>

            {detailActionFeedback && (
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontSize: '12.5px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={16} color="#059669" />
                <span>{detailActionFeedback}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={pinging}
                onClick={handlePingDevice}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#0284C7',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  opacity: pinging ? 0.7 : 1,
                }}
              >
                <RefreshCw size={14} />
                <span>{pinging ? 'Menguji Koneksi...' : 'Ping Perangkat'}</span>
              </button>

              <button
                type="button"
                disabled={restarting}
                onClick={handleRestartTelemetry}
                className="btn-secondary"
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  opacity: restarting ? 0.7 : 1,
                }}
              >
                <RefreshCw size={14} />
                <span>{restarting ? 'Merestart...' : 'Restart Telemetri'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceDetailModal;
