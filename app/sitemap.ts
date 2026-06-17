import { MetadataRoute } from 'next';

const BASE_URL = 'https://xdownloaderz.com';

export default function sitemap(): MetadataRoute.Sitemap {
    // Sabit tarih: her build'de lastmod sıfırlanmasın (Google güven sinyali)
    const DEPLOY_DATE = new Date('2026-06-18');

    const languages = [
        'en', 'tr', 'ar', 'bg', 'bn', 'br', 'cs', 'da', 'de', 'el',
        'es', 'fa', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it',
        'ja', 'km', 'ko', 'ms', 'ne', 'nl', 'no', 'pl', 'pt', 'ro',
        'ru', 'sr', 'sv', 'sw', 'th', 'tl', 'uk', 'ur', 'vi', 'zh'
    ];

    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms'
    ];

    const routes: MetadataRoute.Sitemap = [];

    // Not: Dilsiz kök URL (BASE_URL) bilinçli olarak eklenmiyor.
    // proxy.ts onu Accept-Language'e göre /{locale}'e 307 yönlendiriyor;
    // sitemap'e konulursa "Sayfa yönlendirmeli" hatası üretir.
    // Ana sayfalar zaten aşağıdaki döngüde /en, /tr ... olarak listeleniyor.

    languages.forEach(lang => {
        staticRoutes.forEach(route => {
            const isHome = route === '';
            routes.push({
                url: `${BASE_URL}/${lang}${route}`,
                lastModified: DEPLOY_DATE,
                changeFrequency: isHome ? 'daily' : 'monthly',
                priority: isHome ? 1 : 0.5,
            });
        });
    });

    return routes;
}
