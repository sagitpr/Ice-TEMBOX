-- Migration: MQTT token hashing, hardware config, and pgvector diagnostics

CREATE EXTENSION IF NOT EXISTS vector;

-- 2. ALTER TABLE: devices (Enforce hashed MQTT token & two-way hardware config)
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS serial_number TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS mqtt_token_hash TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS mqtt_topic_prefix TEXT;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS telemetry_interval_sec INT DEFAULT 30;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS sd_interval_sec INT DEFAULT 15;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS temp_offset NUMERIC(4,2) DEFAULT 0.00;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS warn_threshold NUMERIC(4,2) DEFAULT 2.00;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS crit_threshold NUMERIC(4,2) DEFAULT 4.00;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS buzzer_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'online';

CREATE INDEX IF NOT EXISTS idx_devices_serial_number ON public.devices(serial_number);
CREATE INDEX IF NOT EXISTS idx_devices_mqtt_token_hash ON public.devices(mqtt_token_hash);

-- 3. ENABLE STRICT ROW LEVEL SECURITY (RLS) ON DEVICES
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

-- 4. ENABLE STRICT ROW LEVEL SECURITY (RLS) ON TELEMETRY LOGS
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

-- 5. TABLE: field_diagnostics_sop (General Public / Authenticated Read-Only SOP Knowledge)
CREATE TABLE IF NOT EXISTS public.field_diagnostics_sop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_title TEXT NOT NULL,
  error_code TEXT UNIQUE,
  hardware_component TEXT NOT NULL, -- 'DS18B20', 'MicroSD', 'RTC DS3231', 'ESP32', 'MQTT'
  root_cause TEXT NOT NULL,
  resolution_steps TEXT[] NOT NULL,
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.field_diagnostics_sop ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read field diagnostics SOP" ON public.field_diagnostics_sop;
CREATE POLICY "Authenticated users can read field diagnostics SOP"
  ON public.field_diagnostics_sop FOR SELECT
  TO authenticated
  USING (true);

-- Allow public read for offline troubleshooting reference if needed
DROP POLICY IF EXISTS "Public can view field diagnostics SOP" ON public.field_diagnostics_sop;
CREATE POLICY "Public can view field diagnostics SOP"
  ON public.field_diagnostics_sop FOR SELECT
  TO anon
  USING (true);

-- 6. TABLE: device_incident_vectors (Private User Device Incidents - Strictly Isolated by user_id)
CREATE TABLE IF NOT EXISTS public.device_incident_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  incident_title TEXT NOT NULL,
  incident_description TEXT,
  hardware_telemetry_snapshot JSONB,
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.device_incident_vectors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own device incident vectors" ON public.device_incident_vectors;
CREATE POLICY "Users can view own device incident vectors"
  ON public.device_incident_vectors FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own device incident vectors" ON public.device_incident_vectors;
CREATE POLICY "Users can insert own device incident vectors"
  ON public.device_incident_vectors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own device incident vectors" ON public.device_incident_vectors;
CREATE POLICY "Users can update own device incident vectors"
  ON public.device_incident_vectors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own device incident vectors" ON public.device_incident_vectors;
CREATE POLICY "Users can delete own device incident vectors"
  ON public.device_incident_vectors FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_device_incidents_user ON public.device_incident_vectors(user_id);
CREATE INDEX IF NOT EXISTS idx_device_incidents_device ON public.device_incident_vectors(device_id);

