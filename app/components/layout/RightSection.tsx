'use client';

import { Search } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import TweetModal from '../ui/TweetModal';

export default function RightSection() {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  // Enter tuşuna basıldığında çalışır
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim().length > 0) {
      setModalUrl(inputValue.trim());
      setIsModalOpen(true);
      // İsteğe bağlı: Inputu temizle
      // setInputValue(''); 
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Arama / URL Yapıştırma Alanı */}
        <div className="group relative">
          <div className="absolute left-3 top-3 text-(--text-secondary) group-focus-within:text-(--accent)">
             <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Ara" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-(--input-background) rounded-full py-3 pl-12 pr-4 text-sm text-(--text-primary) focus:outline-none focus:bg-(--background) focus:ring-1 focus:ring-(--accent) border border-transparent focus:border-(--accent) transition-all placeholder:text-(--text-secondary)/70"
          />
        </div>

        <section className="flex flex-col gap-4">
          {/* Reklam Alanı 1 */}
          <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center group relative">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 1</span>
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Reklam Alanı 2 */}
          <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 2</span>
          </div>

          {/* Reklam Alanı 3 */}
          <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 3</span>
          </div>
        </section>
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