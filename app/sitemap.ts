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

    const languageRoutes = languages.map((lang) => ({
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...languageRoutes,
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
