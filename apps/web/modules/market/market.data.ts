import box1ImgRaw from '../../src/assets/Box-1.png';
import box2ImgRaw from '../../src/assets/Box-2.png';
import box3ImgRaw from '../../src/assets/Box-3.png';
import type { ProductItem } from './market.types';

interface StaticAssetLike {
  src?: string;
}

const getSrc = (asset: string | StaticAssetLike | unknown): string => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'src' in asset) return (asset as StaticAssetLike).src || '';
  return '';
};

export const MARKET_PRODUCTS: ProductItem[] = [
  {
    id: 'mini',
    name: 'TEMBOX Mini',
    badge: 'Nelayan Kecil',
    tagline: 'Solusi monitoring palka es kompak & portabel untuk perahu jukung dan coolbox fiber.',
    price: 750000,
    priceFormatted: 'Rp 750.000',
    image: getSrc(box1ImgRaw),
    probes: '1x Probe DS18B20 Stainless Steel Anti-Korosi (Kabel 2M)',
    storage: 'Offline Data Logger MicroSD + Modul RTC DS3231 Presisi Tinggi',
    power: 'Aki Kapal 12V DC / Baterai Li-ion Internal Cadangan',
    connectivity: 'Wi-Fi 2.4GHz + Hotspot Pairing Pelabuhan',
    features: [
      'Pemantauan suhu kontinu -1°C s/d +2°C',
      'Display fisik LCD 1602 I2C kontras tinggi hemat daya',
      'Perekaman stempel waktu presisi RTC DS3231',
      'Offline data logger MicroSD otomatis tanpa butuh kuota di laut',
      'Alarm buzzer audio lokal saat es mulai mencair',
      'Pairing Device ID & 6-Digit PIN via LCD 1602',
    ],
    recommendedFor: 'Perahu motor tempel, jukung nelayan, coolbox fiber 50L–200L.',
    inStock: true,
  },
  {
    id: 'pro',
    name: 'TEMBOX Pro',
    badge: 'Paling Populer',
    tagline: 'Unit telemetri ganda dengan offline logging MicroSD & RTC presisi tinggi untuk pelayaran berhari-hari.',
    price: 1450000,
    priceFormatted: 'Rp 1.450.000',
    image: getSrc(box2ImgRaw),
    probes: '2x Probe DS18B20 Stainless Steel Anti-Korosi (Dasar & Permukaan Palka)',
    storage: 'Offline Data Logger MicroSD 16GB + Modul RTC DS3231 Presisi Tinggi',
    power: 'Aki Kapal 12V/24V + Cadangan Baterai Internal 8 Jam',
    connectivity: 'Wi-Fi Long-Range + GSM 4G LTE Auto-Sync',
    features: [
      'Dual-zone monitoring (suhu atas & bawah palka)',
      'Display fisik LCD 1602 I2C di anjungan ruang kemudi',
      'Pencatatan stempel waktu akurat tanpa internet (RTC DS3231)',
      'Offline data logger MicroSD otomatis saat blank spot seluler',
      'Sinkronisasi batch instan ke cloud & dasbor web',
      'Ekspor laporan mutu lelang format PDF/Excel',
      'Pairing Device ID & 6-Digit PIN via LCD 1602',
    ],
    recommendedFor: 'Kapal 5–15 GT, palka es terisolasi, koperasi nelayan, dan pedagang pengepul.',
    inStock: true,
  },
  {
    id: 'enterprise',
    name: 'TEMBOX Enterprise',
    badge: 'Armada & Korporasi',
    tagline: 'Sistem multi-sensor terpusat untuk armada kapal besar, palka berinsulasi multi-kompartemen, dan integrasi TPI.',
    price: 3200000,
    priceFormatted: 'Rp 3.200.000',
    image: getSrc(box3ImgRaw),
    probes: 'Hingga 6x Probe DS18B20 Stainless Steel Anti-Korosi Terdistribusi',
    storage: 'Offline Data Logger MicroSD Industri 32GB + Modul RTC DS3231 Presisi Tinggi',
    power: 'Sistem Kelistrikan Kapal Terproteksi Surge 12V-36V + Backup Baterai 24 Jam',
    connectivity: 'Hybrid Wi-Fi + 4G LTE Gateway + Satellite MQTT Ready',
    features: [
      'Multi-palka telemetry (Palka Kiri, Kanan, Utama, Palka Ikan Umpan)',
      'Display fisik LCD 1602 I2C + peringatan visual LED multi-level',
      'Pencatatan offline MicroSD industri dengan stempel waktu RTC DS3231',
      'Integrasi API Tempat Pelelangan Ikan (TPI) & logistik cold-chain',
      'Audit ketertelusuran histamin berstandar ekspor HACCP',
      'Dukungan teknis onsite & kalibrasi tahunan bersertifikat',
      'Pairing Device ID & 6-Digit PIN via LCD 1602',
    ],
    recommendedFor: 'Kapal purse seine / longline > 20 GT, eksportir ikan tuna, dan pengelola TPI.',
    inStock: true,
  },
];

