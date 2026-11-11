// Centralized Dashboard & Settings Service Layer
// Provides clean, promise-based handlers backed by local reactive mock state,
// ready to be swapped seamlessly with live Supabase / Next.js API endpoints.

export type PalkaPlacement = 'Palka Kiri' | 'Palka Kanan' | 'Palka Utama';

export interface TemboxDevice {
  id: string;
  name: string;
  ipOrSerial: string;
  placement: PalkaPlacement;
  status: 'online' | 'offline';
  firmwareEsp32: string;
  firmwareDs18b20: string;
  microSdIntervalSec: number;
  lastTemperatureC: number | null;
  lastPingMs: number | null;
  lastSyncAt: string;
}

export interface AddDevicePayload {
  name: string;
  ipOrSerial: string;
  placement: PalkaPlacement;
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
      ipOrSerial: '192.168.1.18',
      placement: 'Palka Utama',
      status: 'offline',
      firmwareEsp32: 'v2.4.1-iot-marine',
      firmwareDs18b20: 'Probe Rev.3.2 (±0.5°C)',
      microSdIntervalSec: 30,
      lastTemperatureC: -0.4,
      lastPingMs: null,
      lastSyncAt: 'Hari ini, 07:42 WIB',
    },
  ],
  account: {
    fullName: 'Nelayan',
    email: 'nelayan@example.com',
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
      win.__TEMBOX_DASHBOARD_STORE__ = {
        devices: DEFAULT_STORE.devices.map((d) => ({ ...d })),
        account: { ...DEFAULT_STORE.account },
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
  return getStore().devices.map((d) => ({ ...d }));
}

export async function addDevice(deviceData: AddDevicePayload): Promise<TemboxDevice> {
  await simulateNetworkDelay(260);
  const store = getStore();
  const cleanName = deviceData.name.trim();
  const cleanAddr = deviceData.ipOrSerial.trim();

  if (!cleanName) {
    throw new Error('Nama perangkat tidak boleh kosong.');
  }
  if (!cleanAddr) {
    throw new Error('Alamat IP atau Serial ESP32 wajib diisi.');
  }

  const newDevice: TemboxDevice = {
    id: `${cleanName.toUpperCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
    name: cleanName,
    ipOrSerial: cleanAddr,
    placement: deviceData.placement,
    status: 'online',
    firmwareEsp32: 'v2.4.1-iot-marine',
    firmwareDs18b20: 'Probe Rev.3.2 (±0.5°C)',
    microSdIntervalSec: 30,
    lastTemperatureC: -0.6,
    lastPingMs: 24,
    lastSyncAt: 'Baru saja tersinkronisasi',
  };

  store.devices = [...store.devices, newDevice];
  emitStoreEvent('tembox:devices-updated', store.devices);
  return { ...newDevice };
}

export async function getDeviceDetail(deviceId: string): Promise<TemboxDevice> {
  await simulateNetworkDelay(140);
  const store = getStore();
  const found = store.devices.find((d) => d.id === deviceId);
  if (!found) {
    throw new Error(`Perangkat ${deviceId} tidak ditemukan.`);
  }
  return { ...found };
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

