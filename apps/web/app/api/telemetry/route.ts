import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function deriveHmacSecret(deviceId: string): string {
  const masterKey = process.env.IOT_HMAC_MASTER_KEY || 'tembox-master-secret-key-2026';
  return crypto.createHmac('sha256', masterKey).update(deviceId.trim().toUpperCase()).digest('hex');
}

export async function POST(request: Request) {
  try {
    const rawBodyText = await request.text();
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Payload bukan format JSON yang valid.' },
        { status: 400 }
      );
    }

    const deviceCode = typeof body.device_code === 'string' && body.device_code.trim()
      ? body.device_code.trim()
      : typeof body.device_id === 'string' && body.device_id.trim()
        ? body.device_id.trim()
        : 'ESP32-TEMBOX-01';

    // 1. Signature & RTC Timestamp Validation
    const signatureHeader = request.headers.get('x-tembox-signature') || (body.signature as string | undefined);
    const rtcTimestampHeader = request.headers.get('x-tembox-timestamp') || (body.device_timestamp as string | undefined);

    if (signatureHeader) {
      const secret = deriveHmacSecret(deviceCode);
      const computedSig = crypto.createHmac('sha256', secret).update(rawBodyText).digest('hex');
      // Timing-safe compare
      const sigBuf = Buffer.from(signatureHeader, 'hex');
      const compBuf = Buffer.from(computedSig, 'hex');
      if (sigBuf.length !== compBuf.length || !crypto.timingSafeEqual(sigBuf, compBuf)) {
        return NextResponse.json(
          { success: false, error: 'Signature HMAC-SHA256 tidak valid atau kunci pairing tidak cocok.' },
          { status: 401 }
        );
      }
    }

    // Check RTC timestamp if provided
    if (rtcTimestampHeader) {
      const rtcTime = new Date(rtcTimestampHeader).getTime();
      if (isNaN(rtcTime)) {
        return NextResponse.json(
          { success: false, error: 'Timestamp RTC DS3231 tidak valid.' },
          { status: 400 }
        );
      }
      // Clock skew check (allow reasonable window e.g. 24 hours for offline sync logs)
      const diffHours = Math.abs(Date.now() - rtcTime) / (1000 * 60 * 60);
      if (diffHours > 720 && !body.is_offline_sync) {
        return NextResponse.json(
          { success: false, error: 'Timestamp RTC DS3231 melebihi toleransi drift waktu sistem.' },
          { status: 400 }
        );
      }
    }

    const tempRaw = body.temperature_c ?? body.temperature ?? body.temp;
    const temperatureC = typeof tempRaw === 'number'
      ? Number(tempRaw.toFixed(2))
      : parseFloat(String(tempRaw || '0')) || 0;

    const humidityPct = body.humidity_pct !== undefined ? Number(body.humidity_pct) : null;
    const batteryPct = body.battery_pct !== undefined ? Number(body.battery_pct) : null;
    const signalRssi = body.signal_rssi !== undefined
      ? Number(body.signal_rssi)
      : body.rssi !== undefined
        ? Number(body.rssi)
        : -65;
    const pingMs = body.ping_ms !== undefined ? Number(body.ping_ms) : null;
    const sdStatus = typeof body.sd_status === 'string' ? body.sd_status.trim() : 'OK';
    const offlineQueueCount = typeof body.offline_queue_count === 'number' ? body.offline_queue_count : 0;
    const isOfflineSync = Boolean(body.is_offline_sync);
    const recordedAt = body.recorded_at ? new Date(String(body.recorded_at)).toISOString() : new Date().toISOString();
    const deviceTimestamp = rtcTimestampHeader ? new Date(rtcTimestampHeader).toISOString() : recordedAt;

    // Check if Supabase is configured
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let savedRecord = null;
    let dbStatus = 'unconfigured';

    if (hasSupabase) {
      try {
        const admin = getSupabaseAdmin();

        // 1. Look up device by code
        let { data: device, error: devErr } = await admin
          .from('devices')
          .select('id, device_code, status, is_paired')
          .eq('device_code', deviceCode)
          .maybeSingle();

        if (devErr) {
          console.warn('[Telemetry API] Error looking up device:', devErr.message);
        }

        // Auto-provision device if not found
        if (!device) {
          const { data: firstProfile } = await admin
            .from('profiles')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (firstProfile) {
            const { data: createdDevice } = await admin
              .from('devices')
              .insert({
                user_id: firstProfile.id,
                device_code: deviceCode,
                device_name: deviceCode,
                status: 'online',
                connection_status: 'online',
                last_temperature_c: temperatureC,
                last_seen_at: new Date().toISOString(),
                is_paired: true,
              })
              .select('id, device_code, status, is_paired')
              .maybeSingle();

            if (createdDevice) {
              device = createdDevice;
            }
          }
        }

        if (device) {
          // Update device status & last temperature & last_seen_at heartbeat
          await admin
            .from('devices')
            .update({
              status: 'online',
              connection_status: 'online',
              last_temperature_c: temperatureC,
              last_seen_at: new Date().toISOString(),
            })
            .eq('id', device.id);

          // 2. Insert telemetry log
          const logPayloadWithExtensions: Record<string, unknown> = {
            device_id: device.id,
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
          };

          const { data: inserted, error: insertErr } = await admin
            .from('telemetry_logs')
            .insert(logPayloadWithExtensions)
            .select()
            .maybeSingle();

          if (insertErr) {
            console.warn('[Telemetry API] Extended insert fallback to base:', insertErr.message);
            const basePayload = {
              device_id: device.id,
              temperature_c: temperatureC,
              humidity_pct: humidityPct,
              battery_pct: batteryPct,
              signal_rssi: signalRssi,
              is_offline_sync: isOfflineSync,
              recorded_at: recordedAt,
            };
            const { data: baseInserted } = await admin
              .from('telemetry_logs')
              .insert(basePayload)
              .select()
              .maybeSingle();

            savedRecord = baseInserted;
          } else {
            savedRecord = inserted;
          }

          dbStatus = 'persisted';
        }
      } catch (dbErr) {
        console.error('[Telemetry API Database Error]:', dbErr);
        dbStatus = 'db_error';
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data telemetri berhasil diterima dan diverifikasi.',
      status: 'success',
      dbStatus,
      data: {
        deviceCode,
        temperatureC,
        humidityPct,
        signalRssi,
        pingMs,
        sdStatus,
        offlineQueueCount,
        deviceTimestamp,
        recordedAt,
        recordId: savedRecord ? (savedRecord as { id?: number }).id : null,
      },
    });
  } catch (err: unknown) {
    console.error('[Telemetry API Error]:', err);
    const message = err instanceof Error ? err.message : 'Gagal memproses telemetri.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, Math.max(5, Number(searchParams.get('limit') || 30)));
    const deviceCode = searchParams.get('device_code') || 'ESP32-TEMBOX-01';

    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (hasSupabase) {
      try {
        const admin = getSupabaseAdmin();
        const { data: device } = await admin
          .from('devices')
          .select('id')
          .eq('device_code', deviceCode)
          .maybeSingle();

        if (device) {
          const { data: logs } = await admin
            .from('telemetry_logs')
            .select('*')
            .eq('device_id', device.id)
            .order('recorded_at', { ascending: false })
            .limit(limit);

          if (logs && logs.length > 0) {
            return NextResponse.json({
              success: true,
              source: 'supabase',
              count: logs.length,
              logs,
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Telemetry GET] Supabase lookup error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: 'empty',
      count: 0,
      logs: [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil log telemetri.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
