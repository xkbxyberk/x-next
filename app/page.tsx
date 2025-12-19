'use client';

import { useState } from 'react';
import PostCard from './components/feed/PostCard';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check } from 'lucide-react';
import { useTheme } from './components/ThemeProvider';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [postContent, setPostContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  
  // Dinamik Logo: Tema default ise siyah, değilse beyaz
  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  // POST VERİLERİ: Hepsi marka logosunu kullanıyor
  const posts = [
    {
      id: '1',
      author: {
        name: 'X Downloader',
        handle: '@xdownloaderz',
        avatar: logoSrc, // Marka logosu
      },
      content: "Favori X videolarınızı kaybetmeyin. Linki yukarıya yapıştırın, saniyeler içinde cihazınıza indirin. \n\nReklamsız. Ücretsiz. Sınırsız. 🚀",
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60', 
      timestamp: 'Sabitlenmiş',
      metrics: { likes: 14500, reposts: 2300, replies: 142 },
    },
    {
      id: '2',
      author: {
        name: 'MP3 Converter',
        handle: '@music_saver',
        avatar: logoSrc, // BURASI GÜNCELLENDİ: Artık marka logosunu kullanıyor
      },
      content: 'Sadece sesi mi istiyorsunuz? Videoları otomatik olarak yüksek kaliteli MP3 dosyalarına dönüştürüyoruz. 🎵\n\nVideo linkini yapıştırın > Müzik ikonuna tıklayın > İndirin.',
      timestamp: '1s',
      metrics: { likes: 850, reposts: 120, replies: 45 },
    },
  ];

  return (
    <>
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border)">
        <div className="flex">
          <button
            onClick={() => setActiveTab('foryou')}
            className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer"
          >
            <span className={activeTab === 'foryou' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>
              İndirici
            </span>
            {activeTab === 'foryou' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-16" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer"
          >
            <span className={activeTab === 'following' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>
              Geçmiş
            </span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-12" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="p-4 border-b border-(--border)">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border border-(--border)">
              <Image 
                src={logoSrc} 
                alt="Profilim" 
                fill 
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="X.com veya Twitter video linkini yapıştır..."
                className="w-full bg-transparent text-xl outline-none placeholder-(--text-secondary) text-(--text-primary) resize-none min-h-12"
                rows={3}
              />
              
              {isFocused && (
                <button className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit transition-colors cursor-pointer">
                  <Globe size={16} />
                  <span>.mp4 / .mp3 Hazırlanıyor</span>
                </button>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer" title="Ayarlar">
                    <Settings2 size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer" title="MP3 Modu">
                    <Music size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                        {/* BURASI GERİ GELDİ: Gelecekteki dil seçeneği için Dünya ikonu */}
                        <button 
                            className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer" 
                            aria-label="Dil Seçimi"
                        >
                            <Globe size={20} />
                        </button>
                        
                        <div className="relative">
                          <button
                              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                              className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer"
                              aria-label="Tema Değiştir"
                          >
                              <Moon size={20} />
                          </button>

                          {isThemeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50">
                              <button 
                                onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-blue-500 rounded-full text-white">
                                  <Sun size={16} />
                                </div>
                                <span className="font-bold text-sm">Varsayılan</span>
                                {theme === 'default' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600">
                                  <CloudMoon size={16} />
                                </div>
                                <span className="font-bold text-sm">Loş</span>
                                {theme === 'dim' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-black rounded-full text-white border border-gray-800">
                                  <Moon size={16} />
                                </div>
                                <span className="font-bold text-sm">Işıklar Kapalı</span>
                                {theme === 'lights-out' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-(--border) mx-1"></div>

                    <button
                    disabled={!postContent.trim()}
                    className="bg-(--accent) text-white font-bold px-4 py-2 rounded-full hover:bg-(--accent-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                    İndir
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {posts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}