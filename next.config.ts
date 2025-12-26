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

  // 4. Güvenlik: HSTS ve CSP başlıkları (Task 3)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.twitter.com https://unpkg.com https://static.cloudflareinsights.com https://cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.twimg.com https://images.unsplash.com https://pbs.twimg.com https://abs.twimg.com https://www.google-analytics.com;
              connect-src 'self' https://*.twitter.com https://video.twimg.com https://pbs.twimg.com https://abs.twimg.com https://unpkg.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://www.google-analytics.com https://www.googletagmanager.com;
              frame-src 'self' https://*.twitter.com;
              worker-src 'self' blob: https://unpkg.com;
              media-src 'self' blob: https://video.twimg.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

export default nextConfig;