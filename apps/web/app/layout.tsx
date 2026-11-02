import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

