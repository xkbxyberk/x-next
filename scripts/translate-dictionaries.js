const fs = require('fs');
const path = require('path');

const dictionariesDir = path.join(__dirname, '../dictionaries');

// Common translations for social media
// "About", "Title", "Description", "ImageAlt"
const translations = {
    // English
    en: {
        about: "About",
        ogTitle: "XDownloaderz | Download X Videos Fast & Free | 1080p MP4",
        ogDescription: "The best X (Twitter) Video Downloader. Save videos and GIFs in 1080p full HD quality. Convert X videos to MP3. Free, fast, and no registration required.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Turkish
    tr: {
        about: "Hakkında",
        ogTitle: "XDownloaderz | X Video İndir | Hızlı & Ücretsiz | 1080p MP4",
        ogDescription: "En iyi X (Twitter) Video İndirici. Videoları ve GIF'leri 1080p yüksek kalitede kaydedin. MP3 dönüştürücü. Kurulumsuz, ücretsiz ve hızlı.",
        imageAlt: "XDownloaderz - X Video İndirici"
    },
    // Arabic
    ar: {
        about: "حول",
        ogTitle: "XDownloaderz | تحميل فيديوهات X بسرعة ومجانًا | 1080p MP4",
        ogDescription: "أفضل أداة لتحميل فيديوهات X (تويتر). احفظ الفيديوهات وملفات GIF بجودة عالية 1080p. تحويل إلى MP3. مجاني وسريع وبدون تسجيل.",
        imageAlt: "XDownloaderz - أداة تحميل فيديو X"
    },
    // Bulgarian
    bg: {
        about: "Относно",
        ogTitle: "XDownloaderz | Изтегляне на X видеоклипове Бързо и Безплатно | 1080p MP4",
        ogDescription: "Най-добрият инструмент за изтегляне на видео от X (Twitter). Запазвайте видеоклипове и GIF файлове с Full HD качество 1080p. Конвертиране в MP3.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Bengali
    bn: {
        about: "সম্পর্কে",
        ogTitle: "XDownloaderz | X ভিডিও ডাউনলোড করুন দ্রুত ও বিনামূল্যে | 1080p MP4",
        ogDescription: "সেরা X (Twitter) ভিডিও ডাউনলোডার। ভিডিও এবং GIF সেভ করুন ফুল HD 1080p কোয়ালিটিতে। MP3 তে রূপান্তর করুন। বিনামূল্যে এবং দ্রুত।",
        imageAlt: "XDownloaderz - X ভিডিও ডাউনলোডার"
    },
    // Portuguese (Brazil)
    br: {
        about: "Sobre",
        ogTitle: "XDownloaderz | Baixar Vídeos do X Rápido e Grátis | 1080p MP4",
        ogDescription: "O melhor baixador de vídeos do X (Twitter). Salve vídeos e GIFs em qualidade Full HD 1080p. Converta para MP3. Gratuito, rápido e sem registro.",
        imageAlt: "XDownloaderz - Baixador de Vídeos X"
    },
    // Czech
    cs: {
        about: "O nás",
        ogTitle: "XDownloaderz | Stahování videí z X rychle a zdarma | 1080p MP4",
        ogDescription: "Nejlepší stahovač videí z X (Twitter). Ukládejte videa a GIFy v kvalitě 1080p Full HD. Převod do MP3. Zdarma a bez registrace.",
        imageAlt: "XDownloaderz - Stahovač videí X"
    },
    // Danish
    da: {
        about: "Om",
        ogTitle: "XDownloaderz | Download X-videoer hurtigt og gratis | 1080p MP4",
        ogDescription: "Den bedste X (Twitter) video downloader. Gem videoer og GIF'er i 1080p fuld HD-kvalitet. Konverter til MP3. Gratis, hurtig og ingen registrering.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // German
    de: {
        about: "Über uns",
        ogTitle: "XDownloaderz | X Videos schnell & kostenlos herunterladen | 1080p MP4",
        ogDescription: "Der beste X (Twitter) Video Downloader. Speichern Sie Videos und GIFs in 1080p Full HD Qualität. In MP3 konvertieren. Kostenlos und ohne Registrierung.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Greek
    el: {
        about: "Σχετικά",
        ogTitle: "XDownloaderz | Κατεβάστε βίντεο X γρήγορα και δωρεάν | 1080p MP4",
        ogDescription: "Το καλύτερο πρόγραμμα λήψης βίντεο X (Twitter). Αποθηκεύστε βίντεο και GIF σε ποιότητα Full HD 1080p. Μετατροπή σε MP3.",
        imageAlt: "XDownloaderz - Πρόγραμμα λήψης βίντεο X"
    },
    // Spanish
    es: {
        about: "Acerca de",
        ogTitle: "XDownloaderz | Descargar videos de X Rápido y Gratis | 1080p MP4",
        ogDescription: "El mejor descargador de videos de X (Twitter). Guarda videos y GIFs en calidad Full HD 1080p. Convierte a MP3. Gratis y sin registro.",
        imageAlt: "XDownloaderz - Descargador de videos X"
    },
    // Persian
    fa: {
        about: "درباره ما",
        ogTitle: "XDownloaderz | دانلود ویدیوهای X سریع و رایگان | 1080p MP4",
        ogDescription: "بهترین دانلود کننده ویدیو از X (توییتر). ذخیره ویدیوها و GIFها با کیفیت Full HD 1080p. تبدیل به MP3. رایگان و بدون ثبت نام.",
        imageAlt: "XDownloaderz - دانلود کننده ویدیو X"
    },
    // Finnish
    fi: {
        about: "Tietoja",
        ogTitle: "XDownloaderz | Lataa X-videoita nopeasti ja ilmaiseksi | 1080p MP4",
        ogDescription: "Paras X (Twitter) -videolataaja. Tallenna videoita ja GIF-tiedostoja 1080p Full HD -laadulla. Muunna MP3-muotoon. Ilmainen ja ilman rekisteröitymistä.",
        imageAlt: "XDownloaderz - X-videolataaja"
    },
    // French
    fr: {
        about: "À propos",
        ogTitle: "XDownloaderz | Télécharger vidéos X rapidement et gratuitement | 1080p MP4",
        ogDescription: "Le meilleur téléchargeur de vidéos X (Twitter). Enregistrez vidéos et GIFs en qualité Full HD 1080p. Convertisseur MP3. Gratuit et sans inscription.",
        imageAlt: "XDownloaderz - Téléchargeur de vidéos X"
    },
    // Hebrew
    he: {
        about: "אודות",
        ogTitle: "XDownloaderz | הורדת סרטוני X במהירות ובחינם | 1080p MP4",
        ogDescription: "הורדת הסרטונים הטובה ביותר ל-X (טוויטר). שמור סרטונים ו-GIF באיכות Full HD 1080p. המרה ל-MP3. חינם וללא הרשמה.",
        imageAlt: "XDownloaderz - הורדת סרטוני X"
    },
    // Hindi
    hi: {
        about: "के बारे में",
        ogTitle: "XDownloaderz | X वीडियो डाउनलोड करें तेज़ और मुफ़्त | 1080p MP4",
        ogDescription: "सर्वश्रेष्ठ X (Twitter) वीडियो डाउनलोडर। 1080p फुल एचडी गुणवत्ता में वीडियो और जिफ़ सहेजें। MP3 में बदलें। मुफ़्त और कोई पंजीकरण आवश्यक नहीं।",
        imageAlt: "XDownloaderz - X वीडियो डाउनलोडर"
    },
    // Croatian
    hr: {
        about: "O nama",
        ogTitle: "XDownloaderz | Preuzmite X videozapise brzo i besplatno | 1080p MP4",
        ogDescription: "Najbolji program za preuzimanje videa s X-a (Twittera). Spremite videozapise i GIF-ove u 1080p Full HD kvaliteti. Pretvori u MP3.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Hungarian
    hu: {
        about: "Rólunk",
        ogTitle: "XDownloaderz | X videók letöltése gyorsan és ingyen | 1080p MP4",
        ogDescription: "A legjobb X (Twitter) videó letöltő. Mentse el a videókat és GIF-eket 1080p Full HD minőségben. Konvertálás MP3-ba. Ingyenes és regisztráció nélkül.",
        imageAlt: "XDownloaderz - X Videó letöltő"
    },
    // Indonesian
    id: {
        about: "Tentang",
        ogTitle: "XDownloaderz | Unduh Video X Cepat & Gratis | 1080p MP4",
        ogDescription: "Pengunduh Video X (Twitter) terbaik. Simpan video dan GIF dalam kualitas Full HD 1080p. Konversi ke MP3. Gratis dan tanpa registrasi.",
        imageAlt: "XDownloaderz - Pengunduh Video X"
    },
    // Italian
    it: {
        about: "Chi siamo",
        ogTitle: "XDownloaderz | Scarica video X velocemente e gratis | 1080p MP4",
        ogDescription: "Il miglior downloader di video X (Twitter). Salva video e GIF in qualità Full HD 1080p. Converti in MP3. Gratuito e senza registrazione.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Japanese
    ja: {
        about: "概要",
        ogTitle: "XDownloaderz | X動画を高速かつ無料でダウンロード | 1080p MP4",
        ogDescription: "最高のX（Twitter）動画ダウンローダー。動画やGIFを1080pフルHD品質で保存。MP3に変換。無料、登録不要。",
        imageAlt: "XDownloaderz - X動画ダウンローダー"
    },
    // Khmer
    km: {
        about: "អំពីយើង",
        ogTitle: "XDownloaderz | ទាញយកវីដេអូ X លឿននិងឥតគិតថ្លៃ | 1080p MP4",
        ogDescription: "កម្មវិធីទាញយកវីដេអូ X (Twitter) ល្អបំផុត។ រក្សាទុកវីដេអូនិង GIF ក្នុងគុណភាព 1080p Full HD ។ បម្លែងទៅជា MP3 ។",
        imageAlt: "XDownloaderz - កម្មវិធីទាញយកវីដេអូ X"
    },
    // Korean
    ko: {
        about: "정보",
        ogTitle: "XDownloaderz | X 동영상 빠르고 무료로 다운로드 | 1080p MP4",
        ogDescription: "최고의 X (Twitter) 동영상 다운로더. 1080p Full HD 품질로 동영상 및 GIF 저장. MP3 변환. 무료, 가입 필요 없음.",
        imageAlt: "XDownloaderz - X 동영상 다운로더"
    },
    // Malay
    ms: {
        about: "Tentang",
        ogTitle: "XDownloaderz | Muat Turun Video X Pantas & Percuma | 1080p MP4",
        ogDescription: "Pemuat turun Video X (Twitter) terbaik. Simpan video dan GIF dalam kualiti Full HD 1080p. Tukar kepada MP3. Percuma dan tiada pendaftaran.",
        imageAlt: "XDownloaderz - Pemuat Turun Video X"
    },
    // Nepali
    ne: {
        about: "हाम्रो बारेमा",
        ogTitle: "XDownloaderz | X भिडियोहरू छिटो र नि: शुल्क डाउनलोड गर्नुहोस् | 1080p MP4",
        ogDescription: "सबैभन्दा राम्रो X (Twitter) भिडियो डाउनलोडर। 1080p फुल एचडी गुणस्तरमा भिडियो र GIF बचत गर्नुहोस्। MP3 मा रूपान्तरण गर्नुहोस्।",
        imageAlt: "XDownloaderz - X भिडियो डाउनलोडर"
    },
    // Dutch
    nl: {
        about: "Over ons",
        ogTitle: "XDownloaderz | Download X Video's Snel & Gratis | 1080p MP4",
        ogDescription: "De beste X (Twitter) video downloader. Sla video's en GIF's op in 1080p Full HD kwaliteit. Converteer naar MP3. Gratis en geen registratie.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Norwegian
    no: {
        about: "Om oss",
        ogTitle: "XDownloaderz | Last ned X-videoer raskt og gratis | 1080p MP4",
        ogDescription: "Den beste X (Twitter) videonedlasteren. Lagre videoer og GIF-er i 1080p full HD-kvalitet. Konverter til MP3. Gratis og uten registrering.",
        imageAlt: "XDownloaderz - X Videonedlaster"
    },
    // Polish
    pl: {
        about: "O nas",
        ogTitle: "XDownloaderz | Pobieraj filmy z X Szybko i Za Darmo | 1080p MP4",
        ogDescription: "Najlepszy program do pobierania wideo z X (Twitter). Zapisuj filmy i GIF-y w jakości Full HD 1080p. Konwertuj na MP3. Bezpłatnie i bez rejestracji.",
        imageAlt: "XDownloaderz - Pobieracz wideo X"
    },
    // Portuguese (Portugal)
    pt: {
        about: "Sobre",
        ogTitle: "XDownloaderz | Descarregar Vídeos do X Rápido e Grátis | 1080p MP4",
        ogDescription: "O melhor descarregador de vídeos do X (Twitter). Guarde vídeos e GIFs em qualidade Full HD 1080p. Converta para MP3. Gratuito e sem registo.",
        imageAlt: "XDownloaderz - Descarregador de Vídeos X"
    },
    // Romanian
    ro: {
        about: "Despre",
        ogTitle: "XDownloaderz | Descarcă videoclipuri X Rapid & Gratuit | 1080p MP4",
        ogDescription: "Cel mai bun program de descărcare video X (Twitter). Salvează videoclipuri și GIF-uri la calitate Full HD 1080p. Convertește în MP3.",
        imageAlt: "XDownloaderz - Descărcător Video X"
    },
    // Russian
    ru: {
        about: "О нас",
        ogTitle: "XDownloaderz | Скачать видео с X быстро и бесплатно | 1080p MP4",
        ogDescription: "Лучший загрузчик видео с X (Twitter). Сохраняйте видео и GIF в качестве 1080p Full HD. Конвертация в MP3. Бесплатно и без регистрации.",
        imageAlt: "XDownloaderz - Загрузчик видео с X"
    },
    // Serbian
    sr: {
        about: "O nama",
        ogTitle: "XDownloaderz | Preuzmite X video zapise brzo i besplatno | 1080p MP4",
        ogDescription: "Najbolji program za preuzimanje videa sa X-a (Twittera). Sačuvajte video zapise i GIF-ove u 1080p Full HD kvalitetu. Konvertujte u MP3.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Swedish
    sv: {
        about: "Om oss",
        ogTitle: "XDownloaderz | Ladda ner X-videor snabbt och gratis | 1080p MP4",
        ogDescription: "Den bästa X (Twitter) videonedladdaren. Spara videor och GIF-filer i 1080p full HD-kvalitet. Konvertera till MP3. Gratis och utan registrering.",
        imageAlt: "XDownloaderz - X Videonedladdare"
    },
    // Swahili
    sw: {
        about: "Kuhusu",
        ogTitle: "XDownloaderz | Pakua Video za X Haraka na Bure | 1080p MP4",
        ogDescription: "Kipakuzi bora cha Video cha X (Twitter). Hifadhi video na GIF katika ubora wa 1080p Full HD. Badilisha hadi MP3. Bure na hakuna usajili.",
        imageAlt: "XDownloaderz - Kipakuzi cha Video cha X"
    },
    // Thai
    th: {
        about: "เกี่ยวกับ",
        ogTitle: "XDownloaderz | ดาวน์โหลดวิดีโอ X รวดเร็วและฟรี | 1080p MP4",
        ogDescription: "เครื่องมือดาวน์โหลดวิดีโอ X (Twitter) ที่ดีที่สุด บันทึกวิดีโอและ GIF ในคุณภาพระดับ Full HD 1080p แปลงเป็น MP3 ฟรีและไม่ต้องลงทะเบียน",
        imageAlt: "XDownloaderz - เครื่องมือดาวน์โหลดวิดีโอ X"
    },
    // Filipino (Tagalog)
    tl: {
        about: "Tungkol sa",
        ogTitle: "XDownloaderz | Mag-download ng X Videos Mabilis at Libre | 1080p MP4",
        ogDescription: "Ang pinakamahusay na X (Twitter) Video Downloader. I-save ang mga video at GIF sa 1080p full HD na kalidad. I-convert sa MP3. Libre at walang rehistrasyon.",
        imageAlt: "XDownloaderz - X Video Downloader"
    },
    // Ukrainian
    uk: {
        about: "Про нас",
        ogTitle: "XDownloaderz | Завантажити відео з X швидко та безкоштовно | 1080p MP4",
        ogDescription: "Найкращий завантажувач відео з X (Twitter). Зберігайте відео та GIF у якості 1080p Full HD. Конвертація в MP3. Безкоштовно та без реєстрації.",
        imageAlt: "XDownloaderz - Завантажувач відео з X"
    },
    // Urdu
    ur: {
        about: "ہمارے بارے میں",
        ogTitle: "XDownloaderz | X ویڈیوز تیزی سے اور مفت ڈاؤن لوڈ کریں | 1080p MP4",
        ogDescription: "بہترین X (Twitter) ویڈیو ڈاؤنلوڈر۔ ویڈیوز اور GIFs کو 1080p فل ایچ ڈی کوالٹی میں محفوظ کریں۔ MP3 میں تبدیل کریں۔ مفت اور رجسٹریشن کی ضرورت نہیں۔",
        imageAlt: "XDownloaderz - X ویڈیو ڈاؤنلوڈر"
    },
    // Vietnamese
    vi: {
        about: "Giới thiệu",
        ogTitle: "XDownloaderz | Tải xuống video X nhanh và miễn phí | 1080p MP4",
        ogDescription: "Trình tải xuống video X (Twitter) tốt nhất. Lưu video và GIF ở chất lượng Full HD 1080p. Chuyển đổi sang MP3. Miễn phí và không cần đăng ký.",
        imageAlt: "XDownloaderz - Trình tải xuống video X"
    },
    // Chinese
    zh: {
        about: "关于我们",
        ogTitle: "XDownloaderz | 快速免费下载 X 视频 | 1080p MP4",
        ogDescription: "最好的 X (Twitter) 视频下载器。以 1080p 全高清质量保存视频和 GIF。转换为 MP3。免费且无需注册。",
        imageAlt: "XDownloaderz - X 视频下载器"
    }
};

fs.readdirSync(dictionariesDir).forEach(file => {
    if (!file.endsWith('.json')) return;

    // file name is usually 'code.json' e.g. 'tr.json'
    const langCode = path.basename(file, '.json');
    const translation = translations[langCode] || translations['en']; // Fallback to EN if language code missing in map

    const filePath = path.join(dictionariesDir, file);
    let dict;
    try {
        dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error parsing ${file}:`, e);
        return;
    }

    // Update keys
    if (!dict.common) dict.common = {};

    // Always overwrite with new translation
    dict.common.about = translation.about;

    if (!dict.common.social) dict.common.social = {};

    dict.common.social.ogTitle = translation.ogTitle;
    dict.common.social.ogDescription = translation.ogDescription;
    dict.common.social.imageAlt = translation.imageAlt;

    fs.writeFileSync(filePath, JSON.stringify(dict, null, 4), 'utf8');
    console.log(`Updated translations for ${file}`);
});
