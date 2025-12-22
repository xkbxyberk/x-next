// lib/hooks/use-video-download.ts
import { useState } from 'react';
import { resolveTweet } from '@/app/actions/download';
import { ClientConverter } from '@/lib/services/client-converter';
import { TweetVideo } from '@/lib/core/types';

export type SelectionType = {
  type: 'video' | 'audio';
  url: string;
  qualityLabel?: string;
  bitrate?: number;
};

export function useVideoDownload() {
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState<TweetVideo | null>(null);
  const [error, setError] = useState<string | null>(null); // Hata durumu için state eklendi
  
  // Durum Yönetimi
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Kullanıcı Seçimi
  const [selection, setSelection] = useState<SelectionType | null>(null);
  
  // Bildirim Yönetimi
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (msg: string, type: 'success' | 'error' | 'info') => {
    setNotification({ msg, type });
  };

  const closeNotification = () => setNotification(null);

  // Her şeyi sıfırla (URL silindiğinde çağrılacak)
  const reset = () => {
    setData(null);
    setSelection(null);
    setError(null);
    setLoading(false);
    // inputUrl'i burada sıfırlamıyoruz çünkü onu input'un kendisi kontrol ediyor
  };

  // URL Analizi
  const handleAnalyze = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || inputUrl;
    if (!targetUrl.trim()) return;
    
    setLoading(true);
    setData(null);
    setSelection(null);
    setError(null); // Önceki hataları temizle

    try {
      const result = await resolveTweet(targetUrl);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Video bulunamadı');
      }
      setData(result.data);
      showNotification('Video başarıyla bulundu. Format seçin.', 'success');
      return true;
    } catch (err: any) {
      setError(err.message); // Hatayı state'e işle (Kırmızı renk için)
      showNotification(err.message || 'Analiz başarısız oldu.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // İndirme İşlemi
  const executeDownload = async () => {
    if (!selection || !data) return;

    setDownloading(true);
    setProgress(0);

    try {
      // Bildirim göster
      if (typeof showNotification === 'function') {
         showNotification(`${selection.type === 'audio' ? 'Ses' : 'Video'} indiriliyor...`, 'info');
      }

      let blob: Blob;
      let filename = `${data.user.screen_name}-${data.id}`;

      // --- SES İNDİRME İŞLEMİ (Eski yöntemi koruyoruz) ---
      if (selection.type === 'audio') {
        // Ses dönüştürücü zaten ffmpeg kullanıyor, buraya dokunmuyoruz
        blob = await ClientConverter.convertToMp3(selection.url, (p) => setProgress(p));
        filename += '.mp3';
      } 
      
      // --- VİDEO İNDİRME İŞLEMİ (GÜNCELLENDİ) ---
      else {
        // BURASI KRİTİK NOKTA:
        // Eski 'fetch' yöntemini kullanıyoruz AMA içine 'no-referrer' ekliyoruz.
        // Bu sayede hem dosya olarak paketliyoruz hem de Twitter'a yakalanmıyoruz.
        
        const response = await fetch(selection.url, {
            referrerPolicy: 'no-referrer' // <--- SİHİRLİ SATIR
        });

        if (!response.ok) throw new Error('Video dosyası çekilemedi.');
        
        blob = await response.blob();
        filename += '.mp4';
      }

      // --- DOSYAYI İNDİRME (Link Oluşturma) ---
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Bu özellik artık çalışacak çünkü blob bizim elimizde
      document.body.appendChild(a);
      a.click();
      
      // Temizlik
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (typeof showNotification === 'function') {
        showNotification('İndirme tamamlandı!', 'success');
      }
      
    } catch (err: any) {
      console.error(err);
      if (typeof showNotification === 'function') {
         showNotification('İndirme hatası: ' + (err.message || 'Bilinmeyen hata'), 'error');
      }
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return {
    inputUrl,
    setInputUrl,
    data,
    error, // Dışarı aktarıldı
    loading,
    downloading,
    progress,
    selection,
    setSelection,
    notification,
    closeNotification,
    handleAnalyze,
    executeDownload,
    reset // Dışarı aktarıldı
  };
}