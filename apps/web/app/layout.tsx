import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import './globals.css';

// Server-side asset sync for public media
try {
  const publicDir = path.resolve(process.cwd(), 'public');
  const assetsDir = path.resolve(process.cwd(), 'src/assets');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const penangkapSrc = path.join(assetsDir, 'Penangkap-ikan.jpg');
  const penangkapDest = path.join(publicDir, 'Penangkap-ikan.jpg');
  if (fs.existsSync(penangkapSrc) && !fs.existsSync(penangkapDest)) {
    fs.copyFileSync(penangkapSrc, penangkapDest);
  }

  const sagitRealSrc = path.join(assetsDir, 'Sagit-Faturrakhman.jpg');
  const sagitRealDest = path.join(publicDir, 'Sagit-Faturrakhman.jpg');
  if (fs.existsSync(sagitRealSrc) && !fs.existsSync(sagitRealDest)) {
    fs.copyFileSync(sagitRealSrc, sagitRealDest);
  }

  const sagitArtifact = 'C:\\Users\\ThinkPad\\.gemini\\antigravity\\brain\\b7931393-0445-4c26-b05c-d441be92bba2\\sagit_faturrakhman_headshot_1793670941210.jpg';
  const sagitDest = path.join(publicDir, 'sagit.png');
  const sagitAssetsDest = path.join(assetsDir, 'sagit.png');
  if (fs.existsSync(sagitArtifact)) {
    if (!fs.existsSync(sagitDest)) fs.copyFileSync(sagitArtifact, sagitDest);
    if (!fs.existsSync(sagitAssetsDest)) fs.copyFileSync(sagitArtifact, sagitAssetsDest);
  }
} catch {
  // Silent fallback
}

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
