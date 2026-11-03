import fs from 'node:fs';
import path from 'node:path';

// Asset synchronization for public directory across standalone and monorepo workspaces
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
  // Silent fallback for restricted environments
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handle video/media file imports via webpack
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash:8][ext]',
      },
    });
    return config;
  },

  // Next.js Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
