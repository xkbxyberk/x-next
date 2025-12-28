import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://xdownloaderz.com';

    // All supported languages including default en and tr
    const languages = [
        'en', 'tr', 'ar', 'bg', 'bn', 'br', 'cs', 'da', 'de', 'el',
        'es', 'fa', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it',
        'ja', 'km', 'ko', 'ms', 'ne', 'nl', 'no', 'pl', 'pt', 'ro',
        'ru', 'sr', 'sv', 'sw', 'th', 'tl', 'uk', 'ur', 'vi', 'zh'
    ];

    // Task 4: Sitemap & lastmod Strategy
    // Hardcoded deployment date to avoid fake updates on every request
    const DEPLOY_DATE = new Date('2025-12-28T00:00:00.000Z');

    const languageRoutes = languages.map((lang) => ({
        url: `${baseUrl}/${lang}`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${baseUrl}`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'daily',
            priority: 1,
        },
        ...languageRoutes,
        {
            url: `${baseUrl}/about`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: DEPLOY_DATE,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
