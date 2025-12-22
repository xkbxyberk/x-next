import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Singleton Class: Sayfa boyunca sadece TEK bir FFmpeg instance'ı olmasını garanti eder.
export class FFmpegManager {
  private static instance: FFmpeg | null = null;
  private static loadingPromise: Promise<FFmpeg> | null = null;

  public static async getInstance(): Promise<FFmpeg> {
    if (this.instance) return this.instance;

    // Eğer şu an yükleniyorsa, mevcut yükleme işlemini bekle (Race condition önlemi)
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      const ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        this.instance = ffmpeg;
        return ffmpeg;
      } catch (e) {
        this.loadingPromise = null; // Hata olursa tekrar denenebilsin
        throw e;
      }
    })();

    return this.loadingPromise;
  }

  // İşlem bitince veya component unmount olunca belleği temizle
  // NOT: Sık kullanımda terminate etmemek daha performanslıdır. 
  // Sadece kullanıcı siteden çıkarken veya çok uzun süre işlem yapılmadığında çağrılabilir.
  public static async terminate() {
    if (this.instance) {
      try {
        await this.instance.terminate();
      } catch (e) {
        console.error("FFmpeg termination error", e);
      } finally {
        this.instance = null;
        this.loadingPromise = null;
      }
    }
  }
}