import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Sidebar from '@/app/components/layout/Sidebar';
import RightSection from '@/app/components/layout/RightSection';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import type { Metadata } from 'next';
import { getDictionary } from '@/app/get-dictionary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XDownloaderz | X (Twitter) Video İndirici',
  description: 'X (Twitter) videolarını ücretsiz, hızlı ve güvenli bir şekilde indirin. 1080p Full HD kalite desteği, MP3 dönüştürücü. Tüm cihazlarda çalışır.',
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }];
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
      <body className={`${inter.className} min-h-screen overflow-x-hidden transition-colors duration-200`}>
        <ThemeProvider>
          <div className="mx-auto max-w-325 flex justify-center">

            <header className="hidden md:flex md:w-68.75 md:flex-col h-screen sticky top-0 border-r border-(--border) overflow-y-auto no-scrollbar">
              <Sidebar dict={dict} />
            </header>

            <main className="flex-1 max-w-150 w-full border-r border-(--border) min-h-screen pb-20 md:pb-0">
              {children}
            </main>

            <aside className="hidden lg:flex lg:w-87.5 lg:flex-col pl-8 pt-2 h-screen sticky top-0">
              <RightSection dict={dict} />
            </aside>

            <nav className="md:hidden fixed bottom-0 w-full bg-(--background)/90 backdrop-blur-md border-t border-(--border) z-50">
              <Sidebar mobile dict={dict} />
            </nav>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}