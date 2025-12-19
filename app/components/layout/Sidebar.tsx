'use client';

import { Home, Search, Bell, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../ThemeProvider';

interface SidebarProps {
  mobile?: boolean;
}

const menuItems = [
  { icon: Home, label: 'İndir', active: true }, // "Anasayfa" yerine "İndir" daha eylem odaklı
  { icon: Search, label: 'Özellikler', active: false },
  { icon: Bell, label: 'Güncellemeler', active: false },
  { icon: CircleHelp, label: 'Nasıl Çalışır?', active: false },
];

export default function Sidebar({ mobile = false }: SidebarProps) {
  const { theme } = useTheme();
  // Logo mantığı: Tema default ise siyah, değilse beyaz
  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  if (mobile) {
    return (
      <div className="flex justify-around items-center h-13.25 px-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="p-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)"
            aria-label={item.label}
          >
            <item.icon size={26} strokeWidth={item.active ? 3 : 2} />
          </button>
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
    <div className="flex flex-col h-full px-2 pt-1 pb-4">
      <div className="mb-2 px-2">
        <Link 
          href="/" 
          className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-(--background-secondary) transition-colors relative"
          aria-label="X Downloader Ana Sayfa"
        >
          <Image 
            src={logoSrc} 
            alt="X Downloader Logo" 
            width={32} 
            height={32} 
            className="object-contain"
            priority={true} 
            fetchPriority="high"
          />
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-(--background-secondary) transition-all w-fit xl:w-full group"
          >
            <item.icon size={26} strokeWidth={item.active ? 3 : 2} className="text-(--text-primary)" />
            <span className={`text-xl hidden xl:block text-(--text-primary) ${item.active ? 'font-bold' : 'font-normal'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </div>
      
      <div className="mb-4 p-3 hover:bg-(--background-secondary) rounded-full cursor-pointer flex items-center gap-3 transition-colors">
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
            {/* BURASI GÜNCELLENDİ: Marka Kimliği */}
            <p className="font-bold text-sm text-(--text-primary)">X Downloader</p>
            <p className="text-(--text-secondary) text-sm">@xdownloaderz</p>
         </div>
      </div>
    </div>
  );
}