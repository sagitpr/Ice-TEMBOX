import { NextResponse } from 'next/server';
import { requireServerAuth } from '../../../modules/auth/serverAuth';
import { getSupabaseAdmin } from '../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/orders
 * Returns the purchase history for the currently authenticated user.
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireServerAuth(request);
    if (authResult.response) {
      return authResult.response;
    }

    const verifiedUser = authResult.user;
    const cleanEmail = verifiedUser.email?.trim().toLowerCase();
    const userId = verifiedUser.id;

    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabase) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const admin = getSupabaseAdmin();

    // Query orders matching user_id OR buyer_email
    let query = admin
      .from('orders')
      .select('id, order_code, buyer_name, buyer_email, buyer_phone, shipping_address, items, total_amount, payment_status, payment_method, paid_at, created_at')
      .order('created_at', { ascending: false });

    if (cleanEmail) {
      query = query.or(`user_id.eq.${userId},buyer_email.eq.${cleanEmail}`);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('[API Orders] Database query error:', error.message);
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    return NextResponse.json({ orders: orders || [] }, { status: 200 });
  } catch (err: unknown) {
    console.error('[API Orders] Server error:', err);
    return NextResponse.json(
      { error: 'Gagal memuat riwayat transaksi pesanan.' },
      { status: 500 }
    );
  }
}
