import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicHeader } from '../../../components/ui/PublicHeader';
import { AboutFooter } from '../../../components/views/about/AboutFooter';

interface SolutionDetail {
  slug: string;
  title: string;
  badge: string;
  h1: string;
  description: string;
  targetAudience: string;
  heroSnippet: string;
  challenges: { title: string; desc: string }[];
  solutions: { title: string; desc: string }[];
  hardwareHighlight: {
    unit: string;
    probes: string;
    logging: string;
    connectivity: string;
  };
  metrics: { label: string; value: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const SOLUTIONS_DATA: Record<string, SolutionDetail> = {
  'kapal-nelayan-tradisional': {
    slug: 'kapal-nelayan-tradisional',
    title: 'Solusi IoT Monitoring Palka Kapal Nelayan Tradisional - TEMBOX',
    badge: 'Kapal Nelayan 1-30 GT',
    h1: 'Sistem Monitoring Suhu Palka Es Kapal Nelayan Tradisional',
    description:
      'Solusi retrofit IoT pemantau suhu palka kapal nelayan tradisional di laut. Mencegah es mencair mendadak, menjaga kesegaran ikan tangkapan, dan menjamin harga lelang tertinggi di TPI.',
    targetAudience: 'Nelayan pancing ulur, kapal jaring 5-30 GT, dan pemilik armada perikanan tangkap.',
    heroSnippet:
      'Nelayan tradisional sering kali kehilangan hingga 35% nilai jual hasil tangkapan akibat es palka mencair tanpa terdeteksi di tengah laut. TEMBOX hadir dengan sensor submersible digital stainless steel dan display LCD lokal di kemudi kapal.',
    challenges: [
      {
        title: 'Es Palka Mencair Tanpa Terpantau',
        desc: 'Nelayan tidak dapat mengetahui suhu di dasar tumpukan ikan tanpa membuka palka, yang justru mempercepat udara panas masuk dan mencairkan es.',
      },
      {
        title: 'Susut Mutu & Penurunan Grade Ikan',
        desc: 'Ikan yang terpapar suhu di atas 4°C selama beberapa jam mengalami dekomposisi enzimatis cepat, menurunkan grade ekspor ke grade lokal murah saat lelang.',
      },
      {
        title: 'Blank Spot Sinyal Seluler di Tengah Laut',
        desc: 'Alat pelacak biasa gagal berfungsi saat kapal berlayar puluhan mil dari pantai karena hilangnya jangkauan BTS darat.',
      },
    ],
    solutions: [
      {
        title: 'Sensor Submersible Stainless Steel DS18B20',
        desc: 'Probe tahan air laut dan tekanan es ditempatkan di palka kiri dan kanan untuk memantau titik terdingin dan terhangat secara simultan.',
      },
      {
        title: 'Layar LCD 1602 Langsung di Ruang Kemudi',
        desc: 'Nahkoda dapat memantau suhu palka secara real-time setiap detik tanpa memerlukan koneksi internet maupun smartphone.',
      },
      {
        title: 'Penyimpanan Offline MicroSD Otomatis',
        desc: 'Data suhu tersimpan aman setiap menit di memori lokal kapal, lalu otomatis terunggah ke dashboard begitu kapal kembali ke jangkauan pelabuhan.',
      },
    ],
    hardwareHighlight: {
      unit: 'TEMBOX Pro Marine Edition',
      probes: '2x Probe Digital DS18B20 Submersible Kabel 3m',
      logging: 'MicroSD Card 16GB (Logging Mandiri hingga 180 Hari Berlayar)',
      connectivity: '4G LTE Auto-Sync + Wi-Fi Hotspot Pairing',
    },
    metrics: [
      { label: 'Penurunan Susut Mutu', value: '70%', desc: 'Mengurangi pembusukan ikan akibat es cair lebih awal' },
      { label: 'Peningkatan Nilai Jual', value: '20-35%', desc: 'Ikan tetap berada pada Grade A saat tiba di dermaga lelang' },
      { label: 'Efisiensi Es Balok', value: '25%', desc: 'Mengetahui waktu isolasi optimal palka tanpa sering membuka tutup' },
    ],
    faqs: [
      {
        q: 'Apakah box TEMBOX tahan terhadap ombak dan air laut?',
        a: 'Ya, box TEMBOX dibuat dari bahan industrial polycarbonate dengan rating proteksi IP67 tahan cipratan air asin dan guncangan ombak laut.',
      },
      {
        q: 'Dari mana catu daya alat di kapal nelayan kayu?',
        a: 'TEMBOX mendukung voltase 9V hingga 24V DC langsung dari aki starter kapal, serta dilengkapi baterai cadangan internal yang bertahan hingga 8 jam jika aki dimatikan.',
      },
    ],
  },
  'cold-storage-perikanan': {
    slug: 'cold-storage-perikanan',
    title: 'Monitoring Suhu Gudang Beku & Cold Storage Perikanan - TEMBOX',
    badge: 'Cold Storage & Gudang Beku',
    h1: 'Sistem Telemetri Suhu Real-Time Cold Storage Perikanan',
    description:
      'Solusi pemantauan suhu otomatis 24/7 untuk cold storage, blast freezer, dan fasilitas pendingin industri perikanan. Memenuhi standar SNI dan sertifikasi HACCP ekspor.',
    targetAudience: 'Pengelola cold storage perikanan, eksportir udang & tuna, dan industri pengolahan hasil laut.',
    heroSnippet:
      'Kegagalan kompresor pendingin di malam hari dapat menghancurkan puluhan ton stok bernilai ratusan juta rupiah. TEMBOX menyediakan pengawasan suhu kontinu multi-titik dengan alarm peringatan instan ke WhatsApp & Email.',
    challenges: [
      {
        title: 'Kegagalan Pendingin Tanpa Terdeteksi',
        desc: 'Kerusakan kompresor atau pemadaman listrik darurat saat pergantian shift dapat menaikkan suhu ruangan beku melewati batas kritis -18°C.',
      },
      {
        title: 'Persyaratan Kepatuhan SNI & HACCP',
        desc: 'Audit kepatuhan ekspor mewajibkan pencatatan suhu kontinu tanpa manipulasi manual untuk setiap batch produk yang disimpan.',
      },
      {
        title: 'Titik Buta Suhu Ruangan Luas',
        desc: 'Satu sensor di dekat pintu sering kali tidak mencerminkan suhu aktual di tumpukan palet bagian dalam ruangan gudang.',
      },
    ],
    solutions: [
      {
        title: 'Sensor Multi-Channel Multi-Zone',
        desc: 'Dukungan hingga 4 probe sensor presisi tinggi untuk memetakan distribusi suhu di zona pintu, langit-langit, dan sudut ruangan.',
      },
      {
        title: 'Notifikasi Anomali Suhu Kritis Cepat',
        desc: 'Kirim notifikasi otomatis ke tim maintenance jika suhu naik melebihi ambang batas toleransi yang ditentukan.',
      },
      {
        title: 'Ekspor Log Audit CSV / PDF Siap Cetak',
        desc: 'Download riwayat suhu per jam, harian, atau bulanan secara lengkap untuk kelengkapan berkas verifikasi auditor mutu.',
      },
    ],
    hardwareHighlight: {
      unit: 'TEMBOX Enterprise Industrial',
      probes: '4x Probe Stainless Food-Grade Terkalibrasi ±0.3°C',
      logging: 'Dual Storage MicroSD Industrial + Cloud Database PostgreSQL',
      connectivity: 'Ethernet LAN + 4G LTE Backup + Wi-Fi',
    },
    metrics: [
      { label: 'Uptime Monitoring', value: '99.9%', desc: 'Pemantauan tanpa jeda 24 jam sehari, 7 hari seminggu' },
      { label: 'Waktu Respon Insiden', value: '< 2 Menit', desc: 'Peringatan cepat sebelum suhu merusak struktur daging ikan' },
      { label: 'Kepatuhan Audit', value: '100%', desc: 'Log data digital terenkripsi memenuhi regulasi HACCP & BPOM' },
    ],
    faqs: [
      {
        q: 'Berapa rentang suhu terendah yang dapat dibaca sensor?',
        a: 'Sensor digital TEMBOX mampu membaca suhu stabil dari -55°C hingga +125°C dengan deviasi akurasi terkalibrasi hanya ±0.3°C pada rentang beku.',
      },
      {
        q: 'Apakah bisa dihubungkan ke sistem genset otomatis?',
        a: 'Bisa, unit TEMBOX Enterprise menyediakan port relay output yang dapat mentrigger sirene eksternal atau sistem interlock darurat saat alarm berbunyi.',
      },
    ],
  },
  'transportasi-rantai-dingin': {
    slug: 'transportasi-rantai-dingin',
    title: 'Telemetri Suhu Truk Termal & Logistik Rantai Dingin - TEMBOX',
    badge: 'Truk Pendingin & Reefer',
    h1: 'Pemantauan Suhu & Telemetri Truk Logistik Rantai Dingin',
    description:
      'Solusi pelacakan suhu dan integritas termal armada truk reefer, mobil box berinsulasi, dan kontainer pendingin ikan antar pulau dengan bukti kualitas digital.',
    targetAudience: 'Perusahaan ekspedisi rantai dingin, distributor ikan beku, dan operator truk reefer.',
    heroSnippet:
      'Jarak tempuh darat ratusan kilometer menuntut pembuktian bahwa mesin pendingin truk selalu aktif sepanjang perjalanan. TEMBOX merekam suhu kontinu sebagai bukti serah terima (Proof of Quality) yang sah.',
    challenges: [
      {
        title: 'Praktik Pemadaman Pendingin di Jalan',
        desc: 'Oknum pengemudi kerap mematikan unit pendingin di tengah rute untuk menghemat bahan bakar dan menyalakannya kembali menjelang titik bongkar.',
      },
      {
        title: 'Penolakan Produk oleh Penerima (Buyer)',
        desc: 'Penerima menolak muatan akibat ikan tiba dalam kondisi lembek tanpa bukti objektif mengenai riwayat suhu selama perjalanan.',
      },
      {
        title: 'Fluktuasi Suhu Saat Pintu Dibuka',
        desc: 'Proses pengiriman multi-titik (multi-drop) menyebabkan lonjakan suhu kabin kargo yang harus terdokumentasi durasinya.',
      },
    ],
    solutions: [
      {
        title: 'Perekaman Suhu Tidak Dapat Dimanipulasi',
        desc: 'Sensor merekam suhu kabin box secara independen dengan stempel waktu RTC anti-tamper yang tidak dapat diubah oleh pengemudi.',
      },
      {
        title: 'Sertifikat Suhu Perjalanan Otomatis',
        desc: 'Penerima dapat memindai kode QR atau mengunduh invoice perjalanan untuk memverifikasi bahwa suhu terjaga di bawah 0°C.',
      },
      {
        title: 'Koneksi Seluler 4G Terintegrasi',
        desc: 'Data telemetri ditransmisikan secara kontinu ke kantor operasional logistik untuk memantau seluruh armada dari satu layar.',
      },
    ],
    hardwareHighlight: {
      unit: 'TEMBOX Pro Fleet Edition',
      probes: '2x Probe Submersible Flensa Palka Kargo',
      logging: 'MicroSD Flash Logging (Kapasitas Jutaan Titik Rute)',
      connectivity: '4G LTE Multi-Operator SIM + GPS Tracker Ready',
    },
    metrics: [
      { label: 'Klaim Retur Muatan', value: 'Turun 85%', desc: 'Menghilangkan sengketa mutu saat serah terima barang' },
      { label: 'Disiplin Pengemudi', value: '100%', desc: 'Mesin pendingin terpantau aktif sepanjang rute pengantaran' },
      { label: 'Integritas Suhu Rute', value: '< 2°C Fluktuasi', desc: 'Menjamin kualitas ikan tetap prima hingga ke tangan konsumen' },
    ],
    faqs: [
      {
        q: 'Bagaimana jika truk melewati jalur pegunungan tanpa sinyal?',
        a: 'Data suhu tetap tersimpan rapi per detik di MicroSD internal. Begitu truk memasuki area berjangkauan seluler, data otomatis disinkronisasi ke cloud tanpa kehilangan riwayat.',
      },
      {
        q: 'Apakah instalasi rumit dan membutuhkan modifikasi body truk?',
        a: 'Tidak, kabel probe fleksibel dapat diselipkan melalui lubang drainase atau celah paking pintu reefer tanpa melubangi dinding insulasi poliuretan.',
      },
    ],
  },
  'koperasi-pelelangan-ikan': {
    slug: 'koperasi-pelelangan-ikan',
    title: 'Sistem Mutu Cold-Chain Koperasi Nelayan & TPI - TEMBOX',
    badge: 'Koperasi Nelayan & TPI',
    h1: 'Standardisasi Mutu Ikan Segar untuk Koperasi & TPI',
    description:
      'Platform pengawasan cold-chain terpadu bagi Koperasi Unit Desa (KUD), Tempat Pelelangan Ikan (TPI), dan dinas perikanan untuk menaikkan nilai tawar nelayan.',
    targetAudience: 'Pengurus Koperasi Nelayan, pengelola TPI, asosiasi nelayan, dan pembina UMKM maritim.',
    heroSnippet:
      'Tanpa transparansi data suhu palka, nelayan rentan ditekan oleh tengkulak dengan dalih ikan kurang segar. TEMBOX memberikan sertifikasi data digital yang membuktikan mutu tangkapan nelayan.',
    challenges: [
      {
        title: 'Penilaian Mutu Subjektif Sepihak',
        desc: 'Penentuan harga ikan di dermaga sering kali ditentukan sepihak oleh pedagang besar tanpa alat ukur kondisi pendinginan yang objektif.',
      },
      {
        title: 'Ketiadaan Standardisasi Armada Koperasi',
        desc: 'Koperasi kesulitan memastikan seluruh kapal binaannya menjaga standar rantai dingin yang seragam.',
      },
      {
        title: 'Rendahnya Nilai Tambah Nelayan Kecil',
        desc: 'Nelayan kecil terpaksa menjual cepat tangkapannya dengan harga obral karena khawatir es palka tidak bertahan lama.',
      },
    ],
    solutions: [
      {
        title: 'Dashboard Multi-Kapal Terpusat Koperasi',
        desc: 'Pengurus koperasi dapat memantau kondisi palka seluruh kapal anggota yang sedang melaut secara real-time dari satu dashboard.',
      },
      {
        title: 'Label Kesegaran Berbasis Data Suhu Aktual',
        desc: 'Ikan yang terbukti tersimpan di bawah 2°C sepanjang pelayaran mendapat label "Fresh Catch Verified" untuk dilelang dengan harga premium.',
      },
      {
        title: 'Pengadaan Kolektif & Subsidi Koperasi',
        desc: 'Paket TEMBOX Mini dan Pro yang terjangkau dapat diangsur melalui hasil bagi hasil tangkapan nelayan di koperasi.',
      },
    ],
    hardwareHighlight: {
      unit: 'TEMBOX Fleet Management Suite',
      probes: 'Sensor Modular DS18B20 Standar Palka Nasional',
      logging: 'Sinkronisasi Otomatis Portal Koperasi TPI',
      connectivity: 'Wi-Fi Hub Pelabuhan + 4G Seluler',
    },
    metrics: [
      { label: 'Kenaikan Harga Jual', value: '+15-25%', desc: 'Ikan berlabel sertifikat suhu terbukti lebih diminati buyer premium' },
      { label: 'Transparansi Lelang', value: '100%', desc: 'Data suhu terbuka bagi peserta lelang dan pengurus TPI' },
      { label: 'Partisipasi Anggota', value: '> 80 Kapal', desc: 'Skalabilitas mudah diterapkan pada armada kapal koperasi' },
    ],
    faqs: [
      {
        q: 'Apakah koperasi dapat memesan unit dalam jumlah banyak dengan nama kustom?',
        a: 'Ya, kami menyediakan paket fleet order untuk koperasi nelayan dan TPI dengan kustomisasi branding nama palka armada dan pelatihan teknis pemasangan.',
      },
      {
        q: 'Bagaimana cara mendaftarkan seluruh kapal anggota ke satu akun pengawas?',
        a: 'Dashboard TEMBOX mendukung multi-device pairing. Satu akun koperasi dapat mengelompokkan puluhan nomor kapal dan memantau statusnya dalam satu tabel ringkas.',
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(SOLUTIONS_DATA).map((kategori) => ({
    kategori,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const data = SOLUTIONS_DATA[kategori];

  if (!data) {
    return {
      title: 'Solusi Cold-Chain Tidak Ditemukan - TEMBOX',
    };
  }

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `https://ice-tembox.vercel.app/solusi/${data.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://ice-tembox.vercel.app/solusi/${data.slug}`,
      siteName: 'TEMBOX Cold-Chain Telemetry',
      locale: 'id_ID',
      type: 'article',
    },
  };
}

export default async function SolusiCategoryPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const data = SOLUTIONS_DATA[kategori];

  if (!data) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Beranda',
            item: 'https://ice-tembox.vercel.app',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Solusi Cold-Chain',
            item: 'https://ice-tembox.vercel.app/solusi',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.h1,
            item: `https://ice-tembox.vercel.app/solusi/${data.slug}`,
          },
        ],
      },
      {
        '@type': 'Organization',
        name: 'TEMBOX',
        url: 'https://ice-tembox.vercel.app',
        logo: 'https://ice-tembox.vercel.app/LogoTembox-Horizontal.png',
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader />

      <main style={{ flex: 1, padding: '48px 20px 80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          {/* Breadcrumb Nav */}
          <nav style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Beranda</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/solusi" style={{ color: '#94A3B8', textDecoration: 'none' }}>Solusi Industri</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#7DDCE8', fontWeight: 600 }}>{data.badge}</span>
          </nav>

          {/* Hero Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '36px', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              {data.badge}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
              {data.h1}
            </h1>
            <p style={{ fontSize: '16px', color: '#CBD5E1', maxWidth: '820px', margin: '0 0 24px', lineHeight: 1.7 }}>
              {data.heroSnippet}
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/market"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#38BDF8',
                  color: '#071A27',
                  padding: '12px 26px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Pilih Unit Sesuai Kapal &rarr;
              </Link>
              <Link
                href="/contact"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'transparent',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Konsultasi Kebutuhan Armada
              </Link>
            </div>
          </div>

          {/* Impact Metrics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '40px',
              marginBottom: '48px',
            }}
          >
            {data.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#0B2D42',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#38BDF8', marginBottom: '6px' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5 }}>
                  {m.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Problem vs Solution Split */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Tantangan Lapangan &amp; Solusi Rekayasa TEMBOX
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '32px' }}>
              Bagaimana teknologi IoT cold-chain kami mengatasi hambatan teknis spesifik pada sektor ini.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {/* Challenges Column */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✕</span> Kendala Operasional Nyata
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.challenges.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '10px',
                        padding: '18px 20px',
                      }}
                    >
                      <strong style={{ display: 'block', color: '#FCA5A5', fontSize: '14px', marginBottom: '6px' }}>
                        {c.title}
                      </strong>
                      <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solutions Column */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#34D399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓</span> Pendekatan Rekayasa TEMBOX
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.solutions.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '10px',
                        padding: '18px 20px',
                      }}
                    >
                      <strong style={{ display: 'block', color: '#6EE7B7', fontSize: '14px', marginBottom: '6px' }}>
                        {s.title}
                      </strong>
                      <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Hardware Configuration */}
          <div
            style={{
              backgroundColor: '#0B2D42',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '36px 32px',
              marginBottom: '64px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7DDCE8', letterSpacing: '0.08em' }}>
                  Konfigurasi Hardware yang Direkomendasikan
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 0' }}>
                  {data.hardwareHighlight.unit}
                </h3>
              </div>
              <Link
                href="/market"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#38BDF8',
                  color: '#071A27',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Lihat Spesifikasi &amp; Harga &rarr;
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '13.5px' }}>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '12px' }}>Sensor Suhu</span>
                <strong style={{ color: '#FFFFFF' }}>{data.hardwareHighlight.probes}</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '12px' }}>Perekaman Mandiri</span>
                <strong style={{ color: '#FFFFFF' }}>{data.hardwareHighlight.logging}</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <span style={{ color: '#94A3B8', display: 'block', fontSize: '12px' }}>Konektivitas</span>
                <strong style={{ color: '#FFFFFF' }}>{data.hardwareHighlight.connectivity}</strong>
              </div>
            </div>
          </div>

          {/* Solution FAQ */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>
              Pertanyaan yang Sering Diajukan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.faqs.map((f, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#0B2D42',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '20px 24px',
                  }}
                >
                  <strong style={{ display: 'block', color: '#7DDCE8', fontSize: '15px', marginBottom: '8px' }}>
                    {f.q}
                  </strong>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Solution Links */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '32px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Jelajahi Solusi Sektor Lainnya:
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.values(SOLUTIONS_DATA)
                .filter((s) => s.slug !== data.slug)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/solusi/${other.slug}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#7DDCE8',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {other.badge} &rarr;
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </main>

      <AboutFooter />
    </div>
  );
}
