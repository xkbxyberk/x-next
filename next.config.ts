import type { NextConfig } from "next";

// Dev (next dev) needs 'unsafe-inline'/'unsafe-eval' for React Fast Refresh + HMR.
// Production uses a strict CSP with no 'unsafe-inline'.
const isDev = process.env.NODE_ENV !== 'production';

// SHA-256 of the inline consent-init script in app/[lang]/layout.tsx.
// If that inline script's bytes change, recompute and update this value:
//   printf '%s' '<exact script content>' | openssl dgst -sha256 -binary | openssl base64 -A
const CONSENT_INIT_HASH = "'sha256-9SaqIzS0u8CwrRcDR+7y7ki7U3Z0DeXe/NMqdXCOs7Q='";

// Third-party script origins that must stay allow-listed by host.
const SCRIPT_HOSTS =
  'https://*.twitter.com https://static.cloudflareinsights.com https://cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com';

// Production script-src:
//  - no 'unsafe-inline' (injected inline scripts can no longer run)
//  - 'wasm-unsafe-eval' only (ffmpeg-core WASM; the core JS uses no eval/new Function)
//  - the consent-init inline script is allow-listed by its hash
//  - Next's own inline scripts (RSC payload, next/script, @next/third-parties)
//    are covered by experimental.sri below, so static rendering is preserved.
const scriptSrc = isDev
  ? `'self' 'unsafe-inline' 'unsafe-eval' blob: ${SCRIPT_HOSTS}`
  : `'self' 'wasm-unsafe-eval' ${CONSENT_INIT_HASH} blob: ${SCRIPT_HOSTS}`;

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
  // 3. Güvenlik: Hash-based Subresource Integrity — Next'in inline/bundle
  //    script'lerine integrity ekler; statik render korunarak 'unsafe-inline'
  //    kaldırılabilir. Dev'de HMR ile çakışmaması için sadece production'da.
  experimental: {
    optimizePackageImports: ['lucide-react'],
    ...(isDev ? {} : { sri: { algorithm: 'sha256' as const } }),
  },

  // 4. Geliştirme: Hataları yakalamak için katı mod
  reactStrictMode: true,

  // 5. Güvenlik: HSTS ve CSP başlıkları
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
