import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint for Supabase Server connectivity.
 * Verifies live handshake with Supabase without exposing credentials or internal tokens.
 */
export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const startTime = Date.now();

    // Verify connectivity via Auth Admin API
    const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: 'degraded',
          connected: false,
          service: 'Supabase',
          message: error.message,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      service: 'Supabase PostgreSQL & Auth Engine',
      latencyMs: `${latencyMs}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[Supabase Health Check Error]:', error);
    const message = error instanceof Error ? error.message : 'Koneksi ke Supabase gagal.';

    return NextResponse.json(
      {
        status: 'unhealthy',
        connected: false,
        service: 'Supabase',
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
