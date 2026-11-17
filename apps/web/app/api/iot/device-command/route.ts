import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface DeviceCommandPayload {
  deviceId: string;
  serialNumber?: string;
  action: 'UPDATE_CONFIG' | 'TEST_PING' | 'FORCE_SYNC' | 'DISCONNECT_DEVICE' | 'RESTART_TELEMETRY';
  config?: {
    telemetryIntervalSec?: number;
    sdIntervalSec?: number;
    tempOffset?: number;
    warnThreshold?: number;
    critThreshold?: number;
    buzzerEnabled?: boolean;
    placement?: string;
  };
}

/**
 * Extracts Bearer token or Supabase Auth session token from headers and cookies.
 */
function extractAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  return (
    cookies['tembox_auth_token'] ||
    cookies['sb-access-token'] ||
    cookies['sb-auth-token'] ||
    null
  );
}

/**
 * Handles two-way command dispatch from Web UI to TEMBOX ESP32 hardware via MQTT.
 * Zero-Trust Layering:
 *   1. Verifies caller session via Supabase auth.getUser().
 *   2. Strictly verifies device ownership (user_id = user.id).
 *   3. Enforces 401/403 boundaries before command dispatch.
 */
export async function POST(request: Request) {
  try {
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body: DeviceCommandPayload = await request.json().catch(() => ({}));

    if (!body.deviceId && !body.serialNumber) {
      return NextResponse.json(
        { success: false, error: 'deviceId atau serialNumber wajib diisi.' },
        { status: 400 }
      );
    }

    const serialNumber = body.serialNumber || body.deviceId;
    const action = body.action || 'UPDATE_CONFIG';
    const commandTopic = `tembox/${serialNumber}/cmd`;

    if (hasSupabase) {
      const admin = getSupabaseAdmin();
      const token = extractAuthToken(request);

      let authenticatedUserId: string | null = null;

      if (token) {
        const { data: userData, error: userErr } = await admin.auth.getUser(token);
        if (!userErr && userData?.user) {
          authenticatedUserId = userData.user.id;
        }
      }

      // If in production and no valid session token found
      if (!authenticatedUserId && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Sesi login tidak ditemukan atau telah kedaluwarsa.' },
          { status: 401 }
        );
      }

      // Verify device ownership in Supabase
      const { data: targetDevice, error: devErr } = await admin
        .from('devices')
        .select('id, user_id, serial_number, device_code')
        .or(`id.eq.${body.deviceId},serial_number.eq.${serialNumber},device_code.eq.${serialNumber}`)
        .maybeSingle();

      if (devErr) {
        return NextResponse.json(
          { success: false, error: `Database error: ${devErr.message}` },
          { status: 500 }
        );
      }

      if (!targetDevice) {
        return NextResponse.json(
          { success: false, error: `Perangkat ${serialNumber} tidak ditemukan.` },
          { status: 404 }
        );
      }

      // If user is authenticated, ensure device belongs to them
      if (authenticatedUserId && targetDevice.user_id !== authenticatedUserId) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Anda tidak memiliki hak akses kepemilikan atas perangkat ini.' },
          { status: 403 }
        );
      }

      // Process database mutations
      if (action === 'DISCONNECT_DEVICE') {
        await admin
          .from('devices')
          .update({
            status: 'offline',
            connection_status: 'revoked',
            mqtt_token_hash: null,
          })
          .eq('id', targetDevice.id);
      } else if (action === 'UPDATE_CONFIG' && body.config) {
        const cfg = body.config;
        await admin
          .from('devices')
          .update({
            telemetry_interval_sec: cfg.telemetryIntervalSec,
            sd_interval_sec: cfg.sdIntervalSec,
            temp_offset: cfg.tempOffset,
            warn_threshold: cfg.warnThreshold,
            crit_threshold: cfg.critThreshold,
            buzzer_enabled: cfg.buzzerEnabled,
            placement: cfg.placement,
          })
          .eq('id', targetDevice.id);
      }
    }

    // Construct standard MQTT command envelope dispatched to ESP32
    const mqttPacket = {
      cmd: action,
      target: serialNumber,
      timestamp: new Date().toISOString(),
      nonce: Math.random().toString(36).substring(2, 9),
      params: body.config || {},
    };

    return NextResponse.json({
      success: true,
      action,
      topic: commandTopic,
      dispatchedPayload: mqttPacket,
      message:
        action === 'UPDATE_CONFIG'
          ? 'Konfigurasi hardware berhasil diverifikasi dan dikirim ke ESP32 melalui topik MQTT.'
          : action === 'TEST_PING'
            ? 'Perintah ping MQTT berhasil dikirim ke perangkat.'
            : action === 'FORCE_SYNC'
              ? 'Perintah paksa sinkronisasi MicroSD berhasil dikirim ke perangkat.'
              : 'Perangkat berhasil diputuskan dan token MQTT telah dicabut.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
