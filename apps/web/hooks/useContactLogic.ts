import { useState, useEffect, useCallback } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryOption {
  id: string;
  title: string;
  badge: string;
  description: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'Konsultasi Perangkat',
    title: 'Konsultasi Perangkat TEMBOX',
    badge: 'Hardware & Armada',
    description: 'Spesifikasi teknis alat, instalasi retrofit palka es, dan adaptasi untuk berbagai tipe kapal nelayan.',
  },
  {
    id: 'Pertanyaan Teknis IoT',
    title: 'Pertanyaan Teknis IoT & Sensor',
    badge: 'Firmware & Telemetri',
    description: 'Protokol sensor suhu DS18B20, RTC DS3231, logging offline MicroSD, dan integrasi transmisi cloud.',
  },
  {
    id: 'Kemitraan Strategis',
    title: 'Kemitraan Strategis & TPI',
    badge: 'Institusi & Bisnis',
    description: 'Kerja sama Tempat Pelelangan Ikan (TPI), koperasi nelayan, korporasi logistik, dan dinas perikanan.',
  },
  {
    id: 'Dukungan Pelanggan',
    title: 'Dukungan Pelanggan & Pengguna',
    badge: 'Layanan Bantuan',
    description: 'Bantuan penggunaan aplikasi web, kendala otentikasi akun, pemantauan dasbor, dan laporan telemetri.',
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'Bagaimana cara kerja perangkat saat kapal berlayar di tengah laut tanpa sinyal internet?',
    answer:
      'TEMBOX dirancang dengan kapabilitas Offline-First yang tangguh. Saat berada di luar jangkauan sinyal seluler/internet, modul RTC DS3231 terus mencatat stempel waktu akurat dan seluruh data telemetri suhu disimpan lokal di kartu MicroSD berformat FAT32. Begitu kapal bersandar di dermaga dan mendeteksi jaringan Wi-Fi/Hotspot pelabuhan, data secara otomatis disinkronkan secara batch ke server cloud tanpa ada data yang hilang.',
  },
  {
    question: 'Apakah pemasangan TEMBOX memerlukan modifikasi atau perombakan fisik kapal?',
    answer:
      'Tidak sama sekali. TEMBOX merupakan perangkat tambahan pintar modular (modular retrofit). Perangkat ini dipasang langsung pada kotak palka es atau coolbox yang sudah dimiliki nelayan tanpa perlu mengubah struktur kapal maupun mengganti wadah penyimpanan yang ada.',
  },
  {
    question: 'Bagaimana jika suhu palka es melampaui ambang batas aman di tengah pelayaran?',
    answer:
      'Sistem dilengkapi mekanisme peringatan ganda di tingkat lokal: layar LCD 16x2 I2C menampilkan pembacaan suhu terkini secara seketika, sementara LED RGB visual dan Buzzer audio aktif akan berbunyi kencang untuk memperingatkan awak kapal (ABK) agar segera menambah es batu sebelum kualitas ikan menurun.',
  },
  {
    question: 'Siapa saja yang dapat mengakses dasbor analitik dan riwayat suhu web?',
    answer:
      'Aplikasi web Ice-TEMBOX dirancang untuk pengelola Tempat Pelelangan Ikan (TPI), pengepul, pemilik armada kapal, dan koperasi nelayan. Melalui otentikasi aman berbasis peran, pengguna dapat memantau grafik tren suhu 24 jam, mengunduh laporan kesegaran ikan, serta menerima notifikasi anomali termal.',
  },
];

export function useContactLogic() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [category, setCategory] = useState('Konsultasi Perangkat');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Accordion State for FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut & scroll lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (categoryModalOpen) setCategoryModalOpen(false);
        if (toastOpen) setToastOpen(false);
      }
    };
    if (categoryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoryModalOpen, toastOpen]);

  // Auto-dismiss floating success toast with strict cleanup
  useEffect(() => {
    if (!toastOpen) return;
    const timerId = setTimeout(() => {
      setToastOpen(false);
    }, 5500);
    return () => clearTimeout(timerId);
  }, [toastOpen]);

  const handleSelectCategory = useCallback((selectedId: string) => {
    setCategory(selectedId);
    setCategoryModalOpen(false);
  }, []);

  const handleToggleFAQ = useCallback((index: number) => {
    setOpenFAQ((prev) => (prev === index ? null : index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          name: fullName,
          contactInfo,
          senderContact: contactInfo,
          contact: contactInfo,
          email: contactInfo,
          category,
          message,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan. Silakan coba kembali beberapa saat lagi.');
      }

      setFullName('');
      setContactInfo('');
      setCategory('Konsultasi Perangkat');
      setMessage('');
      setSuccessMessage(data.message || 'Pesan terkirim. Silakan periksa kotak masuk email Anda.');
      setToastOpen(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Terjadi kendala jaringan saat mengirim pesan.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Form fields
    fullName,
    setFullName,
    contactInfo,
    setContactInfo,
    category,
    setCategory,
    message,
    setMessage,
    submitting,
    errorMessage,
    successMessage,

    // Category modal
    categoryModalOpen,
    setCategoryModalOpen,
    handleSelectCategory,

    // Toast
    toastOpen,
    setToastOpen,

    // FAQ
    openFAQ,
    handleToggleFAQ,

    // Navigation UI
    scrolled,
    mobileMenuOpen,
    setMobileMenuOpen,

    // Form submission
    handleSubmit,
  };
}
