'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import Toast from '../ui/Toast';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check, Loader2, Video, FileAudio, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';
import { useVideoDownload, SelectionType } from '@/lib/hooks/use-video-download';

// --- TİP TANIMLAMALARI ---
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

// --- REKLAM BİLEŞENİ ---
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

  // --- SABİT İÇERİK LİSTESİ ---
  const staticItems: FeedItem[] = [
    // 1. HOŞ GELDİN MESAJI
    {
      type: 'post',
      data: {
        id: 'welcome-1',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "🎉 XDownloaderz'e Hoş Geldiniz!\n\nX (Twitter) videolarını ve GIF'lerini tek tıkla, tamamen ücretsiz olarak en yüksek kalitede indirin. MP4 veya MP3 formatında kaydedin, hiçbir uygulama yüklemeden doğrudan tarayıcınızdan kullanın.\n\n✨ Hızlı, güvenli ve sınırsız!",
        timestamp: 'Sabitlenmiş',
        metrics: { likes: 15200, reposts: 4100, replies: 187 },
      }
    },

    // 2. YASAL BİLGİLENDİRME
    {
      type: 'post',
      data: {
        id: 'legal-warning',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "⚖️ Yasal Uyarı ve Kullanım Şartları\n\nXDownloaderz.com, telif hakkıyla korunan içerikleri kendi sunucularında barındırmaz. Tüm videolar doğrudan X (Twitter) CDN'inden anlık olarak indirilir. İndirilen içeriklerin kullanımı tamamen kullanıcının sorumluluğundadır.\n\n⚠️ İçerikleri sadece izin verilen amaçlar için kullanınız.",
        timestamp: 'Sabitlenmiş',
        metrics: { likes: 2400, reposts: 310, replies: 42 },
      }
    },

    // --- REKLAM ALANI 1 ---
    { type: 'ad', id: 'ad-1' },

    // 3. ÖZELLİKLER TANITIMI
    {
      type: 'post',
      data: {
        id: 'seo-info-2',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "🚀 En Gelişmiş X (Twitter) Video İndirici\n\n✅ 1080p Full HD Kalite Desteği\n✅ MP3 Ses Çıkarma (Müzik İndirme)\n✅ Hızlı ve Güvenli İndirme\n✅ Sınırsız Kullanım\n✅ Reklamsız Deneyim\n✅ Kayıt veya Giriş Gerektirmez\n\nXDownloaderz.com ile X (Twitter) videolarını saniyeler içinde cihazınıza kaydedin!",
        timestamp: '2d',
        metrics: { likes: 9800, reposts: 2650, replies: 124 },
      }
    },

    // 4. PLATFORM UYUMLULUK BİLGİSİ
    {
      type: 'post',
      data: {
        id: 'platform-compatibility',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "📱 Tüm Cihazlarla Tam Uyumlu\n\nXDownloaderz, her platformda sorunsuz çalışır:\n\n🤖 Android (Chrome, Samsung Internet)\n🍎 iPhone & iPad (Safari)\n💻 Windows PC (Chrome, Edge, Firefox)\n🖥️ Mac (Safari, Chrome)\n🐧 Linux (Firefox, Chromium)\n\nModern tarayıcınızla xdownloaderz.com'u ziyaret edin, X (Twitter) video linkini yapıştırın ve indirin!",
        timestamp: '3d',
        metrics: { likes: 5600, reposts: 1420, replies: 78 },
      }
    },

    // --- REKLAM ALANI 2 ---
    { type: 'ad', id: 'ad-2' },

    // 5. NASIL KULLANILIR - ADIM 1
    {
      type: 'post',
      data: {
        id: 'guide-step1-4',
        author: { name: 'XDownloaderz Rehber', handle: '@guide', avatar: logoSrc },
        content: "📖 Kullanım Kılavuzu: Adım 1\n\n1️⃣ Video Linkini Kopyalayın\n\nX (Twitter) uygulamasında veya web sitesinde indirmek istediğiniz videoyu açın. Gönderi üzerindeki 'Paylaş' ikonuna dokunun ve 'Bağlantıyı Kopyala' seçeneğini seçin.\n\n💡 İpucu: Video tweet'inin URL'si şu formatta olmalıdır:\nx.com/kullanici/status/1234567890",
        timestamp: '5d',
        metrics: { likes: 4200, reposts: 980, replies: 56 },
      }
    },

    // 6. NASIL KULLANILIR - ADIM 2
    {
      type: 'post',
      data: {
        id: 'guide-step2',
        author: { name: 'XDownloaderz Rehber', handle: '@guide', avatar: logoSrc },
        content: "📖 Kullanım Kılavuzu: Adım 2\n\n2️⃣ Linki XDownloaderz'e Yapıştırın\n\nxdownloaderz.com sayfasını açın. Sayfanın üst kısmındaki metin kutusuna kopyaladığınız X (Twitter) video linkini yapıştırın.\n\nSistemimiz linki otomatik olarak algılayacak ve video bilgilerini anında yükleyecektir.",
        timestamp: '5d',
        metrics: { likes: 3800, reposts: 890, replies: 48 },
      }
    },

    // 7. NASIL KULLANILIR - ADIM 3
    {
      type: 'post',
      data: {
        id: 'guide-step3',
        author: { name: 'XDownloaderz Rehber', handle: '@guide', avatar: logoSrc },
        content: "📖 Kullanım Kılavuzu: Adım 3\n\n3️⃣ Kalite ve Format Seçin\n\nVideo analiz edildikten sonra, ayarlar menüsünden (⚙️ ikonu) istediğiniz kaliteyi seçin:\n\n• 1080p / 720p / 480p (MP4 Video)\n• MP3 (Sadece Ses)\n\nDaha yüksek çözünürlük = Daha iyi görüntü kalitesi ancak büyük dosya boyutu.",
        timestamp: '5d',
        metrics: { likes: 3500, reposts: 820, replies: 44 },
      }
    },

    // 8. NASIL KULLANILIR - ADIM 4
    {
      type: 'post',
      data: {
        id: 'guide-step4',
        author: { name: 'XDownloaderz Rehber', handle: '@guide', avatar: logoSrc },
        content: "📖 Kullanım Kılavuzu: Adım 4\n\n4️⃣ İndirme İşlemini Başlatın\n\nFormat ve kalite seçiminizi yaptıktan sonra mavi 'İndir' butonuna tıklayın. Video veya ses dosyanız otomatik olarak cihazınıza indirilecektir.\n\n⚡ İndirme hızı internet bağlantınıza ve video boyutuna bağlıdır.",
        timestamp: '5d',
        metrics: { likes: 3200, reposts: 750, replies: 39 },
      }
    },

    // --- REKLAM ALANI 3 ---
    { type: 'ad', id: 'ad-3' },

    // 9. SSS - ÖZEL VİDEOLAR
    {
      type: 'post',
      data: {
        id: 'faq-private-7',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n🔒 Özel/Kilitli hesaplardan video indirebilir miyim?\n\nHayır. XDownloaderz yalnızca herkese açık X (Twitter) gönderilerinden video indirebilir. Özel hesaplardaki içerikler X (Twitter) API'si tarafından korunmaktadır ve erişilemez.\n\n💡 Çözüm: İndirmek istediğiniz içeriğin sahibinden izin isteyebilirsiniz.",
        timestamp: '1w',
        metrics: { likes: 2100, reposts: 420, replies: 67 },
      }
    },

    // 10. SSS - KALİTE SORUNU
    {
      type: 'post',
      data: {
        id: 'faq-quality',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n📹 1080p seçeneği neden bazen görünmüyor?\n\nBazı X (Twitter) videoları yalnızca 720p veya daha düşük kalitede yüklenmiş olabilir. XDownloaderz, videonun orijinal kalitesinden daha yüksek çözünürlük üretemez.\n\nMevcut en yüksek kalite seçeneği size sunulacaktır.",
        timestamp: '1w',
        metrics: { likes: 1800, reposts: 360, replies: 52 },
      }
    },

    // 11. SSS - MP3 DÖNÜŞÜMÜ
    {
      type: 'post',
      data: {
        id: 'faq-mp3-conversion',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n🎵 MP3 dönüşümü nasıl çalışır?\n\nXDownloaderz, X (Twitter) videosunu indirirken ses kaydını otomatik olarak ayıklayıp MP3 formatına dönüştürür. Bu işlem tarayıcınızda gerçekleşir, tamamen güvenlidir.\n\n⏱️ Dönüşüm süresi video uzunluğuna bağlı olarak 5-30 saniye arası sürebilir.",
        timestamp: '1w',
        metrics: { likes: 2800, reposts: 710, replies: 94 },
      }
    },

    // 12. SSS - GÜVENLİK
    {
      type: 'post',
      data: {
        id: 'faq-security',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n🛡️ XDownloaderz güvenli mi? Virüs bulaşır mı?\n\nEvet, %100 güvenlidir. XDownloaderz hiçbir dosya yüklemez, reklam yazılımı veya virüs içermez. Videolar doğrudan X (Twitter) CDN sunucularından indirilir.\n\n✅ Tarayıcınızda SSL (HTTPS) şifrelemesi ile çalışır.\n✅ Kişisel bilgileriniz hiçbir şekilde toplanmaz.",
        timestamp: '1w',
        metrics: { likes: 3400, reposts: 890, replies: 103 },
      }
    },

    // 13. SSS - ÜCRET
    {
      type: 'post',
      data: {
        id: 'faq-pricing',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n💰 XDownloaderz ücretli mi? Abonelik gerekiyor mu?\n\nHayır! XDownloaderz tamamen ücretsizdir ve sonsuza kadar öyle kalacaktır. Hiçbir ücret, gizli maliyet veya abonelik sistemi yoktur.\n\n🎁 Sınırsız sayıda video indirebilir, istediğiniz kadar kullanabilirsiniz.",
        timestamp: '1w',
        metrics: { likes: 5200, reposts: 1340, replies: 156 },
      }
    },

    // 14. SSS - YASAL KULLANIM
    {
      type: 'post',
      data: {
        id: 'faq-legal-use',
        author: { name: 'XDownloaderz SSS', handle: '@faq', avatar: logoSrc },
        content: "❓ Sık Sorulan Sorular\n\n⚖️ İndirilen videoları kullanmak yasal mı?\n\nİndirilen içerikleri kişisel, eğitim amaçlı veya adil kullanım kapsamında kullanabilirsiniz. Ancak:\n\n❌ Ticari amaçla yeniden yayınlamak\n❌ Telif hakkı ihlali yapmak\n❌ İçerik sahibinin iznini almadan paylaşmak\n\nYasalara uygun davranmak kullanıcının sorumluluğundadır.",
        timestamp: '2w',
        metrics: { likes: 2600, reposts: 580, replies: 89 },
      }
    },

    // --- REKLAM ALANI 4 ---
    { type: 'ad', id: 'ad-4' },

    // 15. SEO ODAKLI BİLGİLENDİRME
    {
      type: 'post',
      data: {
        id: 'seo-info-benefits',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "🌟 Neden XDownloaderz?\n\n🚀 En Hızlı İndirme: Saniyeler içinde X (Twitter) videolarını kaydedin\n🎯 Kolay Kullanım: Sadece 3 adımda video indirin\n💎 Yüksek Kalite: 1080p Full HD desteği\n🔄 MP3 Dönüştürücü: Videodan sadece sesi çıkarın\n🌍 Evrensel Erişim: Tüm cihazlarda çalışır\n\nxdownloaderz.com - X (Twitter) Video İndirme'nin En İyi Yolu!",
        timestamp: '2w',
        metrics: { likes: 7100, reposts: 1890, replies: 142 },
      }
    },

    // --- REKLAM ALANI 5 ---
    { type: 'ad', id: 'ad-5' },

    // 16. SEO - ANAHTAR KELİMELER
    {
      type: 'post',
      data: {
        id: 'seo-keywords',
        author: { name: 'XDownloaderz', handle: '@xdownloaderz', avatar: logoSrc },
        content: "🔍 XDownloaderz ile Yapabilecekleriniz:\n\n• X (Twitter) video indir MP4\n• X (Twitter) GIF indir\n• X (Twitter) video indirici online\n• X (Twitter) MP3 dönüştürücü\n• 1080p X (Twitter) video download\n• Mobil X (Twitter) video kaydetme\n• Ücretsiz X (Twitter) downloader\n\nEn iyi X (Twitter) video indirme deneyimi için xdownloaderz.com",
        timestamp: '3w',
        metrics: { likes: 4800, reposts: 1230, replies: 95 },
      }
    },
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

  // Tema değiştiğinde veya data değiştiğinde displayItems'ı güncelle
  useEffect(() => {
    if (data) {
      const newPost: FeedItem = {
        type: 'post',
        data: {
            id: data.id,
            author: { 
              name: data.author.name, 
              handle: `@${data.author.screenName}`, 
              avatar: data.author.avatarUrl 
            },
            content: data.text,
            image: data.media.thumbnailUrl,
            timestamp: 'Şimdi',
            metrics: { likes: data.statistics.likes || 0, reposts: 0, replies: 0 },
        }
      };
      setDisplayItems([newPost, ...staticItems]);
    } else {
      setDisplayItems(staticItems);
    }
  }, [theme, data]);

  // Click Outside
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
              <Image src={logoSrc} alt="XDownloaderz" fill className="object-cover" sizes="40px" />
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
                  placeholder="X (Twitter) video linkini buraya yapıştırın..."
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
                        onMouseDown={(e) => e.preventDefault()} 
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
                                    const qualityLabel = variant.quality || (variant.bitrate ? `${Math.round(variant.bitrate / 1000)}kbps` : 'Standart');
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

        {/* --- DİNAMİK RENDER --- */}
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