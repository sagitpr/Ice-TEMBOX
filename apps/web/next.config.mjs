import fs from 'node:fs';
import path from 'node:path';

// Asset synchronization for public directory
const publicDir = path.resolve(process.cwd(), 'public');
const assetsDir = path.resolve(process.cwd(), 'src/assets');

try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Ensure Favicon.png exists in public
  const faviconSrc = path.join(assetsDir, 'Favicon.png');
  const faviconDest = path.join(publicDir, 'Favicon.png');
  if (fs.existsSync(faviconSrc) && !fs.existsSync(faviconDest)) {
    fs.copyFileSync(faviconSrc, faviconDest);
  }

  // Ensure Nelayan-kapal-Horizontal.mp4 exists in public
  const videoSrc = path.join(assetsDir, 'Video', 'Nelayan-kapal-Horizontal.mp4');
  const videoDest = path.join(publicDir, 'Nelayan-kapal-Horizontal.mp4');
  if (fs.existsSync(videoSrc) && !fs.existsSync(videoDest)) {
    fs.copyFileSync(videoSrc, videoDest);
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
