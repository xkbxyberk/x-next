import 'server-only';
import seoData from '@/data/seo-strategy.json';

export type SeoKeyword = {
    Keyword: string;
    "Search Volume": string;
    "Keyword Difficulty": string;
    lang?: string;
};

export type SeoPageData = {
    slug: string;
    keyword: string;
    lang: string;
    title: string;
    description: string;
    h1: string;
    introText: string;
    relatedKeywords: { text: string; slug: string }[];
};

const COMPETITORS = [
    'ssstwitter',
    'twittervideodownloader',
    'savetweetvid',
    'twdown',
    'sss twitter',
    'twitter video downloader app',
    'twitter video downloader extension'
];

// Force string parsing because "Search Volume" might be "368000" (string) or number
const parseVolume = (vol: string | number) => typeof vol === 'string' ? parseInt(vol.replace(/,/g, ''), 10) : vol;
const parseDifficulty = (diff: string | number) => typeof diff === 'string' ? parseInt(diff, 10) : diff;

/**
 * Normalizes a keyword into a URL-friendly slug.
 * "Twitter Video Downloader" -> "twitter-video-downloader"
 */
export function generateSlug(keyword: string): string {
    return keyword
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-') // Support multilingual chars
        .replace(/^-+|-+$/g, '');
}

/**
 * Returns the top ~1000 "Golden Ratio" keywords for Static Site Generation (SSG).
 * Rule: High Volume AND Low Difficulty (< 40) preferred.
 * Also includes top absolute volume keywords to ensure coverage.
 */
export function getStaticPathsData() {
    const allKeywords = seoData as SeoKeyword[];

    // 1. Filter valid items
    const validItems = allKeywords.filter(k => k.Keyword && k.lang);

    // 2. Score items: Promote High Vol + Low Diff
    const scored = validItems.map(item => {
        const vol = parseVolume(item["Search Volume"]);
        const diff = parseDifficulty(item["Keyword Difficulty"]);

        // Simple Score: Volume / (Difficulty + 1) ^ 2
        // Lower difficulty boosts score significantly.
        // If diff < 40, it's a "Golden Keyword"
        let score = vol;
        if (diff < 40) {
            score = score * 2; // Boost golden ratio
        }

        return { ...item, _score: score };
    });

    // 3. Sort by Score Descending and take top 1000
    return scored
        .sort((a, b) => b._score - a._score)
        .slice(0, 1000)
        .map(item => ({
            slug: generateSlug(item.Keyword),
            lang: item.lang || 'en'
        }));
}

/**
 * Finds a keyword entry by slug and language.
 */
export function getSeoMetadata(slug: string, lang: string): SeoPageData | null {
    const allKeywords = seoData as SeoKeyword[];

    // Find exact match for slug within the requested language
    const match = allKeywords.find(k =>
        (k.lang === lang || (!k.lang && lang === 'en')) &&
        generateSlug(k.Keyword) === slug
    );

    if (!match) return null;

    return {
        slug,
        lang,
        keyword: match.Keyword,
        title: generatePageTitle(match.Keyword, lang),
        description: generateDescription(match.Keyword, lang),
        h1: generateH1(match.Keyword, lang),
        introText: generateIntroText(match.Keyword, lang),
        relatedKeywords: getRelatedKeywords(match, allKeywords)
    };
}

/**
 * Sidebar "Popular Searches" Logic
 * Returns top keywords for the current language.
 */
export function getPopularKeywords(lang: string, limit: number = 8) {
    const allKeywords = seoData as SeoKeyword[];

    let results = allKeywords
        .filter(k => k.lang === lang)
        .sort((a, b) => parseVolume(b["Search Volume"]) - parseVolume(a["Search Volume"]))
        .slice(0, limit);

    // Fallback to English if no keywords found for this language
    if (results.length === 0) {
        results = allKeywords
            .filter(k => k.lang === 'en')
            .sort((a, b) => parseVolume(b["Search Volume"]) - parseVolume(a["Search Volume"]))
            .slice(0, limit);
    }

    return results.map(k => ({
        text: k.Keyword,
        slug: generateSlug(k.Keyword),
        vol: k["Search Volume"],
        lang: k.lang
    }));
}

// --- Content Generation Helpers ---

