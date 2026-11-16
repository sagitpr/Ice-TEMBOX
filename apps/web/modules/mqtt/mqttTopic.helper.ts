/**
 * MQTT Session & Topic Isolation Helper
 * Enforces strict per-user and per-device MQTT topic boundaries to prevent
 * cross-tenant / cross-user data leakage.
 */

export interface MqttSessionValidationParams {
  userId: string;
  deviceId: string;
  sessionToken?: string;
}

/**
 * Validates active session parameters before establishing or subscribing to MQTT channels.
 * Throws explicit errors if parameters are missing or invalid.
 */
export function validateMqttSession({ userId, deviceId, sessionToken }: MqttSessionValidationParams): void {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error(
      '[MQTT Security Guard] Akses Ditolak: userId tidak terautentikasi. Koneksi MQTT dihentikan untuk mencegah kebocoran sesi.'
    );
  }

  if (!deviceId || typeof deviceId !== 'string' || !deviceId.trim()) {
    throw new Error(
      '[MQTT Security Guard] Akses Ditolak: deviceId tidak valid. Topik MQTT memerlukan ID node perangkat yang terdaftar.'
    );
  }

  // If a sessionToken is passed, ensure it is non-empty
  if (sessionToken !== undefined && (!sessionToken || !sessionToken.trim())) {
    throw new Error(
      '[MQTT Security Guard] Token otentikasi sesi kedaluwarsa atau tidak valid. Harap login kembali.'
    );
  }
}

/**
 * Generates an isolated telemetry topic:
 * Pattern: `tembox/users/${userId}/devices/${deviceId}/telemetry`
 */
export function getTelemetryTopic(userId: string, deviceId: string, sessionToken?: string): string {
  validateMqttSession({ userId, deviceId, sessionToken });
  const cleanUser = encodeURIComponent(userId.trim().toLowerCase());
  const cleanDevice = encodeURIComponent(deviceId.trim().toUpperCase());
  return `tembox/users/${cleanUser}/devices/${cleanDevice}/telemetry`;
}

/**
 * Generates an isolated control/command topic:
 * Pattern: `tembox/users/${userId}/devices/${deviceId}/command`
 */
export function getControlTopic(userId: string, deviceId: string, sessionToken?: string): string {
  validateMqttSession({ userId, deviceId, sessionToken });
  const cleanUser = encodeURIComponent(userId.trim().toLowerCase());
  const cleanDevice = encodeURIComponent(deviceId.trim().toUpperCase());
  return `tembox/users/${cleanUser}/devices/${cleanDevice}/command`;
}
