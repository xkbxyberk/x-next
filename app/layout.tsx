import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/layout/Sidebar';
import RightSection from './components/layout/RightSection';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'X-Next | 2025 Web Experience',
  description: 'AI-First, SSR-Powered Social Platform Prototype.',
  openGraph: {
    title: 'X-Next',
    description: 'Developed with Next.js 15 & Islands Architecture.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="bg-black text-white">
      <body className={`${inter.className} min-h-screen overflow-x-hidden`}>
        {/*
           Doc A: Bento Grid & Layout
           Masaüstünde 3 sütunlu yapı (Sidebar - Main - Trends).
           Mobilde tek sütun.
        */}
        <div className="mx-auto max-w-325 flex justify-center">
          
          {/* Sol Sütun: Navigasyon (Semantik: <nav>) */}
          <header className="hidden md:flex md:w-68.75 md:flex-col min-h-screen border-r border-gray-800">
            <Sidebar />
          </header>

          {/* Orta Sütun: Ana İçerik (Semantik: <main>) */}
          <main className="flex-1 max-w-150 w-full border-r border-gray-800 min-h-screen pb-20 md:pb-0">
            {children}
          </main>

          {/* Sağ Sütun: Trendler & Arama (Semantik: <aside>) */}
          <aside className="hidden lg:flex lg:w-87.5 lg:flex-col pl-8 pt-4 h-screen sticky top-0">
            <RightSection />
          </aside>

          {/* Mobil Navigasyon (Bottom Bar - Thumb Zone) */}
          <nav className="md:hidden fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 z-50">
             <Sidebar mobile />
          </nav>
        </div>
      </body>
    </html>
  );
}