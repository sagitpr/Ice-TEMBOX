import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../modules/supabase/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DiagnosticRule {
  errorCode: string;
  symptomTitle: string;
  hardwareComponent: string;
  rootCause: string;
  resolutionSteps: string[];
}

const STATIC_DIAGNOSTIC_KNOWLEDGE: DiagnosticRule[] = [
  {
    errorCode: 'DS18B20_DISCONNECTED',
    symptomTitle: 'Sensor Suhu Menampilkan -127.0°C / Kabel Terputus',
    hardwareComponent: 'DS18B20',
    rootCause: 'Kabel data probe DS18B20 terlepas dari terminal GPIO 4, korosi air garam pada konektor, atau resistor pull-up 4.7kΩ lepas.',
    resolutionSteps: [
      'Periksa sambungan kabel probe sensor suhu pada terminal blok sekrup ESP32 (pin GPIO 4).',
      'Pastikan resistor pull-up 4.7kΩ terpasang kokoh di antara pin DATA dan pin 3.3V.',
      'Bersihkan sisa garam pada ujung konektor dengan cairan contact cleaner atau lap kering.',
      'Ganti probe DS18B20 jika selongsong stainless steel penyok atau kabel tertekan balok es.',
    ],
  },
  {
    errorCode: 'DS18B20_POWER_ON_RESET',
    symptomTitle: 'Sensor Suhu Menampilkan Nilai Konstan +85.0°C',
    hardwareComponent: 'DS18B20',
    rootCause: 'Nilai default reset chip Dallas OneWire terbaca sebelum konversi ADC 12-bit selesai, atau tegangan VCC drop di bawah 3.0V.',
    resolutionSteps: [
      'Pastikan firmware menyisipkan jeda konversi minimal 750ms sebelum membaca register scratchpad.',
      'Periksa voltase baterai ESP32; pastikan catu daya regulator tidak drop saat transmisi data.',
      'Klik tombol "Restart Telemetri" untuk melakukan inisialisasi ulang jalur OneWire.',
    ],
  },
  {
    errorCode: 'SD_CARD_MOUNT_ERROR',
    symptomTitle: 'Modul MicroSD Gagal Mount (Inisialisasi SPI Gagal)',
    hardwareComponent: 'MicroSD',
    rootCause: 'Kartu memori belum diformat ke FAT32 (misal format exFAT/NTFS) atau pin SPI (MISO/MOSI/SCK/CS GPIO 5) terkena karat/embun laut.',
    resolutionSteps: [
      'Keluarkan kartu MicroSD dari modul, bersihkan pelat tembaga dengan kain halus kering.',
      'Format kartu MicroSD di komputer menggunakan sistem FAT32 (Cluster size 32KB).',
      'Gunakan kartu MicroSD kelas industri (Sandisk Industrial Class 10 kapasitas 16GB atau 32GB).',
      'Pasang kembali kartu sampai terdengar bunyi "klik" pengunci pegas.',
    ],
  },
  {
    errorCode: 'RTC_TIME_LOST',
    symptomTitle: 'Jam RTC DS3231 Kembali ke Tahun 2000 / Jam Berantakan',
    hardwareComponent: 'RTC DS3231',
    rootCause: 'Baterai koin CR2032 pada modul DS3231 habis voltasenya (< 2.4V) saat perangkat dimatikan di dermaga.',
    resolutionSteps: [
      'Ganti baterai koin CR2032 pada wadah modul RTC DS3231 dengan baterai lithium 3V baru.',
      'Sambungkan ESP32 ke jaringan seluler/Wi-Fi agar jam tersinkronisasi otomatis via server NTP.',
      'Tekan tombol "Paksa Sync MicroSD & RTC" di web portal untuk menyuntikkan waktu WIB server.',
    ],
  },
  {
    errorCode: 'MQTT_TLS_HANDSHAKE_FAIL',
    symptomTitle: 'Koneksi MQTT Terputus / Gagal Handshake Port 8883',
    hardwareComponent: 'MQTT',
    rootCause: 'Sinyal antena seluler 4G/GSM lemah di zona tengah laut atau sertifikat CA broker belum cocok dengan konfigurasi token.',
    resolutionSteps: [
      'Pastikan antena eksternal 4G terpasang tegak di atas atap dek kapal bebas halangan logam.',
      'Perangkat secara otomatis mencatat data ke MicroSD jika MQTT putus, data tetap aman.',
      'Unduh file "tembox-config.json" dari menu pengaturan dan salin ke MicroSD untuk memperbarui token broker.',
    ],
  },
  {
    errorCode: 'BUZZER_TEMP_ALERT',
    symptomTitle: 'Buzzer Fisik Berbunyi Nyaring di Palka',
    hardwareComponent: 'ESP32',
    rootCause: 'Suhu palka telah melampaui batas kritis yang ditentukan (misal > 4.0°C).',
    resolutionSteps: [
      'Segera buka palka dan periksa kondisi tumpukan es yang menyelimuti ikan hasil tangkapan.',
      'Tambahkan es curai atau es balok baru untuk menurunkan suhu ruang palka kembali di bawah 2.0°C.',
      'Jika perlu membisukan alarm saat penataan es, nonaktifkan toggle "Buzzer Alarm Fisik" di portal web.',
    ],
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const currentTemp = typeof body.current_temp === 'number' ? body.current_temp : null;
    const currentSdStatus = typeof body.sd_status === 'string' ? body.sd_status : null;
    const currentStatus = typeof body.current_status === 'string' ? body.current_status : null;

    // 1. Automatic Heuristic Problem Detection
    const detectedAnomalies: DiagnosticRule[] = [];

    if (currentTemp !== null) {
      if (currentTemp <= -120) {
        detectedAnomalies.push(STATIC_DIAGNOSTIC_KNOWLEDGE[0]); // DS18B20_DISCONNECTED
      } else if (currentTemp >= 84 && currentTemp <= 86) {
        detectedAnomalies.push(STATIC_DIAGNOSTIC_KNOWLEDGE[1]); // DS18B20_POWER_ON_RESET
      } else if (currentTemp >= 4.0) {
        detectedAnomalies.push(STATIC_DIAGNOSTIC_KNOWLEDGE[5]); // BUZZER_TEMP_ALERT
      }
    }

    if (currentSdStatus && currentSdStatus !== 'OK' && currentSdStatus !== 'OK_SYNCED') {
      detectedAnomalies.push(STATIC_DIAGNOSTIC_KNOWLEDGE[2]); // SD_CARD_MOUNT_ERROR
    }

    if (currentStatus === 'offline') {
      detectedAnomalies.push(STATIC_DIAGNOSTIC_KNOWLEDGE[4]); // MQTT_TLS_HANDSHAKE_FAIL
    }

    // 2. Query Search: Search through Knowledge Base
    let searchResults: DiagnosticRule[] = [];

    if (query) {
      const q = query.toLowerCase();
      searchResults = STATIC_DIAGNOSTIC_KNOWLEDGE.filter((item) => {
        return (
          item.symptomTitle.toLowerCase().includes(q) ||
          item.rootCause.toLowerCase().includes(q) ||
          item.hardwareComponent.toLowerCase().includes(q) ||
          item.errorCode.toLowerCase().includes(q) ||
          item.resolutionSteps.some((step) => step.toLowerCase().includes(q))
        );
      });

      // If no direct keyword match, perform fuzzy token matching
      if (searchResults.length === 0) {
        const tokens = q.split(/\s+/).filter((t) => t.length > 2);
        searchResults = STATIC_DIAGNOSTIC_KNOWLEDGE.filter((item) => {
          return tokens.some(
            (tok) =>
              item.symptomTitle.toLowerCase().includes(tok) ||
              item.rootCause.toLowerCase().includes(tok) ||
              item.hardwareComponent.toLowerCase().includes(tok)
          );
        });
      }
    }

    // Check if Supabase pgvector is configured for additional embeddings
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let vectorSearched = false;
    if (hasSupabase && query) {
      try {
        const admin = getSupabaseAdmin();
        const { data: sopHits } = await admin
          .from('field_diagnostics_sop')
          .select('id, symptom_title, error_code, hardware_component, root_cause, resolution_steps')
          .ilike('symptom_title', `%${query}%`)
          .limit(3);

        if (sopHits && sopHits.length > 0) {
          vectorSearched = true;
          sopHits.forEach((hit) => {
            if (!searchResults.some((r) => r.errorCode === hit.error_code)) {
              searchResults.push({
                errorCode: hit.error_code || 'SOP_DIAG',
                symptomTitle: hit.symptom_title,
                hardwareComponent: hit.hardware_component,
                rootCause: hit.root_cause,
                resolutionSteps: hit.resolution_steps || [],
              });
            }
          });
        }
      } catch (err) {
        // Fallback gracefully to static rule base
      }
    }

    return NextResponse.json({
      success: true,
      hasAnomalies: detectedAnomalies.length > 0,
      detectedAnomalies,
      searchResults: searchResults.length > 0 ? searchResults : detectedAnomalies.length > 0 ? [] : STATIC_DIAGNOSTIC_KNOWLEDGE.slice(0, 3),
      allTopicsCount: STATIC_DIAGNOSTIC_KNOWLEDGE.length,
      vectorSearched,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
