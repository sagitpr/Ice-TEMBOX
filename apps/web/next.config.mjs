import fs from 'node:fs';
import path from 'node:path';

// Auto-sync optimized assets during Next.js initialization
const sourceHeroImg = 'C:\\Users\\ThinkPad\\.gemini\\antigravity\\brain\\b7931393-0445-4c26-b05c-d441be92bba2\\hero_boat_1793644680249.jpg';
const publicDir = path.resolve(process.cwd(), 'public');
const assetsDir = path.resolve(process.cwd(), 'src/assets');

try {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  if (fs.existsSync(sourceHeroImg)) {
    fs.copyFileSync(sourceHeroImg, path.join(publicDir, 'hero-boat.jpg'));
    
    if (fs.existsSync(assetsDir)) {
      fs.copyFileSync(sourceHeroImg, path.join(assetsDir, 'hero-boat.jpg'));
    }
  }
  
  const faviconSrc = path.join(assetsDir, 'Favicon.png');
  const faviconDest = path.join(publicDir, 'Favicon.png');
  if (fs.existsSync(faviconSrc) && !fs.existsSync(faviconDest)) {
    fs.copyFileSync(faviconSrc, faviconDest);
  }

  // Also sync video to public for direct streaming
  const videoSrc = path.join(assetsDir, 'Video', 'Nelayan-kapal-Horizontal.mp4');
  const videoDest = path.join(publicDir, 'Nelayan-kapal-Horizontal.mp4');
  if (fs.existsSync(videoSrc) && !fs.existsSync(videoDest)) {
    fs.copyFileSync(videoSrc, videoDest);
  }
} catch (err) {
  // Silent fallback
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
