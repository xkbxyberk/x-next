// lib/core/types.ts

// Twitter'dan dönen ham cevabın içinden ayıkladığımız temiz veri modelimiz
export interface TweetVideo {
  id: string;
  text: string;
  user: {
    name: string;
    screen_name: string;
    avatar_url: string;
  };
  media: {
    thumbnail_url: string;
    variants: VideoVariant[]; // Farklı çözünürlükler
  };
  createdAt: string;
}

// Videonun farklı kalite seçenekleri (720p, 1080p vs.)
export interface VideoVariant {
  bitrate?: number; // Bitrate yüksekse kalite yüksektir
  content_type: string; // "video/mp4"
  url: string; // Videonun direkt CDN linki
}

// Başarılı veya Hatalı sonuçları yönetmek için standart bir cevap kalıbı
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}