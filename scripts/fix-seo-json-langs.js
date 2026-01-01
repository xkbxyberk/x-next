const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data/seo-strategy.json');

function detectLanguage(keyword) {
    if (!keyword) return 'en';
    const lower = keyword.toLowerCase();

    // CJK (Chinese, Japanese, Korean)
    if (/[\u3040-\u30ff]/.test(lower)) return 'ja'; // Hiragana/Katakana
    if (/[\u4e00-\u9fff]/.test(lower)) return 'zh'; // CJK Unified Ideographs
    if (/[\uac00-\ud7af]/.test(lower)) return 'ko'; // Hangul

    // Cyrillic
    if (/[\u0400-\u04FF]/.test(lower)) return 'ru'; // Default to RU for Cyrillic (could be bg/uk)

    // Arabic/Persian
    if (/[\u0600-\u06FF]/.test(lower)) return 'ar';

    // Turkish (Specific characters check)
    if (/[ğıüşöçĞÜŞİÖÇ]/.test(lower)) return 'tr';
    if (/\b(indir|yükle|izle|dönüştürücü|hilesi|nasıl)\b/.test(lower)) return 'tr';

    // Portuguese (Specific words/chars)
    if (/\b(baixar|vídeo|para|twitter)\b/.test(lower) && /(baixar|vídeo)/.test(lower)) return 'pt';
    if (/[\u00C0-\u00FF]/.test(lower) && /\b(vídeo|gravar|salvar)\b/.test(lower)) return 'pt';

    // Spanish (Specific words)
    if (/\b(descargar|video|de|el|la)\b/.test(lower) && /(descargar)/.test(lower)) return 'es';

    // Indonesian (Specific words)
    if (/\b(unduh|dari|cara)\b/.test(lower)) return 'id';

    // Default to English
    return 'en';
}

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(rawData);

    console.log(`Analyzing ${data.length} keywords...`);

    let updatedCount = 0;
    data = data.map(item => {
        // Only parse if not already tagged or force update
        const lang = detectLanguage(item['Keyword']);
        updatedCount++;
        return {
            ...item,
            lang: lang
        };
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Successfully updated ${updatedCount} items with language tags.`);

    // Log statistics
    const stats = data.reduce((acc, item) => {
        acc[item.lang] = (acc[item.lang] || 0) + 1;
        return acc;
    }, {});
    console.log('Language Distribution:', stats);

} catch (error) {
    console.error('Error processing JSON:', error);
}
