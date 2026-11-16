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
    <div className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-icon-wrap">
          <Box size={18} color="#0284C7" />
        </div>
        <div>
          <h3 className="settings-section-title">Perangkat</h3>
          <p className="settings-section-desc">Kelola perangkat IoT palka TEMBOX Anda.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {devices.map((device) => (
          <div className="device-config-item" key={device.id} style={{ marginBottom: 0 }}>
            <div className="device-config-left">
              <Box size={22} color="#0284C7" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="device-config-name">{device.name}</span>
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
                <div className="device-config-ip">
                  <span className={`status-dot ${device.status === 'online' ? 'online' : 'offline'}`} />{' '}
                  {device.status === 'online' ? 'Terhubung' : 'Belum terhubung'} &bull; {device.ipOrSerial}
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
        ))}
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
