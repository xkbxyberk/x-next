import { MetadataRoute } from 'next';
import seoData from '@/data/seo-strategy.json';

const BASE_URL = 'https://xdownloaderz.com';
const CHUNK_SIZE = 10000; // Conservative limit (Google max 50k)

type SeoItem = {
    Keyword: string;
    lang: string;
    "Search Volume"?: string; // Optional because we just need keyword/lang
};

function generateSlug(keyword: string): string {
    return keyword
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function generateSitemaps() {
    const totalItems = (seoData as SeoItem[]).filter(k => k.Keyword && k.lang).length;
    const numChunks = Math.ceil(totalItems / CHUNK_SIZE);

    // ID 0 represents static pages
    // IDs 1..N represent SEO data chunks
    const sitemaps = [{ id: 0 }];

    for (let i = 0; i < numChunks; i++) {
        sitemaps.push({ id: i + 1 });
    }

    return sitemaps;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
    const DEPLOY_DATE = new Date();

    // 1. Static Pages (ID: 0)
    if (id === 0) {
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

        // Root + Lang Roots
        const routes: MetadataRoute.Sitemap = [];

        // Add root /
        routes.push({
            url: BASE_URL,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'daily',
            priority: 1,
        });

        // Add /en, /tr, etc. for all static pages
        languages.forEach(lang => {
            staticRoutes.forEach(route => {
                routes.push({
                    url: `${BASE_URL}/${lang}${route}`,
                    lastModified: DEPLOY_DATE,
                    changeFrequency: route === '' ? 'daily' : 'monthly',
                    priority: route === '' ? 1 : 0.5,
                });
            });
        });

        return routes;
    }

    // 2. Programmatic SEO Pages (ID: 1+)
    // Adjust ID to 0-based index for data slicing
    const chunkIndex = id - 1;
    const validItems = (seoData as SeoItem[]).filter(k => k.Keyword && k.lang);

    const start = chunkIndex * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const items = validItems.slice(start, end);

    return items.map((item) => ({
        url: `${BASE_URL}/${item.lang}/${generateSlug(item.Keyword)}`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));
}
