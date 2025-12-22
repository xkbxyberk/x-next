import { z } from 'zod';

// Twitter URL Validasyonu
export const TweetUrlSchema = z.string().url().refine((url) => {
  return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/.test(url);
}, {
  message: "Geçerli bir X (Twitter) video bağlantısı giriniz."
});

// Domain Varlıkları (Types)
export interface TweetVideoEntity {
  id: string;
  text: string;
  author: {
    name: string;
    screenName: string;
    avatarUrl: string;
  };
  media: {
    thumbnailUrl: string;
    variants: VideoVariantEntity[];
  };
  statistics: {
    likes: number;
    views: number;
  };
  createdAt: string;
}

export interface VideoVariantEntity {
  bitrate: number;
  contentType: string;
  url: string;
  quality: string; // '1080p', '720p' vb.
}

export type ServiceResponse<T> = 
  | { success: true; data: T; fromCache: boolean }
  | { success: false; error: string };