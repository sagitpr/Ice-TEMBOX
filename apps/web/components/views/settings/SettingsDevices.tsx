import React from 'react';
import { Box, UserPlus } from '../../../app/components/Icons';
import type { TemboxDevice } from '../../../lib/services/dashboardService';

interface SettingsDevicesProps {
  devices: TemboxDevice[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (deviceId: string) => void;
}

export const SettingsDevices: React.FC<SettingsDevicesProps> = ({
  devices,
  onOpenAddModal,
  onOpenDetailModal,
}) => {
  return (
    <div
      className="settings-section-flat"
      style={{
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '28px',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Box size={20} color="#0284C7" />
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Perangkat
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
            Kelola perangkat IoT palka TEMBOX Anda.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
        {devices.length === 0 ? (
          <div style={{ padding: '20px 0', color: '#64748B', fontSize: '13px' }}>
            Belum ada perangkat IoT palka terdaftar. Silakan klik tombol di bawah untuk mendaftarkan unit ESP32 TEMBOX Anda.
          </div>
        ) : (
          devices.map((device) => {
            const isOnline = device.lastSeenAt
              ? (Date.now() - new Date(device.lastSeenAt).getTime() < 30000)
              : device.status === 'online';

            return (
              <div
                key={device.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #F1F5F9',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box size={20} color="#0284C7" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                        {device.name}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#E0F2FE',
                          color: '#0369A1',
                        }}
                      >
                        {device.placement}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />{' '}
                      {isOnline ? 'Terkoneksi' : 'Belum Terhubung'} &bull; {device.serialNumber || device.ipOrSerial}
                      {device.lastPingMs !== null ? ` • ${device.lastPingMs} ms` : ''}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onOpenDetailModal(device.id)}
                >
                  Detail
                </button>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        className="btn-primary-outline"
        onClick={onOpenAddModal}
      >
        <UserPlus size={14} />
        <span>+ Tambah Perangkat</span>
      </button>
    </div>
  );
};

export default SettingsDevices;
