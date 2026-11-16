-- ==============================================================================
-- SCHEMA DEFINITION FOR ICE-TEMBOX (SUPABASE POSTGRESQL)
-- Project: Ice-TEMBOX - Smart Monitoring for Fresher Catch
-- Target Project ID: mztlqqyacomjnbkgqqim
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS: Updated At Timestamp Handler
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLE: PROFILES (User accounts linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. TABLE: DEVICES (IoT Retrofit Units)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_code TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'pro' CHECK (variant IN ('mini', 'pro', 'enterprise')),
  vessel_name TEXT,
  placement TEXT NOT NULL DEFAULT 'Palka Utama' CHECK (placement IN ('Palka Kiri', 'Palka Kanan', 'Palka Utama')),
  ip_or_serial TEXT,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'warning')),
  min_temp_threshold NUMERIC(5,2) NOT NULL DEFAULT -1.00,
  max_temp_threshold NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  firmware_esp32 TEXT NOT NULL DEFAULT 'v2.4.1-iot-marine',
  firmware_ds18b20 TEXT NOT NULL DEFAULT 'Probe Rev.3.2 (±0.5°C)',
  microsd_interval_sec INT NOT NULL DEFAULT 30,
  last_temperature_c NUMERIC(5,2),
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_devices_updated_at ON public.devices;
CREATE TRIGGER trigger_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_device_code ON public.devices(device_code);

-- ==============================================================================
-- 5. TABLE: TELEMETRY_LOGS (Real-Time Sensor & Offline RTC Buffering)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
  id BIGSERIAL PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  temperature_c NUMERIC(5,2) NOT NULL,
  humidity_pct NUMERIC(5,2),
  battery_pct INT CHECK (battery_pct >= 0 AND battery_pct <= 100),
  signal_rssi INT,
  is_offline_sync BOOLEAN NOT NULL DEFAULT false,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_device_recorded ON public.telemetry_logs(device_id, recorded_at DESC);

-- ==============================================================================
-- 6. TABLE: ORDERS (Unit Purchases & DOKU Payment Gateway)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  product_variant TEXT NOT NULL CHECK (product_variant IN ('mini', 'pro', 'enterprise')),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price BIGINT NOT NULL,
  shipping_cost BIGINT NOT NULL DEFAULT 0,
  total_amount BIGINT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  shipping_city TEXT,
  shipping_address TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED')),
  doku_payment_url TEXT,
  doku_payment_channel TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_invoice_number ON public.orders(invoice_number);

-- ==============================================================================
-- 7. TABLE: CONTACT_MESSAGES (Website Inquiries & Support)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Konsultasi Perangkat',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_messages(created_at DESC);

-- ==============================================================================
-- 8. TABLE: OTP_VERIFICATIONS (Server-Side Passwordless / Verification Store)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'register' CHECK (purpose IN ('register', 'reset_password')),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent column migrations if table already exists in Supabase
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS attempts INT NOT NULL DEFAULT 0;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS max_attempts INT NOT NULL DEFAULT 5;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_otp_email_purpose ON public.otp_verifications(email, purpose);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- B. DEVICES RLS
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

-- C. TELEMETRY LOGS RLS
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view telemetry for own devices" ON public.telemetry_logs;
CREATE POLICY "Users can view telemetry for own devices"
  ON public.telemetry_logs FOR SELECT
  USING (
    device_id IN (
      SELECT id FROM public.devices WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users or devices can insert telemetry for own devices" ON public.telemetry_logs;
CREATE POLICY "Users or devices can insert telemetry for own devices"
  ON public.telemetry_logs FOR INSERT
  WITH CHECK (
    device_id IN (
      SELECT id FROM public.devices WHERE user_id = auth.uid()
    )
  );

-- D. ORDERS RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- E. CONTACT MESSAGES RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admins can read contact messages
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- F. OTP VERIFICATIONS RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
-- Strictly accessed server-side via service_role key; no public policies needed.
