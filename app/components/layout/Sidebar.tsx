'use client';

import { Home, BookOpen, Zap, CircleHelp, X, Info, Shield, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../ThemeProvider';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SidebarProps {
  mobile?: boolean;
  dict: any;
}

export default function Sidebar({ mobile = false, dict }: SidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'tr'; /* Default to tr if undefined */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  /* Menu Items (Dynamic based on props) */
  const menuItems = [
    { icon: Home, label: dict.sidebar.download, href: '#download-area' },
    { icon: BookOpen, label: dict.sidebar.howToUse, href: '#guide-step1-4' },
    { icon: Zap, label: dict.sidebar.howItWorks, href: '#seo-info-2' },
    { icon: CircleHelp, label: dict.sidebar.faq, href: '#faq-private-7' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    if (pathname !== '/' && !pathname.match(/^\/(en|tr)\/?$/)) {
      /* If not on home page, push to home page with lang prefix */
      router.push(`/${lang}${href}`);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  if (mobile) {
    return (
      <>
        <div className="flex justify-around items-center h-13.25 px-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="p-2 rounded-full hover:bg-(--background-secondary) text-(--text-primary)"
              aria-label={item.label}
            >
              <item.icon size={24} strokeWidth={2} />
            </a>
          ))}
          <div
            className="p-2 flex items-center gap-3 cursor-pointer"
            onClick={() => setIsDrawerOpen(true)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image
                src={logoSrc}
                alt="X Downloader Profil"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <h1 className="text-sm font-bold text-(--text-primary) hidden sm:block">{dict.common.title}</h1>
          </div>
        </div>

        {/* Side Drawer with Portal */}
        {isDrawerOpen && mounted && createPortal(
          <div className="fixed inset-0 z-[100] flex justify-end text-base pointer-events-auto">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
              onClick={closeDrawer}
            />

            {/* Drawer Content */}
            <div className="relative w-[75%] max-w-[300px] h-full bg-(--background) border-l border-(--border) flex flex-col p-5 shadow-2xl overflow-y-auto animate-slide-in-right">
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-(--border)">
                    <Image
                      src={logoSrc}
                      alt="X Downloader Icon"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <span className="font-bold text-lg text-(--text-primary)">XDownloaderz</span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-(--background-secondary) rounded-full text-(--text-primary) transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/${lang}/about`}
                  onClick={closeDrawer}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-(--background-secondary) text-(--text-primary) font-medium transition-colors"
                >
                  <Info size={22} className="text-(--text-secondary)" />
                  {dict.common.about}
                </Link>

                <Link
                  href={`/${lang}/terms`}
                  onClick={closeDrawer}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-(--background-secondary) text-(--text-primary) font-medium transition-colors"
                >
                  <FileText size={22} className="text-(--text-secondary)" />
                  {dict.common.termsOfService}
                </Link>

                <Link
                  href={`/${lang}/privacy`}
                  onClick={closeDrawer}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-(--background-secondary) text-(--text-primary) font-medium transition-colors"
                >
                  <Shield size={22} className="text-(--text-secondary)" />
                  {dict.common.privacyPolicy}
                </Link>

                <Link
                  href={`/${lang}/contact`}
                  onClick={closeDrawer}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-(--background-secondary) text-(--text-primary) font-medium transition-colors"
                >
                  <Mail size={22} className="text-(--text-secondary)" />
                  {dict.common.contact}
                </Link>
              </div>

              <div className="mt-auto pt-6 border-t border-(--border) shrink-0">
                <p className="text-xs text-(--text-secondary) leading-relaxed">
                  {dict.common.footerText}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col h-full px-2 pt-0 pb-4">

      <div className="mb-2 px-2">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 p-2 w-fit xl:w-full rounded-full hover:bg-(--background-secondary) relative group"
          aria-label="X Downloader Ana Sayfa"
        >
          <Image
            src={logoSrc}
            alt="X Downloader Logo"
            width={52}
            height={52}
            className="object-contain shrink-0"
            sizes="52px"
          />
          <h1 className="hidden xl:block text-sm font-bold text-(--text-primary) leading-tight">
            {dict.common.title}
          </h1>
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-(--background-secondary) w-fit xl:w-full group shrink-0 cursor-pointer"
          >
            <item.icon size={24} strokeWidth={2} className="text-(--text-primary)" />
            <span className="text-xl hidden xl:block text-(--text-primary) font-normal group-hover:font-medium">
              {item.label}
            </span>
          </a>
        ))}

        {/*
        <div className="hidden xl:flex w-full my-2 px-2 flex-1 min-h-75">
          <div className="w-full bg-(--background-secondary) rounded-2xl border border-(--border) h-full flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-(--text-primary) text-[10px] font-bold tracking-widest absolute top-2 right-2">{dict.sidebar.adLabel}</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-(--text-primary) text-xs font-bold tracking-widest rotate-90 whitespace-nowrap">{dict.sidebar.verticalAd}</span>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* --- Popular Searches (SEO) --- */}
      {/* --- Popular Searches (SEO) - MOVED TO RIGHT SECTION --- */}


      <div className="mb-4 mt-2 p-3 hover:bg-(--background-secondary) rounded-full cursor-pointer flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden relative border border-(--border)">
          <Image
            src={logoSrc}
            alt="X Downloader"
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="hidden xl:block">
          <p className="font-bold text-sm text-(--text-primary)">X Downloader</p>
          <p className="text-(--text-secondary) text-sm">@xdownloaderz</p>
        </div>
      </div>
    </div>
  );
}