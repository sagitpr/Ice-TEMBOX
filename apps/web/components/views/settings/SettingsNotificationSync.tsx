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
    <div
      className="settings-section-flat"
      style={{
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '28px',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Bell size={20} color="#0284C7" />
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Kontrol Notifikasi &amp; Sinkronisasi
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
            Atur peringatan dini palka dan sinkronisasi data otomatis.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: '1px solid #F1F5F9',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13.5px' }}>
              Peringatan Suhu Kritis (&gt; +2°C)
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Tampilkan notifikasi otomatis saat suhu palka melewati ambang batas aman.
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
              backgroundColor: notifSettings.thermalAlertEnabled ? '#0284C7' : '#CBD5E1',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
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
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 0',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13.5px' }}>
              Sinkronisasi Cloud Otomatis (Saat Sandar)
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
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
              backgroundColor: notifSettings.autoCloudSyncEnabled ? '#0284C7' : '#CBD5E1',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
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
                backgroundColor: '#FFFFFF',
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
