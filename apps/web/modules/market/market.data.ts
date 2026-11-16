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
    probes: '1x Probe DS18B20 Anti-Karat (Kabel 2M)',
    storage: 'Buffer Internal Flash (72 Jam)',
    power: 'Baterai Li-ion 18650 3.7V / DC 12V Kapal',
    connectivity: 'Wi-Fi 2.4GHz + Hotspot Pairing Pelabuhan',
    features: [
      'Pemantauan suhu kontinu -1°C s/d +2°C',
      'Display LCD Mini 0.96" OLED hemat daya',
      'Alarm buzzer audio lokal saat es mencair',
      'Sinkronisasi otomatis saat bersandar',
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
    probes: '2x Probe DS18B20 Anti-Karat (Dasar & Permukaan Palka)',
    storage: 'MicroSD 16GB FAT32 + Modul RTC DS3231',
    power: 'Aki Kapal 12V/24V + Cadangan Baterai Internal',
    connectivity: 'Wi-Fi Long-Range + GSM 4G Fallback Ready',
    features: [
      'Dual-zone monitoring (suhu atas & bawah palka)',
      'Layar LCD 16x2 I2C kontras tinggi di anjungan',
      'Pencatatan stempel waktu akurat tanpa internet (RTC)',
      'Sinkronisasi batch instan ke cloud & dasbor web',
      'Ekspor laporan mutu lelang format PDF/Excel',
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
    probes: 'Hingga 6x Probe DS18B20 Bus 1-Wire Terdistribusi',
    storage: 'MicroSD Industri 32GB + Offline Database RTC',
    power: 'Sistem Kelistrikan Kapal Terproteksi Surge 12V-36V',
    connectivity: 'Hybrid Wi-Fi + 4G LTE Gateway + Satellite MQTT Ready',
    features: [
      'Multi-palka telemetry (Palka Kiri, Kanan, Utama, Palka Ikan Umpan)',
      'Panel kontrol anjungan dengan peringatan visual LED RGB multi-level',
      'Integrasi API Tempat Pelelangan Ikan (TPI) & logistik cold-chain',
      'Audit ketertelusuran histamin berstandar ekspor',
      'Dukungan teknis onsite & kalibrasi tahunan bersertifikat',
    ],
    recommendedFor: 'Kapal purse seine / longline > 20 GT, eksportir ikan tuna, dan pengelola TPI.',
    inStock: true,
  },
];
