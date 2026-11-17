import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

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
 * GET /api/iot/devices
 * Lists devices safely: NEVER exposes raw mqtt_token or mqtt_token_hash.
 */
export async function GET(request: Request) {
  try {
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      // Return empty list when Supabase is not configured (honest state, no fake devices)
      return NextResponse.json({
        success: true,
        devices: [],
      });
    }

    const admin = getSupabaseAdmin();
    const token = extractAuthToken(request);

    let userId: string | null = null;
    if (token) {
      const { data: userData } = await admin.auth.getUser(token);
      if (userData?.user) {
        userId = userData.user.id;
      }
    }

    let query = admin
      .from('devices')
      .select(`
        id,
        device_code,
        device_name,
        serial_number,
        placement,
        status,
        telemetry_interval_sec,
        sd_interval_sec,
        temp_offset,
        warn_threshold,
        crit_threshold,
        buzzer_enabled,
        firmware_esp32,
        firmware_ds18b20,
        last_temperature_c,
        last_seen_at
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: devices, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Sanitize output: ensure NO token or hash field is present
    const sanitized = (devices || []).map((dev) => ({
      id: dev.id,
      name: dev.device_name,
      device_name: dev.device_name,
      device_code: dev.device_code,
      serial_number: dev.serial_number || dev.device_code,
      serialNumber: dev.serial_number || dev.device_code,
      placement: dev.placement,
      status: dev.status,
      telemetryIntervalSec: dev.telemetry_interval_sec ?? 30,
      sdIntervalSec: dev.sd_interval_sec ?? 15,
      tempOffset: Number(dev.temp_offset ?? 0),
      warnThreshold: Number(dev.warn_threshold ?? 2.0),
      critThreshold: Number(dev.crit_threshold ?? 4.0),
      buzzerEnabled: Boolean(dev.buzzer_enabled ?? true),
      firmwareEsp32: dev.firmware_esp32,
      firmwareDs18b20: dev.firmware_ds18b20,
      mqttTopicTelemetry: `tembox/${dev.serial_number || dev.device_code}/telemetry`,
      mqttTopicCmd: `tembox/${dev.serial_number || dev.device_code}/cmd`,
      lastTemperatureC: dev.last_temperature_c ? Number(dev.last_temperature_c) : null,
      lastSyncAt: dev.last_seen_at ? new Date(dev.last_seen_at).toLocaleString('id-ID') : 'Belum ada data',
    }));

    return NextResponse.json({
      success: true,
      devices: sanitized,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/iot/devices
 * Provisions a new device.
 * Stores ONLY the SHA-256 hash in database.
 * Returns raw mqtt_token ONLY ONCE in the response.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const cleanName = typeof body.name === 'string' ? body.name.trim() : '';
    const cleanSerial = typeof body.serialNumber === 'string' ? body.serialNumber.trim() : '';
    const placement = typeof body.placement === 'string' ? body.placement.trim() : 'Palka Utama';

    if (!cleanName) {
      return NextResponse.json({ success: false, error: 'Nama perangkat wajib diisi.' }, { status: 400 });
    }
    if (!cleanSerial) {
      return NextResponse.json({ success: false, error: 'Serial number / MAC ID wajib diisi.' }, { status: 400 });
    }

    // 1. Generate one-time raw token
    const oneTimeRawToken = `tbk_live_${crypto.randomBytes(12).toString('hex')}`;
    const tokenHash = hashToken(oneTimeRawToken);

    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let createdId = cleanSerial;

    if (hasSupabase) {
      const admin = getSupabaseAdmin();
      const token = extractAuthToken(request);

      let userId = '00000000-0000-0000-0000-000000000000';
      if (token) {
        const { data: userData } = await admin.auth.getUser(token);
        if (userData?.user) {
          userId = userData.user.id;
        }
      }

      // Insert device with SHA-256 hash
      const { data: inserted, error } = await admin
        .from('devices')
        .insert({
          user_id: userId,
          device_code: cleanSerial,
          device_name: cleanName,
          serial_number: cleanSerial,
          placement: placement,
          mqtt_token_hash: tokenHash,
          telemetry_interval_sec: 30,
          sd_interval_sec: 15,
          temp_offset: 0.0,
          warn_threshold: 2.0,
          crit_threshold: 4.0,
          buzzer_enabled: true,
          status: 'online',
          connection_status: 'online',
        })
        .select('id')
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      if (inserted) {
        createdId = inserted.id;
      }
    }

    return NextResponse.json({
      success: true,
      deviceId: createdId,
      name: cleanName,
      serialNumber: cleanSerial,
      placement,
      mqttBroker: {
        host: 'mqtt.tembox.id',
        port: 8883,
        protocol: 'mqtts',
        telemetryTopic: `tembox/${cleanSerial}/telemetry`,
        cmdTopic: `tembox/${cleanSerial}/cmd`,
      },
      // DISPLAYED ONLY ONCE:
      oneTimeProvisioningToken: oneTimeRawToken,
      securityNotice: 'PERINGATAN: Token otentikasi MQTT ini hanya ditampilkan satu kali saat registrasi. Simpan token ini sekarang di tempat aman.',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
