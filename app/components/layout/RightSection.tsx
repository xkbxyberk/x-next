'use client';

import { Search } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import TweetModal from '../ui/TweetModal';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface RightSectionProps {
  dict: any;
}

export default function RightSection({ dict }: RightSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const params = useParams();
  const lang = (params?.lang as string) || 'tr';

  // Enter tuşuna basıldığında çalışır
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim().length > 0) {
      setModalUrl(inputValue.trim());
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between py-2">
        {/* Üst Kısım: Arama + Reklamlar */}
        <div className="flex flex-col gap-3">
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
              className="w-full bg-(--input-background) rounded-full py-3 pl-12 pr-4 text-sm text-(--text-primary) focus:outline-none focus:bg-(--background) focus:ring-1 focus:ring-(--accent) border border-transparent focus:border-(--accent) transition-all placeholder:text-(--text-secondary)/70"
            />
          </div>

          {/* Reklam Alanları */}
          <div className="flex flex-col gap-3">
            {/* Reklam Alanı 1 */}
            <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) h-59.5 flex items-center justify-center group relative">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest">{dict.rightSection.adLabel1}</span>
            </div>

            {/* Reklam Alanı 2 */}
            <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) h-59.5 flex items-center justify-center">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest">{dict.rightSection.adLabel2}</span>
            </div>

            {/* Reklam Alanı 3 */}
            <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) h-59.5 flex items-center justify-center">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest">{dict.rightSection.adLabel3}</span>
            </div>
          </div>
        </div>

        {/* Footer - Her Zaman En Altta Görünür */}
        <footer className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-(--text-secondary) py-3 shrink-0">
          <span>{dict.common.footerText}</span>
          <Link href={`/${lang}/privacy`} className="hover:underline hover:text-(--text-primary) transition-colors">
            {dict.common.privacyPolicy}
          </Link>
          <Link href={`/${lang}/terms`} className="hover:underline hover:text-(--text-primary) transition-colors">
            {dict.common.termsOfService}
          </Link>
          <Link href={`/${lang}/contact`} className="hover:underline hover:text-(--text-primary) transition-colors">
            {dict.common.contact}
          </Link>
          <Link href={`/${lang}/about`} className="hover:underline hover:text-(--text-primary) transition-colors">
            {dict.common.about}
          </Link>
        </footer>
      </div>

      {/* Modal Bileşeni - Sayfanın üzerine açılır */}
      <TweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={modalUrl}
      />
    </>
  );
}