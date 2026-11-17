// Centralized Dashboard & Settings Service Layer
// Provides clean, promise-based handlers backed by local reactive mock state,
// ready to be swapped seamlessly with live Supabase / Next.js API endpoints.

export type PalkaPlacement = 'Palka Kiri' | 'Palka Kanan' | 'Palka Utama';

export interface TemboxDevice {
  id: string;
  name: string;
  serialNumber: string;
  ipOrSerial?: string;
  placement: PalkaPlacement;
  status: 'online' | 'offline';
  firmwareEsp32: string;
  firmwareDs18b20: string;
  microSdIntervalSec: number;
  telemetryIntervalSec: number;
  tempOffset: number;
  warnThreshold: number;
  critThreshold: number;
  buzzerEnabled: boolean;
  mqttToken?: string;
  mqttTokenHash?: string;
  mqttTopicTelemetry: string;
  mqttTopicCmd: string;
  lastTemperatureC: number | null;
  lastPingMs: number | null;
  lastSyncAt: string;
}

export interface AddDevicePayload {
  name: string;
  serialNumber: string;
  ipOrSerial?: string;
  placement: PalkaPlacement;
  mqttToken?: string;
}

export interface UpdateHardwareConfigPayload {
  deviceId: string;
  telemetryIntervalSec: number;
  sdIntervalSec: number;
  tempOffset: number;
  warnThreshold: number;
  critThreshold: number;
  buzzerEnabled: boolean;
  placement?: PalkaPlacement;
}

export interface UserAccount {
  fullName: string;
  email: string;
  role: string;
}

export interface UpdateAccountPayload {
  fullName: string;
  email: string;
}

export interface NotificationSettingState {
  thermalAlertEnabled: boolean;
  autoCloudSyncEnabled: boolean;
}

export interface HeaderNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  severity: 'warning' | 'info' | 'success';
  unread: boolean;
}

// ==================================================
// IN-MEMORY MOCK STORE (Persisted across SPA tab switches & route changes via window)
// ==================================================
interface StoreState {
  devices: TemboxDevice[];
  account: UserAccount;
  notifSettings: NotificationSettingState;
  notifications: HeaderNotificationItem[];
}

const DEFAULT_STORE: StoreState = {
  devices: [
    {
      id: 'TEMBOX-001',
      name: 'TEMBOX-001',
      serialNumber: 'TEMBOX-ESP32-9F8A21',
      ipOrSerial: 'TEMBOX-ESP32-9F8A21',
      placement: 'Palka Utama',
      status: 'online',
      firmwareEsp32: 'v2.4.1-iot-marine',
      firmwareDs18b20: 'Probe Rev.3.2 (±0.5°C)',
      microSdIntervalSec: 15,
      telemetryIntervalSec: 30,
      tempOffset: 0.0,
      warnThreshold: 2.0,
      critThreshold: 4.0,
      buzzerEnabled: true,
      mqttToken: 'tbk_live_9f8a21e48bc0981a',
      mqttTopicTelemetry: 'tembox/TEMBOX-ESP32-9F8A21/telemetry',
      mqttTopicCmd: 'tembox/TEMBOX-ESP32-9F8A21/cmd',
      lastTemperatureC: -0.4,
      lastPingMs: 34,
      lastSyncAt: 'Hari ini, 14:32 WIB',
    },
  ],
  account: {
    fullName: 'Pengguna TEMBOX',
    email: 'user@tembox.id',
    role: 'Pemilik Armada / Operator TPI',
  },
  notifSettings: {
    thermalAlertEnabled: true,
    autoCloudSyncEnabled: true,
  },
  notifications: [
    {
      id: 'notif-1',
      title: 'Suhu Palka Utama Stabil (-0.4°C)',
      message: 'TEMBOX-001 mencatat kondisi es optimal untuk tangkapan pelayaran.',
      time: '12 menit lalu',
      severity: 'success',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Peringatan Pencairan Es Bertahap',
      message: 'Suhu palka terdeteksi naik +0.8°C dalam 2 jam terakhir. Siapkan es cadangan.',
      time: '1 jam lalu',
      severity: 'warning',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Log Offline MicroSD Tersinkronisasi',
      message: '148 titik data telemetri berhasil diunggah saat kapal mendekati pelabuhan.',
      time: '3 jam lalu',
      severity: 'info',
      unread: false,
    },
  ],
};

