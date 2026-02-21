import { MetadataRoute } from 'next';

const BASE_URL = 'https://xdownloaderz.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const DEPLOY_DATE = new Date();

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

    routes.push({
        url: BASE_URL,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'daily',
        priority: 1,
    });

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
