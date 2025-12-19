import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/layout/Sidebar';
import RightSection from './components/layout/RightSection';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'X-Next | 2025 Web Experience',
  description: 'AI-First, SSR-Powered Social Platform Prototype.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen overflow-x-hidden transition-colors duration-200`}>
        <ThemeProvider>
          <div className="mx-auto max-w-325 flex justify-center">
            
            <header className="hidden md:flex md:w-68.75 md:flex-col h-screen sticky top-0 border-r border-(--border) overflow-y-auto no-scrollbar">
              <Sidebar />
            </header>

            <main className="flex-1 max-w-150 w-full border-r border-(--border) min-h-screen pb-20 md:pb-0">
              {children}
            </main>

            <aside className="hidden lg:flex lg:w-87.5 lg:flex-col pl-8 pt-2 h-screen sticky top-0">
              <RightSection />
            </aside>

            <nav className="md:hidden fixed bottom-0 w-full bg-(--background)/90 backdrop-blur-md border-t border-(--border) z-50">
               <Sidebar mobile />
            </nav>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}