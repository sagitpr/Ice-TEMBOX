import fs from 'node:fs';
import path from 'node:path';

// Asset synchronization for public directory
const publicDir = path.resolve(process.cwd(), 'public');
const assetsDir = path.resolve(process.cwd(), 'src/assets');
const sagitArtifactSrc = 'C:\\Users\\ThinkPad\\.gemini\\antigravity\\brain\\b7931393-0445-4c26-b05c-d441be92bba2\\sagit_faturrakhman_headshot_1793670941210.jpg';

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

  // Ensure LogoTembox-Horizontal.png exists in public
  const logoSrc = path.join(assetsDir, 'LogoTembox-Horizontal.png');
  const logoDest = path.join(publicDir, 'LogoTembox-Horizontal.png');
  if (fs.existsSync(logoSrc) && !fs.existsSync(logoDest)) {
    fs.copyFileSync(logoSrc, logoDest);
  }

  // Ensure Nelayan-kapal-Horizontal.mp4 exists in public
  const videoSrc = path.join(assetsDir, 'Video', 'Nelayan-kapal-Horizontal.mp4');
  const videoDest = path.join(publicDir, 'Nelayan-kapal-Horizontal.mp4');
  if (fs.existsSync(videoSrc) && !fs.existsSync(videoDest)) {
    fs.copyFileSync(videoSrc, videoDest);
  }

  // Ensure Penangkap-ikan.jpg exists in public
  const penangkapSrc = path.join(assetsDir, 'Penangkap-ikan.jpg');
  const penangkapDest = path.join(publicDir, 'Penangkap-ikan.jpg');
  if (fs.existsSync(penangkapSrc) && !fs.existsSync(penangkapDest)) {
    fs.copyFileSync(penangkapSrc, penangkapDest);
  }

  // Ensure hero-boat.jpg exists in public
  const heroBoatSrc = path.join(assetsDir, 'hero-boat.jpg');
  const heroBoatDest = path.join(publicDir, 'hero-boat.jpg');
  if (fs.existsSync(heroBoatSrc) && !fs.existsSync(heroBoatDest)) {
    fs.copyFileSync(heroBoatSrc, heroBoatDest);
  }

  // Ensure Sagit Faturrakhman profile photo exists in public
  const sagitRealSrc = path.join(assetsDir, 'Sagit-Faturrakhman.jpg');
  const sagitRealDest = path.join(publicDir, 'Sagit-Faturrakhman.jpg');
  if (fs.existsSync(sagitRealSrc) && !fs.existsSync(sagitRealDest)) {
    fs.copyFileSync(sagitRealSrc, sagitRealDest);
  }

  // Ensure Sagit Faturrakhman profile photo exists in public and assets
  if (fs.existsSync(sagitArtifactSrc)) {
    fs.copyFileSync(sagitArtifactSrc, path.join(publicDir, 'sagit.png'));
    fs.copyFileSync(sagitArtifactSrc, path.join(assetsDir, 'sagit.png'));
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
