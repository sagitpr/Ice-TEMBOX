import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import PersistentBackgroundVideo from './components/PersistentBackgroundVideo';
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
          'google835db05cba2f9052.html',
        ];

        for (const file of filesToSync) {
          const s = path.join(assetsDir, file);
          const d = path.join(pub, file);
          if (fs.existsSync(s) && !fs.existsSync(d)) {
            fs.copyFileSync(s, d);
          }
        }

        // Also ensure Penangkap-Ikan.jpg (capitalized I) exists for Linux/Vercel case-sensitive resolution
        const penangkapReal = path.join(assetsDir, 'Penangkap-ikan.jpg');
        const penangkapCap = path.join(pub, 'Penangkap-Ikan.jpg');
        if (fs.existsSync(penangkapReal) && !fs.existsSync(penangkapCap)) {
          fs.copyFileSync(penangkapReal, penangkapCap);
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app'),
  title: {
    default: 'TEMBOX — Smart Monitoring for Fresher Catch',
    template: '%s | TEMBOX',
  },
  description:
    'TEMBOX adalah sistem pemantauan suhu dan kondisi penyimpanan palka ikan secara real-time berbasis IoT untuk menjaga kualitas kesegaran hasil tangkapan laut nelayan.',
  keywords: [
    'TEMBOX',
    'monitoring suhu palka ikan',
    'cold chain perikanan',
    'IoT maritim',
    'rantai dingin ikan',
    'kualitas tangkapan laut',
    'sensor DS18B20 kapal',
  ],
  authors: [{ name: 'Sagit Faturrakhman' }],
  creator: 'TEMBOX Engineering Team',
  icons: {
    icon: '/favicon.svg',
    apple: '/Favicon.png',
  },
  verification: {
    google: [
      'google835db05cba2f9052',
      't11aB7h55yknoLd2mUNHP546wltGH0gF1mrbh4ZMb6E',
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ice-tembox.vercel.app',
    siteName: 'TEMBOX',
    title: 'TEMBOX — Smart Monitoring for Fresher Catch',
    description:
      'Solusi cerdas pemantauan suhu palka es berbasis IoT untuk menjaga kesegaran ikan tangkapan nelayan.',
    images: [
      {
        url: '/Penangkap-ikan.jpg',
        width: 1200,
        height: 630,
        alt: 'TEMBOX IoT Marine Cold Chain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEMBOX — Smart Monitoring for Fresher Catch',
    description:
      'Solusi cerdas pemantauan suhu palka es berbasis IoT untuk menjaga kesegaran ikan tangkapan nelayan.',
    images: ['/Penangkap-ikan.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <PersistentBackgroundVideo />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
