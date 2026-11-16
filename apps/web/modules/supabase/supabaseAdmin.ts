import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminInstance: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase Admin client using the service_role secret.
 * STRICTLY RESTRICTED TO SERVER-SIDE CONTEXTS (API Routes & Server Actions).
 * Throws immediately if invoked in a browser environment to prevent secret leaks.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin tidak boleh dijalankan di browser!');
  }

  if (adminInstance) {
    return adminInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Konfigurasi Supabase Admin tidak lengkap: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum didefinisikan.'
    );
  }

  adminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminInstance;
}

export default getSupabaseAdmin;
