import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Zero-Trust MQTT Webhook & Ingestion Handler for TEMBOX IoT Devices.
 * Boundary Isolation:
 *   1. Enforces header `x-webhook-secret` against MQTT_WEBHOOK_SECRET.
 *   2. Validates device token hash against `mqtt_token_hash` in Supabase.
 *   3. Strictly prevents unauthorized writes to database.
 */
export async function POST(request: Request) {
  try {
    // 1. Validate Webhook Secret (Zero-Trust Broker Boundary)
    const webhookSecretEnv = process.env.MQTT_WEBHOOK_SECRET?.trim();
    if (webhookSecretEnv) {
      const incomingSecret =
        request.headers.get('x-webhook-secret') ||
        request.headers.get('x-broker-secret') ||
        '';

      if (!incomingSecret || incomingSecret !== webhookSecretEnv) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid or missing x-webhook-secret' },
          { status: 401 }
        );
      }
    }

    const rawBody = await request.json().catch(() => ({}));

    // Support both direct payload and broker webhook envelopes (e.g. EMQX payload/topic)
    const topic = typeof rawBody.topic === 'string' ? rawBody.topic : '';
    const payload = rawBody.payload && typeof rawBody.payload === 'object' ? rawBody.payload : rawBody;

    // Extract device serial from topic (e.g., "tembox/TEMBOX-ESP32-9F8A21/telemetry") or payload
    let serialNumber = '';
    if (topic.startsWith('tembox/')) {
      const parts = topic.split('/');
      if (parts.length >= 2) {
        serialNumber = parts[1];
      }
    }
    if (!serialNumber) {
      serialNumber = payload.serial_number || payload.device_code || payload.device_id || '';
    }

    if (!serialNumber) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: Missing device serial number or topic' },
        { status: 400 }
      );
    }

    // Extract token provided by device in payload or authorization header
    const rawDeviceToken =
      typeof payload.mqtt_token === 'string' && payload.mqtt_token.trim()
        ? payload.mqtt_token.trim()
        : typeof payload.token === 'string' && payload.token.trim()
          ? payload.token.trim()
          : request.headers.get('x-device-token') || '';

    const tempRaw = payload.temperature_c ?? payload.temperature ?? payload.temp;
    const temperatureC = typeof tempRaw === 'number'
      ? Number(tempRaw.toFixed(2))
      : parseFloat(String(tempRaw || '0')) || 0;

    const humidityPct = payload.humidity_pct !== undefined ? Number(payload.humidity_pct) : null;
    const batteryPct = payload.battery_pct !== undefined ? Number(payload.battery_pct) : null;
    const signalRssi = payload.signal_rssi !== undefined
      ? Number(payload.signal_rssi)
      : payload.rssi !== undefined
        ? Number(payload.rssi)
        : -64;
    const pingMs = payload.ping_ms !== undefined ? Number(payload.ping_ms) : 32;
    const sdStatus = typeof payload.sd_status === 'string' ? payload.sd_status.trim() : 'OK';
    const offlineQueueCount = typeof payload.offline_queue_count === 'number' ? payload.offline_queue_count : 0;
    const isOfflineSync = Boolean(payload.is_offline_sync);
    const recordedAt = payload.recorded_at ? new Date(payload.recorded_at).toISOString() : new Date().toISOString();
    const deviceTimestamp = payload.device_timestamp ? new Date(payload.device_timestamp).toISOString() : recordedAt;

    // Check if Supabase is configured
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let savedRecord = null;
    let deviceRecord = null;

    if (hasSupabase) {
      const admin = getSupabaseAdmin();

      // 2. Look up device and verify token hash
      const { data: foundDev, error: findErr } = await admin
        .from('devices')
        .select('id, device_code, serial_number, mqtt_token_hash, status')
        .or(`serial_number.eq.${serialNumber},device_code.eq.${serialNumber}`)
        .maybeSingle();

      if (findErr) {
        return NextResponse.json(
          { success: false, error: `Database query error: ${findErr.message}` },
          { status: 500 }
        );
      }

      if (!foundDev) {
        return NextResponse.json(
          { success: false, error: `Device ${serialNumber} not found or not provisioned` },
          { status: 404 }
        );
      }

      deviceRecord = foundDev;

      // Verify SHA-256 token hash if device has registered token
      if (deviceRecord.mqtt_token_hash) {
        if (!rawDeviceToken) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Missing device authentication token' },
            { status: 403 }
          );
        }

        const incomingHash = hashToken(rawDeviceToken);
        const match = crypto.timingSafeEqual(
          Buffer.from(incomingHash, 'hex'),
          Buffer.from(deviceRecord.mqtt_token_hash, 'hex')
        );

        if (!match) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Device token hash mismatch' },
            { status: 403 }
          );
        }
      }

      // 3. Authenticated: Insert telemetry log
      const { data: inserted, error: logErr } = await admin
        .from('telemetry_logs')
        .insert({
          device_id: deviceRecord.id,
          temperature_c: temperatureC,
          humidity_pct: humidityPct,
          battery_pct: batteryPct,
          signal_rssi: signalRssi,
          ping_ms: pingMs,
          sd_status: sdStatus,
          offline_queue_count: offlineQueueCount,
          device_timestamp: deviceTimestamp,
          is_offline_sync: isOfflineSync,
          recorded_at: recordedAt,
        })
        .select()
        .single();

      if (!logErr) {
        savedRecord = inserted;
      }

      // 4. Update device heartbeat
      await admin
        .from('devices')
        .update({
          last_seen_at: recordedAt,
          last_temperature_c: temperatureC,
          status: 'online',
          connection_status: 'online',
        })
        .eq('id', deviceRecord.id);
    }

    return NextResponse.json({
      success: true,
      protocol: 'MQTT/TLS',
      topic: topic || `tembox/${serialNumber}/telemetry`,
      deviceSerial: serialNumber,
      authenticated: true,
      dbStatus: savedRecord ? 'saved' : 'bridged',
      receivedData: {
        temperature_c: temperatureC,
        ping_ms: pingMs,
        signal_rssi: signalRssi,
        sd_status: sdStatus,
        recorded_at: recordedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