const getStore = (): StoreState => {
  if (typeof window !== 'undefined') {
    const win = window as unknown as { __TEMBOX_DASHBOARD_STORE__?: StoreState };
    if (!win.__TEMBOX_DASHBOARD_STORE__) {
      let initialAccount = { ...DEFAULT_STORE.account };
      try {
        const rawAuth = localStorage.getItem('tembox_auth_session');
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth);
          if (parsed.name) initialAccount.fullName = parsed.name;
          if (parsed.email) initialAccount.email = parsed.email;
        }
      } catch {}

      win.__TEMBOX_DASHBOARD_STORE__ = {
        devices: DEFAULT_STORE.devices.map((d) => ({ ...d })),
        account: initialAccount,
        notifSettings: { ...DEFAULT_STORE.notifSettings },
        notifications: DEFAULT_STORE.notifications.map((n) => ({ ...n })),
      };
    }
    return win.__TEMBOX_DASHBOARD_STORE__;
  }
  return DEFAULT_STORE;
};

const simulateNetworkDelay = (ms = 220) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const emitStoreEvent = (eventName: string, detail?: unknown) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
};

// ==================================================
// EXPORTED SERVICE FUNCTIONS
// ==================================================

export async function fetchDevices(): Promise<TemboxDevice[]> {
  await simulateNetworkDelay(160);
  // Zero-trust sanitization: Never leak raw MQTT token to standard device lists
  return getStore().devices.map((d) => {
    const { mqttToken, ...safeDevice } = d;
    return safeDevice;
  });
}

export async function addDevice(deviceData: AddDevicePayload): Promise<TemboxDevice> {
  await simulateNetworkDelay(260);
  const store = getStore();
  const cleanName = deviceData.name.trim();
  const cleanSerial = (deviceData.serialNumber || deviceData.ipOrSerial || '').trim();

  if (!cleanName) {
    throw new Error('Nama perangkat tidak boleh kosong.');
  }
  if (!cleanSerial) {
    throw new Error('Device Serial / MAC ID wajib diisi.');
  }

  const generatedToken = deviceData.mqttToken || `tbk_live_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).slice(-4)}`;
  const teleTopic = `tembox/${cleanSerial}/telemetry`;
  const cmdTopic = `tembox/${cleanSerial}/cmd`;

  const newDevice: TemboxDevice = {
    id: cleanSerial,
    name: cleanName,
    serialNumber: cleanSerial,
    ipOrSerial: cleanSerial,
    placement: deviceData.placement,
    status: 'online',
    firmwareEsp32: 'v2.4.1-iot-marine',
    firmwareDs18b20: 'Probe Rev.3.2 (±0.5°C)',
    microSdIntervalSec: 15,
    telemetryIntervalSec: 30,
    tempOffset: 0.0,
    warnThreshold: 2.0,
    critThreshold: 4.0,
    buzzerEnabled: true,
    mqttToken: generatedToken,
    mqttTopicTelemetry: teleTopic,
    mqttTopicCmd: cmdTopic,
    lastTemperatureC: -0.4,
    lastPingMs: 28,
    lastSyncAt: 'Baru saja terdaftar via MQTT',
  };

  store.devices = [...store.devices, newDevice];
  emitStoreEvent('tembox:devices-updated', store.devices);
  return { ...newDevice };
}

export async function updateHardwareConfig(payload: UpdateHardwareConfigPayload): Promise<TemboxDevice> {
  await simulateNetworkDelay(240);
  const store = getStore();
  const idx = store.devices.findIndex((d) => d.id === payload.deviceId || d.serialNumber === payload.deviceId);
  if (idx === -1) {
    throw new Error(`Perangkat ${payload.deviceId} tidak ditemukan.`);
  }

  store.devices[idx] = {
    ...store.devices[idx],
    telemetryIntervalSec: payload.telemetryIntervalSec,
    microSdIntervalSec: payload.sdIntervalSec,
    tempOffset: payload.tempOffset,
    warnThreshold: payload.warnThreshold,
    critThreshold: payload.critThreshold,
    buzzerEnabled: payload.buzzerEnabled,
    placement: payload.placement || store.devices[idx].placement,
    lastSyncAt: 'Konfigurasi MQTT dikirim barusan',
  };

  emitStoreEvent('tembox:devices-updated', store.devices);
  return { ...store.devices[idx] };
}

