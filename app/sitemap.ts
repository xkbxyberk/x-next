import { MetadataRoute } from 'next';
import seoData from '@/data/seo-strategy.json';

const BASE_URL = 'https://xdownloaderz.com';

type SeoItem = {
    Keyword: string;
    lang: string;
    "Search Volume"?: string;
};

// URL-friendly slug oluşturucu (lib/seo.ts ile uyumlu regex)
function generateSlug(keyword: string): string {
    return keyword
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
    const DEPLOY_DATE = new Date();

    // 1. STATİK SAYFALAR
    const languages = [
        'en', 'tr', 'ar', 'bg', 'bn', 'br', 'cs', 'da', 'de', 'el',
        'es', 'fa', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it',
        'ja', 'km', 'ko', 'ms', 'ne', 'nl', 'no', 'pl', 'pt', 'ro',
        'ru', 'sr', 'sv', 'sw', 'th', 'tl', 'uk', 'ur', 'vi', 'zh'
    ];

    const staticRoutes = [
        '',          // Anasayfa
        '/about',
        '/contact',
        '/privacy',
        '/terms'
    ];

    const routes: MetadataRoute.Sitemap = [];

    // Kök dizin (Root URL)
    routes.push({
        url: BASE_URL,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'daily',
        priority: 1,
    });

    // Tüm diller ve statik sayfalar için kombinasyonlar
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

    // 2. PROGRAMATİK SEO SAYFALARI
    // Veriyi filtrele (Boş keyword veya dili olmayanları at)
    const validItems = (seoData as SeoItem[]).filter(k => k.Keyword && k.lang);

    const dynamicRoutes = validItems.map((item) => ({
        url: `${BASE_URL}/${item.lang}/${generateSlug(item.Keyword)}`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...dynamicRoutes];
}