import { getDictionary } from '@/app/get-dictionary';
import MainFeed from '@/app/components/feed/MainFeed';
import { getSeoMetadata, getStaticPathsData, generateGuideText, generateBenefitsText } from '@/lib/seo';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ lang: string; slug: string }>;
};

// 1. Generate Static Params for High-Value (Golden Ratio) Pages only
export async function generateStaticParams() {
    const paths = getStaticPathsData();
    return paths;
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const decodedSlug = decodeURIComponent(slug).normalize('NFKC');
    const seoData = getSeoMetadata(decodedSlug, lang);

    if (!seoData) {
        return {
            title: 'Not Found'
        };
    }

    return {
        title: seoData.title,
        description: seoData.description,
        openGraph: {
            title: seoData.title,
            description: seoData.description,
            type: 'website',
            url: `https://xdownloaderz.com/${lang}/${slug}`,
        },
        alternates: {
            canonical: `https://xdownloaderz.com/${lang}/${slug}`
        }
    };
}

export default async function SeoPage({ params }: Props) {
    const { lang, slug } = await params;
    const decodedSlug = decodeURIComponent(slug).normalize('NFKC');

    // Validate Slug & Language
    const seoData = getSeoMetadata(decodedSlug, lang);

    if (!seoData) {
        // If not found in current lang, maybe it exists in another? 
        // For now, simpler to just 404 to avoid loose matching issues.
        notFound();
    }

    const dict = await getDictionary(lang as any);

    // --- CONTENT INJECTION ---
    // Clone the dictionary to inject our specific SEO content without mutating original
    const modifiedDict = JSON.parse(JSON.stringify(dict));

    // Override "Welcome" or Main Title
    if (modifiedDict.feed && modifiedDict.feed.pinned) {
        // NOTE: We are NOT changing the code of MainFeed, we are changing the DATA passed to it.
        // However, MainFeed renders `initialItems`. 
        // We need to construct a specific `initialItems` array for this page.
        const logoSrc = '/logo.avif';
        const logoWhiteSrc = '/logo-white.avif';
    }

    const logoSrc = '/logo.avif'; // Define logo source
    const logoWhiteSrc = '/logo.avif'; // Define dark mode logo source (using same for now)

    // Inject customizations into the first "Welcome" post equivalent
    const dynamicItems = [
        // 1. WELCOME POST (SEO Optimized Intro)
        {
            type: 'post',
            data: {
                id: 'seo-welcome',
                author: {
                    name: 'XDownloaderz', // Corrected Name
                    handle: '@xdownloaderz',
                    avatar: logoSrc,
                    avatarDark: logoWhiteSrc
                },
                content: `👋 **${seoData.h1}**\n\n${seoData.introText}`, // Removed "URL:" line
                timestamp: dict.feed.pinned, // "Pinned"
                metrics: { likes: 1240, reposts: 350, replies: 12 },
            }
        },
        // Keep standard Ad
        { type: 'ad', id: 'ad-seo-1' },

        // 2. GUIDE POST (Real Step-by-Step)
        {
            type: 'post',
            data: {
                id: 'seo-guide',
                author: {
                    name: lang === 'tr' ? 'Nasıl Kullanılır' : 'How to Use',
                    handle: '@guide',
                    avatar: logoSrc,
                    avatarDark: logoWhiteSrc,
                },
                content: generateGuideText(seoData.keyword, lang),
                timestamp: '1h',
                metrics: { likes: 540, reposts: 85, replies: 4 },
            }
        },

        // 3. BENEFITS POST (Why Use Us)
        {
            type: 'post',
            data: {
                id: 'seo-benefits',
                author: {
                    name: lang === 'tr' ? 'Özellikler' : 'Features',
                    handle: '@help',
                    avatar: logoSrc,
                    avatarDark: logoWhiteSrc,
                },
                content: generateBenefitsText(seoData.keyword, lang),
                timestamp: '2d',
                metrics: { likes: 800, reposts: 100, replies: 20 }
            }
        }
    ];

    /* JSON-LD Schema (Rich Snippets) */
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'XDownloaderz',
                applicationCategory: 'MultimediaApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                },
                description: seoData.description,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '1250'
                }
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: `Is it free to use ${seoData.keyword}?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: `Yes, XDownloaderz is completely free to use for ${seoData.keyword}.`
                        }
                    },
                    {
                        '@type': 'Question',
                        name: `How do I ${seoData.keyword}?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: `Simply copy the link from X (Twitter), paste it into XDownloaderz, and click download.`
                        }
                    }
                ]
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: `https://xdownloaderz.com/${lang}`
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: seoData.title,
                        item: `https://xdownloaderz.com/${lang}/${slug}`
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Reuse the exact same MainFeed component to maintain visual consistency */}
            <MainFeed dict={modifiedDict} initialItems={dynamicItems} />
        </>
    );
}
