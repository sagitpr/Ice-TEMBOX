import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashSha256(text: string): string {
  return crypto.createHash('sha256').update(text.trim()).digest('hex');
}

function deriveHmacSecret(deviceId: string): string {
  const masterKey = process.env.IOT_HMAC_MASTER_KEY || 'tembox-master-secret-key-2026';
  return crypto.createHmac('sha256', masterKey).update(deviceId.trim().toUpperCase()).digest('hex');
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
 * POST /api/iot/pair
 * Handles LCD 1602 ID + 6-digit PIN pairing, PIN rotation, and unpairing.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'pair';

    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const token = extractAuthToken(request);
    let userId: string = '00000000-0000-0000-0000-000000000000';

    if (hasSupabase && token) {
      try {
        const admin = getSupabaseAdmin();
        const { data: userData } = await admin.auth.getUser(token);
        if (userData?.user) {
          userId = userData.user.id;
        }
      } catch (err) {
        console.warn('[Pair API] User session check:', err);
      }
    }

    // 1. Rotate PIN
    if (action === 'rotate_pin') {
      const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim().toUpperCase() : '';
      if (!deviceId) {
        return NextResponse.json(
          { success: false, error: 'Device ID wajib disertakan untuk rotasi PIN.' },
          { status: 400 }
        );
      }

      // Generate 6-digit numeric PIN
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      const pinHash = hashSha256(newPin);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

      if (hasSupabase) {
        const admin = getSupabaseAdmin();
        const { error: updateErr } = await admin
          .from('devices')
          .update({
            pairing_pin_hash: pinHash,
            pin_expires_at: expiresAt,
          })
          .or(`device_code.eq.${deviceId},serial_number.eq.${deviceId}`);

        if (updateErr) {
          return NextResponse.json(
            { success: false, error: `Gagal memperbarui PIN: ${updateErr.message}` },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: 'PIN baru berhasil dibuat. Masukkan PIN ini pada layar LCD 1602 perangkat.',
        deviceId,
        newPin,
        expiresAt,
      });
    }

    // 2. Unpair
    if (action === 'unpair') {
      const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim().toUpperCase() : '';
      if (!deviceId) {
        return NextResponse.json(
          { success: false, error: 'Device ID wajib disertakan.' },
          { status: 400 }
        );
      }

      if (hasSupabase) {
        const admin = getSupabaseAdmin();
        await admin
          .from('devices')
          .update({
            is_paired: false,
            hmac_secret_hash: null,
            status: 'offline',
            connection_status: 'offline',
          })
          .or(`id.eq.${deviceId},device_code.eq.${deviceId},serial_number.eq.${deviceId}`);
      }

      return NextResponse.json({
        success: true,
        message: `Perangkat ${deviceId} berhasil diputuskan.`,
      });
    }

    // 3. Pair (LCD 1602)
    const boxName = typeof body.boxName === 'string' ? body.boxName.trim() : typeof body.name === 'string' ? body.name.trim() : '';
    const rawDeviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
    const cleanDeviceId = rawDeviceId.toUpperCase();
    const pin = typeof body.pin === 'string' ? body.pin.trim() : String(body.pin || '').trim();

    if (!boxName) {
      return NextResponse.json(
        { success: false, error: 'Nama Box / Palka wajib diisi (misal: Box 01 atau Palka Utama).' },
        { status: 400 }
      );
    }

    if (!cleanDeviceId) {
      return NextResponse.json(
        { success: false, error: 'Device ID dari layar LCD 1602 wajib diisi (contoh: TBX-9F8A21).' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'PIN verifikasi harus berupa 6 digit angka dari layar LCD 1602.' },
        { status: 400 }
      );
    }

    const pinHash = hashSha256(pin);
    const hmacSecret = deriveHmacSecret(cleanDeviceId);
    const hmacSecretHash = hashSha256(hmacSecret);

    let matchedDeviceId = cleanDeviceId;

    if (hasSupabase) {
      const admin = getSupabaseAdmin();

      // Check if device exists
      const { data: existingDevice } = await admin
        .from('devices')
        .select('id, device_code, pairing_pin_hash, pin_expires_at, is_paired, user_id')
        .or(`device_code.eq.${cleanDeviceId},serial_number.eq.${cleanDeviceId}`)
        .maybeSingle();

      if (existingDevice) {
        matchedDeviceId = existingDevice.id;

        // If a specific pairing PIN hash was set and hasn't expired, verify it
        if (existingDevice.pairing_pin_hash) {
          if (existingDevice.pairing_pin_hash !== pinHash) {
            return NextResponse.json(
              { success: false, error: 'PIN tidak cocok dengan kode yang tampil di layar LCD 1602.' },
              { status: 401 }
            );
          }

          if (existingDevice.pin_expires_at) {
            const expiry = new Date(existingDevice.pin_expires_at).getTime();
            if (Date.now() > expiry) {
              return NextResponse.json(
                { success: false, error: 'PIN sudah kedaluwarsa. Silakan lakukan rotasi PIN baru.' },
                { status: 401 }
              );
            }
          }
        }

        // Update device pairing state
        const { error: updateErr } = await admin
          .from('devices')
          .update({
            device_name: boxName,
            user_id: userId,
            is_paired: true,
            pairing_pin_hash: null, // Consumed
            pin_expires_at: null,
            hmac_secret_hash: hmacSecretHash,
            status: 'online',
            connection_status: 'online',
            last_seen_at: new Date().toISOString(),
          })
          .eq('id', existingDevice.id);

        if (updateErr) {
          return NextResponse.json(
            { success: false, error: `Gagal menyimpan pairing: ${updateErr.message}` },
            { status: 500 }
          );
        }
      } else {
        // Pre-insert new device matching LCD 1602 credentials
        const { data: newDev, error: insertErr } = await admin
          .from('devices')
          .insert({
            user_id: userId,
            device_code: cleanDeviceId,
            device_name: boxName,
            serial_number: cleanDeviceId,
            placement: boxName,
            is_paired: true,
            hmac_secret_hash: hmacSecretHash,
            status: 'online',
            connection_status: 'online',
            telemetry_interval_sec: 30,
            sd_interval_sec: 15,
            temp_offset: 0.0,
            warn_threshold: 2.0,
            crit_threshold: 4.0,
            buzzer_enabled: true,
            last_seen_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (insertErr) {
          return NextResponse.json(
            { success: false, error: `Gagal mendaftarkan perangkat: ${insertErr.message}` },
            { status: 500 }
          );
        }
        if (newDev) {
          matchedDeviceId = newDev.id;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Perangkat ${boxName} (${cleanDeviceId}) berhasil dihubungkan!`,
      deviceId: matchedDeviceId,
      deviceCode: cleanDeviceId,
      boxName,
      hmacSecret, // Provided once to the IoT client/device
      isPaired: true,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
