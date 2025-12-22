'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, MessageCircle, Repeat, Share, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { resolveTweetAction } from '@/app/actions/resolve-tweet';
import { TweetVideoEntity } from '@/lib/core/schemas';

interface TweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function TweetModal({ isOpen, onClose, url }: TweetModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TweetVideoEntity | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && url) {
      loadTweetData();
      document.body.style.overflow = 'hidden';
    } else {
      setData(null);
      setError(null);
      setLoading(true);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, url]);

  const loadTweetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await resolveTweetAction(url);
      
      // DÜZELTME BURADA:
      // Önce başarısız mı diye bakıyoruz.
      if (!result.success) {
        // Başarısız ise hata mesajını alıp fonksiyonu bitiriyoruz (return).
        setError(result.error || 'Tweet bilgileri alınamadı.');
        return;
      }

      // Eğer buraya geldiyse, result.success kesinlikle true demektir.
      setData(result.data);

    } catch (err) {
      setError('Bir bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    // DÜZELTME: z-[99999] yerine z-99999 (Tailwind v4 syntax uyarısı giderildi)
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-(--background) rounded-2xl border border-(--border) shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 z-10">
        
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          <h3 className="font-bold text-lg text-(--text-primary)">Gönderi Önizleme</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-(--background-secondary) text-(--text-secondary) transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto custom-scrollbar bg-(--background)">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={32} className="animate-spin text-(--accent)" />
              <p className="text-(--text-secondary) text-sm">Tweet verileri alınıyor...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <X size={32} />
              </div>
              <p className="text-(--text-primary) font-medium mb-2">Hata Oluştu</p>
              <p className="text-(--text-secondary) text-sm">{error}</p>
            </div>
          ) : data ? (
            <div className="flex flex-col p-4 gap-3">
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-(--border)">
                  <Image 
                    src={data.author.avatarUrl} 
                    alt={data.author.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-(--text-primary) hover:underline cursor-pointer">
                    {data.author.name}
                  </span>
                  <span className="text-(--text-secondary) text-sm">
                    @{data.author.screenName}
                  </span>
                </div>
              </div>

              <p className="text-(--text-primary) text-[15px] whitespace-pre-wrap">
                {data.text}
              </p>

              {data.media && data.media.variants.length > 0 && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-(--border) bg-black relative aspect-video group">
                  <video 
                    controls 
                    poster={data.media.thumbnailUrl}
                    className="w-full h-full object-contain"
                    playsInline
                  >
                    <source src={data.media.variants[0].url} type="video/mp4" />
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
                </div>
              )}

              <div className="mt-2 text-(--text-secondary) text-sm border-b border-(--border) pb-3">
                {new Date(data.createdAt).toLocaleDateString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>

              <div className="flex items-center justify-between pt-1 px-2">
                 <button className="text-(--text-secondary) hover:text-blue-400 transition-colors"><MessageCircle size={20} /></button>
                 <button className="text-(--text-secondary) hover:text-green-400 transition-colors"><Repeat size={20} /></button>
                 <button className="text-(--text-secondary) hover:text-pink-500 transition-colors"><Heart size={20} /></button>
                 <button className="text-(--text-secondary) hover:text-blue-400 transition-colors"><Share size={20} /></button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}