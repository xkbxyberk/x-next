'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import Toast from '../ui/Toast';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check, Loader2, Video, FileAudio, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';
import { useVideoDownload, SelectionType } from '@/lib/hooks/use-video-download';

// --- TİP TANIMLAMALARI ---
// Gönderi ve Reklamları ayırt etmek için tipleri ayırıyoruz
type PostData = {
  id: string;
  author: { name: string; handle: string; avatar: string };
  content: string;
  image?: string;
  timestamp: string;
  metrics: { likes: number; reposts: number; replies: number };
};

type FeedItem = 
  | { type: 'post'; data: PostData }
  | { type: 'ad'; id: string };

// --- REKLAM BİLEŞENİ (Yatay Tasarım) ---
const AdBanner = () => (
  <div className="border-b border-(--border) p-4 bg-(--background-secondary)/30">
     <div className="w-full h-32 bg-(--background-secondary) rounded-xl border border-(--border) flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-(--border)/50 transition-colors">
        <span className="text-(--text-secondary) text-[10px] font-bold tracking-widest opacity-40 absolute top-2 right-2">SPONSORLU</span>
        <div className="flex flex-col items-center gap-2 opacity-50">
           <span className="text-(--text-secondary) text-sm font-bold tracking-widest">REKLAM ALANI</span>
           <span className="text-(--text-secondary) text-[10px]">(Google Adsense / Özel Reklam)</span>
        </div>
     </div>
  </div>
);

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

  // --- SABİT İÇERİK LİSTESİ (REKLAMLAR DAHİL) ---
  const staticItems: FeedItem[] = [
    // 1. BÖLÜM: GİRİŞ VE YASAL
    {
      type: 'post',
      data: {
        id: 'welcome-1',
        author: { name: 'X Downloader', handle: '@asistan', avatar: logoSrc },
        content: "X-Next'e hoş geldiniz! 🎉\n\nTwitter (yeni adıyla X) üzerindeki videoları, GIF'leri ve ses dosyalarını en yüksek kalitede, tamamen ücretsiz ve şifresiz olarak indirebilirsiniz. Başlamak için yukarıdaki kutuya bir link yapıştırmanız yeterli.",
        timestamp: 'Sabitlenmiş',
        metrics: { likes: 12500, reposts: 3400, replies: 156 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'legal-warning',
        author: { name: 'X Downloader', handle: '@legal_notice', avatar: logoSrc },
        content: "⚠️ Yasal Bilgilendirme\n\nTwitter Video İndirici sitemiz, telif hakkı ile korunan hiçbir materyali kendi sunucularında barındırmaz ve izinsiz dosya paylaşımını desteklemez. İndirilen tüm videolar, doğrudan X (Twitter) CDN sunucularından anlık olarak çekilmektedir.",
        timestamp: 'Sabitlenmiş',
        metrics: { likes: 999, reposts: 0, replies: 0 },
      }
    },

    // --- REKLAM ALANI 1 ---
    { type: 'ad', id: 'ad-1' },

    // 2. BÖLÜM: NASIL ÇALIŞIR / BİLGİ
    {
      type: 'post',
      data: {
        id: 'seo-info-2',
        author: { name: 'X Downloader', handle: '@info', avatar: logoSrc },
        content: "🚀 Profesyonel X (Twitter) Video İndirici\n\nSitemiz, herhangi bir uygulama yüklemenize gerek kalmadan, mobil (Android & iOS) veya bilgisayar (PC & Mac) üzerinden Twitter videolarını cihazınıza kaydetmenizi sağlar. \n\n✅ 1080p Full HD Desteği\n✅ Ücretsiz ve Sınırsız\n✅ Güvenli ve Reklamsız Deneyim",
        timestamp: '1s',
        metrics: { likes: 8500, reposts: 2100, replies: 95 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'guide-platform-3',
        author: { name: 'X Downloader', handle: '@guide', avatar: logoSrc },
        content: "📱 Tüm Cihazlarla Tam Uyumlu\n\nTwitter videolarını Android, iPhone, iPad, Windows, macOS veya Linux fark etmeksizin indirebilirsiniz. X Downloader, modern tarayıcıların (Chrome, Safari, Firefox) çalıştığı her cihazda sorunsuz çalışır.",
        timestamp: '2s',
        metrics: { likes: 4200, reposts: 850, replies: 42 },
      }
    },

    // --- REKLAM ALANI 2 ---
    { type: 'ad', id: 'ad-2' },

    // 3. BÖLÜM: NASIL KULLANILIR (ADIMLAR)
    {
      type: 'post',
      data: {
        id: 'guide-step1-4',
        author: { name: 'X Downloader', handle: '@step1', avatar: logoSrc },
        content: "1️⃣ Adım: Bağlantıyı Kopyalayın\n\nİndirmek veya MP4'e dönüştürmek istediğiniz X.com gönderisini açın. 'Paylaş' butonuna tıklayın ve açılan menüden 'Bağlantıyı Kopyala' seçeneğini seçin.",
        timestamp: '3s',
        metrics: { likes: 3100, reposts: 620, replies: 28 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'guide-step2-5',
        author: { name: 'X Downloader', handle: '@step2', avatar: logoSrc },
        content: "2️⃣ Adım: Linki Yapıştırın\n\nX Downloader sayfasını açın ve sayfanın en üstünde yer alan kutucuğa kopyaladığınız linki yapıştırın. Sistemimiz linki otomatik olarak algılayacak veya 'İndir' butonuna basarak analizi başlatabilirsiniz.",
        timestamp: '4s',
        metrics: { likes: 2900, reposts: 580, replies: 25 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'guide-step3-6',
        author: { name: 'X Downloader', handle: '@step3', avatar: logoSrc },
        content: "3️⃣ Adım: Videoyu Kaydedin\n\nAnaliz tamamlandığında karşınıza kalite seçenekleri (720p, 1080p vb.) ve 'Sadece Ses (MP3)' seçeneği çıkacaktır. İhtiyacınız olan formatı seçin ve indirme işlemini başlatın. İşte bu kadar basit! ⬇️",
        timestamp: '5s',
        metrics: { likes: 5400, reposts: 1200, replies: 110 },
      }
    },

    // --- REKLAM ALANI 3 ---
    { type: 'ad', id: 'ad-3' },

    // 4. BÖLÜM: S.S.S.
    {
      type: 'post',
      data: {
        id: 'faq-private-7',
        author: { name: 'X Downloader', handle: '@security', avatar: logoSrc },
        content: "🔒 Soru: Gizli (Korumalı) hesaplardan video indirebilir miyim?\n\nCevap: Hayır. Kullanıcı gizliliğine ve yasalarımıza saygı duyuyoruz. X Downloader sadece 'Herkese Açık' (Public) profillerden paylaşılan videoları ve GIF'leri indirmenize olanak tanır.",
        timestamp: '1d',
        metrics: { likes: 1200, reposts: 300, replies: 45 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'faq-iphone-8',
        author: { name: 'X Downloader', handle: '@ios_support', avatar: logoSrc },
        content: "🍎 Soru: iPhone'da Twitter videoları nasıl indirilir?\n\niOS 13 ve üzeri sürümlerde Safari tarayıcısı yerleşik indirme yöneticisine sahiptir. Sitemizi Safari'den açın, linki yapıştırın ve indirin. Video, 'Dosyalar' uygulamasına kaydedilecektir. Daha sonra 'Fotoğraflar'a taşıyabilirsiniz.",
        timestamp: '1d',
        metrics: { likes: 1800, reposts: 450, replies: 60 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'faq-limits-9',
        author: { name: 'X Downloader', handle: '@faq_limits', avatar: logoSrc },
        content: "⚡ Soru: Günlük indirme sınırı var mı?\n\nCevap: Kesinlikle hayır! X Downloader tamamen sınırsızdır. İstediğiniz kadar Twitter videosunu veya sesi cihazınıza indirebilirsiniz. Sadece sunucu sağlığı için ardışık indirmeler arasında çok kısa bekleme süreleri olabilir.",
        timestamp: '2d',
        metrics: { likes: 2500, reposts: 500, replies: 30 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'faq-android-10',
        author: { name: 'X Downloader', handle: '@android_support', avatar: logoSrc },
        content: "🤖 Soru: Android cihazımda program kullanmadan video indirebilir miyim?\n\nCevap: Evet! Android telefonunuzda Chrome veya herhangi bir tarayıcıyı açın, X Downloader'a girin ve yukarıdaki 3 adımı uygulayın. Video otomatik olarak 'Galeri'nize veya 'İndirilenler' klasörüne MP4 formatında kaydedilir.",
        timestamp: '2d',
        metrics: { likes: 2100, reposts: 410, replies: 35 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'faq-convert-11',
        author: { name: 'X Downloader', handle: '@converter', avatar: logoSrc },
        content: "🎵 Soru: Twitter videolarını MP3 veya MP4'e çevirebilir miyim?\n\nCevap: Aracımız, Twitter'daki içerikleri standart MP4 video formatında sunar. Ayrıca videodaki görüntüyü istemiyorsanız, 'Sadece Ses' seçeneği ile otomatik olarak MP3 formatına dönüştürüp indirebilirsiniz.",
        timestamp: '3d',
        metrics: { likes: 3200, reposts: 890, replies: 120 },
      }
    },
    {
      type: 'post',
      data: {
        id: 'faq-account-12',
        author: { name: 'X Downloader', handle: '@account_free', avatar: logoSrc },
        content: "👤 Soru: Kullanmak için üye olmam veya giriş yapmam gerekiyor mu?\n\nCevap: Hayır! X Downloader tamamen anonimdir. Twitter şifrenizi girmenize, üye olmanıza veya herhangi bir kişisel bilgi paylaşmanıza gerek yoktur. Sadece linki yapıştırın ve indirin.",
        timestamp: '3d',
        metrics: { likes: 4500, reposts: 1100, replies: 200 },
      }
    }
  ];

  const [displayItems, setDisplayItems] = useState<FeedItem[]>(staticItems);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    setInputUrl(pastedText);
    if (pastedText.includes('x.com') || pastedText.includes('twitter.com')) {
        const success = await handleAnalyze(pastedText);
        if (success) setIsSettingsMenuOpen(true);
    }
  };

  const handleManualAnalyze = async () => {
     const success = await handleAnalyze();
     if(success) setIsSettingsMenuOpen(true);
  };

  const handlePasteAndAnalyze = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
       if (inputRef.current) inputRef.current.focus();
       return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        inputRef.current?.focus();
        return;
      }
      setInputUrl(text);
      if (text.includes('x.com') || text.includes('twitter.com')) {
          const success = await handleAnalyze(text);
          if (success) setIsSettingsMenuOpen(true);
      } else {
          inputRef.current?.focus();
      }
    } catch (err) {
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleClearInput = () => {
    setInputUrl('');
    reset();
    setIsSettingsMenuOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectFormat = (sel: SelectionType) => {
    setSelection(sel);
  };

  useEffect(() => {
    if (!inputUrl.trim()) {
        reset();
        setDisplayItems(staticItems);
        setIsSettingsMenuOpen(false);
    }
  }, [inputUrl]);

  // Data gelince yeni postu listeye ekle
  useEffect(() => {
    if (data) {
      const newPost: FeedItem = {
        type: 'post',
        data: {
            id: data.id,
            author: { name: data.user.name, handle: `@${data.user.screen_name}`, avatar: data.user.avatar_url },
            content: data.text,
            image: data.media.thumbnail_url,
            timestamp: 'Şimdi',
            metrics: { likes: 0, reposts: 0, replies: 0 },
        }
      };
      // Yeni post en üste, reklamlar ve diğerleri alta
      setDisplayItems([newPost, ...staticItems]);
    }
  }, [data]);

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

  const getTextAreaColorClass = () => {
    if (error) return 'text-red-500 placeholder-red-500/50';
    if (data) return 'text-(--accent) font-medium';
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
            <span className={activeTab === 'foryou' && 'font-bold text-(--text-primary)' || 'text-(--text-secondary)'}>İndirici</span>
            {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-16" />}
          </button>
          <button onClick={() => setActiveTab('following')} className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer">
            <span className={activeTab === 'following' && 'font-bold text-(--text-primary)' || 'text-(--text-secondary)'}>Geçmiş</span>
            {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-12" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div id="download-area" className="p-4 border-b border-(--border) scroll-mt-24">
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
                  className={`w-full bg-transparent text-xl outline-none resize-none min-h-12 transition-colors duration-300 ${getTextAreaColorClass()}`}
                  rows={2}
                  disabled={loading || downloading}
                />
              </div>
              
              {!loading && (
                 inputUrl ? (
                    <button 
                      onClick={handleClearInput}
                      className="flex items-center gap-2 text-(--text-secondary) hover:text-red-500 font-semibold text-sm hover:bg-red-500/10 rounded-full px-3 py-1 w-fit transition-all cursor-pointer"
                    >
                      <X size={16} />
                      <span>Temizle</span>
                    </button>
                 ) : (
                    isFocused && (
                      <button 
                        onClick={handlePasteAndAnalyze}
                        className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit transition-colors cursor-pointer"
                      >
                        <Globe size={16} />
                        <span>Linki yapıştırın ve indirin</span>
                      </button>
                    )
                 )
              )}

               {loading && (
                <div className="flex items-center gap-2 text-(--text-secondary) font-semibold text-sm px-3 py-1">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Video analiz ediliyor...</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                <div className="flex items-center gap-2">
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
                  
                  <div className={`p-2 rounded-full transition-all duration-300 ${selection?.type === 'audio' ? 'bg-pink-500/10 text-pink-500 ring-2 ring-pink-500/20 opacity-100' : 'text-pink-500/50 opacity-50'}`}>
                    <Music size={20} />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                        <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                            <Globe size={20} />
                        </button>
                        
                        <div className="relative" ref={themeRef}>
                          <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className={`p-2 rounded-full transition-colors cursor-pointer ${isThemeMenuOpen ? 'bg-(--accent)/20 text-(--accent)' : 'hover:bg-(--accent)/10 text-(--accent)'}`}>
                              <Moon size={20} />
                          </button>
                          {isThemeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                              <button onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-blue-500 rounded-full text-white shadow-sm group-hover:scale-110"><Sun size={16} /></div>
                                <span className="font-bold text-sm">Varsayılan</span>
                                {theme === 'default' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                              <button onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600 shadow-sm group-hover:scale-110"><CloudMoon size={16} /></div>
                                <span className="font-bold text-sm">Loş</span>
                                {theme === 'dim' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                              <button onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group">
                                <div className="p-2 bg-black rounded-full text-white border border-gray-800 shadow-sm group-hover:scale-110"><Moon size={16} /></div>
                                <span className="font-bold text-sm">Işıklar Kapalı</span>
                                {theme === 'lights-out' && <Check className="ml-auto text-blue-500" size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                    <div className="h-8 w-px bg-(--border) mx-1"></div>
                    <button onClick={executeDownload} disabled={!selection || downloading || loading} className={`font-bold px-6 py-2 rounded-full transition-all duration-200 shadow-md flex items-center gap-2 ${(!selection || downloading || loading) ? 'bg-(--background-secondary) text-(--text-secondary) cursor-not-allowed opacity-70' : 'bg-(--accent) text-white hover:bg-(--accent-hover) cursor-pointer hover:scale-105 active:scale-95'}`}>
                      {downloading ? (
                         <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{selection?.type === 'audio' && progress > 0 ? `%${progress}` : 'İniyor...'}</span>
                         </>
                      ) : (
                         <>
                            <span>İndir</span>
                            {selection && (selection.type === 'audio' ? <FileAudio size={18} /> : <Video size={18} />)}
                         </>
                      )}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DİNAMİK RENDER (GÖNDERİ VEYA REKLAM) --- */}
        {displayItems.map((item, index) => {
            if (item.type === 'post') {
                return <PostCard key={item.data.id} data={item.data} />;
            } else {
                return <AdBanner key={item.id} />;
            }
        })}
      </div>
    </>
  );
}