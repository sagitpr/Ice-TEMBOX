import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
 * GET /api/notifications
 * Lists cold-chain notifications for authenticated user.
 */
export async function GET(request: Request) {
  try {
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        notifications: [],
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
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      notifications: data || [],
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Marks all or specific notifications as read.
 */
export async function PATCH(request: Request) {
  try {
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json({ success: true, updated: 0 });
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

    const body = await request.json().catch(() => ({}));
    const { id } = body;

    let query = admin.from('notifications').update({ is_read: true });

    if (id) {
      query = query.eq('id', id);
    } else if (userId) {
      query = query.eq('user_id', userId).eq('is_read', false);
    } else {
      query = query.eq('is_read', false);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notifikasi berhasil ditandai telah dibaca.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications
 * Clears read notifications.
 */
export async function DELETE(request: Request) {
  try {
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json({ success: true, deleted: 0 });
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

    let query = admin.from('notifications').delete().eq('is_read', true);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notifikasi yang telah dibaca berhasil dibersihkan.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
