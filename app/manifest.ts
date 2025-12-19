import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'X-Next | 2025 Web Experience', // Uygulamanın tam adı
    short_name: 'X-Next', // Ana ekranda ikonun altında yazacak kısa ad
    description: 'AI-First, SSR-Powered Social Platform Prototype.',
    start_url: '/',
    display: 'standalone', // Tarayıcı çubuğunu gizler, uygulama gibi tam ekran açar
    background_color: '#000000', // Uygulama açılırken görünen arka plan rengi
    theme_color: '#000000', // Telefonun üst bildirim çubuğu rengi
    icons: [
      {
        src: '/icon-512.png', // Public klasörüne attığın dosya
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}