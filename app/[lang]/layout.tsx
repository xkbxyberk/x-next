import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Sidebar from '@/app/components/layout/Sidebar';
import RightSection from '@/app/components/layout/RightSection';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import type { Metadata } from 'next';
import { getDictionary } from '@/app/get-dictionary';
import { GoogleAnalytics } from '@next/third-parties/google';
import { keywords } from '@/app/keywords';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");
  const baseUrl = 'https://xdownloaderz.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.common.title,
      template: `%s | XDownloaderz`
    },
    description: dict.common.social?.ogDescription || dict.common.description,
    keywords: keywords,
    authors: [{ name: 'XDownloaderz' }],
    creator: 'XDownloaderz',
    publisher: 'XDownloaderz',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'tr': '/tr',
        'es': '/es',
        'fr': '/fr',
        'de': '/de',
        'it': '/it',
        'pt': '/pt',
        'ru': '/ru',
        'ja': '/ja',
        'ko': '/ko',
        'ar': '/ar',
        'hi': '/hi'
        // Diğer diller buraya eklenebilir, fakat liste çok uzun olacağı için
        // temel dilleri eklemek yeterli olabilir veya hepsi eklenebilir.
        // Şimdilik ana dilleri ekliyoruz.
      },
    },
    openGraph: {
      title: dict.common.social?.ogTitle || dict.common.title,
      description: dict.common.social?.ogDescription || dict.common.description,
      url: `/${lang}`,
      siteName: 'XDownloaderz',
      locale: lang,
      type: 'website',

    },
    twitter: {
      card: 'summary_large_image',
      title: dict.common.social?.ogTitle || dict.common.title,
      description: dict.common.social?.ogDescription || dict.common.description,
      creator: '@xdownloaderz',

    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'XDownloaderz',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png' },
      ],
    },
  };
}

export async function generateStaticParams() {
  return [
    { lang: 'en' }, { lang: 'tr' }, { lang: 'ar' }, { lang: 'bg' }, { lang: 'bn' },
    { lang: 'br' }, { lang: 'cs' }, { lang: 'da' }, { lang: 'de' }, { lang: 'el' },
    { lang: 'es' }, { lang: 'fa' }, { lang: 'fi' }, { lang: 'fr' }, { lang: 'he' },
    { lang: 'hi' }, { lang: 'hr' }, { lang: 'hu' }, { lang: 'id' }, { lang: 'it' },
    { lang: 'ja' }, { lang: 'km' }, { lang: 'ko' }, { lang: 'ms' }, { lang: 'ne' },
    { lang: 'nl' }, { lang: 'no' }, { lang: 'pl' }, { lang: 'pt' }, { lang: 'ro' },
    { lang: 'ru' }, { lang: 'sr' }, { lang: 'sv' }, { lang: 'sw' }, { lang: 'th' },
    { lang: 'tl' }, { lang: 'uk' }, { lang: 'ur' }, { lang: 'vi' }, { lang: 'zh' }
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");

  return (
    <html lang={lang}>
      <body className={`${inter.className} ${inter.variable} font-sans min-h-screen overflow-x-hidden`}>
        <ThemeProvider>
          <div className="mx-auto max-w-325 flex justify-center">

            <header className="hidden md:flex md:w-68.75 md:flex-col h-screen sticky top-0 border-r border-(--border) overflow-y-auto no-scrollbar">
              <Sidebar dict={dict} />
            </header>

            <main className="flex-1 max-w-150 w-full border-r border-(--border) min-h-screen pb-20 md:pb-0">
              {children}
            </main>

            <aside className="hidden lg:flex lg:w-87.5 lg:flex-col pl-8 pt-2 pb-2 h-screen sticky top-0 justify-between">
              <RightSection dict={dict} lang={lang} />
            </aside>

            <nav className="md:hidden fixed bottom-0 w-full bg-(--background)/90 backdrop-blur-md border-t border-(--border) z-50">
              <Sidebar mobile dict={dict} />
            </nav>
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-Q3CFQW96JD" />
      </body>
    </html>
  );
}