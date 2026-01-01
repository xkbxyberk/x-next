const fs = require('fs');
const path = require('path');

const seoData = require('../data/seo-strategy.json');

// Force string parsing
const parseVolume = (vol) => typeof vol === 'string' ? parseInt(vol.replace(/,/g, ''), 10) : vol;
const parseDifficulty = (diff) => typeof diff === 'string' ? parseInt(diff, 10) : diff;

function generateSlug(keyword) {
    return keyword
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getStaticPathsData() {
    const allKeywords = seoData;

    // 1. Filter valid items
    const validItems = allKeywords.filter(k => k.Keyword && k.lang);

    // 2. Score items
    const scored = validItems.map(item => {
        const vol = parseVolume(item["Search Volume"]);
        const diff = parseDifficulty(item["Keyword Difficulty"]);

        let score = vol;
        if (diff < 40) {
            score = score * 2;
        }

        return { ...item, _score: score, _vol: vol, _diff: diff };
    });

    // 3. Sort by Score Descending and take top 1000
    return scored
        .sort((a, b) => b._score - a._score)
        .slice(0, 1000);
}

const list = getStaticPathsData();

console.log(`Total Pages Selected for SSG: ${list.length}`);
console.log('------------------------------------------------');
console.log('Top 20 Priority Pages (High Vol, Low Diff):');
list.slice(0, 20).forEach((item, i) => {
    const slug = generateSlug(item.Keyword);
    const url = `/${item.lang || 'en'}/${slug}`;
    console.log(`${i + 1}. ${url} (Vol: ${item._vol}, Diff: ${item._diff}, Lang: ${item.lang})`);
});
console.log('...');
console.log(`... and ${list.length - 20} more.`);