-- 7. RPC FUNCTION: Semantic Vector Matching for General SOP Knowledge
CREATE OR REPLACE FUNCTION public.match_field_diagnostics (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  symptom_title TEXT,
  error_code TEXT,
  hardware_component TEXT,
  root_cause TEXT,
  resolution_steps TEXT[],
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sop.id,
    sop.symptom_title,
    sop.error_code,
    sop.hardware_component,
    sop.root_cause,
    sop.resolution_steps,
    (1 - (sop.embedding <=> query_embedding))::float AS similarity
  FROM public.field_diagnostics_sop sop
  WHERE sop.embedding IS NOT NULL AND (1 - (sop.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 8. RPC FUNCTION: Semantic Vector Matching for User's Private Incidents (Locked to auth.uid())
CREATE OR REPLACE FUNCTION public.match_device_incidents (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  device_id UUID,
  incident_title TEXT,
  incident_description TEXT,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    inc.id,
    inc.device_id,
    inc.incident_title,
    inc.incident_description,
    (1 - (inc.embedding <=> query_embedding))::float AS similarity
  FROM public.device_incident_vectors inc
  WHERE inc.user_id = auth.uid()
    AND inc.embedding IS NOT NULL
    AND (1 - (inc.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 9. SEED DATA: Diagnostic Field Knowledge SOP
INSERT INTO public.field_diagnostics_sop (symptom_title, error_code, hardware_component, root_cause, resolution_steps)
VALUES
(
  'Sensor Suhu Menampilkan -127°C atau Tidak Terbaca',
  'DS18B20_DISCONNECTED',
  'DS18B20',
  'Kabel data probe DS18B20 putus, korosi air laut pada terminal pin GPIO, atau resistor pull-up 4.7kΩ lepas.',
  ARRAY[
    'Periksa kabel biru/kuning probe sensor suhu pada terminal blok sekrup ESP32 (GPIO 4).',
    'Pastikan resistor pull-up 4.7kΩ terpasang erat di antara pin DATA dan VCC (3.3V).',
    'Bersihkan karat/garam pada ujung konektor dengan contact cleaner atau amplas halus.',
    'Ganti probe waterproof DS18B20 stainless steel jika kabel telah terjepit es balok.'
  ]
),
(
  'Sensor Suhu Macet pada Nilai Konstan +85°C',
  'DS18B20_POWER_ON_RESET',
  'DS18B20',
  'Sensor menerima daya saat boot tetapi pembacaan diambil sebelum proses konversi 12-bit ADC selesai atau suplai daya VCC drop di bawah 3.0V.',
  ARRAY[
    'Tambahkan delay konversi minimal 750ms pada loop pembacaan firmware ESP32.',
    'Periksa voltase rail 3.3V ESP32; jika baterai drop, gunakan catu daya step-down DC 12V ke 5V yang stabil.',
    'Gunakan tombol "Restart Telemetri" dari portal web untuk memicu soft-reset OneWire.'
  ]
),
(
  'MicroSD Gagal Inisialisasi / Mount Failed',
  'SD_CARD_MOUNT_ERROR',
  'MicroSD',
  'Format kartu MicroSD bukan FAT32 (misal exFAT/NTFS) atau pin SPI (MISO/MOSI/SCK/CS GPIO 5) kotor terkena kelembaban laut.',
  ARRAY[
    'Lepaskan MicroSD, bersihkan konektor kuningan dengan kain kering bersih.',
    'Pastikan kartu diformat dalam sistem FAT32 dengan alokasi unit 32KB atau 16KB.',
    'Pastikan kapasitas kartu tidak melebihi 32GB (disarankan Sandisk Industrial Class 10 16GB/32GB).',
    'Dorong kembali MicroSD ke slot sampai berbunyi klik pengunci.'
  ]
),
(
  'Jam RTC DS3231 Kembali ke Tahun 2000 / Tanggal Tidak Sinkron',
  'RTC_TIME_LOST',
  'RTC DS3231',
  'Baterai koin CR2032 pada modul DS3231 habis voltasenya (< 2.4V) saat perangkat dimatikan di pelabuhan.',
  ARRAY[
    'Ganti baterai koin CR2032 pada soket modul RTC DS3231 dengan baterai baru 3V.',
    'Nyalakan perangkat dan hubungkan ke Wi-Fi / jaringan 4G agar otomatis sync NTP.',
    'Gunakan tombol "Paksa Sync MicroSD & RTC" pada portal web untuk menyuntikkan waktu WIB server.'
  ]
),
(
  'Koneksi MQTT Terputus-putus atau Gagal Handshake TLS (Port 8883)',
  'MQTT_TLS_HANDSHAKE_FAIL',
  'MQTT',
  'Sinyal antena seluler 4G/GSM lemah di tengah laut, atau sertifikat root CA broker MQTT belum di-flash.',
  ARRAY[
    'Pastikan antena eksternal SMA 4G/GSM terpasang tegak di atas atap dek kemudi kapal.',
    'ESP32 akan otomatis beralih ke mode offline logging (MicroSD) jika MQTT terputus, data tidak hilang.',
    'Unduh file "tembox-config.json" dari modal pengaturan perangkat dan simpan di root kartu MicroSD untuk memperbarui token broker.'
  ]
),
(
  'Buzzer Alarm Berbunyi Terus Menerus di Box Palka',
  'BUZZER_TEMP_ALERT',
  'ESP32',
  'Suhu ruang palka telah melampaui batas kritis yang ditentukan (default > 4.0°C).',
  ARRAY[
    'Segera buka palka dan periksa ketebalan es curai/es balok yang menyelimuti tangkapan ikan.',
    'Tambahkan es pendingin baru untuk menekan suhu di bawah 2.0°C.',
    'Buzzer dapat dinonaktifkan sementara dari menu "Detail Hardware" dengan mematikan toggle buzzer fisik.'
  ]
)
ON CONFLICT (error_code) DO NOTHING;
