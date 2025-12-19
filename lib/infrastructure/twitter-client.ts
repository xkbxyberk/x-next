// lib/infrastructure/twitter-client.ts

/**
 * Twitter Syndication API İstemcisi
 * Resmi "Embed" (Gömülü Tweet) altyapısını kullanır.
 * Avantajı: Guest Token veya Login gerektirmez, çok daha hızlıdır ve limitlere takılmaz.
 */
export class TwitterClient {
  
  /**
   * Twitter'ın Embed sisteminin kullandığı özel token üretme algoritması.
   * Bu formül, tweet ID'sine dayalı matematiksel bir imza üretir.
   */
  private static getToken(id: string): string {
    // Not: JavaScript'in büyük sayı hassasiyeti (precision) kaybı, 
    // Twitter'ın algoritmasının bir parçasıdır. Bu yüzden Number() dönüşümü doğrudur.
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0)+/g, '');
  }

  /**
   * Tweet detaylarını çeker.
   */
  public static async getTweetDetails(tweetId: string): Promise<any> {
    const token = this.getToken(tweetId);
    
    // GraphQL yerine Syndication URL'ini kullanıyoruz
    const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 } // 1 Dakikalık önbellek
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Tweet bulunamadı veya silinmiş.');
      }
      throw new Error(`Twitter API Hatası: ${response.status}`);
    }

    const data = await response.json();
    
    // Gelen veriyi Service katmanımızın beklediği formata (GraphQL formatına benzeterek) çeviriyoruz.
    // Bu sayede Service katmanını değiştirmemize gerek kalmıyor (Adapter Pattern).
    return this.normalizeResponse(data);
  }

  /**
   * Syndication verisini, bizim sistemin anladığı GraphQL benzeri yapıya çevirir.
   */
  private static normalizeResponse(data: any): any {
    return {
      data: {
        tweetResult: {
          result: {
            legacy: {
              full_text: data.text,
              created_at: data.created_at,
              extended_entities: {
                media: data.mediaDetails?.map((m: any) => ({
                  type: m.type,
                  media_url_https: m.media_url_https,
                  video_info: {
                    variants: m.video_info?.variants || []
                  }
                }))
              }
            },
            core: {
              user_results: {
                result: {
                  legacy: {
                    name: data.user.name,
                    screen_name: data.user.screen_name,
                    profile_image_url_https: data.user.profile_image_url_https
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}