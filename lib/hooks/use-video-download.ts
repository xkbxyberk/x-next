// lib/hooks/use-video-download.ts
import { useState } from 'react';
import { resolveTweet } from '@/app/actions/download';
import { ClientConverter } from '@/lib/services/client-converter';
import { TweetVideo } from '@/lib/core/types';

type DownloadMode = 'video' | 'audio' | null;

export function useVideoDownload() {
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState<TweetVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<DownloadMode>(null);
  const [progress, setProgress] = useState(0); // MP3 dönüştürme yüzdesi
  const [error, setError] = useState<string | null>(null);

  // URL'i analiz et (Backend'e sor)
  const handleAnalyze = async () => {
    if (!inputUrl.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await resolveTweet(inputUrl);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Video bulunamadı');
      }
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // MP3 İndirme Mantığı (Müzik Butonu)
  const handleMusicDownload = async () => {
    if (!data) {
      // Eğer veri yoksa önce analiz et, sonra indir (Zincirleme)
      await handleAnalyze();
    }
    
    // Veri hala yoksa veya analiz başarısızsa dur
    if (!data && !inputUrl) return; 

    setMode('audio');
    
    try {
      // En iyi kalite videoyu bul (Ses dönüşümü için kaynak)
      const bestVariant = data?.media.variants[0];
      if (!bestVariant) throw new Error('Kaynak video bulunamadı');

      // Client-Side dönüştürmeyi başlat
      const mp3Blob = await ClientConverter.convertToMp3(bestVariant.url, (p) => setProgress(p));
      
      // İndirmeyi tetikle
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data?.user.screen_name || 'x-download'}.mp3`;
      a.click();
      
    } catch (err: any) {
      setError('MP3 dönüşümü başarısız: ' + err.message);
    } finally {
      setMode(null);
      setProgress(0);
    }
  };

  // Video Ayarları (Settings Butonu)
  const toggleSettings = async () => {
    if (!data) {
      await handleAnalyze();
    }
    setMode(mode === 'video' ? null : 'video');
  };

  return {
    inputUrl,
    setInputUrl,
    data,
    loading,
    error,
    mode,
    progress,
    handleAnalyze,
    handleMusicDownload,
    toggleSettings
  };
}