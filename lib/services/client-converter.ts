// lib/services/client-converter.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class ClientConverter {
  private static ffmpeg: FFmpeg | null = null;

  private static async load() {
    if (this.ffmpeg) return this.ffmpeg;

    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    // WebAssembly çekirdeğini yükle
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.ffmpeg = ffmpeg;
    return ffmpeg;
  }

  static async convertToMp3(videoUrl: string, onProgress: (progress: number) => void): Promise<Blob> {
    const ffmpeg = await this.load();

    // DÜZELTME BURADA: { progress }: { progress: number } diyerek tipi belirttik.
    // Progress event log type
    interface ProgressEvent {
        progress: number;
        time: number;
    }

    ffmpeg.on('progress', ({ progress }: ProgressEvent) => {
      onProgress(Math.round(progress * 100));
    });

    // 1. Videoyu sanal dosya sistemine yaz
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoUrl));

    // 2. Dönüştür (MP3)
    await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-ab', '192k', 'output.mp3']);

    // 3. Oku
    const data = await ffmpeg.readFile('output.mp3');
    
    // Temizlik
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp3');

    return new Blob([data as any], { type: 'audio/mp3' });
  }
}