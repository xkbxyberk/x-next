import { Home, Search, Bell, Mail, User, PenSquare } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
}

const menuItems = [
  { icon: Home, label: 'Anasayfa', active: true },
  { icon: Search, label: 'Keşfet', active: false },
  { icon: Bell, label: 'Bildirimler', active: false },
  { icon: Mail, label: 'Mesajlar', active: false },
  { icon: User, label: 'Profil', active: false },
];

export default function Sidebar({ mobile = false }: SidebarProps) {
  // Mobil Tasarım (Thumb Zone - Bottom Bar)
  if (mobile) {
    return (
      <div className="flex justify-around items-center h-13.25 px-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={item.label} // Doc B: Erişilebilirlik
          >
            <item.icon size={26} strokeWidth={item.active ? 3 : 2} />
          </button>
        ))}
      </div>
    );
  }

  // Masaüstü Tasarım (Left Sidebar)
  return (
    <div className="flex flex-col h-full px-2 py-4">
      {/* Logo */}
      <div className="mb-6 px-3">
        <div className="text-3xl font-bold">X</div>
      </div>

      {/* Navigasyon Linkleri */}
      <div className="flex flex-col gap-2 flex-1">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/10 transition-all w-fit xl:w-full group"
          >
            <item.icon size={26} strokeWidth={item.active ? 3 : 2} />
            <span className={`text-xl hidden xl:block ${item.active ? 'font-bold' : 'font-normal'}`}>
              {item.label}
            </span>
          </a>
        ))}

        {/* Post Butonu */}
        <button className="mt-4 bg-white text-black font-bold rounded-full h-13 w-13 xl:w-[90%] flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
          <PenSquare className="xl:hidden" />
          <span className="hidden xl:block text-lg">Gönderi yayınla</span>
        </button>
      </div>
      
      {/* User Mini Profile */}
      <div className="mb-4 p-3 hover:bg-white/10 rounded-full cursor-pointer flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-gray-600" />
         <div className="hidden xl:block">
            <p className="font-bold text-sm">Kullanıcı Adı</p>
            <p className="text-gray-500 text-sm">@kullanici</p>
         </div>
      </div>
    </div>
  );
}