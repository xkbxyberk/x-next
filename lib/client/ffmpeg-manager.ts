import { FFmpeg } from '@ffmpeg/ffmpeg';

// Pinned, immutable CDN release of @ffmpeg/core.
// jsDelivr is a multi-CDN (Cloudflare + Fastly + Bunny) serving immutable
// versioned URLs — far higher availability than a single-origin CDN.
// 0.12.10 is the current stable single-thread core, compatible with
// @ffmpeg/ffmpeg 0.12.15.
const CORE_VERSION = '0.12.10';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

// Subresource Integrity (SHA-384) for the pinned assets.
// ffmpeg.load() has no native `integrity` option, so we fetch the bytes,
// verify the digest ourselves, and only then hand a same-origin blob: URL to
// the loader. Any CDN/package compromise that alters a single byte fails the
// check and aborts the load, so tampered code never executes.
const INTEGRITY = {
  coreJs: 'sha384-sKfkiFtvUk+vexk+0EUhEh366190/4WpgUAsUvaxEfyg7+E1Zt5Y5hrsU808g8Q9',
  coreWasm: 'sha384-U1VDhkPYrM3wTCT4/vjSpSsKqG/UjljYrYCI4hBSJ02svbCkxuCi6U6u/peg5vpW',
} as const;

const bufferToBase64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

// Fetches an asset and verifies its SHA-384 against the expected SRI value.
// Returns a same-origin blob: URL on success; throws on any mismatch.
const fetchWithIntegrity = async (
  url: string,
  expected: string,
  mime: string
): Promise<string> => {
  const [, expectedB64] = expected.split('-');

  const response = await fetch(url, { referrerPolicy: 'no-referrer' });
  if (!response.ok) {
    throw new Error(`FFmpeg çekirdeği indirilemedi (${response.status}): ${url}`);
  }

  const bytes = await response.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-384', bytes);
  if (bufferToBase64(digest) !== expectedB64) {
    throw new Error(`FFmpeg çekirdeği bütünlük (SRI) doğrulaması başarısız: ${url}`);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mime }));
};

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
      try {
        // Bütünlüğü, loader herhangi bir kodu çalıştırmadan ÖNCE doğrula.
        // Doğrulama geçerse aynı-köken (blob:) URL'leri loader'a veriyoruz.
        const [coreURL, wasmURL] = await Promise.all([
          fetchWithIntegrity(`${CDN_BASE}/ffmpeg-core.js`, INTEGRITY.coreJs, 'text/javascript'),
          fetchWithIntegrity(`${CDN_BASE}/ffmpeg-core.wasm`, INTEGRITY.coreWasm, 'application/wasm'),
        ]);

        await ffmpeg.load({ coreURL, wasmURL });

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
