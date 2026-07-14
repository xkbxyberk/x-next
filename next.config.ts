import type { NextConfig } from "next";

// Dev (next dev) needs 'unsafe-eval' for React Fast Refresh + HMR.
const isDev = process.env.NODE_ENV !== 'production';

// Third-party script origins that must stay allow-listed by host.
const SCRIPT_HOSTS =
  'https://*.twitter.com https://static.cloudflareinsights.com https://cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com';

// script-src:
//  - 'wasm-unsafe-eval' only in production (ffmpeg-core WASM; the core JS uses
//    no eval/new Function), narrowed from the original broad 'unsafe-eval'.
//  - 'unsafe-inline' is retained: dropping it requires build-time script
//    hashing (experimental.sri), which OOMs the ~200-page static build on this
//    4GB box. The real XSS vectors are already closed (framework upgrade +
//    escaped JSON-LD + safe rich-text renderer), so this is defense-in-depth
//    only. Revisit strict inline hardening when building on a higher-RAM host.
const scriptSrc = isDev
  ? `'self' 'unsafe-inline' 'unsafe-eval' blob: ${SCRIPT_HOSTS}`
  : `'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: ${SCRIPT_HOSTS}`;

const cspHeader = `
  default-src 'self';
  script-src ${scriptSrc};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.twimg.com https://images.unsplash.com https://pbs.twimg.com https://abs.twimg.com https://www.google-analytics.com;
  connect-src 'self' https://*.twitter.com https://video.twimg.com https://pbs.twimg.com https://abs.twimg.com https://cdn.jsdelivr.net https://cloudflareinsights.com https://static.cloudflareinsights.com https://www.google-analytics.com https://www.googletagmanager.com;
  frame-src 'self' https://*.twitter.com;
  worker-src 'self' blob:;
  media-src 'self' blob: https://video.twimg.com;
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

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

  // 4. Güvenlik: HSTS ve CSP başlıkları
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
            value: cspHeader
          }
        ],
      },
    ];
  },
};

export default nextConfig;
