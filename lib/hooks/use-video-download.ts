// lib/hooks/use-video-download.ts
import { useState } from 'react';
import { resolveTweetAction } from '@/app/actions/resolve-tweet';
// remove FFmpegManager and fetchFile static imports
import { TweetVideoEntity } from '@/lib/core/schemas';

export type SelectionType = {
  type: 'video' | 'audio';
  url: string;
  qualityLabel?: string;
  bitrate?: number;
};

export function useVideoDownload() {
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState<TweetVideoEntity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (msg: string, type: 'success' | 'error' | 'info') => {
    setNotification({ msg, type });
  };

  const closeNotification = () => setNotification(null);

  const reset = () => {
    setData(null);
    setSelection(null);
    setError(null);
    setLoading(false);
  };

  // 1. ANALİZ İŞLEMİ
  const handleAnalyze = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || inputUrl;
    if (!targetUrl.trim()) return;

    setLoading(true);
    setData(null);
    setSelection(null);
    setError(null);

    try {
      const result = await resolveTweetAction(targetUrl);

      // DÜZELTME BURADA:
      // TypeScript'e "Eğer success false ise bu bloğa gir" diyoruz.
      // Böylece bu bloğun içinde result.error'a erişmemize izin veriyor.
      if (!result.success) {
        throw new Error(result.error || 'Video bulunamadı');
      }

      // Buraya geldiyse TypeScript artık başarısız olmadığını biliyor.
      // Dolayısıyla result.data'ya güvenle erişebiliriz.
      setData(result.data);

      if (result.fromCache) {
        console.log('⚡ Veri Cache\'den ışık hızında geldi!');
      }

      showNotification('Video başarıyla bulundu. Format seçin.', 'success');
      return true;
    } catch (err: any) {
      setError(err.message);
      showNotification(err.message || 'Analiz başarısız oldu.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. İNDİRME İŞLEMİ
  const executeDownload = async () => {
    if (!selection || !data) return;

    setDownloading(true);
    setProgress(0);

    try {
      if (typeof showNotification === 'function') {
        showNotification(`${selection.type === 'audio' ? 'Ses' : 'Video'} indiriliyor...`, 'info');
      }

      let blob: Blob;
      let filename = `${data.author.screenName}-${data.id}`;

      if (selection.type === 'audio') {
        // Dynamic import for FFmpegManager
        const { FFmpegManager } = await import('@/lib/client/ffmpeg-manager');
        const ffmpeg = await FFmpegManager.getInstance();

        ffmpeg.on('progress', ({ progress }) => {
          setProgress(Math.round(progress * 100));
        });

        try {
          // fetchFile yerine manuel fetch yapıyoruz, böylece referrerPolicy ekleyebiliriz.
          const response = await fetch(selection.url, {
            referrerPolicy: 'no-referrer'
          });

          if (!response.ok) {
            throw new Error(`Video indirilemedi. Status: ${response.status}`);
          }

          const blobData = await response.blob();
          const arrayBuffer = await blobData.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          // Task 5: INP Optimization - Yield to main thread
          await new Promise(resolve => setTimeout(resolve, 0)); // yieldToMain polyfill

          await ffmpeg.writeFile('input.mp4', uint8Array);

          // Yield again before heavy processing
          await new Promise(resolve => setTimeout(resolve, 0));

          await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-ab', '192k', 'output.mp3']);

          // Yield before reading result
          await new Promise(resolve => setTimeout(resolve, 0));

          const fileData = await ffmpeg.readFile('output.mp3');
          blob = new Blob([fileData as any], { type: 'audio/mp3' });
          filename += '.mp3';
        } catch (e: any) {
          console.error("FFmpeg error full object:", e);
          const errorMessage = e.message || (typeof e === 'string' ? e : JSON.stringify(e));
          throw new Error("Ses dönüştürme hatası: " + errorMessage);
        } finally {
          // Temizlik
          try {
            await ffmpeg.deleteFile('input.mp4');
            await ffmpeg.deleteFile('output.mp3');
          } catch (cleanupErr) {
            console.warn("Dosya temizleme hatası (önemsiz olabilir):", cleanupErr);
          }
        }
      } else {
        const response = await fetch(selection.url, {
          referrerPolicy: 'no-referrer'
        });

        if (!response.ok) throw new Error('Video dosyası çekilemedi.');

        setProgress(50);
        blob = await response.blob();
        setProgress(100);
        filename += '.mp4';
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);

      // Optimization: Schedule click to avoid sync layout thrashing
      requestAnimationFrame(() => {
        a.click();
        // Clean up in next frame or immediately after
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      showNotification('İndirme tamamlandı!', 'success');

    } catch (err: any) {
      console.error(err);
      showNotification('İndirme hatası: ' + (err.message || 'Bilinmeyen hata'), 'error');
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return {
    inputUrl,
    setInputUrl,
    data,
    error,
    loading,
    downloading,
    progress,
    selection,
    setSelection,
    notification,
    closeNotification,
    handleAnalyze,
    executeDownload,
    reset
  };
}