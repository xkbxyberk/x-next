// Mocking usage locally
// const { generateSlug } = require('./lib/seo');
function generateSlugLocal(keyword) {
    return keyword
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const arabicKeywords = [
    "تنزيل فيديو تويتر", // classic
    "تحميل فيديو من تويتر",
    "تويتر فيديو"
];

console.log("--- ARABIC SLUG TEST ---");
arabicKeywords.forEach(k => {
    const slug = generateSlugLocal(k);
    console.log(`Keyword: ${k}`);
    console.log(`Slug:    ${slug}`);
    console.log(`Encoded: ${encodeURIComponent(slug)}`);
});
