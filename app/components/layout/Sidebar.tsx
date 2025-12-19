'use client';

import { Home, Search, Bell, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../ThemeProvider';

interface SidebarProps {
  mobile?: boolean;
}

const menuItems = [
  { icon: Home, label: 'İndir', active: true },
  { icon: Search, label: 'Özellikler', active: false },
  { icon: Bell, label: 'Güncellemeler', active: false },
  { icon: CircleHelp, label: 'Nasıl Çalışır?', active: false },
];

export default function Sidebar({ mobile = false }: SidebarProps) {
  const { theme } = useTheme();
  
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
            <item.icon size={24} strokeWidth={item.active ? 3 : 2} />
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
    <div className="flex flex-col h-full px-2 pt-0 pb-4">
      
      {/* Logo Alanı */}
      {/* mb-0 korundu: Logo ile menü arası sıkı */}
      <div className="mb-0 px-2">
        <Link 
          href="/" 
          /* p-2 ve w-fit korundu: Hover alanı logoyu sarıyor */
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

      {/* Menü ve Reklam Kapsayıcısı */}
      {/* BURASI DÜZELTİLDİ: gap-1 -> gap-2 yapıldı (Eski haline döndü) */}
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            /* BURASI DÜZELTİLDİ: py-2 -> py-3 yapıldı (Eski ferah haline döndü) */
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-(--background-secondary) transition-all w-fit xl:w-full group shrink-0"
          >
            <item.icon size={24} strokeWidth={item.active ? 3 : 2} className="text-(--text-primary)" />
            <span className={`text-xl hidden xl:block text-(--text-primary) ${item.active ? 'font-bold' : 'font-normal'}`}>
              {item.label}
            </span>
          </a>
        ))}

        {/* DİKEY REKLAM ALANI (SKYSCRAPER) */}
        <div className="hidden xl:flex w-full my-2 px-2 flex-1 min-h-75">
            <div className="w-full bg-(--background-secondary) rounded-2xl border border-(--border) h-full flex flex-col items-center justify-center relative overflow-hidden group">
                 <span className="text-(--text-secondary) text-[10px] font-bold tracking-widest opacity-40 absolute top-2 right-2">REKLAM</span>
                 <div className="flex flex-col items-center gap-2 opacity-50">
                    <span className="text-(--text-secondary) text-xs font-bold tracking-widest rotate-90 whitespace-nowrap">DİKEY REKLAM ALANI</span>
                 </div>
            </div>
        </div>
      </div>
      
      {/* Profil Alanı */}
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