export interface HardwareSpecRow {
  feature: string;
  mini: string;
  pro: string;
  enterprise: string;
}

export const HARDWARE_SPECS_COMPARISON: HardwareSpecRow[] = [
  {
    feature: 'Mikrokontroler Utama',
    mini: 'ESP32 Dual-Core 240MHz',
    pro: 'ESP32 Dual-Core 240MHz',
    enterprise: 'ESP32 Industrial Grade Dual-Core',
  },
  {
    feature: 'Sensor Suhu Digital',
    mini: '1x DS18B20 Stainless Steel Anti-Korosi',
    pro: '2x DS18B20 Stainless Steel Anti-Korosi',
    enterprise: 'Hingga 6x DS18B20 Stainless Steel Anti-Korosi',
  },
  {
    feature: 'Akurasi Suhu Terkalibrasi',
    mini: '±0.5°C (-55°C s.d +125°C)',
    pro: '±0.5°C (-55°C s.d +125°C)',
    enterprise: '±0.3°C Terkalibrasi Khusus Pembekuan',
  },
  {
    feature: 'Display Fisik Lokal',
    mini: 'Display LCD 1602 I2C',
    pro: 'Display LCD 1602 I2C',
    enterprise: 'Display LCD 1602 I2C + Array LED Multi-Zona',
  },
  {
    feature: 'Modul Jam Presisi (RTC)',
    mini: 'RTC DS3231 Presisi Tinggi',
    pro: 'RTC DS3231 Presisi Tinggi',
    enterprise: 'RTC DS3231 Presisi Tinggi Extreme Temp',
  },
  {
    feature: 'Penyimpanan Mandiri (Offline Logger)',
    mini: 'Offline Data Logger MicroSD',
    pro: 'Offline Data Logger MicroSD (16GB)',
    enterprise: 'Offline Data Logger MicroSD Industri (32GB)',
  },
  {
    feature: 'Sistem Pairing Keamanan',
    mini: 'LCD 1602 Device ID + 6-Digit PIN',
    pro: 'LCD 1602 Device ID + 6-Digit PIN',
    enterprise: 'LCD 1602 Device ID + 6-Digit PIN + HMAC-SHA256',
  },
  {
    feature: 'Proteksi Enclosure Box',
    mini: 'ABS Weatherproof IP65',
    pro: 'Industrial Polycarbonate IP67 Anti-Korosi',
    enterprise: 'Heavy Duty Die-Cast IP68 Marine Seal',
  },
  {
    feature: 'Konektivitas Jaringan',
    mini: 'Wi-Fi 2.4GHz + Hotspot Pairing',
    pro: 'Wi-Fi + GSM 4G LTE Auto-Sync',
    enterprise: 'Wi-Fi + 4G LTE Multi-Operator + Satellite MQTT Ready',
  },
  {
    feature: 'Garansi Resmi TEMBOX',
    mini: '6 Bulan Penggantian Unit',
    pro: '1 Tahun Ganti Baru',
    enterprise: '2 Tahun Full Support & Onsite Assistance',
  },
];

export const MARKET_FAQS = [
  {
    q: 'Bagaimana cara memasang sensor TEMBOX pada palka ikan tradisional?',
    a: 'Pemasangan sangat mudah dan ramah instalasi mandiri. Unit box utama dipasang di dinding luar palka atau di anjungan kemudi. Kabel probe sensor suhu digital DS18B20 stainless steel anti-korosi dimasukkan melewati celah paking tutup palka langsung ke dalam tumpukan es dan ikan.',
  },
  {
    q: 'Apakah data suhu tetap tercatat saat kapal berlayar di luar jangkauan sinyal di laut?',
    a: 'Ya. Seluruh unit TEMBOX (Mini, Pro, dan Enterprise) dilengkapi Offline Data Logger MicroSD dan Modul Jam RTC DS3231 presisi tinggi. Data suhu palka terekam secara berkala setiap menit dengan penanda waktu akurat. Saat kapal merapat ke pelabuhan dan mendapat sinyal 4G/Wi-Fi, data otomatis tersinkronisasi ke dashboard akun tanpa ada data yang hilang.',
  },
  {
    q: 'Berapa akurasi sensor suhu yang digunakan?',
    a: 'Seluruh unit menggunakan probe digital DS18B20 berbahan stainless steel anti-korosi dengan akurasi terkalibrasi ±0.5°C pada rentang kritis penyimpanan ikan (-10°C hingga +10°C). Sensor kebal terhadap getaran mesin dan air asin.',
  },
  {
    q: 'Bagaimana alur menghubungkan (pairing) unit fisik ke dashboard akun web?',
    a: 'Setiap unit fisik dilengkapi layar Display LCD 1602 I2C. Saat box dinyalakan, layar LCD 1602 akan menampilkan Device ID unik dan 6-Digit PIN pairing. Buka menu Pengaturan > Tambah Perangkat di dashboard akun Anda, lalu masukkan Device ID dan PIN tersebut untuk menghubungkan palka secara instan dan aman.',
  },
];
