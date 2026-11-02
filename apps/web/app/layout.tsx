import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TEMBOX — Smart Monitoring for Fresher Catch',
  description:
    'TEMBOX adalah sistem pemantauan suhu dan kondisi penyimpanan ikan secara real-time untuk menjaga kualitas hasil tangkapan hingga sampai ke tangan Anda.',
  icons: {
    icon: '/favicon.svg',
    apple: '/Favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
