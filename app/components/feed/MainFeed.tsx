'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check, Loader2, Download, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';
import { useVideoDownload } from '@/lib/hooks/use-video-download';

export default function MainFeed() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [isFocused, setIsFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  
  // Menüleri dışarı tıklayınca kapatmak için ref
  const settingsRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  
  // BACKEND HOOK BAĞLANTISI
  const { 
    inputUrl, setInputUrl, data, loading, error, progress, 
    handleAnalyze, handleMusicDownload 
  } = useVideoDownload();

  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  // SABİT POSTLAR
  const staticPosts = [
    {
      id: 'pinned-1',
      author: { name: 'X Downloader', handle: '@xdownloaderz', avatar: logoSrc },
      content: "Favori X videolarınızı kaybetmeyin. Linki yukarıya yapıştırın, saniyeler içinde cihazınıza indirin. \n\nReklamsız. Ücretsiz. Sınırsız. 🚀",
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60', 
      timestamp: 'Sabitlenmiş',
      metrics: { likes: 14500, reposts: 2300, replies: 142 },
    },
    {
      id: 'pinned-2',
      author: { name: 'MP3 Converter', handle: '@music_saver', avatar: logoSrc },
      content: 'Sadece sesi mi istiyorsunuz? Videoları otomatik olarak yüksek kaliteli MP3 dosyalarına dönüştürüyoruz. 🎵\n\nVideo linkini yapıştırın > Müzik ikonuna tıklayın > İndirin.',
      timestamp: '1s',
      metrics: { likes: 850, reposts: 120, replies: 45 },
    },
  ];

  const [displayPosts, setDisplayPosts] = useState(staticPosts);

  // Analiz bitince otomatik olarak Settings menüsünü aç ki kullanıcı kaliteleri görsün
  useEffect(() => {
    if (data) {
      setIsSettingsMenuOpen(true);
      // İsteğe bağlı: Yeni veriyi post olarak da ekleyebiliriz
      const newPost = {
        id: data.id,
        author: { name: data.user.name, handle: `@${data.user.screen_name}`, avatar: data.user.avatar_url },
        content: data.text,
        image: data.media.thumbnail_url,
        timestamp: 'Şimdi',
        metrics: { likes: 0, reposts: 0, replies: 0 },
      };
      setDisplayPosts([newPost, ...staticPosts]);
    }
  }, [data]);

  // Dışarı tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border)">
        <div className="flex">
          <button onClick={() => setActiveTab('foryou')} className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer">
            <span className={activeTab === 'foryou' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>İndirici</span>
            {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-16" />}
          </button>
          <button onClick={() => setActiveTab('following')} className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer">
            <span className={activeTab === 'following' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>Geçmiş</span>
            {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-12" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="p-4 border-b border-(--border)">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border border-(--border)">
              <Image src={logoSrc} alt="Profilim" fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              
              <div className="relative">
                <textarea
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyze();
                    }
                  }}
                  placeholder="X.com veya Twitter video linkini yapıştır..."
                  className="w-full bg-transparent text-xl outline-none placeholder-(--text-secondary) text-(--text-primary) resize-none min-h-12"
                  rows={2}
                  disabled={loading}
                />
                
                {error && <div className="text-red-500 text-sm font-medium mt-1 animate-pulse">⚠️ {error}</div>}
              </div>
              
              {isFocused && !loading && !data && (
                <button className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit transition-colors cursor-pointer">
                  <Globe size={16} />
                  <span>Linki yapıştırın ve indirin</span>
                </button>
              )}

               {loading && (
                <div className="flex items-center gap-2 text-(--text-secondary) font-semibold text-sm px-3 py-1">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Video analiz ediliyor...</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                <div className="flex items-center gap-2">
                  
                  {/* --- AYARLAR / VİDEO KALİTESİ MENÜSÜ --- */}
                  <div className="relative" ref={settingsRef}>
                    <button 
                        onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${isSettingsMenuOpen ? 'bg-(--accent)/20 text-(--accent)' : 'hover:bg-(--accent)/10 text-(--accent)'}`} 
                        title="Video Seçenekleri"
                    >
                        <Settings2 size={20} />
                    </button>

                    {isSettingsMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-(--background) border border-(--border) rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Menü Başlığı */}
                            <div className="px-4 py-3 border-b border-(--border) bg-(--background-secondary)/50">
                                <h3 className="font-bold text-sm text-(--text-primary)">Video Kalitesi</h3>
                            </div>

                            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {!data ? (
                                    <div className="text-center py-6 text-(--text-secondary) text-sm px-4">
                                        <p>Henüz bir video analiz edilmedi.</p>
                                        <p className="text-xs mt-1 opacity-70">Lütfen önce linki yapıştırıp "İndir" butonuna basın.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {data.media.variants.map((variant, idx) => (
                                            <a
                                                key={idx}
                                                href={variant.url}
                                                download={`x-video-${data.id}.mp4`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-(--background-secondary) transition-colors group text-(--text-primary) cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                                                        MP4
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm">
                                                            {variant.bitrate ? `${Math.round(variant.bitrate / 1000)} kbps` : 'Standart'}
                                                        </span>
                                                        <span className="text-xs text-(--text-secondary)">
                                                            {idx === 0 ? 'En Yüksek Kalite' : 'Veri Tasarrufu'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Download size={16} className="text-(--text-secondary) group-hover:text-(--accent)" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                  
                  {/* --- MÜZİK (MP3) BUTONU --- */}
                  <button 
                    onClick={handleMusicDownload}
                    disabled={!data && !inputUrl}
                    className="p-2 rounded-full hover:bg-pink-500/10 text-pink-500 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50" 
                    title="MP3 Olarak İndir"
                  >
                    {progress > 0 ? (
                      <span className="text-xs font-bold animate-pulse">{progress}%</span>
                    ) : (
                      <Music size={20} />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                        <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                            <Globe size={20} />
                        </button>
                        
                        {/* --- TEMA MENÜSÜ (Senin İstediğin Tasarım) --- */}
                        <div className="relative" ref={themeRef}>
                          <button
                              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                              className={`p-2 rounded-full transition-colors cursor-pointer ${isThemeMenuOpen ? 'bg-(--accent)/20 text-(--accent)' : 'hover:bg-(--accent)/10 text-(--accent)'}`}
                          >
                              <Moon size={20} />
                          </button>

                          {isThemeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                              <div className="px-2 py-1 mb-2">
                                <h3 className="font-bold text-sm text-(--text-primary)">Görünüm</h3>
                              </div>
                              
                              <button 
                                onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group"
                              >
                                <div className="p-2 bg-blue-500 rounded-full text-white shadow-sm group-hover:scale-110 transition-transform">
                                  <Sun size={16} />
                                </div>
                                <span className="font-bold text-sm">Varsayılan (Aydınlık)</span>
                                {theme === 'default' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group"
                              >
                                <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600 shadow-sm group-hover:scale-110 transition-transform">
                                  <CloudMoon size={16} />
                                </div>
                                <span className="font-bold text-sm">Loş (Dim)</span>
                                {theme === 'dim' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group"
                              >
                                <div className="p-2 bg-black rounded-full text-white border border-gray-800 shadow-sm group-hover:scale-110 transition-transform">
                                  <Moon size={16} />
                                </div>
                                <span className="font-bold text-sm">Işıklar Kapalı (Koyu)</span>
                                {theme === 'lights-out' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-(--border) mx-1"></div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!inputUrl.trim() || loading}
                      className="bg-(--accent) text-white font-bold px-6 py-2 rounded-full hover:bg-(--accent-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    >
                      {loading ? '...' : 'İndir'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {displayPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}