const UNSUPPORTED_PLATFORMS = [
    // English & Global
    'youtube', 'tiktok', 'facebook', 'reels', 'dailymotion', 'ig', 'yt', 'fb',
    'reddit', 'pinterest', 'twitch', 'soundcloud', 'vimeo', 'spotify', 'threads', 'instagram', 'snapchat', 'vk',

    // Arabic (فيسبوك, فيس, تيك توك, انستقرام, يوتيوب, سناب)
    'فيسبوك', 'فيس', 'تيك توك', 'انستقرام', 'يوتيوب', 'سناب',

    // Russian (тик ток, фейсбук, инстаграм, ютуб, вк, вконтакте)
    'тик ток', 'фейсбук', 'инстаграм', 'ютуб', 'вк', 'вконтакте',

    // Thai (เฟส, ดาวโหลดวิดีโอจากเฟส, ติ๊กต๊อก)
    'เฟส', 'ดาวโหลดวิดีโอจากเฟส', 'ติ๊กต๊อก',

    // Chinese (抖音, 油管)
    '抖音', '油管',

    // Vietnamese (tải video facebook)
    'tải video facebook',

    // Others/Common Typos/Shorts
    'fb video', 'ig video', 'insta'
];

function isComingSoon(keyword: string): string | undefined {
    const lower = keyword.toLowerCase();
    // Start matching specific platforms. 
    // "ig" should match "ig video" but maybe not "big". Using word boundary or simple includes if platform name is long enough.
    // "ig", "yt", "fb" are short, need careful matching.
    return UNSUPPORTED_PLATFORMS.find(p => {
        if (['ig', 'yt', 'fb'].includes(p)) {
            return new RegExp(`\\b${p}\\b`).test(lower);
        }
        return lower.includes(p);
    });
}


function isCompetitor(keyword: string): string | undefined {
    const lower = keyword.toLowerCase();
    return COMPETITORS.find(c => lower.includes(c));
}

export function generatePageTitle(keyword: string, lang: string): string {
    const platform = isComingSoon(keyword);
    const competitor = isCompetitor(keyword);
    const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const title = toTitleCase(keyword);

    if (platform) {
        const soonMap: Record<string, string> = {
            tr: `${title} - Çok Yakında (XDownloaderz)`,
            en: `${title} - Coming Soon (XDownloaderz)`,
            es: `${title} - Próximamente (XDownloaderz)`,
            pt: `${title} - Em Breve (XDownloaderz)`,
            id: `${title} - Segera Hadir (XDownloaderz)`
        };
        return soonMap[lang] || soonMap['en'];
    }

    if (competitor) {
        const compMap: Record<string, string> = {
            tr: `${title} Alternatifi - XDownloaderz`,
            en: `${title} Alternative - XDownloaderz`,
            es: `Alternativa a ${title} - XDownloaderz`,
            pt: `Alternativa ao ${title} - XDownloaderz`,
            id: `Alternatif ${title} - XDownloaderz`,
            ko: `${title} 대안 - XDownloaderz`,
            zh: `${title} 替代方案 - XDownloaderz`,
            ar: `بديل ${title} - XDownloaderz`,
            ru: `Альтернатива ${title} - XDownloaderz`
        };
        return compMap[lang] || compMap['en'];
    }

    const titleMap: Record<string, string> = {
        tr: `${title} - Ücretsiz İndir (HD)`,
        en: `${title} - Download Free (HD)`,
        es: `${title} - Descargar Gratis (HD)`,
        pt: `${title} - Baixar Grátis (HD)`,
        id: `${title} - Unduh Gratis (HD)`,
        ko: `${title} - 무료 다운로드 (HD)`,
        zh: `${title} - 免费下载 (HD)`,
        ar: `${title} - تحميل مجاني (HD)`,
        ru: `${title} - Скачать бесплатно (HD)`
    };
    return titleMap[lang] || titleMap['en'];
}

