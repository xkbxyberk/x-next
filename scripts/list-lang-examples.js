const seoData = require('../data/seo-strategy.json');

// Mocking the normalized slug generation from lib/seo.ts
function generateSlug(keyword) {
    return keyword
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const examples = {};

seoData.forEach(item => {
    const lang = item.lang || 'en';
    if (!examples[lang]) {
        examples[lang] = item;
    }
});

console.log("--- EXAMPLE URLS PER LANGUAGE ---");
Object.entries(examples).forEach(([lang, item]) => {
    const slug = generateSlug(item.Keyword);
    // Use localhost for easy clicking
    console.log(`${lang.toUpperCase()}: http://localhost:3000/${lang}/${slug}`);
});
