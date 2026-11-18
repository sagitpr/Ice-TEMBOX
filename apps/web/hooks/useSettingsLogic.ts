import { useState, useEffect, useCallback } from 'react';
import {
  fetchDevices,
  addDevice,
  pairDevice,
  rotateDevicePin,
  getDeviceDetail,
  pingDevice,
  restartTelemetry,
  updateHardwareConfig,
  deleteOrDisconnectDevice,
  fetchAccount,
  updateAccount,
  fetchNotificationSettings,
  toggleNotificationSettings,
  type TemboxDevice,
  type PalkaPlacement,
  type UserAccount,
  type NotificationSettingState,
  type UpdateHardwareConfigPayload,
} from '../lib/services/dashboardService';

export const PALKA_OPTIONS: PalkaPlacement[] = ['Palka Kiri', 'Palka Kanan', 'Palka Utama'];

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'warning';
}

export function useSettingsLogic() {
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

  // Add Device Form State (LCD 1602 Pairing Workflow)
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState(''); // Holds Device ID (e.g. TBX-9F8A21)
  const [newDevicePin, setNewDevicePin] = useState(''); // Holds 6-digit numeric PIN
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

  // Escape key for active modals
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

  // Open Add Device Modal (LCD 1602 Pairing)
  const handleOpenAddModal = useCallback(() => {
    const nextNumber = String(devices.length + 1).padStart(2, '0');
    setNewDeviceName(`Box ${nextNumber}`);
    setNewDeviceIp('');
    setNewDevicePin('');
    setNewDevicePlacement('Palka Utama');
    setAddFormError('');
    setAddModalOpen(true);
  }, [devices.length]);

  // Submit Add Device via LCD 1602 ID + PIN Pairing
  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');

    const cleanName = newDeviceName.trim();
    const cleanId = newDeviceIp.trim();
    const cleanPin = newDevicePin.trim();

    if (!cleanName) {
      setAddFormError('Nama Box / Palka wajib diisi (misal: Box 01 atau Palka Utama).');
      return;
    }
    if (!cleanId) {
      setAddFormError('Device ID (dari LCD 1602) wajib diisi (contoh: TBX-9F8A21).');
      return;
    }
    if (!/^\d{6}$/.test(cleanPin)) {
      setAddFormError('PIN verifikasi harus berupa 6 digit angka dari layar LCD 1602.');
      return;
    }

    setSavingDevice(true);
    try {
      const created = await pairDevice({
        boxName: cleanName,
        deviceId: cleanId,
        pin: cleanPin,
      });

      setDevices((prev) => [...prev.filter((d) => d.id !== created.id && d.serialNumber !== created.serialNumber), created]);
      setAddModalOpen(false);
      showToast(`Perangkat ${created.name} (${created.serialNumber}) berhasil dihubungkan via LCD 1602!`, 'success');
    } catch (err: unknown) {
      setAddFormError(err instanceof Error ? err.message : 'Gagal menghubungkan perangkat.');
    } finally {
      setSavingDevice(false);
    }
  };

  // Rotate Device PIN for re-pairing
  const handleRotatePin = async (deviceId: string): Promise<string> => {
    try {
      const newPin = await rotateDevicePin(deviceId);
      showToast(`PIN baru dibuat: ${newPin}. Masukkan PIN ini pada LCD 1602.`, 'info');
      return newPin;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal merotasi PIN.';
      showToast(msg, 'warning');
      throw err;
    }
  };

  // Open Device Detail Modal
  const handleOpenDetailModal = useCallback(async (deviceId: string) => {
    setDetailActionFeedback('');
    try {
      const detail = await getDeviceDetail(deviceId);
      setSelectedDevice(detail);
      setDetailModalOpen(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat detail perangkat.', 'warning');
    }
  }, [showToast]);

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
  const handleOpenAccountModal = useCallback(() => {
    setEditName(account.fullName);
    setEditEmail(account.email);
    setAccountFormError('');
    setAccountModalOpen(true);
  }, [account]);

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

  // Hardware Config & Disconnect Handlers
  const handleSaveHardwareConfig = async (payload: UpdateHardwareConfigPayload) => {
    try {
      const updated = await updateHardwareConfig(payload);
      setSelectedDevice(updated);
      setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      fetch('/api/iot/device-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: updated.id,
          serialNumber: updated.serialNumber,
          action: 'UPDATE_CONFIG',
          config: {
            telemetryIntervalSec: payload.telemetryIntervalSec,
            sdIntervalSec: payload.sdIntervalSec,
            tempOffset: payload.tempOffset,
            warnThreshold: payload.warnThreshold,
            critThreshold: payload.critThreshold,
            buzzerEnabled: payload.buzzerEnabled,
            placement: payload.placement,
          },
        }),
      }).catch(() => {});

      showToast(`Konfigurasi MQTT untuk ${updated.name} berhasil disimpan dan dikirim.`, 'success');
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi.', 'warning');
      return false;
    }
  };

  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await deleteOrDisconnectDevice(deviceId);
      setDevices((prev) => prev.filter((d) => d.id !== deviceId && d.serialNumber !== deviceId));
      setSelectedDevice(null);
      setDetailModalOpen(false);

      fetch('/api/iot/device-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          action: 'DISCONNECT_DEVICE',
        }),
      }).catch(() => {});

      showToast('Perangkat berhasil diputuskan dan token MQTT dicabut.', 'info');
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal memutuskan perangkat.', 'warning');
      return false;
    }
  };

  return {
    // Entities
    devices,
    account,
    notifSettings,

    // Modal Visibilities
    addModalOpen,
    setAddModalOpen,
    detailModalOpen,
    setDetailModalOpen,
    accountModalOpen,
    setAccountModalOpen,

    // Add Device State (LCD 1602 Pairing)
    newDeviceName,
    setNewDeviceName,
    newDeviceIp,
    setNewDeviceIp,
    newDevicePin,
    setNewDevicePin,
    newDevicePlacement,
    setNewDevicePlacement,
    addFormError,
    savingDevice,
    handleOpenAddModal,
    handleSaveDevice,

    // Device Detail State
    selectedDevice,
    pinging,
    restarting,
    detailActionFeedback,
    handleOpenDetailModal,
    handlePingDevice,
    handleRestartTelemetry,
    handleSaveHardwareConfig,
    handleDisconnectDevice,
    handleRotatePin,

    // Account Edit State
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    accountFormError,
    savingAccount,
    handleOpenAccountModal,
    handleSaveAccount,

    // Toggle Settings
    handleToggleSetting,

    // Toast
    toast,
    setToast,
    showToast,
  };
}