function generateH1(keyword: string, lang: string): string {
    const platform = isComingSoon(keyword);
    const competitor = isCompetitor(keyword);
    const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    if (platform) {
        const h1Map: Record<string, string> = {
            tr: `${toTitleCase(keyword)} (Üzerinde Çalışıyoruz 🚧)`,
            en: `${toTitleCase(keyword)} (Coming Soon 🚧)`,
            es: `${toTitleCase(keyword)} (Próximamente 🚧)`,
        };
        return h1Map[lang] || `${toTitleCase(keyword)} (Coming Soon 🚧)`;
    }

    if (competitor) {
        const h1Map: Record<string, string> = {
            tr: `${toTitleCase(keyword)} İçin Daha İyi Bir Alternatif`,
            en: `A Better Alternative directly for ${toTitleCase(keyword)}`,
            es: `Mejor Alternativa a ${toTitleCase(keyword)}`,
            pt: `Melhor Alternativa para ${toTitleCase(keyword)}`,
            id: `Alternatif Terbaik untuk ${toTitleCase(keyword)}`,
            ko: `${toTitleCase(keyword)}를 위한 더 나은 대안`,
            zh: `${toTitleCase(keyword)} 的最佳替代方案`,
            ar: `أفضل بديل لـ ${toTitleCase(keyword)}`,
            ru: `Лучшая альтернатива для ${toTitleCase(keyword)}`
        };
        return h1Map[lang] || h1Map['en'];
    }

    const lower = keyword.toLowerCase();

    if (lang === 'en') {
        if (lower.includes('iphone')) return `Download ${toTitleCase(keyword.replace('iphone', '').trim())} to iPhone`;
        if (lower.includes('android')) return `Download ${toTitleCase(keyword.replace('android', '').trim())} to Android`;
        if (lower.includes('gif')) return `Save ${toTitleCase(keyword)}s Instantly`;
    }
    return toTitleCase(keyword);
}

function generateDescription(keyword: string, lang: string): string {
    const platform = isComingSoon(keyword);
    const competitor = isCompetitor(keyword);

    if (platform) {
        const descMap: Record<string, string> = {
            tr: `XDownloaderz şu an sadece Twitter/X destekliyor, ancak ${keyword} özelliği çok yakında eklenecek! Şu an için en iyi Twitter video indiriciyi deneyebilirsiniz.`,
            en: `XDownloaderz currently supports Twitter/X only, but support for ${keyword} is coming very soon! In the meantime, try the best Twitter video downloader.`,
            es: `XDownloaderz actualmente solo soporta Twitter/X, ¡pero la función de ${keyword} llegará muy pronto!`,
        };
        return descMap[lang] || descMap['en'];
    }

    if (competitor) {
        const descMap: Record<string, string> = {
            tr: `${keyword} çalışmıyor mu veya yavaş mı? XDownloaderz, Twitter videolarını reklamsız ve HD kalitede indirmeniz için en hızlı ve güvenli alternatiftir.`,
            en: `Is ${keyword} not working or slow? Try XDownloaderz, the fastest and most secure alternative to download Twitter videos in HD without ads.`,
            es: `¿${keyword} no funciona? Prueba XDownloaderz, la alternativa más rápida y segura para descargar videos de Twitter en HD.`,
            pt: `O ${keyword} não está funcionando? Experimente o XDownloaderz, a alternativa mais rápida e segura para baixar vídeos do Twitter.`,
            id: `${keyword} tidak berfungsi? Coba XDownloaderz, alternatif tercepat dan teraman untuk mengunduh video Twitter.`
        };
        return descMap[lang] || descMap['en'];
    }

    const descMap: Record<string, string> = {
        tr: `En iyi ${keyword} aracı. XDownloaderz ile Twitter (X) üzerindeki videoları ve GIF'lerini ücretsiz, yüksek kalitede (1080p) telefonuna veya bilgisayarına indir.`,
        en: `The best tool for ${keyword}. Download Twitter videos and GIFs in HD (1080p) for free to your phone or PC with XDownloaderz.`,
        es: `La mejor herramienta para ${keyword}. Descarga videos y GIFs de Twitter en HD (1080p) gratis en tu teléfono o PC con XDownloaderz.`,
        pt: `A melhor ferramenta para ${keyword}. Baixe vídeos e GIFs do Twitter em HD (1080p) gratuitamente para seu telefone ou PC com o XDownloaderz.`,
        id: `Alat terbaik untuk ${keyword}. Unduh video dan GIF Twitter dalam HD (1080p) secara gratis ke ponsel atau PC Anda dengan XDownloaderz.`,
        ko: `${keyword}을(를) 위한 최고의 도구입니다. XDownloaderz를 사용하여 Twitter 비디오 및 GIF를 무료로 HD(1080p) 화질로 다운로드하세요.`,
        zh: `${keyword} 的最佳工具。使用 XDownloaderz免费下载高清 (1080p) 的 Twitter 视频和 GIF。`,
        ar: `أفضل أداة لـ ${keyword}. قم بتنزيل مقاطع فيديو Twitter وملفات GIF بجودة HD (1080p) مجانًا باستخدام XDownloaderz.`,
        ru: `Лучший инструмент для ${keyword}. Скачивайте видео и GIF из Твиттера в HD (1080p) бесплатно с XDownloaderz.`
    };
    return descMap[lang] || descMap['en'];
}

