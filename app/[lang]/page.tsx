import { getDictionary } from '@/app/get-dictionary';
import MainFeed from '@/app/components/feed/MainFeed';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");

  // Helper to find post content from dictionary (Server Side execution)
  const getPost = (id: string) => dict.staticPosts.find((p: any) => p.id === id) || { content: '', authorName: 'XDownloaderz' };
  const logoSrc = '/logo.avif'; // Default logo for SSR

  // Reconstruct static items on the server
  const staticItems = [
    // 1. HOŞ GELDİN MESAJI
    {
      type: 'post',
      data: {
        id: 'welcome-1',
        author: { name: getPost('welcome-1').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('welcome-1').content,
        timestamp: dict.feed.pinned,
        metrics: { likes: 15200, reposts: 4100, replies: 187 },
      }
    },
    // 2. YASAL BİLGİLENDİRME
    {
      type: 'post',
      data: {
        id: 'legal-warning',
        author: { name: getPost('legal-warning').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('legal-warning').content,
        timestamp: dict.feed.pinned,
        metrics: { likes: 2400, reposts: 310, replies: 42 },
      }
    },
    // --- REKLAM ALANI 1 ---
    { type: 'ad', id: 'ad-1' },
    // 3. ÖZELLİKLER TANITIMI
    {
      type: 'post',
      data: {
        id: 'seo-info-2',
        author: { name: getPost('seo-info-2').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('seo-info-2').content,
        timestamp: '2d',
        metrics: { likes: 9800, reposts: 2650, replies: 124 },
      }
    },
    // 4. PLATFORM UYUMLULUK BİLGİSİ
    {
      type: 'post',
      data: {
        id: 'platform-compatibility',
        author: { name: getPost('platform-compatibility').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('platform-compatibility').content,
        timestamp: '3d',
        metrics: { likes: 5600, reposts: 1420, replies: 78 },
      }
    },
    // --- REKLAM ALANI 2 ---
    { type: 'ad', id: 'ad-2' },
    // 5. NASIL KULLANILIR - ADIM 1
    {
      type: 'post',
      data: {
        id: 'guide-step1-4',
        author: { name: getPost('guide-step1-4').authorName, handle: '@guide', avatar: logoSrc },
        content: getPost('guide-step1-4').content,
        timestamp: '5d',
        metrics: { likes: 4200, reposts: 980, replies: 56 },
      }
    },
    // 6. NASIL KULLANILIR - ADIM 2
    {
      type: 'post',
      data: {
        id: 'guide-step2',
        author: { name: getPost('guide-step2').authorName, handle: '@guide', avatar: logoSrc },
        content: getPost('guide-step2').content,
        timestamp: '5d',
        metrics: { likes: 3800, reposts: 890, replies: 48 },
      }
    },
    // 7. NASIL KULLANILIR - ADIM 3
    {
      type: 'post',
      data: {
        id: 'guide-step3',
        author: { name: getPost('guide-step3').authorName, handle: '@guide', avatar: logoSrc },
        content: getPost('guide-step3').content,
        timestamp: '5d',
        metrics: { likes: 3500, reposts: 820, replies: 44 },
      }
    },
    // 8. NASIL KULLANILIR - ADIM 4
    {
      type: 'post',
      data: {
        id: 'guide-step4',
        author: { name: getPost('guide-step4').authorName, handle: '@guide', avatar: logoSrc },
        content: getPost('guide-step4').content,
        timestamp: '5d',
        metrics: { likes: 3200, reposts: 750, replies: 39 },
      }
    },
    // --- REKLAM ALANI 3 ---
    { type: 'ad', id: 'ad-3' },
    // 9. SSS - ÖZEL VİDEOLAR
    {
      type: 'post',
      data: {
        id: 'faq-private-7',
        author: { name: getPost('faq-private-7').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-private-7').content,
        timestamp: '1w',
        metrics: { likes: 2100, reposts: 420, replies: 67 },
      }
    },
    // 10. SSS - KALİTE SORUNU
    {
      type: 'post',
      data: {
        id: 'faq-quality',
        author: { name: getPost('faq-quality').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-quality').content,
        timestamp: '1w',
        metrics: { likes: 1800, reposts: 360, replies: 52 },
      }
    },
    // 11. SSS - MP3 DÖNÜŞÜMÜ
    {
      type: 'post',
      data: {
        id: 'faq-mp3-conversion',
        author: { name: getPost('faq-mp3-conversion').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-mp3-conversion').content,
        timestamp: '1w',
        metrics: { likes: 2800, reposts: 710, replies: 94 },
      }
    },
    // 12. SSS - GÜVENLİK
    {
      type: 'post',
      data: {
        id: 'faq-security',
        author: { name: getPost('faq-security').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-security').content,
        timestamp: '1w',
        metrics: { likes: 3400, reposts: 890, replies: 103 },
      }
    },
    // 13. SSS - ÜCRET
    {
      type: 'post',
      data: {
        id: 'faq-pricing',
        author: { name: getPost('faq-pricing').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-pricing').content,
        timestamp: '1w',
        metrics: { likes: 5200, reposts: 1340, replies: 156 },
      }
    },
    // 14. SSS - YASAL KULLANIM
    {
      type: 'post',
      data: {
        id: 'faq-legal-use',
        author: { name: getPost('faq-legal-use').authorName, handle: '@faq', avatar: logoSrc },
        content: getPost('faq-legal-use').content,
        timestamp: '2w',
        metrics: { likes: 2600, reposts: 580, replies: 89 },
      }
    },
    // --- REKLAM ALANI 4 ---
    { type: 'ad', id: 'ad-4' },
    // 15. SEO ODAKLI BİLGİLENDİRME
    {
      type: 'post',
      data: {
        id: 'seo-info-benefits',
        author: { name: getPost('seo-info-benefits').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('seo-info-benefits').content,
        timestamp: '2w',
        metrics: { likes: 7100, reposts: 1890, replies: 142 },
      }
    },
    // --- REKLAM ALANI 5 ---
    { type: 'ad', id: 'ad-5' },
    // 16. SEO - ANAHTAR KELİMELER
    {
      type: 'post',
      data: {
        id: 'seo-keywords',
        author: { name: getPost('seo-keywords').authorName, handle: '@xdownloaderz', avatar: logoSrc },
        content: getPost('seo-keywords').content,
        timestamp: '3w',
        metrics: { likes: 4800, reposts: 1230, replies: 95 },
      }
    }
  ];

  /* JSON-LD Schema (Task 3) */
  /* JSON-LD Schema (Task 2: Graph Architecture) */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://xdownloaderz.com/#organization',
        name: 'XDownloaderz',
        url: 'https://xdownloaderz.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://xdownloaderz.com/logo.avif',
          width: 512,
          height: 512
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://xdownloaderz.com/#website',
        url: 'https://xdownloaderz.com',
        name: dict.common.title,
        publisher: { '@id': 'https://xdownloaderz.com/#organization' }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://xdownloaderz.com/#app',
        name: 'XDownloaderz',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        description: dict.common.title,
        softwareVersion: '2025.1.0',
        author: { '@id': 'https://xdownloaderz.com/#organization' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '15200'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://xdownloaderz.com/#faq',
        mainEntity: staticItems
          .filter((item: any) => item.type === 'post' && item.data.id.startsWith('faq-'))
          .map((item: any) => ({
            '@type': 'Question',
            name: item.data.content.split('\n')[2]?.replace('❓ ', '').trim() || 'Question',
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.data.content.split('\n\n').slice(1).join('\n')
            }
          }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <MainFeed dict={dict} initialItems={staticItems} />
    </>
  );
}