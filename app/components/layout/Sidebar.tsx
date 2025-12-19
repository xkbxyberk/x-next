import { Home, Search, Bell, CircleHelp } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  mobile?: boolean;
}

const menuItems = [
  { icon: Home, label: 'Anasayfa', active: true },
  { icon: Search, label: 'Keşfet', active: false },
  { icon: Bell, label: 'Bildirimler', active: false },
  { icon: CircleHelp, label: 'Nasıl Kullanılır', active: false },
];

export default function Sidebar({ mobile = false }: SidebarProps) {
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-2 pt-1 pb-4">
      <div className="mb-2 px-2">
        <Link 
          href="/" 
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-(--background-secondary) transition-colors"
        >
          <span className="text-3xl font-bold text-(--text-primary)">X</span>
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
         <div className="w-10 h-10 rounded-full bg-gray-600" />
         <div className="hidden xl:block">
            <p className="font-bold text-sm text-(--text-primary)">Kullanıcı Adı</p>
            <p className="text-(--text-secondary) text-sm">@kullanici</p>
         </div>
      </div>
    </div>
  );
}