function generateIntroText(keyword: string, lang: string): string {
    const lower = keyword.toLowerCase();

    // 1. Check Coming Soon First
    const platform = isComingSoon(keyword);
    if (platform) {
        const introMap: Record<string, string> = {
            tr: `Aradığınız **${keyword}** özelliği şu an geliştirme aşamasındadır. XDownloaderz ekibi olarak, yakında Youtube, Instagram, TikTok ve diğer platformları da destekleyeceğiz.\n\nŞimdilik, dünyanın en hızlı Twitter (X) video indiricisini ücretsiz kullanabilirsiniz.`,
            en: `The **${keyword}** feature you are looking for is currently under development. As the XDownloaderz team, we will strictly support Youtube, Instagram, TikTok, and other platforms soon.\n\nFor now, you can use the world's fastest Twitter (X) video downloader for free.`,
            es: `La función **${keyword}** que buscas está actualmente en desarrollo. ¡Pronto daremos soporte a más plataformas!\n\nPor ahora, disfruta del mejor descargador de Twitter.`,
        };
        return introMap[lang] || introMap['en'];
    }

    let intro = '';

    // Competitor Comparison Logic
    const competitor = isCompetitor(keyword);

    if (competitor) {
        if (lang === 'tr') {
            intro += `${keyword} alternatifi mi arıyorsunuz? XDownloaderz daha hızlı, reklamsız ve %100 güvenli bir deneyim sunar. `;
        } else {
            intro += `Looking for a faster alternative to ${keyword}? XDownloaderz offers a secure, ad-free, and high-speed experience. `;
        }
    }

    // Improved Intro Text (SEO Optimized)
    const introMap: Record<string, string> = {
        tr: `**${keyword}** işlemini yapmak için en iyi yerdesiniz. XDownloaderz ile Twitter (X) üzerindeki videoları, GIF'leri ve medyaları saniyeler içinde, en yüksek kalitede cihazınıza kaydedebilirsiniz. Kurulum, üyelik veya bekleme süresi yok. Sadece linki yapıştırın ve indirin.`,
        en: `You've found the best tool for **${keyword}**. With XDownloaderz, you can save Twitter (X) videos, GIFs, and media to your device in seconds at the highest quality. No installation, no sign-up, no waiting. Just paste the link and download.`,
        es: `Has encontrado la mejor herramienta para **${keyword}**. Con XDownloaderz, puedes guardar videos, GIF y medios de Twitter (X) en tu dispositivo en segundos con la máxima calidad. Sin instalación, sin registro, sin esperas.`,
        pt: `Você encontrou a melhor ferramenta para **${keyword}**. Com o XDownloaderz, você pode salvar vídeos, GIFs e mídias do Twitter (X) no seu dispositivo em segundos com a mais alta qualidade. Sem instalação, sem cadastro.`,
        id: `Anda telah menemukan alat terbaik untuk **${keyword}**. Dengan XDownloaderz, Anda dapat menyimpan video, GIF, dan media Twitter (X) ke perangkat Anda dalam hitungan detik dengan kualitas tertinggi.`,
        ko: `**${keyword}**을(를) 위한 최고의 도구를 찾으셨습니다. XDownloaderz를 사용하면 Twitter(X) 비디오, GIF 및 미디어를 최고 품질로 몇 초 만에 기기에 저장할 수 있습니다. 설치나 가입이 필요 없습니다.`,
        zh: `您已找到 **${keyword}** 的最佳工具。使用 XDownloaderz，您可以在几秒钟内以最高质量将 Twitter (X) 视频、GIF 和媒体保存到您的设备。无需安装，无需注册。`,
        ar: `لقد وجدت أفضل أداة لـ **${keyword}**. مع XDownloaderz، يمكنك حفظ مقاطع فيديو Twitter (X) وملفات GIF والوسائط على جهازك في ثوانٍ بأعلى جودة. لا تثبيت، لا تسجيل.`,
        ru: `Вы нашли лучший инструмент для **${keyword}**. С XDownloaderz вы можете сохранить видео, GIF и медиа из Twitter (X) на свое устройство за считанные секунды в высочайшем качестве. Без установки и регистрации.`
    };

    return intro + (introMap[lang] || introMap['en']);
}

