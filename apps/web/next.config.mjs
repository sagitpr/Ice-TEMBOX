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

  // Disable image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

