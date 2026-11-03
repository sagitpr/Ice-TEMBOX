import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import './globals.css';

// Server-side asset sync for public media across standalone and monorepo setups
try {
  const possibleRoots = [
    path.resolve(process.cwd(), 'apps/web'),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    const assetsDir = path.join(root, 'src', 'assets');
    if (fs.existsSync(assetsDir)) {
      const targetPublicDirs = [
        path.join(root, 'public'),
        path.resolve(process.cwd(), 'apps/web/public'),
        path.resolve(process.cwd(), 'public'),
      ];

      for (const pub of targetPublicDirs) {
        if (!fs.existsSync(pub)) {
          fs.mkdirSync(pub, { recursive: true });
        }

        const filesToSync = [
          'Favicon.png',
          'LogoTembox-Horizontal.png',
          'Penangkap-ikan.jpg',
          'hero-boat.jpg',
          'Sagit-Faturrakhman.jpg',
        ];

        for (const file of filesToSync) {
          const s = path.join(assetsDir, file);
          const d = path.join(pub, file);
          if (fs.existsSync(s) && !fs.existsSync(d)) {
            fs.copyFileSync(s, d);
          }
        }

        // Also check Video directory
        const videoSrc = path.join(assetsDir, 'Video', 'Nelayan-kapal-Horizontal.mp4');
        const videoDest = path.join(pub, 'Nelayan-kapal-Horizontal.mp4');
        if (fs.existsSync(videoSrc) && !fs.existsSync(videoDest)) {
          fs.copyFileSync(videoSrc, videoDest);
        }

        // Sync Sagit profile photo to sagit.png as well
        const sagitSrc = path.join(assetsDir, 'Sagit-Faturrakhman.jpg');
        const sagitPngDest = path.join(pub, 'sagit.png');
        if (fs.existsSync(sagitSrc) && !fs.existsSync(sagitPngDest)) {
          fs.copyFileSync(sagitSrc, sagitPngDest);
        }
      }
    }
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