export async function deleteOrDisconnectDevice(deviceId: string): Promise<void> {
  await simulateNetworkDelay(280);
  const store = getStore();
  store.devices = store.devices.filter((d) => d.id !== deviceId && d.serialNumber !== deviceId);
  emitStoreEvent('tembox:devices-updated', store.devices);
}

export async function getDeviceDetail(deviceId: string): Promise<TemboxDevice> {
  await simulateNetworkDelay(140);
  const store = getStore();
  const found = store.devices.find((d) => d.id === deviceId || d.serialNumber === deviceId);
  if (!found) {
    throw new Error(`Perangkat ${deviceId} tidak ditemukan.`);
  }
  const { mqttToken, ...safeDetail } = found;
  return { ...safeDetail };
}

export async function pingDevice(deviceId: string): Promise<{ latencyMs: number; device: TemboxDevice }> {
  await simulateNetworkDelay(380);
  const store = getStore();
  const idx = store.devices.findIndex((d) => d.id === deviceId);
  if (idx === -1) {
    throw new Error(`Perangkat ${deviceId} tidak ditemukan.`);
  }
  const latencyMs = Math.floor(14 + Math.random() * 28);
  store.devices[idx] = {
    ...store.devices[idx],
    status: 'online',
    lastPingMs: latencyMs,
    lastSyncAt: 'Baru saja (Ping OK)',
  };
  emitStoreEvent('tembox:devices-updated', store.devices);
  return { latencyMs, device: { ...store.devices[idx] } };
}

export async function restartTelemetry(deviceId: string): Promise<TemboxDevice> {
  await simulateNetworkDelay(420);
  const store = getStore();
  const idx = store.devices.findIndex((d) => d.id === deviceId);
  if (idx === -1) {
    throw new Error(`Perangkat ${deviceId} tidak ditemukan.`);
  }
  store.devices[idx] = {
    ...store.devices[idx],
    status: 'online',
    lastSyncAt: 'Telemetri dimulai ulang barusan',
  };
  emitStoreEvent('tembox:devices-updated', store.devices);
  return { ...store.devices[idx] };
}

export async function fetchAccount(): Promise<UserAccount> {
  await simulateNetworkDelay(100);
  return { ...getStore().account };
}

export async function updateAccount(accountData: UpdateAccountPayload): Promise<UserAccount> {
  await simulateNetworkDelay(240);
  const cleanName = accountData.fullName.trim();
  const cleanEmail = accountData.email.trim();

  if (!cleanName) {
    throw new Error('Nama lengkap wajib diisi.');
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Format alamat email tidak valid.');
  }

  const store = getStore();
  store.account = {
    ...store.account,
    fullName: cleanName,
    email: cleanEmail,
  };

  if (typeof window !== 'undefined') {
    try {
      const rawAuth = localStorage.getItem('tembox_auth_session');
      if (rawAuth) {
        const parsed = JSON.parse(rawAuth);
        parsed.name = cleanName;
        parsed.email = cleanEmail;
        localStorage.setItem('tembox_auth_session', JSON.stringify(parsed));
        localStorage.setItem('tembox_user_profile', JSON.stringify({ fullName: cleanName, email: cleanEmail }));
        window.dispatchEvent(new CustomEvent('tembox:auth-changed', { detail: parsed }));
      }
    } catch {}
  }

  emitStoreEvent('tembox:account-updated', store.account);
  return { ...store.account };
}

export async function fetchNotificationSettings(): Promise<NotificationSettingState> {
  await simulateNetworkDelay(100);
  return { ...getStore().notifSettings };
}

export async function toggleNotificationSettings(
  key: keyof NotificationSettingState,
  value: boolean
): Promise<NotificationSettingState> {
  await simulateNetworkDelay(180);
  const store = getStore();
  store.notifSettings = {
    ...store.notifSettings,
    [key]: value,
  };
  emitStoreEvent('tembox:notif-settings-updated', store.notifSettings);
  return { ...store.notifSettings };
}

export async function fetchHeaderNotifications(): Promise<HeaderNotificationItem[]> {
  await simulateNetworkDelay(100);
  return getStore().notifications.map((n) => ({ ...n }));
}

export async function markAllHeaderNotificationsRead(): Promise<HeaderNotificationItem[]> {
  await simulateNetworkDelay(120);
  const store = getStore();
  store.notifications = store.notifications.map((n) => ({ ...n, unread: false }));
  emitStoreEvent('tembox:notifications-updated', store.notifications);
  return store.notifications.map((n) => ({ ...n }));
}

