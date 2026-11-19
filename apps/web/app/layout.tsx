import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import dynamic from 'next/dynamic';
import PersistentBackgroundVideo from './components/PersistentBackgroundVideo';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import './globals.css';

// Lazy load non-critical consent banner to prioritize initial paint
const CookieConsentBanner = dynamic(
  () => import('./components/CookieConsentBanner')
);

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
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app'),
  title: {
    default: 'TEMBOX — Pemantau Suhu Palka & Box Pendingin Ikan IoT',
    template: '%s | TEMBOX',
  },
  description:
    'Sistem IoT pemantau suhu palka ikan dan box pendingin coolbox nelayan secara real-time untuk menjaga kualitas kesegaran hasil tangkapan laut.',
  keywords: [
    'ikan',
    'box',
    'box ikan',
    'palka ikan',
    'box pendingin ikan',
    'coolbox ikan',
    'coolbox nelayan',
    'monitoring suhu palka ikan',
    'cold chain perikanan',
    'IoT maritim nelayan',
    'rantai dingin ikan',
    'es palka ikan',
    'suhu ikan segar',
    'sensor suhu ikan',
    'alat pemantau ikan kapal',
    'TEMBOX',
  ],
  authors: [{ name: 'Sagit Faturrakhman' }],
  creator: 'TEMBOX Engineering Team',
  icons: {
    icon: '/favicon.svg',
    apple: '/Favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    title: 'TEMBOX — Pemantau Suhu Palka & Box Pendingin Ikan IoT',
    description:
      'Solusi cerdas pemantauan suhu palka es dan box pendingin ikan berbasis IoT untuk menjaga kesegaran ikan tangkapan nelayan.',
    images: [
      {
        url: '/Penangkap-ikan.jpg',
        width: 1200,
        height: 630,
        alt: 'TEMBOX IoT Marine Cold Chain Palka Ikan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEMBOX — Pemantau Suhu Palka & Box Pendingin Ikan IoT',
    description:
      'Solusi cerdas pemantauan suhu palka es dan box pendingin ikan berbasis IoT untuk menjaga kesegaran ikan tangkapan nelayan.',
    images: ['/Penangkap-ikan.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://ice-tembox.vercel.app/#website',
        url: 'https://ice-tembox.vercel.app',
        name: 'TEMBOX',
        alternateName: [
          'Ice TEMBOX',
          'TEMBOX Box Pendingin Ikan',
          'Monitoring Palka Ikan TEMBOX',
        ],
        description:
          'Sistem pemantau suhu palka ikan dan box pendingin coolbox nelayan berbasis IoT.',
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate:
              'https://ice-tembox.vercel.app/pencarian/{search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://ice-tembox.vercel.app/#organization',
        name: 'TEMBOX',
        url: 'https://ice-tembox.vercel.app',
        logo: 'https://ice-tembox.vercel.app/LogoTembox-Horizontal.png',
        description:
          'Penyedia sistem IoT pemantau suhu palka ikan dan cold-chain maritim Indonesia.',
      },
    ],
  };

  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body className={plusJakartaSans.className} suppressHydrationWarning>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <PersistentBackgroundVideo />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          {children}
        </div>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
