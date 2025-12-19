'use server'

import { VideoService } from '@/lib/services/video-service';
import { ServiceResult, TweetVideo } from '@/lib/core/types';

// Frontend'den çağrılacak fonksiyon
export async function resolveTweet(url: string): Promise<ServiceResult<TweetVideo>> {
  // Controller katmanı sadece yönlendirme yapar, iş yapmaz.
  // İşi Service katmanına devreder.
  return await VideoService.getVideoInfo(url);
}