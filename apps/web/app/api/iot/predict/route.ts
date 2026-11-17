import { NextRequest, NextResponse } from 'next/server';
import { runColdChainML, TelemetryPoint } from '../../../../modules/analytics/coldChainML.service';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { deviceId, deviceCode, ambientTemp, telemetryPoints } = body;

    // 1. If client provided telemetry points directly, run ML directly
    if (Array.isArray(telemetryPoints) && telemetryPoints.length > 0) {
      const prediction = runColdChainML(telemetryPoints, typeof ambientTemp === 'number' ? ambientTemp : 30.0);
      return NextResponse.json({ success: true, prediction });
    }

    // 2. Otherwise query latest telemetry logs from Supabase
    let points: TelemetryPoint[] = [];
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('telemetry_logs')
      .select('id, temperature_c, recorded_at, ping_ms, signal_rssi, sd_status')
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (deviceId) {
      query = query.eq('device_id', deviceId);
    } else if (deviceCode) {
      // Find device id first
      const { data: dev } = await supabase
        .from('devices')
        .select('id')
        .or(`device_code.eq.${deviceCode},serial_number.eq.${deviceCode}`)
        .maybeSingle();

      if (dev?.id) {
        query = query.eq('device_id', dev.id);
      }
    }

    const { data: logs, error } = await query;
    if (!error && Array.isArray(logs)) {
      points = logs.map((l) => ({
        id: l.id,
        temperature_c: Number(l.temperature_c),
        recorded_at: l.recorded_at,
        ping_ms: l.ping_ms,
        signal_rssi: l.signal_rssi,
        sd_status: l.sd_status,
      }));
    }

    const prediction = runColdChainML(points, typeof ambientTemp === 'number' ? ambientTemp : 30.0);
    return NextResponse.json({ success: true, prediction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses prediksi ML cold-chain' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId') || undefined;
    const deviceCode = searchParams.get('deviceCode') || undefined;
    const ambientParam = searchParams.get('ambientTemp');
    const ambientTemp = ambientParam ? parseFloat(ambientParam) : 30.0;

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('telemetry_logs')
      .select('id, temperature_c, recorded_at, ping_ms, signal_rssi, sd_status')
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (deviceId) {
      query = query.eq('device_id', deviceId);
    } else if (deviceCode) {
      const { data: dev } = await supabase
        .from('devices')
        .select('id')
        .or(`device_code.eq.${deviceCode},serial_number.eq.${deviceCode}`)
        .maybeSingle();

      if (dev?.id) {
        query = query.eq('device_id', dev.id);
      }
    }

    const { data: logs, error } = await query;
    const points: TelemetryPoint[] = (!error && Array.isArray(logs))
      ? logs.map((l) => ({
          id: l.id,
          temperature_c: Number(l.temperature_c),
          recorded_at: l.recorded_at,
          ping_ms: l.ping_ms,
          signal_rssi: l.signal_rssi,
          sd_status: l.sd_status,
        }))
      : [];

    const prediction = runColdChainML(points, isNaN(ambientTemp) ? 30.0 : ambientTemp);
    return NextResponse.json({ success: true, prediction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses prediksi ML cold-chain' },
      { status: 500 }
    );
  }
}
