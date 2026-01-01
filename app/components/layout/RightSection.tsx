'use client';

import { Search, MoreHorizontal } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TweetModal = dynamic(() => import('../ui/TweetModal'), {
  ssr: false,
});


interface RightSectionProps {
  dict: any;
  lang: string;
  popularKeywords?: any[];
}

export default function RightSection({ dict, lang, popularKeywords = [] }: RightSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  // Enter tuşuna basıldığında çalışır
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim().length > 0) {
      setModalUrl(inputValue.trim());
      setIsModalOpen(true);
    }
  };


  // 1. Header Map (Google'da Popüler)
  const headerMap: Record<string, string> = {
    tr: "Google'da Popüler",
    en: "Popular on Google",
    es: "Popular en Google",
    pt: "Popular no Google",
    id: "Populer di Google",
    ru: "Популярное в Google",
    ko: "Google 인기",
    zh: "Google 热门",
    ar: "شائع على Google",
    ja: "Googleで人気",
    it: "Popolare su Google",
    de: "Beliebt auf Google",
    fr: "Populaire sur Google",
    pl: "Popularne w Google",
    nl: "Populair op Google",
    sv: "Populärt på Google",
    da: "Populært på Google",
    no: "Populært på Google",
    fi: "Suosittua Googlessa",
    cs: "Populární na Googlu",
    ro: "Popular pe Google",
    hu: "Népszerű a Google-on",
    el: "Δημοφιλή στο Google",
    bg: "Популярно в Google",
    sk: "Populárne na Google",
    uk: "Популярне в Google",
    he: "פופולרי ב-Google",
    hi: "Google पर लोकप्रिय",
    th: "ยอดนิยมใน Google",
    vi: "Phổ biến trên Google",

    // Remaining Languages
    bn: "Google-এ জনপ্রিয়",
    br: "Popular no Google", // Breton/Brazilian Port? Assuming pt-BR mostly
    fa: "محبوب در گوگل",
    hr: "Popularno na Googleu",
    km: "Google ពេញនិយម",
    ms: "Popular di Google",
    ne: "Google मा लोकप्रिय",
    sr: "Популарно на Гуглу",
    sw: "Maarufu kwenye Google",
    tl: "Sikat sa Google",
    ur: "Google پر مقبول",
  };

  // 2. Trend Label Map (Trending in ...)
  const trendLabelMap: Record<string, string> = {
    tr: 'Türkiye tarihinde gündemde', // Custom for TR
    en: 'Trending in United States',
    es: 'Tendencia en España',
    pt: 'Assuntos do Momento no Brasil',
    id: 'Tren di Indonesia',
    ru: 'Актуально в России',
    ko: '대한민국 트렌드',
    zh: '中国趋势',
    ar: 'المتداول في السعودية',
    ja: '日本のトレンド',
    it: 'Di tendenza in Italia',
    de: 'Trends in Deutschland',
    fr: 'Tendances en France',
    pl: 'Popularne w Polsce',
    nl: 'Trending in Nederland',
    sv: 'Trender i Sverige',
    da: 'Trender i Danmark',
    no: 'Trender i Norge',
    fi: 'Trendit Suomessa',
    cs: 'Trendy v Česku',
    ro: 'Tendințe în România',
    hu: 'Felkapott Magyarországon',
    el: 'Тάσεις στην Ελλάδα',
    bg: 'Тенденции в България',
    sk: 'Trendy na Slovensku',
    uk: 'Тренди в Україні',
    he: 'מגמות בישראל',
    hi: 'भारत में ट्रेंडिंग',
    th: 'เทรนด์ในไทย',
    vi: 'Xu hướng tại Việt Nam',

    // Remaining
    bn: 'বাংলাদেশে ট্রেন্ডিং',
    br: 'Tendências no Brasil',
    fa: 'ترند در ایران',
    hr: 'U trendu u Hrvatskoj',
    km: 'الانجاهات في كمبوديا', // Placeholder or English fallback often better for Khmer UI constraint
    ms: 'Trending di Malaysia',
    ne: 'नेपालमा ट्रेन्डिंग',
    sr: 'У тренду у Србији',
    sw: 'Inavuma nchini Kenya',
    tl: 'Trending sa Pilipinas',
    ur: 'پاکستان में ट्रेंडिंग', // Urdu script: پاکستان میں ٹرینڈنگ
  };

  // Fix Urdu Text
  if (lang === 'ur') trendLabelMap.ur = 'پاکستان میں ٹرینڈنگ';
  if (lang === 'km') trendLabelMap.km = 'ពេញនិយមនៅកម្ពុជា';

  const headerText = headerMap[lang] || headerMap['en'];
  const trendLabel = trendLabelMap[lang] || `Trending in ${lang.toUpperCase()}`;

  const postsLabel = lang === 'tr' ? 'gönderi' : 'posts';

  return (
    <>

      {/* Üst Kısım: Arama + Gündem */}
      <div className="flex flex-col gap-4">
        {/* Arama / URL Yapıştırma Alanı */}
        <div className="group relative">
          <div className="absolute left-3 top-3 text-(--text-secondary) group-focus-within:text-(--accent)">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder={dict.rightSection.searchPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-(--input-background) rounded-full py-3 pl-12 pr-4 text-sm text-(--text-primary) focus:outline-none focus:bg-(--background) focus:ring-1 focus:ring-(--accent) border border-transparent focus:border-(--accent) placeholder:text-(--text-secondary)/70"
          />
        </div>

        {/* What's Happening / Gündem Kartı */}
        {popularKeywords && popularKeywords.length > 0 && (
          <div className="bg-(--background-secondary) rounded-2xl border border-(--border) overflow-hidden flex flex-col">
            <h2 className="font-extrabold text-xl px-4 py-3 text-(--text-primary) leading-6">
              {headerText}
            </h2>

            {popularKeywords.slice(0, 5).map((topic, i) => (
              <Link
                key={i}
                href={`/${topic.lang || lang}/${topic.slug}`}
                className="flex justify-between items-start px-4 py-3 hover:bg-(--hover-background)/50 transition-colors cursor-pointer relative"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-(--text-secondary) font-medium">
                    {trendLabel}
                  </span>
                  <span className="font-bold text-[15px] text-(--text-primary) leading-5">
                    {topic.text}
                  </span>
                  <span className="text-[13px] text-(--text-secondary)">
                    {topic.vol} {postsLabel}
                  </span>
                </div>
                <div className="text-(--text-secondary) p-2 hover:bg-[rgba(29,155,240,0.1)] rounded-full hover:text-(--accent) transition-colors -mr-2 -mt-2 group">
                  <MoreHorizontal size={18} />
                </div>
              </Link>
            ))}

            <div className="px-4 py-3 hover:bg-(--hover-background)/50 cursor-pointer transition-colors">
              <span className="text-(--accent) text-[15px] font-normal">
                {lang === 'tr' ? 'Daha fazla göster' : 'Show more'}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Footer - Her Zaman En Altta Görünür */}
      <footer className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-(--text-secondary) py-3 shrink-0 px-4">
        <span>{dict.common.footerText}</span>
        <Link href={`/${lang}/privacy`} className="hover:underline hover:text-(--text-primary)">
          {dict.common.privacyPolicy}
        </Link>
        <Link href={`/${lang}/terms`} className="hover:underline hover:text-(--text-primary)">
          {dict.common.termsOfService}
        </Link>
        <Link href={`/${lang}/contact`} className="hover:underline hover:text-(--text-primary)">
          {dict.common.contact}
        </Link>
        <Link href={`/${lang}/about`} className="hover:underline hover:text-(--text-primary)">
          {dict.common.about}
        </Link>
      </footer>
      {/* Modal Bileşeni - Sayfanın üzerine açılır */}
      <TweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={modalUrl}
      />
    </>
  );
}