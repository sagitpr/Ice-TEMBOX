import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const deviceCode = typeof body.device_code === 'string' && body.device_code.trim()
      ? body.device_code.trim()
      : typeof body.device_id === 'string' && body.device_id.trim()
        ? body.device_id.trim()
        : 'ESP32-TEMBOX-01';

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
    const recordedAt = body.recorded_at ? new Date(body.recorded_at).toISOString() : new Date().toISOString();
    const deviceTimestamp = body.device_timestamp ? new Date(body.device_timestamp).toISOString() : recordedAt;

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
          .select('id, device_code, status')
          .eq('device_code', deviceCode)
          .maybeSingle();

        if (devErr) {
          console.warn('[Telemetry API] Error looking up device:', devErr.message);
        }

        // Auto-provision device if not found
        if (!device) {
          // Get first user profile or fallback
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
                last_temperature_c: temperatureC,
                last_seen_at: new Date().toISOString(),
              })
              .select('id, device_code, status')
              .maybeSingle();

            if (createdDevice) {
              device = createdDevice;
            }
          }
        }

        if (device) {
          // Update device status & last temperature
          await admin
            .from('devices')
            .update({
              status: 'online',
              last_temperature_c: temperatureC,
              last_seen_at: new Date().toISOString(),
            })
            .eq('id', device.id);

          // 2. Insert telemetry log with optional new fields
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
            // Fallback: If custom columns do not exist in DDL yet, insert only base columns
            console.warn('[Telemetry API] Extended insert failed, falling back to base columns:', insertErr.message);
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
      message: 'Data telemetri berhasil diterima.',
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

    // Fallback sample records for initial offline exploration
    const now = Date.now();
    const fallbackLogs = Array.from({ length: 12 }).map((_, i) => ({
      id: 100 - i,
      temperature_c: Number((-0.8 + Math.sin(i / 2) * 0.4).toFixed(2)),
      humidity_pct: 85,
      battery_pct: 98,
      signal_rssi: -62 - (i % 5),
      ping_ms: 38 + (i % 12),
      sd_status: 'OK',
      offline_queue_count: 0,
      recorded_at: new Date(now - i * 60 * 1000).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: fallbackLogs.length,
      logs: fallbackLogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil log telemetri.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
