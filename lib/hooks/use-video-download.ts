// lib/hooks/use-video-download.ts
import { useState, useEffect } from 'react';
import { resolveTweetAction } from '@/app/actions/resolve-tweet';
import { sendDownloadNotification } from '@/app/actions/notify-download';
// remove FFmpegManager and fetchFile static imports
import { TweetVideoEntity } from '@/lib/core/schemas';

export type SelectionType = {
  type: 'video' | 'audio';
  url: string;
  qualityLabel?: string;
  bitrate?: number;
};

export type HistoryItem = {
  id: string;
  originalUrl: string;
  author: { name: string; handle: string; avatar: string };
  content: string;
  image?: string;
  timestamp: string;
  quality: string;
  type: 'video' | 'audio';
};

export function useVideoDownload(dict?: any) {
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

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdl_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('History parse error', e);
      }
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('xdl_history', JSON.stringify(newHistory));
  };

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('xdl_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('xdl_history');
  };

  const reset = () => {
    setData(null);
    setSelection(null);
    setError(null);
    setLoading(false);
  };

  // 1. ANALİZ İŞLEMİ (Server-Side Only)
  const handleAnalyze = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || inputUrl;
    if (!targetUrl.trim()) return;

    setLoading(true);
    setData(null);
    setSelection(null);
    setError(null);

    try {
      console.log('🛡️ [Analyze] Server Action tetikleniyor...');
      const result = await resolveTweetAction(targetUrl);

      if (!result.success) {
        throw new Error(result.error || dict?.feed?.notifications?.errorAnalyzing || 'Video bulunamadı');
      }

      setData(result.data);

      if (result.fromCache) {
        console.log('⚡ Veri Cache\'den geldi.');
      }

      showNotification(dict?.feed?.notifications?.videoFound || 'Video başarıyla bulundu.', 'success');
      return true;

    } catch (err: any) {
      setError(err.message);
      showNotification(err.message || dict?.feed?.notifications?.errorAnalyzing || 'Analiz başarısız oldu.', 'error');
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
        const msg = selection.type === 'audio'
          ? (dict?.feed?.notifications?.downloadingAudio || 'Ses indiriliyor...')
          : (dict?.feed?.notifications?.downloadingVideo || 'Video indiriliyor...');
        showNotification(msg, 'info');

        // TELEGRAM NOTIFICATION (Action)
        // Fire-and-forget style
        sendDownloadNotification({
          tweetId: data.id,
          authorName: data.author.name,
          format: selection.type
        });
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

      requestAnimationFrame(() => {
        a.click();
        // Clean up in next frame or immediately after
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // Save to History
      const historyItem: HistoryItem = {
        id: data.id, // Tweet ID remains specific
        originalUrl: inputUrl, // inputUrl is the source of truth
        author: {
          name: data.author.name,
          handle: data.author.screenName,
          avatar: data.author.avatarUrl
        },
        content: data.text,
        image: data.media.thumbnailUrl,
        timestamp: new Date().toISOString(),
        quality: selection.qualityLabel || (selection.type === 'audio' ? 'MP3' : 'Standard'),
        type: selection.type
      };
      saveToHistory(historyItem);

      showNotification(dict?.feed?.notifications?.downloadComplete || 'İndirme tamamlandı!', 'success');

    } catch (err: any) {
      console.error(err);
      const errorTitle = dict?.feed?.notifications?.errorDownloading || 'İndirme hatası';
      showNotification(errorTitle + ': ' + (err.message || 'Bilinmeyen hata'), 'error');
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
    reset,
    history,
    removeFromHistory,
    clearHistory
  };
}