import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Görsel Optimizasyonu: En yeni ve sıkıştırılmış formatları destekle
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Demo görselleri (Unsplash) için izin
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // İleride gerçek X (Twitter) profil resimleri için hazırlık
      },
    ],
  },

  // 2. Performans: İkon kütüphanesini otomatik optimize et
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 3. Geliştirme: Hataları yakalamak için katı mod
  reactStrictMode: true,
};

export default nextConfig;