export function generateGuideText(keyword: string, lang: string): string {
    const platform = isComingSoon(keyword);
    if (platform) {
        return lang === 'tr'
            ? `🚧 **${keyword}** henüz aktif değil.\n\nBu özellik eklendiğinde:\n1. Linki kopyala.\n2. Buraya yapıştır.\n3. İndir butonuna bas.\n\nTakipte kalın!`
            : `🚧 **${keyword}** is not active yet.\n\nOnce added:\n1. Copy link.\n2. Paste here.\n3. Click Download.\n\nStay tuned!`;
    }

    const guideMap: Record<string, string> = {
        tr: `**${keyword}** Nasıl Yapılır?\n\n1. X (Twitter) uygulamasını açın ve indirmek istediğiniz videoyu bulun.\n2. "Paylaş" ikonuna tıklayın ve "Bağlantıyı Kopyala" seçeneğini seçin.\n3. XDownloaderz'a dönün ve bağlantıyı yukarıdaki kutuya yapıştırın.\n4. "İndir" butonuna basın ve istediğiniz kaliteyi (HD, SD, MP3) seçin.`,
        en: `How to **${keyword}**?\n\n1. Open X (Twitter) and find the video/media you want to save.\n2. Tap the "Share" icon and select "Copy Link".\n3. Come back to XDownloaderz and paste the link in the box above.\n4. Hit the "Download" button and choose your preferred quality (HD, SD, MP3).`,
        es: `¿Cómo **${keyword}**?\n\n1. Abre X (Twitter) y busca el video que deseas guardar.\n2. Toca el icono "Compartir" y selecciona "Copiar enlace".\n3. Vuelve a XDownloaderz y pega el enlace en el cuadro de arriba.\n4. Pulsa "Descargar" y elige tu calidad (HD, SD, MP3).`,
        pt: `Como **${keyword}**?\n\n1. Abra o X (Twitter) e encontre o vídeo que deseja salvar.\n2. Toque no ícone "Compartilhar" e selecione "Copiar Link".\n3. Volte para o XDownloaderz e cole o link na caixa acima.\n4. Clique no botão "Baixar" e escolha a qualidade (HD, SD, MP3).`,
        id: `Bagaimana cara **${keyword}**?\n\n1. Buka X (Twitter) dan temukan video yang ingin Anda simpan.\n2. Ketuk ikon "Bagikan" dan pilih "Salin Tautan".\n3. Kembali ke XDownloaderz dan tempel tautan di kotak di atas.\n4. Tekan tombol "Unduh" dan pilih kualitas yang Anda inginkan (HD, SD, MP3).`,
        ko: `**${keyword}** 방법?\n\n1. X(Twitter)를 열고 저장하려는 비디오를 찾습니다.\n2. "공유" 아이콘을 탭하고 "링크 복사"를 선택합니다.\n3. XDownloaderz로 돌아와 링크를 상단에 붙여넣습니다.\n4. "다운로드" 버튼을 누르고 원하는 화질을 선택합니다.`,
        zh: `如何 **${keyword}**？\n\n1. 打开 X (Twitter) 并找到您要保存的视频。\n2. 点击“分享”图标并选择“复制链接”。\n3. 回到 XDownloaderz 并将链接粘贴到上方框中。\n4. 点击“下载”按钮并选择您想要的质量。`,
        ar: `كيفية **${keyword}**؟\n\n1. افتح X (Twitter) وابحث عن الفيديو الذي تريد حفظه.\n2. اضغط على أيقونة "مشاركة" واختر "نسخ الرابط".\n3. عد إلى XDownloaderz والصق الرابط في المربع أعلاه.\n4. اضغط على "تنزيل" واختر الجودة المفضلة لديك.`,
        ru: `Как **${keyword}**?\n\n1. Откройте X (Twitter) и найдите видео, которое хотите сохранить.\n2. Нажмите значок «Поделиться» и выберите «Копировать ссылку».\n3. Вернитесь в XDownloaderz и вставьте ссылку в поле выше.\n4. Нажмите кнопку «Скачать» и выберите качество.`
    }
    return guideMap[lang] || guideMap['en'];
}

