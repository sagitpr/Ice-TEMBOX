import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../modules/supabase/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const deviceCode = searchParams.get('deviceCode');

    // 1. Fetch from activity_logs
    let actQuery = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (category && category !== 'Semua') {
      actQuery = actQuery.eq('category', category);
    }
    if (deviceCode && deviceCode !== 'all') {
      actQuery = actQuery.eq('device_code', deviceCode);
    }

    const { data: actLogs, error: actError } = await actQuery;

    // 2. Also fetch notifications to unify operational alerts into activity feed
    const { data: notifLogs } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const unifiedActivities: any[] = [];

    if (Array.isArray(actLogs)) {
      actLogs.forEach((item) => {
        unifiedActivities.push({
          id: item.id,
          uuid: item.id,
          timestamp: item.created_at,
          rtcTimestamp: item.created_at,
          category: item.category || 'Sistem',
          title: item.title,
          description: item.description || '',
          source: item.source || 'Sistem',
          deviceCode: item.device_code || 'Perangkat TEMBOX',
          status: item.status || 'Berhasil',
          metadata: item.metadata || {},
          created_at: item.created_at,
        });
      });
    }

    if (Array.isArray(notifLogs)) {
      notifLogs.forEach((n) => {
        unifiedActivities.push({
          id: `notif-${n.id}`,
          uuid: n.id,
          timestamp: n.created_at,
          rtcTimestamp: n.created_at,
          category: 'Peringatan',
          title: n.title,
          description: n.message || '',
          source: 'ESP32',
          deviceCode: n.device_name || n.device_id || 'Perangkat TEMBOX',
          status: n.severity === 'critical' ? 'Peringatan' : 'Info',
          metadata: {
            trigger_value: n.trigger_value,
            action_type: n.action_type,
            channel_sent: n.channel_sent,
          },
          created_at: n.created_at,
        });
      });
    }

    // Sort by created_at descending
    unifiedActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      activities: unifiedActivities,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat log aktivitas' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const { deviceCode, category, title, description, source, status, metadata } = body;

    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        device_code: deviceCode || null,
        category: category || 'Sistem',
        title: title || 'Aktivitas Tercatat',
        description: description || null,
        source: source || 'Pengguna',
        status: status || 'Berhasil',
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, activity: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mencatat aktivitas' },
      { status: 500 }
    );
  }
}
