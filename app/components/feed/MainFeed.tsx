'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import Toast from '../ui/Toast';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check, Loader2, Download, Video, FileAudio } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';
import { useVideoDownload, SelectionType } from '@/lib/hooks/use-video-download';

export default function MainFeed() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [isFocused, setIsFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { theme, setTheme } = useTheme();
  
  const { 
    inputUrl, setInputUrl, data, error, loading, downloading, progress, 
    selection, setSelection, notification, closeNotification, 
    handleAnalyze, executeDownload, reset 
  } = useVideoDownload();

  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  // --- SABİT POSTLAR ---
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

  // --- 1. İYİLEŞTİRME: PASTE SORUNU ÇÖZÜMÜ ---
  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    // URL'yi hemen inputa yaz ki kaybolmasın
    setInputUrl(pastedText);

    if (pastedText.includes('x.com') || pastedText.includes('twitter.com')) {
        // Analizi başlat
        const success = await handleAnalyze(pastedText);
        if (success) {
            setIsSettingsMenuOpen(true);
        }
    }
  };

  const handleManualAnalyze = async () => {
     const success = await handleAnalyze();
     if(success) setIsSettingsMenuOpen(true);
  };

  const handleSelectFormat = (sel: SelectionType) => {
    setSelection(sel);
  };

  // --- 3. İYİLEŞTİRME: URL SİLİNİNCE HER ŞEYİ UNUTMA ---
  useEffect(() => {
    if (!inputUrl.trim()) {
        reset(); // Hook tarafındaki datayı sıfırla
        setDisplayPosts(staticPosts); // Postları eski haline döndür
        setIsSettingsMenuOpen(false); // Menüyü kapat
    }
  }, [inputUrl]);

  // Data gelince post listesine ekle
  useEffect(() => {
    if (data) {
      const newPost = {
        id: data.id,
        author: { name: data.user.name, handle: `@${data.user.screen_name}`, avatar: data.user.avatar_url },
        content: data.text,
        image: data.media.thumbnail_url,
        timestamp: 'Şimdi',
        metrics: { likes: 0, reposts: 0, replies: 0 },
      };
      // Sadece static postların üstüne ekle (önceki analizleri temizle)
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

  // --- 2. İYİLEŞTİRME: RENK MANTIĞI ---
  // Data varsa (başarılı) -> Yeşil/Mavi, Hata varsa -> Kırmızı, Yoksa -> Varsayılan
  const getTextAreaColorClass = () => {
    if (error) return 'text-red-500 placeholder-red-500/50';
    if (data) return 'text-(--accent) font-medium'; // Başarılıysa yeşil
    return 'text-(--text-primary) placeholder-(--text-secondary)';
  };

  return (
    <>
      {notification && (
        <Toast 
            message={notification.msg} 
            type={notification.type} 
            isVisible={!!notification} 
            onClose={closeNotification} 
        />
      )}

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
                  ref={inputRef}
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onPaste={handlePaste}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleManualAnalyze();
                    }
                  }}
                  placeholder="X.com veya Twitter video linkini yapıştır..."
                  // RENK SINIFINI BURAYA EKLİYORUZ
                  className={`w-full bg-transparent text-xl outline-none resize-none min-h-12 transition-colors duration-300 ${getTextAreaColorClass()}`}
                  rows={2}
                  disabled={loading || downloading}
                />
              </div>
              
              {/* ODAKLANINCA ÇIKAN BUTON */}
              {isFocused && !loading && !data && !error && (
                <button 
                  onClick={handleManualAnalyze}
                  className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit transition-colors cursor-pointer"
                >
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
                  
                  {/* --- SETTINGS / DROPDOWN --- */}
                  <div className="relative" ref={settingsRef}>
                    <button 
                        onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                        disabled={!data}
                        className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2
                            ${!data ? 'text-(--text-secondary) opacity-50 cursor-not-allowed' : ''}
                            ${selection?.type === 'video' ? 'bg-blue-500/10 text-blue-500 ring-2 ring-blue-500/20' : 'text-(--accent) hover:bg-(--accent)/10'}
                        `}
                        title="Video Seçenekleri"
                    >
                        <Settings2 size={20} />
                        {selection?.type === 'video' && (
                            <span className="text-xs font-bold hidden sm:block">{selection.qualityLabel}</span>
                        )}
                    </button>

                    {isSettingsMenuOpen && data && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-(--background) border border-(--border) rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-(--border) bg-(--background-secondary)/50">
                                <h3 className="font-bold text-sm text-(--text-primary)">Format Seçin</h3>
                            </div>

                            <div className="p-2 flex flex-col gap-1 max-h-80 overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => handleSelectFormat({
                                        type: 'audio',
                                        url: data.media.variants[0].url
                                    })}
                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors group cursor-pointer w-full text-left
                                        ${selection?.type === 'audio' ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-(--background-secondary)'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-colors
                                            ${selection?.type === 'audio' ? 'bg-pink-500 text-white' : 'bg-pink-500/10 text-pink-500'}
                                        `}>
                                            MP3
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-sm ${selection?.type === 'audio' ? 'text-pink-500' : 'text-(--text-primary)'}`}>
                                                Sadece Ses
                                            </span>
                                            <span className="text-xs text-(--text-secondary)">Otomatik Dönüştürme</span>
                                        </div>
                                    </div>
                                    {selection?.type === 'audio' && <Check size={16} className="text-pink-500" />}
                                </button>

                                <div className="h-px bg-(--border) my-1 mx-2"></div>

                                {data.media.variants.map((variant, idx) => {
                                    const qualityLabel = variant.bitrate ? `${Math.round(variant.bitrate / 1000)}kbps` : 'Standart';
                                    const isSelected = selection?.type === 'video' && selection.url === variant.url;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectFormat({
                                                type: 'video',
                                                url: variant.url,
                                                qualityLabel: qualityLabel
                                            })}
                                            className={`flex items-center justify-between p-3 rounded-lg transition-colors group cursor-pointer w-full text-left
                                                ${isSelected ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-(--background-secondary)'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-colors
                                                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'}
                                                `}>
                                                    MP4
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-semibold text-sm ${isSelected ? 'text-blue-500' : 'text-(--text-primary)'}`}>
                                                        {qualityLabel}
                                                    </span>
                                                    <span className="text-xs text-(--text-secondary)">
                                                        {idx === 0 ? 'En Yüksek Kalite' : 'Veri Tasarrufu'}
                                                    </span>
                                                </div>
                                            </div>
                                            {isSelected && <Check size={16} className="text-blue-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                  </div>
                  
                  {/* --- MÜZİK İKONU --- */}
                  <div 
                    className={`p-2 rounded-full transition-all duration-300
                        ${selection?.type === 'audio' 
                            ? 'bg-pink-500/10 text-pink-500 ring-2 ring-pink-500/20 opacity-100' 
                            : 'text-pink-500/50 opacity-50'}
                    `}
                  >
                    <Music size={20} />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                        {/* --- GLOBE İKONU --- */}
                        <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                            <Globe size={20} />
                        </button>
                        
                        {/* --- TEMA MENÜSÜ --- */}
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
                              <button onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-blue-500 rounded-full text-white shadow-sm group-hover:scale-110 transition-transform"><Sun size={16} /></div>
                                <span className="font-bold text-sm">Varsayılan</span>
                                {theme === 'default' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                              <button onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600 shadow-sm group-hover:scale-110 transition-transform"><CloudMoon size={16} /></div>
                                <span className="font-bold text-sm">Loş</span>
                                {theme === 'dim' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                              <button onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-black rounded-full text-white border border-gray-800 shadow-sm group-hover:scale-110 transition-transform"><Moon size={16} /></div>
                                <span className="font-bold text-sm">Işıklar Kapalı</span>
                                {theme === 'lights-out' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-(--border) mx-1"></div>

                    {/* --- İNDİR BUTONU --- */}
                    <button
                      onClick={executeDownload}
                      disabled={!selection || downloading || loading}
                      className={`
                        font-bold px-6 py-2 rounded-full transition-all duration-200 shadow-md flex items-center gap-2
                        ${(!selection || downloading || loading) 
                            ? 'bg-(--background-secondary) text-(--text-secondary) cursor-not-allowed opacity-70' 
                            : 'bg-(--accent) text-white hover:bg-(--accent-hover) cursor-pointer hover:scale-105 active:scale-95'
                        }
                      `}
                    >
                      {downloading ? (
                         <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>
                                {selection?.type === 'audio' && progress > 0 
                                    ? `%${progress}` 
                                    : 'İniyor...'}
                            </span>
                         </>
                      ) : (
                         <>
                            <span>İndir</span>
                            {selection && (
                                selection.type === 'audio' ? <FileAudio size={18} /> : <Video size={18} />
                            )}
                         </>
                      )}
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