export function generateBenefitsText(keyword: string, lang: string): string {
    const platform = isComingSoon(keyword);
    if (platform) {
        return lang === 'tr'
            ? `Neden XDownloaderz?\n\n• **Çoklu Platform:** Yakında sadece Twitter değil, ${platform} ve diğerleri de desteklenecek.\n• **Tek Adres:** Tüm indirme ihtiyaçlarınız için tek site.\n• **Güvenli:** Tamamen tarayıcı tabanlı.`
            : `Why XDownloaderz?\n\n• **Multi-Platform:** Soon supporting not just Twitter, but also ${platform} and more.\n• **All-in-One:** One site for all your download needs.\n• **Secure:** Fully browser-based.`;
    }

    const beneMap: Record<string, string> = {
        tr: `Neden XDownloaderz? **${keyword}** konusunda size en iyi deneyimi sunuyoruz:\n\n• **Tamamen Ücretsiz:** Gizli ücret yok.\n• **HD Kalite:** Videoları orijinal 1080p kalitesinde indirin.\n• **Tüm Cihazlarla Uyumlu:** iPhone, Android, Tablet veya PC.\n• **Hızlı ve Güvenli:** Verileriniz kaydedilmez, indirme işlemi anlıktır.`,
        en: `Why choose XDownloaderz for **${keyword}**?\n\n• **100% Free:** No hidden costs.\n• **HD Quality:** Download videos in original 1080p resolution.\n• **All Devices:** Works perfectly on iPhone, Android, Tablet, or PC.\n• **Fast & Secure:** No data retention, instant downloads.`,
        ko: `왜 XDownloaderz인가요? **${keyword}**를 위한 최고의 선택:\n\n• **100% 무료:** 숨겨진 비용이 없습니다.\n• **HD 화질:** 원본 1080p 해상도로 비디오를 다운로드하세요.\n• **모든 기기 호환:** iPhone, Android, 태블릿 또는 PC에서 완벽하게 작동합니다.\n• **빠르고 안전함:** 데이터가 저장되지 않으며 즉시 다운로드됩니다.`,
        zh: `为什么选择 XDownloaderz 进行 **${keyword}**？\n\n• **100% 免费：** 无隐藏费用。\n• **HD 画质：** 以原始 1080p 分辨率下载视频。\n• **全设备兼容：** 在 iPhone、Android、平板电脑或 PC 上完美运行。\n• **快速安全：** 无数据保留，即时下载。`,
        ar: `لماذا تختار XDownloaderz لـ **${keyword}**؟\n\n• **مجاني 100%:** لا تكاليف خفية.\n• **جودة HD:** قم بتنزيل مقاطع الفيديو بدقة 1080p الأصلية.\n• **جميع الأجهزة:** يعمل بشكل مثالي على iPhone أو Android أو الكمبيوتر اللوحي أو الكمبيوتر الشخصي.\n• **سريع وآمن:** لا يتم الاحتفاظ بالبيانات، تنزيلات فورية.`,
        ru: `Почему XDownloaderz для **${keyword}**?\n\n• **100% Бесплатно:** Никаких скрытых расходов.\n• **HD Качество:** Скачивайте видео в оригинальном разрешении 1080p.\n• **Все устройства:** Отлично работает на iPhone, Android, планшете или ПК.\n• **Быстро и безопасно:** Данные не сохраняются, мгновенная загрузка.`
    }
    return beneMap[lang] || beneMap['en'];
}

function getRelatedKeywords(current: SeoKeyword, all: SeoKeyword[]) {
    // Find other keywords in same language with similar words
    const words = current.Keyword.split(' ').filter(w => w.length > 3);

    return all
        .filter(k => k.lang === current.lang && k.Keyword !== current.Keyword)
        .map(k => {
            let matchCount = 0;
            words.forEach(w => {
                if (k.Keyword.includes(w)) matchCount++;
            });
            return { ...k, matchCount };
        })
        .sort((a, b) => b.matchCount - a.matchCount || parseVolume(b["Search Volume"]) - parseVolume(a["Search Volume"]))
        .slice(0, 6)
        .map(k => ({
            text: k.Keyword,
            slug: generateSlug(k.Keyword)
        }));
}
