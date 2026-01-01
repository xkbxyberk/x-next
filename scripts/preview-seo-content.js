// Mocking logic for preview purposes since we cannot run TS directly easily via node without ts-node setup
// This script replicates the logic in lib/seo.ts to show what the output would look like.

const seoData = require('../data/seo-strategy.json');
const COMPETITORS = ['ssstwitter', 'twittervideodownloader', 'savetweetvid'];

function generateSlug(keyword) {
    return keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function generateTitle(keyword, lang) {
    const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const titleMap = {
        tr: `${toTitleCase(keyword)} - Ücretsiz İndir (HD)`,
        en: `${toTitleCase(keyword)} - Download Free (HD)`,
        es: `${toTitleCase(keyword)} - Descargar Gratis (HD)`,
    };
    return titleMap[lang] || `${toTitleCase(keyword)} - Download Free`;
}

function generateDescription(keyword, lang) {
    const descMap = {
        tr: `En iyi ${keyword} aracı. XDownloaderz ile Twitter videolarını ve GIF'lerini ücretsiz, yüksek kalitede (1080p) telefonuna veya bilgisayarına indir.`,
        en: `The best tool for ${keyword}. Download Twitter videos and GIFs in HD (1080p) for free to your phone or PC with XDownloaderz.`,
    };
    return descMap[lang] || descMap['en'];
}

function generateH1(keyword, lang) {
    const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const lower = keyword.toLowerCase();

    if (lang === 'en') {
        if (lower.includes('iphone')) return `Download ${toTitleCase(keyword.replace('iphone', '').trim())} to iPhone`;
        if (lower.includes('android')) return `Download ${toTitleCase(keyword.replace('android', '').trim())} to Android`;
        if (lower.includes('gif')) return `Save ${toTitleCase(keyword)}s Instantly`;
    }
    return toTitleCase(keyword);
}

function generateIntro(keyword, lang) {
    const lower = keyword.toLowerCase();
    const competitor = COMPETITORS.find(c => lower.includes(c));
    let intro = "";
    if (competitor) {
        intro = `[COMPETITOR MATCH: ${competitor}] Looking for a faster alternative to ${competitor}? XDownloaderz offers a secure, ad-free... `;
    }
    return intro + `If you are looking for **${keyword}**, you are in the right place...`;
}

// Sample keywords to test
const samples = [
    "twitter video downloader", // Generic High Vol
    "twitter video downloader iphone", // Device Specific
    "twitter gif downloader", // Format Specific
    "ssstwitter", // Competitor
    "twitter video indir" // Turkish
];

console.log("--- CONTENT PREVIEW ---");
samples.forEach(sampleKey => {
    // Find lang from JSON
    const item = seoData.find(k => k.Keyword === sampleKey);
    const lang = item ? item.lang : 'en';

    console.log(`\nKEYWORD: "${sampleKey}" (Lang: ${lang})`);
    console.log(`SLUG: /${lang}/${generateSlug(sampleKey)}`);
    console.log(`TITLE: ${generateTitle(sampleKey, lang)}`);
    console.log(`H1:    ${generateH1(sampleKey, lang)}`);
    console.log(`DESC:  ${generateDescription(sampleKey, lang)}`);
    console.log(`INTRO: ${generateIntro(sampleKey, lang).substring(0, 80)}...`);
});
