'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Info,
  Box,
  UserPlus,
  User,
  X,
  Check,
  RefreshCw,
  ShieldCheck,
  Bell,
} from './Icons';
import {
  fetchDevices,
  addDevice,
  getDeviceDetail,
  pingDevice,
  restartTelemetry,
  fetchAccount,
  updateAccount,
  fetchNotificationSettings,
  toggleNotificationSettings,
  type TemboxDevice,
  type PalkaPlacement,
  type UserAccount,
  type NotificationSettingState,
} from '../../lib/services/dashboardService';

const PALKA_OPTIONS: PalkaPlacement[] = ['Palka Kiri', 'Palka Kanan', 'Palka Utama'];

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'warning';
}

export const PengaturanView: React.FC = () => {
  const [devices, setDevices] = useState<TemboxDevice[]>([]);
  const [account, setAccount] = useState<UserAccount>({
    fullName: 'Nelayan',
    email: 'nelayan@example.com',
    role: 'Pemilik Armada / Operator TPI',
  });
  const [notifSettings, setNotifSettings] = useState<NotificationSettingState>({
    thermalAlertEnabled: true,
    autoCloudSyncEnabled: true,
  });

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Add Device Form State
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState('');
  const [newDevicePlacement, setNewDevicePlacement] = useState<PalkaPlacement>('Palka Utama');
  const [addFormError, setAddFormError] = useState('');
  const [savingDevice, setSavingDevice] = useState(false);

  // Device Detail State
  const [selectedDevice, setSelectedDevice] = useState<TemboxDevice | null>(null);
  const [pinging, setPinging] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [detailActionFeedback, setDetailActionFeedback] = useState('');

  // Account Edit Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [accountFormError, setAccountFormError] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ id: Date.now(), text, type });
  }, []);

  // Load initial data from centralized dashboardService
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [devList, acc, nSettings] = await Promise.all([
          fetchDevices(),
          fetchAccount(),
          fetchNotificationSettings(),
        ]);
        if (!isMounted) return;
        setDevices(devList);
        setAccount(acc);
        setNotifSettings(nSettings);
      } catch {
        // Fallback already initialized in state
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-hide toast with cleanup
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Escape key & scroll lock for active modals
  const anyModalOpen = addModalOpen || detailModalOpen || accountModalOpen;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAddModalOpen(false);
        setDetailModalOpen(false);
        setAccountModalOpen(false);
      }
    };
    if (anyModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [anyModalOpen]);

  // Open Add Device Modal
  const handleOpenAddModal = () => {
    const nextNumber = String(devices.length + 1).padStart(3, '0');
    setNewDeviceName(`TEMBOX-${nextNumber}`);
    setNewDeviceIp('');
    setNewDevicePlacement('Palka Utama');
    setAddFormError('');
    setAddModalOpen(true);
  };

  // Submit Add Device
  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');
    if (!newDeviceName.trim()) {
      setAddFormError('Nama perangkat wajib diisi (misal: TEMBOX-002).');
      return;
    }
    if (!newDeviceIp.trim()) {
      setAddFormError('Alamat IP atau Serial ESP32 wajib diisi.');
      return;
    }

    setSavingDevice(true);
    try {
      const created = await addDevice({
        name: newDeviceName,
        ipOrSerial: newDeviceIp,
        placement: newDevicePlacement,
      });
      setDevices((prev) => [...prev, created]);
      setAddModalOpen(false);
      showToast(`Perangkat ${created.name} berhasil ditambahkan ke ${created.placement}.`, 'success');
    } catch (err: unknown) {
      setAddFormError(err instanceof Error ? err.message : 'Gagal menyimpan perangkat.');
    } finally {
      setSavingDevice(false);
    }
  };

  // Open Device Detail Modal
  const handleOpenDetailModal = async (deviceId: string) => {
    setDetailActionFeedback('');
    try {
      const detail = await getDeviceDetail(deviceId);
      setSelectedDevice(detail);
      setDetailModalOpen(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat detail perangkat.', 'warning');
    }
  };

  // Ping Device Mock Action
  const handlePingDevice = async () => {
    if (!selectedDevice || pinging) return;
    setPinging(true);
    setDetailActionFeedback('');
    try {
      const result = await pingDevice(selectedDevice.id);
      setSelectedDevice(result.device);
      setDevices((prev) => prev.map((d) => (d.id === result.device.id ? result.device : d)));
      setDetailActionFeedback(`Ping berhasil: ${result.latencyMs} ms • Perangkat aktif terhubung.`);
      showToast(`${result.device.name} merespons (${result.latencyMs} ms).`, 'success');
    } catch (err: unknown) {
      setDetailActionFeedback(err instanceof Error ? err.message : 'Gagal menghubungi perangkat.');
    } finally {
      setPinging(false);
    }
  };

  // Restart Telemetry Mock Action
  const handleRestartTelemetry = async () => {
    if (!selectedDevice || restarting) return;
    setRestarting(true);
    setDetailActionFeedback('');
    try {
      const updated = await restartTelemetry(selectedDevice.id);
      setSelectedDevice(updated);
      setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setDetailActionFeedback('Modul sensor DS18B20 & telemetri ESP32 berhasil dimulai ulang.');
      showToast(`Telemetri ${updated.name} berhasil di-restart.`, 'info');
    } catch (err: unknown) {
      setDetailActionFeedback(err instanceof Error ? err.message : 'Gagal memulai ulang telemetri.');
    } finally {
      setRestarting(false);
    }
  };

  // Open Edit Account Modal
  const handleOpenAccountModal = () => {
    setEditName(account.fullName);
    setEditEmail(account.email);
    setAccountFormError('');
    setAccountModalOpen(true);
  };

  // Submit Edit Account
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountFormError('');
    if (!editName.trim()) {
      setAccountFormError('Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!editEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      setAccountFormError('Masukkan format alamat email yang valid.');
      return;
    }

    setSavingAccount(true);
    try {
      const updated = await updateAccount({
        fullName: editName,
        email: editEmail,
      });
      setAccount(updated);
      setAccountModalOpen(false);
      showToast(`Profil akun diperbarui menjadi ${updated.fullName}.`, 'success');
    } catch (err: unknown) {
      setAccountFormError(err instanceof Error ? err.message : 'Gagal memperbarui akun.');
    } finally {
      setSavingAccount(false);
    }
  };

  // Toggle Notification Preferences
  const handleToggleSetting = async (key: keyof NotificationSettingState) => {
    const nextValue = !notifSettings[key];
    setNotifSettings((prev) => ({ ...prev, [key]: nextValue }));
    try {
      const updated = await toggleNotificationSettings(key, nextValue);
      setNotifSettings(updated);
      const label =
        key === 'thermalAlertEnabled'
          ? 'Peringatan Anomali Suhu'
          : 'Sinkronisasi Cloud Otomatis';
      showToast(`${label} ${nextValue ? 'diaktifkan' : 'dinonaktifkan'}.`, 'info');
    } catch {
      setNotifSettings((prev) => ({ ...prev, [key]: !nextValue }));
    }
  };

  return (
    <section className="app-page active" id="page-pengaturan">
      {/* Interactive Mode Status Banner */}
      <div
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          color: '#0369A1',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} />
          <span>Mode interaktif aktif menggunakan service state lokal (siap dihubungkan ke API backend).</span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '9999px',
            background: '#E0F2FE',
            color: '#0284C7',
          }}
        >
          {devices.length} Perangkat Terdaftar
        </span>
      </div>

      {/* Section 1: Perangkat */}
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
                onClick={() => handleOpenDetailModal(device.id)}
              >
                Detail
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-primary-outline"
          onClick={handleOpenAddModal}
        >
          <UserPlus size={14} />
          <span>+ Tambah Perangkat</span>
        </button>
      </div>

      {/* Section 2: Akun */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">
            <User size={18} color="#0284C7" />
          </div>
          <div>
            <h3 className="settings-section-title">Akun</h3>
            <p className="settings-section-desc">Kelola informasi profil pengguna Anda.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="topbar-avatar" style={{ width: '44px', height: '44px', fontSize: '16px', flexShrink: 0 }}>
              <User size={20} />
            </div>
            <div>
              <div id="settingsAccountName" style={{ fontWeight: 700, color: 'var(--color-ocean)', fontSize: '15px' }}>
                {account.fullName}
              </div>
              <div id="settingsAccountEmail" style={{ fontSize: '12.5px', color: '#64748B' }}>
                {account.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleOpenAccountModal}
          >
            Ubah
          </button>
        </div>
      </div>

      {/* Section 3: Kontrol Notifikasi & Telemetri */}
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
              onClick={() => handleToggleSetting('thermalAlertEnabled')}
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
              onClick={() => handleToggleSetting('autoCloudSyncEnabled')}
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

      {/* Section 4: Informasi Sistem */}
      <div className="settings-section-card">
        <div className="settings-section-header">
          <div className="settings-icon-wrap">
            <Info size={18} color="#0284C7" />
          </div>
          <div>
            <h3 className="settings-section-title">Informasi Sistem</h3>
          </div>
        </div>

        <div>
          <div className="info-table-row">
            <span className="info-table-label">Versi Perangkat</span>
            <span className="info-table-val">1.0.0</span>
          </div>
          <div className="info-table-row">
            <span className="info-table-label">Versi Aplikasi</span>
            <span className="info-table-val">Next.js App Router (15.1.0)</span>
          </div>
          <div className="info-table-row">
            <span className="info-table-label">Protokol Komunikasi</span>
            <span className="info-table-val">WebSocket &amp; REST</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          MODAL 1: + TAMBAH PERANGKAT
          ================================================== */}
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

      {/* ==================================================
          MODAL 2: DETAIL TEKNIS PERANGKAT
          ================================================== */}
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

      {/* ==================================================
          MODAL 3: UBAH PROFIL AKUN
          ================================================== */}
      <div
        role="dialog"
        aria-modal={accountModalOpen}
        aria-hidden={!accountModalOpen}
        className={accountModalOpen ? '' : 'pointer-events-none'}
        onClick={() => accountModalOpen && setAccountModalOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(7, 26, 39, 0.55)',
          backdropFilter: accountModalOpen ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: accountModalOpen ? 'blur(8px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          opacity: accountModalOpen ? 1 : 0,
          visibility: accountModalOpen ? 'visible' : 'hidden',
          pointerEvents: accountModalOpen ? 'auto' : 'none',
          transition: 'opacity 0.22s ease, visibility 0.22s ease',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2EDF4',
            borderRadius: '18px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
            transform: accountModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
                PROFIL PENGGUNA
              </span>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0B2D42', margin: '4px 0 0 0' }}>
                Ubah Informasi Akun
              </h3>
            </div>
            <button
              type="button"
              aria-label="Tutup modal edit profil"
              onClick={() => setAccountModalOpen(false)}
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

          <form onSubmit={handleSaveAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="editAccountName" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Nama Lengkap
              </label>
              <input
                id="editAccountName"
                type="text"
                placeholder="Nama lengkap Anda"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
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
              <label htmlFor="editAccountEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Alamat Email
              </label>
              <input
                id="editAccountEmail"
                type="email"
                placeholder="email@domain.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
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

            {accountFormError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '12.5px', padding: '10px 12px', borderRadius: '8px' }}>
                {accountFormError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button type="button" className="btn-secondary" onClick={() => setAccountModalOpen(false)}>
                Batal
              </button>
              <button
                type="submit"
                disabled={savingAccount}
                style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  opacity: savingAccount ? 0.7 : 1,
                }}
              >
                {savingAccount ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==================================================
          FLOATING TOAST NOTIFICATION
          ================================================== */}
      <div
        role="status"
        aria-live="polite"
        className={toast ? '' : 'pointer-events-none'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          pointerEvents: toast ? 'auto' : 'none',
          opacity: toast ? 1 : 0,
          transform: toast ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        {toast && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#0B2D42',
              color: '#FFFFFF',
              padding: '12px 18px',
              borderRadius: '12px',
              borderLeft: `4px solid ${toast.type === 'warning' ? '#F59E0B' : '#7DDCE8'}`,
              boxShadow: '0 14px 35px rgba(7, 26, 39, 0.3)',
              fontSize: '13px',
              fontWeight: 600,
              maxWidth: '380px',
            }}
          >
            <Check size={16} color="#7DDCE8" />
            <span>{toast.text}</span>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              onClick={() => setToast(null)}
              style={{ color: '#94A3B8', marginLeft: '6px' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PengaturanView;
