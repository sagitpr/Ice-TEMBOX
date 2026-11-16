import React from 'react';
import { Bell } from '../../../app/components/Icons';
import type { NotificationSettingState } from '../../../lib/services/dashboardService';

interface SettingsNotificationSyncProps {
  notifSettings: NotificationSettingState;
  onToggleSetting: (key: keyof NotificationSettingState) => void;
}

export const SettingsNotificationSync: React.FC<SettingsNotificationSyncProps> = ({
  notifSettings,
  onToggleSetting,
}) => {
  return (
    <div className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-icon-wrap">
          <Bell size={18} color="#0284C7" />
        </div>
        <div>
          <h3 className="settings-section-title">Kontrol Notifikasi &amp; Sinkronisasi</h3>
          <p className="settings-section-desc">Atur peringatan dini palka dan sinkronisasi data otomatis.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="info-table-row" style={{ padding: '10px 0' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-ocean)', fontSize: '13.5px' }}>
              Peringatan Suhu Kritis (&gt; +2°C)
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Tampilkan notifikasi otomatis saat suhu palka melewati ambang aman.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifSettings.thermalAlertEnabled}
            onClick={() => onToggleSetting('thermalAlertEnabled')}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '9999px',
              background: notifSettings.thermalAlertEnabled ? '#0284C7' : '#CBD5E1',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: notifSettings.thermalAlertEnabled ? '23px' : '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>

        <div className="info-table-row" style={{ padding: '10px 0' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-ocean)', fontSize: '13.5px' }}>
              Sinkronisasi Cloud Otomatis (Saat Sandar)
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Unggah log offline MicroSD FAT32 seketika perangkat terhubung Wi-Fi pelabuhan.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifSettings.autoCloudSyncEnabled}
            onClick={() => onToggleSetting('autoCloudSyncEnabled')}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '9999px',
              background: notifSettings.autoCloudSyncEnabled ? '#0284C7' : '#CBD5E1',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: notifSettings.autoCloudSyncEnabled ? '23px' : '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsNotificationSync;
