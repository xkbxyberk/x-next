const fs = require('fs');
const path = require('path');
const seoData = require('../data/seo-strategy.json');

const stats = seoData.reduce((acc, item) => {
    const lang = item.lang || 'unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
}, {});

console.log("--- LANGUAGE BREAKDOWN ---");
Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .forEach(([lang, count]) => {
        console.log(`${lang.toUpperCase()}: ${count} pages`);
    });
console.log(`TOTAL: ${seoData.length} pages`);
