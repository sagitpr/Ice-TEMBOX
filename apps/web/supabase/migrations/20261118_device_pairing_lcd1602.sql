-- ==============================================================================
-- MIGRATION: LCD 1602 ID+PIN PAIRING, HMAC-SHA256 AUTH, AND DEVICE SECURITY
-- Project: Ice-TEMBOX - Cold-Chain Monitoring
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. ADD SECURITY & PAIRING COLUMNS TO DEVICES TABLE
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS pairing_pin_hash TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS pin_expires_at TIMESTAMPTZ;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS is_paired BOOLEAN DEFAULT false;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS hmac_secret_hash TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

-- 2. CREATE INDEXES FOR FAST LOOKUP AND TELEMETRY VERIFICATION
CREATE INDEX IF NOT EXISTS idx_devices_pairing_pin_hash ON public.devices(pairing_pin_hash);
CREATE INDEX IF NOT EXISTS idx_devices_hmac_secret_hash ON public.devices(hmac_secret_hash);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen_at ON public.devices(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_devices_is_paired ON public.devices(is_paired);

-- 3. ENSURE STRICT ROW LEVEL SECURITY (RLS) POLICIES FOR AUTHENTICATED USERS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;
CREATE POLICY "Users can view own devices"
  ON public.devices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;
CREATE POLICY "Users can insert own devices"
  ON public.devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;
CREATE POLICY "Users can update own devices"
  ON public.devices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own devices" ON public.devices;
CREATE POLICY "Users can delete own devices"
  ON public.devices FOR DELETE
  USING (auth.uid() = user_id);
