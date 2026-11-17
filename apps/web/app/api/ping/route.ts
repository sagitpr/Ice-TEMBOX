import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    serverTime: new Date().toISOString(),
    timestamp: Date.now(),
    status: 'online',
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const clientTime = typeof body.clientTime === 'number' ? body.clientTime : Date.now();
  const latency = Math.max(1, Date.now() - clientTime);

  return NextResponse.json({
    success: true,
    measuredLatencyMs: latency,
    serverTime: new Date().toISOString(),
    timestamp: Date.now(),
  });
}
