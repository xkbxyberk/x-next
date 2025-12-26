import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://xdownloaderz.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: [
                    'GPTBot',          // OpenAI
                    'ChatGPT-User',    // OpenAI
                    'CCBot',           // Common Crawl
                    'Google-Extended', // Google AI
                    'AnthropicAI',     // Claude
                    'FacebookBot',     // Meta
                    'Bytespider',      // ByteDance
                    'Amazonbot',       // Amazon
                ],
                disallow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
