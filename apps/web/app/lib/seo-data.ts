export interface SeoTopic {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  targetKeywords: string[];
  metaDescription: string;
  optimalTemp: string;
  maxStorageDays: string;
  overview: string;
  challenge: string;
  solution: string;
  keyFeatures: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export const PRIMARY_TOPICS: SeoTopic[] = [
  {
    slug: 'monitoring-suhu-palka-ikan',
    title: 'Sistem Monitoring Suhu Palka Ikan Berbasis IoT',
    subtitle: 'Solusi Cerdas Pengawasan Suhu Dingin Palka Nelayan Sepanjang Pelayaran Samudra',
    category: 'IoT Maritim & Cold Chain',
    targetKeywords: [
      'monitoring suhu palka ikan',
      'alat pantau suhu kapal nelayan',
      'iot palka es',
      'sensor suhu palka kapal',
    ],
    metaDescription:
      'Solusi monitoring suhu palka ikan real-time dengan sensor DS18B20 dan IoT ESP32. Menjaga kualitas tangkapan nelayan, mencegah es mencair tanpa disadari.',
    optimalTemp: '-1°C s/d +2°C',
    maxStorageDays: '7 - 12 Hari',
    overview:
      'Pengawasan suhu palka es secara manual sering menyebabkan nelayan terlambat menyadari naiknya temperatur palka saat berlayar di tengah laut. TEMBOX menghadirkan telemetri palka otomatis dengan alarm visual & buzzer seketika suhu melampaui ambang batas.',
    challenge:
      'Nelayan tradisional mengandalkan bongkahan es balok tanpa indikator visual. Ketika es mencair di dasar palka, bakteri pembusuk dan histamin berkembang biak dengan cepat, menurunkan mutu ikan saat dilelang di TPI.',
    solution:
      'TEMBOX dipasang secara modular (retrofit) pada dinding atau tutup kotak palka tanpa mengubah konstruksi kapal. Probe sensor tahan korosi air laut memantau suhu secara kontinu tiap detik.',
    keyFeatures: [
      {
        title: 'Sensor DS18B20 Anti-Korosi',
        desc: 'Probe baja tahan karat bersertifikasi IP68 tahan terhadap air laut dan kelembapan ekstrem palka.',
      },
      {
        title: 'Peringatan Dini Audio & Visual',
        desc: 'Layar LCD 16x2, lampu LED RGB, dan Buzzer aktif memperingatkan ABK seketika suhu palka mendekati ambang kritis.',
      },
      {
        title: 'Logging Offline MicroSD FAT32',
        desc: 'Mencatat stempel waktu RTC DS3231 secara presisi meski kapal berlayar berminggu-minggu di luar sinyal seluler.',
      },
      {
        title: 'Sinkronisasi Otomatis ke Cloud',
        desc: 'Data telemetri langsung terunggah ke server cloud saat kapal merapat di dermaga pelabuhan.',
      },
    ],
    faqs: [
      {
        question: 'Berapa suhu ideal untuk palka penyimpanan ikan segar?',
        answer:
          'Suhu ideal penyimpanan ikan segar di dalam palka es berkisar antara 0°C hingga +2°C. Suhu di atas 4°C mempercepat pembusukan enzimatis dan pertumbuhan bakteri.',
      },
      {
        question: 'Apakah alat ini aman dari percikan air laut dan garam?',
        answer:
          'Ya, komponen probe eksternal TEMBOX menggunakan stainless steel marine-grade dan kotak kontrol utama terlindung dalam box enclosure berstandar industri tahan air.',
      },
    ],
  },
  {
    slug: 'iot-cold-chain-perikanan',
    title: 'Manajemen IoT Cold Chain Perikanan Tangkap Nusantara',
    subtitle: 'Digitalisasi Rantai Pasok Dingin dari Samudra Lepas Hingga ke Tangan Konsumen',
    category: 'Rantai Pasok Perikanan',
    targetKeywords: [
      'iot cold chain perikanan',
      'rantai dingin ikan laut',
      'cold chain logistics nelayan',
      'teknologi pendingin ikan',
    ],
    metaDescription:
      'Pelajari bagaimana IoT cold chain merevolusi logistik perikanan tangkap Indonesia. Verifikasi integritas rantai dingin ikan segar dengan teknologi cerdas TEMBOX.',
    optimalTemp: '0°C s/d +4°C',
    maxStorageDays: '10 - 14 Hari',
    overview:
      'Rantai dingin (cold chain) perikanan tangkap adalah penentu utama harga jual ikan di pasar ekspor maupun domestik. TEMBOX menyediakan bukti rekam jejak suhu digital yang transparan dan tidak dapat dimanipulasi.',
    challenge:
      'Kurangnya transparansi suhu antara nelayan penangkap, pengepul dermaga, dan armada logistik darat menyebabkan klaim kerugian mutually distrusted atas penurunan kesegaran ikan.',
    solution:
      'Integrasi data sensor real-time dari palka kapal hingga truk pendingin darat yang terhubung ke satu dasbor analitik terpusat.',
    keyFeatures: [
      {
        title: 'Audit Trail Riwayat Suhu',
        desc: 'Grafik suhu per jam yang membuktikan bahwa ikan disimpan pada rentang suhu dingin aman sepanjang perjalanan.',
      },
      {
        title: 'Kepatuhan Standar HACCP',
        desc: 'Memenuhi persyaratan keamanan pangan internasional untuk komoditas ekspor seperti Tuna dan Cakalang.',
      },
      {
        title: 'Dasbor Web Responsif Multi-Perangkat',
        desc: 'Dapat diakses oleh manajer TPI, koperasi nelayan, dan pemilik armada melalui smartphone maupun PC.',
      },
    ],
    faqs: [
      {
        question: 'Mengapa verifikasi cold chain sangat penting untuk nelayan?',
        answer:
          'Ikan yang memiliki bukti rekaman suhu dingin stabil dapat dijual dengan harga lelang 20-40% lebih tinggi karena dijamin bebas dari degradasi mutu histamin.',
      },
    ],
  },
  {
    slug: 'sensor-suhu-ds18b20-kapal',
    title: 'Aplikasi Sensor Suhu Digital DS18B20 pada Kotak Palka Kapal',
    subtitle: 'Akurasi Pengukuran 1-Wire dengan Ketahanan Terhadap Lingkungan Bahari Ekstrem',
    category: 'Teknologi Hardware & Sensor',
    targetKeywords: [
      'sensor suhu ds18b20 kapal',
      'waterproof temperature sensor palka',
      'probe suhu air laut',
      'sensor 1-wire maritim',
    ],
    metaDescription:
      'Spesifikasi teknis sensor DS18B20 anti-karat untuk pemantauan suhu es palka kapal nelayan. Presisi tinggi 1-Wire untuk efisiensi penyimpanan ikan.',
    optimalTemp: '-55°C s/d +125°C',
    maxStorageDays: 'Non-stop Monitoring',
    overview:
      'Sensor suhu analog biasa rentan terhadap interferensi tegangan dan degradasi kabel panjang. TEMBOX mengadopsi sensor digital DS18B20 dengan protokol 1-Wire yang kebal interferensi sinyal kabel panjang di dek kapal.',
    challenge:
      'Air laut memiliki tingkat salinitas tinggi yang dengan cepat merusak probe logam standar. Kabel sensor juga berisiko terjepit beban es dan ikan ratusan kilogram.',
    solution:
      'Penggunaan probe bertutup selongsong baja 316 dengan kabel silikon fleksibel anti-getas tahan terhadap himpitan balok es.',
    keyFeatures: [
      {
        title: 'Akurasi ±0.5°C',
        desc: 'Kalibrasi presisi pada rentang kritis -10°C hingga +10°C.',
      },
      {
        title: 'Komunikasi Digital 1-Wire',
        desc: 'Mengirimkan data pembacaan langsung dalam format biner tanpa mengalami degradasi akibat panjang kabel.',
      },
    ],
    faqs: [
      {
        question: 'Apakah kabel probe sensor bisa diperpanjang?',
        answer:
          'Bisa, protokol 1-Wire mendukung panjang kabel hingga belasan meter tanpa kehilangan akurasi sinyal digital.',
      },
    ],
  },
  {
    slug: 'retrofit-coolbox-nelayan',
    title: 'Retrofit Modular: Mengubah Coolbox Konvensional Menjadi Smart Palka',
    subtitle: 'Upgrade Kotak Penyimpanan Ikan Tanpa Merombak Konstruksi Fisik Armada Kapal',
    category: 'Rekayasa Perangkat Nelayan',
    targetKeywords: [
      'retrofit coolbox nelayan',
      'smart coolbox perikanan',
      'kotak ikan cerdas',
      'upgrade palka es kapal',
    ],
    metaDescription:
      'Teknologi retrofit modular TEMBOX memungkinkan kotak palka atau styrofoam box nelayan diubah menjadi sistem penyimpanan pintar berbiaya hemat.',
    optimalTemp: '0°C s/d +3°C',
    maxStorageDays: 'Sesuai Kapasitas Es',
    overview:
      'Membeli armada kapal baru dengan sistem freezer berdaya genset besar membutuhkan investasi ratusan juta rupiah yang di luar jangkauan nelayan kecil. Solusi retrofit TEMBOX memberikan lompatan teknologi dengan biaya terjangkau.',
    challenge:
      'Lebih dari 85% kapal penangkap ikan di Indonesia berbobot di bawah 10 GT yang hanya mengandalkan coolbox insulasi styrofoam atau palka kayu lapis semen.',
    solution:
      'Perangkat modular mandiri berdaya rendah (low-power battery/solar-ready) yang dapat dipasang di wadah penyimpanan apa pun dalam waktu kurang dari 15 menit.',
    keyFeatures: [
      {
        title: 'Konsumsi Daya Rendah (<1W)',
        desc: 'Baterai lithium berumur panjang atau dapat disambungkan ke aki starter kapal 12V.',
      },
      {
        title: 'Pemasangan Non-Invasif',
        desc: 'Hanya membutuhkan satu lubang kecil seal kedap air untuk selongsong probe sensor.',
      },
    ],
    faqs: [
      {
        question: 'Apakah alat ini bisa dipindah-pindah ke box lain?',
        answer:
          'Sangat bisa. Desain modular klem lepas-pasang memudahkan nelayan memindahkan TEMBOX ke box es lain saat dibutuhkan.',
      },
    ],
  },
  {
    slug: 'data-logger-offline-microsd',
    title: 'Sistem Data Logger Palka Offline-First dengan Penyimpanan MicroSD',
    subtitle: 'Pencatatan Telemetri Suhu Terus-Menerus Tanpa Ketergantungan Kuota Seluler di Tengah Laut',
    category: 'Arsitektur Firmware & IoT',
    targetKeywords: [
      'data logger suhu offline',
      'logger suhu microsd palka',
      'rtc ds3231 perikanan',
      'esp32 sd card data logger',
    ],
    metaDescription:
      'Arsitektur offline-first TEMBOX menjamin nol data hilang saat kapal berlayar berminggu-minggu di samudra tanpa sinyal internet.',
    optimalTemp: 'Real-time Interval 1 Menit',
    maxStorageDays: 'Hingga 365 Hari Data',
    overview:
      'Di laut lepas, sinyal BTS seluler 4G/GSM tidak terjangkau. Pendekatan IoT konvensional yang bergantung pada transmisi awan terus-menerus akan gagal total. TEMBOX menerapkan filosofi Offline-First.',
    challenge:
      'Konektivitas maritim sangat terbatas dan mahal. Perangkat logging harus mampu bertahan dalam kondisi restart mendadak dan mencatat waktu akurat.',
    solution:
      'Modul RTC (Real-Time Clock) DS3231 dengan kompensasi temperatur menjaga waktu berpresisi tinggi, menulis file CSV terstruktur langsung ke kartu MicroSD berformat FAT32.',
    keyFeatures: [
      {
        title: 'Buffer Lokal Kebal Padam Listrik',
        desc: 'Mekanisme flush berkala mencegah korupsi file log saat suplai daya terputus.',
      },
      {
        title: 'Sinkronisasi Otomatis di Dermaga',
        desc: 'Deteksi Wi-Fi otomatis saat merapat untuk transfer data batch ke server Supabase cloud.',
      },
    ],
    faqs: [
      {
        question: 'Berapa kapasitas data yang bisa disimpan kartu MicroSD?',
        answer:
          'Kartu MicroSD 16GB mampu menyimpan data telemetri suhu per menit tanpa henti hingga lebih dari 5 tahun.',
      },
    ],
  },
  {
    slug: 'standar-suhu-ekspor-ikan-haccp',
    title: 'Standar Manajemen Suhu Dingin untuk Ikan Kualitas Ekspor (HACCP)',
    subtitle: 'Memenuhi Syarat Ketat Pasar Uni Eropa, Jepang, dan Amerika Serikat dengan Verifikasi Termal',
    category: 'Kualitas & Regulasi Ekspor',
    targetKeywords: [
      'standar suhu ekspor ikan',
      'haccp suhu ikan segar',
      'regulasi rantai dingin perikanan',
      'cegah histamin ikan tuna',
    ],
    metaDescription:
      'Panduan standar suhu penyimpanan dingin ikan laut sesuai regulasi ekspor HACCP internasional dan peran telemetri IoT TEMBOX.',
    optimalTemp: '0°C s/d +1.5°C',
    maxStorageDays: 'Sesuai Sertifikasi TPI',
    overview:
      'Komoditas laut bernilai tinggi seperti Tuna Sirip Kuning (Yellowfin Tuna) dan Kakap Merah sangat sensitif terhadap fluktuasi suhu. Kenaikan suhu sedikit saja memicu pembentukan racun histamin yang berujung pada penolakan kontainer ekspor.',
    challenge:
      'Eksportir menolak hasil tangkapan nelayan jika tidak ada bukti konsistensi suhu dingin sejak saat ikan ditarik dari mata kail di samudra.',
    solution:
      'Laporan histori suhu TEMBOX yang dapat diunduh dalam format PDF/Excel sebagai lampiran dokumen sertifikasi mutu hasil tangkapan.',
    keyFeatures: [
      {
        title: 'Laporan Kesegaran Ikan Digital',
        desc: 'Menghasilkan sertifikat riwayat dingin bernomor seri untuk setiap trip pelayaran kapal.',
      },
    ],
    faqs: [
      {
        question: 'Pada suhu berapa pembentukan racun histamin ikan terjadi?',
        answer:
          'Bakteri penghasil enzim histidin dekarboksilase aktif berkembang biak pada suhu di atas 4.4°C. Menjaga suhu di kisaran 0°C - 2°C mutlak diperlukan untuk mencegah timbulnya histamin.',
      },
    ],
  },
];

// Commodity & Region Matrices for Programmatic Content Scaling
export const COMMODITIES = [
  { name: 'Ikan Tuna Sirip Kuning', slug: 'ikan-tuna', temp: '-1°C s/d +1°C', shelf: '12 Hari' },
  { name: 'Ikan Tongkol', slug: 'ikan-tongkol', temp: '0°C s/d +2°C', shelf: '8 Hari' },
  { name: 'Ikan Cakalang', slug: 'ikan-cakalang', temp: '0°C s/d +2°C', shelf: '10 Hari' },
  { name: 'Ikan Kakap Merah', slug: 'ikan-kakap-merah', temp: '0°C s/d +2°C', shelf: '10 Hari' },
  { name: 'Ikan Kerapu Segar', slug: 'ikan-kerapu', temp: '0°C s/d +3°C', shelf: '9 Hari' },
  { name: 'Ikan Tenggiri', slug: 'ikan-tenggiri', temp: '-1°C s/d +2°C', shelf: '8 Hari' },
  { name: 'Udang Vaname', slug: 'udang-vaname', temp: '0°C s/d +1°C', shelf: '6 Hari' },
  { name: 'Cumi-Cumi Segar', slug: 'cumi-cumi', temp: '-1°C s/d +1°C', shelf: '7 Hari' },
  { name: 'Ikan Kembung', slug: 'ikan-kembung', temp: '0°C s/d +2°C', shelf: '7 Hari' },
  { name: 'Ikan Layang', slug: 'ikan-layang', temp: '0°C s/d +2°C', shelf: '8 Hari' },
];

export const REGIONS = [
  { name: 'Muara Angke Jakarta', slug: 'muara-angke', province: 'DKI Jakarta' },
  { name: 'Cilacap Jawa Tengah', slug: 'cilacap', province: 'Jawa Tengah' },
  { name: 'Cipatujah Tasikmalaya', slug: 'cipatujah-tasikmalaya', province: 'Jawa Barat' },
  { name: 'Pelabuhan Ratu Sukabumi', slug: 'pelabuhan-ratu', province: 'Jawa Barat' },
  { name: 'Pengambengan Bali', slug: 'pengambengan-bali', province: 'Bali' },
  { name: 'Muncar Banyuwangi', slug: 'muncar-banyuwangi', province: 'Jawa Timur' },
  { name: 'Brondong Lamongan', slug: 'brondong-lamongan', province: 'Jawa Timur' },
  { name: 'Kendari Sulawesi Tenggara', slug: 'kendari', province: 'Sulawesi Tenggara' },
  { name: 'Bitung Sulawesi Utara', slug: 'bitung', province: 'Sulawesi Utara' },
  { name: 'Ambon Maluku', slug: 'ambon', province: 'Maluku' },
  { name: 'Belawan Sumatera Utara', slug: 'belawan', province: 'Sumatera Utara' },
  { name: 'Sibolga Sumatera Utara', slug: 'sibolga', province: 'Sumatera Utara' },
];

export const FOCUS_TOPICS = [
  { title: 'Monitoring Suhu Palka', slug: 'monitoring-suhu-palka' },
  { title: 'Manajemen Rantai Dingin', slug: 'rantai-dingin' },
  { title: 'Retrofit Coolbox IoT', slug: 'retrofit-coolbox' },
  { title: 'Alarm Suhu Es Mencair', slug: 'alarm-suhu-es' },
  { title: 'Audit Mutu Tangkapan TPI', slug: 'audit-mutu-tpi' },
];

/**
 * Generate programmatic fallback topic from any slug or keyword
 */
export function resolveSeoTopic(rawSlug: string): SeoTopic {
  const cleanSlug = rawSlug.trim().toLowerCase();

  // 1. Direct match with Primary Topics
  const primaryMatch = PRIMARY_TOPICS.find((t) => t.slug === cleanSlug);
  if (primaryMatch) {
    return primaryMatch;
  }

  // 2. Programmatic Dynamic Generator
  // Deconstruct keywords from slug
  const words = cleanSlug.split('-').filter(Boolean);
  const formattedTitleWords = words.map(
    (w) => w.charAt(0).toUpperCase() + w.slice(1)
  );
  const readableTitle = formattedTitleWords.join(' ');

  // Identify matching commodity or region
  const matchedCommodity = COMMODITIES.find((c) =>
    cleanSlug.includes(c.slug)
  );
  const matchedRegion = REGIONS.find((r) => cleanSlug.includes(r.slug));

  const optimalTemp = matchedCommodity ? matchedCommodity.temp : '0°C s/d +2°C';
  const shelfLife = matchedCommodity ? matchedCommodity.shelf : '8 - 12 Hari';
  const regionNote = matchedRegion
    ? ` di pelabuhan dan sentra perikanan ${matchedRegion.name}`
    : ' armada kapal nelayan maritim Indonesia';

  return {
    slug: cleanSlug,
    title: `${readableTitle} — Solusi IoT & Rantai Dingin TEMBOX`,
    subtitle: `Standar Pengawasan dan Efisiensi Suhu Dingin untuk ${readableTitle}${regionNote}`,
    category: 'Sistem Rantai Dingin & IoT Perikanan',
    targetKeywords: [
      cleanSlug.replace(/-/g, ' '),
      'monitoring suhu palka',
      'iot nelayan',
      'cold chain perikanan',
      matchedCommodity ? matchedCommodity.name : 'ikan segar',
    ],
    metaDescription: `Informasi teknis dan solusi cerdas seputar ${readableTitle}. Ketahui suhu penyimpanan optimal ${optimalTemp} dan pencegahan susut mutu ikan dengan perangkat pintar TEMBOX.`,
    optimalTemp,
    maxStorageDays: shelfLife,
    overview: `Penerapan teknologi pemantauan suhu otomatis untuk ${readableTitle} menjadi kunci dalam meningkatkan margin keuntungan nelayan dan menjaga kesegaran ikan agar memenuhi standar mutu Tempat Pelelangan Ikan (TPI) dan pasar ekspor.`,
    challenge: `Tantangan utama pada pengelolaan ${readableTitle} adalah fluktuasi es batu palka yang mencair akibat cuaca panas laut dan durasi pelayaran yang panjang, mengakibatkan bakteri pembusuk berkembang biak tanpa disadari oleh awak kapal.`,
    solution: `Sistem modular TEMBOX memberikan peringatan dini seketika suhu menyentuh ambang batas kritis, mencatat data telemetri ke kartu memori offline, dan menyinkronkan status tangkapan ke dasbor cloud saat kapal merapat.`,
    keyFeatures: [
      {
        title: 'Kontrol Suhu Presisi Tinggi',
        desc: `Menjaga stabilitas termal pada kisaran aman ${optimalTemp} sepanjang hari pelayaran.`,
      },
      {
        title: 'Sensor Anti-Korosi Air Asin',
        desc: 'Komponen stainless steel marine-grade tahan banting terhadap gesekan balok es dan salinitas tinggi.',
      },
      {
        title: 'Dasbor Web Terintegrasi',
        desc: 'Pemantauan grafik riwayat suhu yang dapat diakses oleh pengepul, koperasi, dan pemilik armada.',
      },
      {
        title: 'Peringatan Audio-Visual ABK',
        desc: 'Alarm suara buzzer dan lampu LED memberi tahu nelayan untuk segera menambah es saat suhu mulai naik.',
      },
    ],
    faqs: [
      {
        question: `Berapa suhu penyimpanan yang ideal untuk ${readableTitle}?`,
        answer: `Untuk menjaga kesegaran terbaik dan mencegah pembentukan histamin, suhu penyimpanan direkomendasikan berada pada rentang ${optimalTemp}.`,
      },
      {
        question: 'Bagaimana TEMBOX membantu armada nelayan setempat?',
        answer:
          'TEMBOX dipasang langsung pada kotak palka atau coolbox yang sudah ada tanpa perlu merombak fisik kapal, memberikan bukti riwayat suhu dingin terverifikasi saat ikan dilelang.',
      },
    ],
  };
}

/**
 * Generates an array of programmatic URLs for sitemap and indexation
 */
export function generateProgrammaticUrls(): { slug: string; priority: number }[] {
  const result: { slug: string; priority: number }[] = [];

  // 1. Primary Topics
  PRIMARY_TOPICS.forEach((t) => {
    result.push({ slug: t.slug, priority: 0.9 });
  });

  // 2. Commodities × Focus Topics
  COMMODITIES.forEach((c) => {
    FOCUS_TOPICS.forEach((f) => {
      result.push({
        slug: `${f.slug}-${c.slug}`,
        priority: 0.8,
      });
    });
  });

  // 3. Regions × Commodities
  REGIONS.forEach((r) => {
    COMMODITIES.slice(0, 5).forEach((c) => {
      result.push({
        slug: `suhu-palka-${c.slug}-${r.slug}`,
        priority: 0.7,
      });
    });
  });

  // 4. Focus Topics × Regions
  FOCUS_TOPICS.forEach((f) => {
    REGIONS.forEach((r) => {
      result.push({
        slug: `${f.slug}-${r.slug}`,
        priority: 0.75,
      });
    });
  });

  return result;
}

