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
  lastSeenAt?: string | null;
  isPaired?: boolean;
}

export interface PairDevicePayload {
  boxName: string;
  deviceId: string;
  pin: string;
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
  severity: 'warning' | 'info' | 'success' | 'critical';
  category?: 'warning' | 'system' | 'info';
  unread: boolean;
  deviceId?: string | null;
  deviceName?: string | null;
  placement?: string | null;
  triggerValue?: string | null;
  channelSent?: string | null;
  actionType?: 'mute_buzzer' | 'view_diagnostics' | 'check_graph' | string | null;
  createdAt?: string;
}

// In-memory store
interface StoreState {
  devices: TemboxDevice[];
  account: UserAccount;
  notifSettings: NotificationSettingState;
  notifications: HeaderNotificationItem[];
}

const DEFAULT_STORE: StoreState = {
  devices: [],
  account: {
    fullName: 'Pengguna TEMBOX',
    email: 'user@tembox.id',
    role: 'Pemilik Armada / Operator TPI',
  },
  notifSettings: {
    thermalAlertEnabled: true,
    autoCloudSyncEnabled: true,
  },
  notifications: [],
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

// Service functions

export async function fetchDevices(): Promise<TemboxDevice[]> {
  try {
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/iot/devices');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.devices)) {
          const store = getStore();
          store.devices = data.devices;
          return data.devices;
        }
      }
    }
  } catch {}
  await simulateNetworkDelay(160);
  return getStore().devices.map((d) => {
    const { mqttToken, ...safeDevice } = d;
    return safeDevice;
  });
}

export async function pairDevice(payload: PairDevicePayload): Promise<TemboxDevice> {
  const cleanName = payload.boxName.trim();
  const cleanSerial = payload.deviceId.trim().toUpperCase();

  const res = await fetch('/api/iot/pair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'pair',
      boxName: cleanName,
      deviceId: cleanSerial,
      pin: payload.pin,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Gagal menghubungkan perangkat.');
  }

  const pairedDev: TemboxDevice = {
    id: data.deviceId || cleanSerial,
    name: cleanName,
    serialNumber: cleanSerial,
    ipOrSerial: cleanSerial,
    placement: cleanName as PalkaPlacement,
    status: 'offline', // Honest status: stays offline until physical telemetry heartbeat arrives
    firmwareEsp32: 'v2.4.1-iot-marine',
    firmwareDs18b20: 'Probe Rev.3.2 (±0.5°C)',
    microSdIntervalSec: 15,
    telemetryIntervalSec: 30,
    tempOffset: 0.0,
    warnThreshold: 2.0,
    critThreshold: 4.0,
    buzzerEnabled: true,
    mqttTopicTelemetry: `tembox/${cleanSerial}/telemetry`,
    mqttTopicCmd: `tembox/${cleanSerial}/cmd`,
    lastTemperatureC: null,
    lastPingMs: null,
    lastSyncAt: 'Baru saja di-pair via LCD 1602',
    lastSeenAt: null,
    isPaired: true,
  };

  const store = getStore();
  store.devices = [...store.devices.filter((d) => d.id !== pairedDev.id && d.serialNumber !== pairedDev.serialNumber), pairedDev];
  emitStoreEvent('tembox:devices-updated', store.devices);
  return pairedDev;
}

export async function rotateDevicePin(deviceId: string): Promise<string> {
  const res = await fetch('/api/iot/pair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'rotate_pin',
      deviceId,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Gagal merotasi PIN.');
  }
  return data.newPin;
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
  try {
    await fetch('/api/iot/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unpair', deviceId }),
    });
  } catch {}
  await simulateNetworkDelay(200);
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
  try {
    const res = await fetch('/api/notifications', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.notifications)) {
        const mapped: HeaderNotificationItem[] = data.notifications.map((n: {
          id: string;
          title: string;
          message: string;
          severity?: 'warning' | 'info' | 'success' | 'critical';
          category?: 'warning' | 'system' | 'info';
          is_read?: boolean;
          unread?: boolean;
          device_id?: string;
          device_name?: string;
          placement?: string;
          trigger_value?: string;
          channel_sent?: string;
          action_type?: string;
          created_at?: string;
        }) => {
          const recDate = n.created_at ? new Date(n.created_at) : new Date();
          const timeStr = recDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
          return {
            id: String(n.id),
            title: n.title,
            message: n.message,
            time: timeStr,
            severity: n.severity || 'info',
            category: n.category || (n.severity === 'critical' || n.severity === 'warning' ? 'warning' : 'info'),
            unread: n.is_read !== undefined ? !n.is_read : (n.unread ?? true),
            deviceId: n.device_id || null,
            deviceName: n.device_name || null,
            placement: n.placement || null,
            triggerValue: n.trigger_value || null,
            channelSent: n.channel_sent || 'Terkirim via Email & WA',
            actionType: n.action_type || 'view_diagnostics',
            createdAt: n.created_at || new Date().toISOString(),
          };
        });
        const store = getStore();
        store.notifications = mapped;
        return mapped;
      }
    }
  } catch {
    // Fall back to local store
  }
  return getStore().notifications.map((n) => ({ ...n }));
}

export async function markAllHeaderNotificationsRead(): Promise<HeaderNotificationItem[]> {
  try {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  } catch {}

  const store = getStore();
  store.notifications = store.notifications.map((n) => ({ ...n, unread: false }));
  emitStoreEvent('tembox:notifications-updated', store.notifications);
  return store.notifications.map((n) => ({ ...n }));
}

export async function clearReadNotifications(): Promise<HeaderNotificationItem[]> {
  try {
    await fetch('/api/notifications', { method: 'DELETE' });
  } catch {}

  const store = getStore();
  store.notifications = store.notifications.filter((n) => n.unread);
  emitStoreEvent('tembox:notifications-updated', store.notifications);
  return store.notifications.map((n) => ({ ...n }));
}

