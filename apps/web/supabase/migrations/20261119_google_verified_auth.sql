-- Migration: Google verified credential binding for profiles

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_sub TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_google_sub ON public.profiles(google_sub);
CREATE INDEX IF NOT EXISTS idx_profiles_google_verified ON public.profiles(google_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
