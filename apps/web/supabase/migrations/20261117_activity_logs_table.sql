
-- Migration: Add activity_logs table for audit trail and operational events
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    device_code TEXT,
    category TEXT NOT NULL DEFAULT 'Sistem', -- 'Peringatan' | 'MicroSD Sync' | 'Koneksi' | 'Pengaturan' | 'Sistem'
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL DEFAULT 'Sistem', -- 'ESP32' | 'Sistem' | 'Pengguna'
    status TEXT NOT NULL DEFAULT 'Berhasil', -- 'Berhasil' | 'Peringatan' | 'Info'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_device_id ON public.activity_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activity logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
