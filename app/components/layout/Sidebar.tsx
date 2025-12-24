'use client';

import { Home, BookOpen, Zap, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../ThemeProvider';
import { usePathname, useRouter, useParams } from 'next/navigation';

interface SidebarProps {
  mobile?: boolean;
  dict: any;
}

export default function Sidebar({ mobile = false, dict }: SidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'tr'; // Default to tr if undefined

  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  // Menu Items (Dynamic based on props)
  const menuItems = [
    { icon: Home, label: dict.sidebar.download, href: '#download-area' },
    { icon: BookOpen, label: dict.sidebar.howToUse, href: '#guide-step1-4' },
    { icon: Zap, label: dict.sidebar.howItWorks, href: '#seo-info-2' },
    { icon: CircleHelp, label: dict.sidebar.faq, href: '#faq-private-7' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    if (pathname !== '/' && !pathname.match(/^\/(en|tr)\/?$/)) {
      // If not on home page, push to home page with lang prefix
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

  if (mobile) {
    return (
      <div className="flex justify-around items-center h-13.25 px-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="p-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)"
            aria-label={item.label}
          >
            <item.icon size={24} strokeWidth={2} />
          </a>
        ))}
        <div className="p-2">
          <div className="w-8 h-8 rounded-full overflow-hidden relative">
            <Image
              src={logoSrc}
              alt="X Downloader Profil"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-2 pt-0 pb-4">

      <div className="mb-0 px-2">
        <Link
          href={`/${lang}`}
          className="flex items-center justify-center p-2 w-fit rounded-full hover:bg-(--background-secondary) transition-colors relative"
          aria-label="X Downloader Ana Sayfa"
        >
          <Image
            src={logoSrc}
            alt="X Downloader Logo"
            width={52}
            height={52}
            className="object-contain"
            priority={true}
            fetchPriority="high"
          />
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-(--background-secondary) transition-all w-fit xl:w-full group shrink-0 cursor-pointer"
          >
            <item.icon size={24} strokeWidth={2} className="text-(--text-primary)" />
            <span className="text-xl hidden xl:block text-(--text-primary) font-normal group-hover:font-medium">
              {item.label}
            </span>
          </a>
        ))}

        <div className="hidden xl:flex w-full my-2 px-2 flex-1 min-h-75">
          <div className="w-full bg-(--background-secondary) rounded-2xl border border-(--border) h-full flex flex-col items-center justify-center relative overflow-hidden group">
            <span className="text-(--text-secondary) text-[10px] font-bold tracking-widest opacity-40 absolute top-2 right-2">{dict.sidebar.adLabel}</span>
            <div className="flex flex-col items-center gap-2 opacity-50">
              <span className="text-(--text-secondary) text-xs font-bold tracking-widest rotate-90 whitespace-nowrap">{dict.sidebar.verticalAd}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-2 p-3 hover:bg-(--background-secondary) rounded-full cursor-pointer flex items-center gap-3 transition-colors shrink-0">
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