import { Search } from 'lucide-react';

export default function RightSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="group relative">
        <div className="absolute left-3 top-3 text-(--text-secondary) group-focus-within:text-(--accent)">
           <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Ara" 
          className="w-full bg-(--input-background) rounded-full py-3 pl-12 pr-4 text-sm text-(--text-primary) focus:outline-none focus:bg-(--background) focus:ring-1 focus:ring-(--accent) border border-transparent focus:border-(--accent) transition-all"
        />
      </div>

      <section className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border)">
        <h2 className="text-xl font-bold px-4 py-3 text-(--text-primary)">İlginizi çekebilir</h2>
        
        <div className="px-4 py-3 hover:bg-(--background)/50 cursor-pointer transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-(--text-secondary)">Türkiye konumunda gündem</span>
            <span className="text-(--text-secondary) text-xs">...</span>
          </div>
          <p className="font-bold text-(--text-primary)">#Teknoloji</p>
          <span className="text-xs text-(--text-secondary)">12,5 B posts</span>
        </div>

        <div className="px-4 py-3 hover:bg-(--background)/50 cursor-pointer transition-colors">
          <div className="flex justify-between items-start">
             <span className="text-xs text-(--text-secondary)">Yazılım · Gündemdekiler</span>
          </div>
          <p className="font-bold text-(--text-primary)">Next.js 15</p>
          <span className="text-xs text-(--text-secondary)">45 B posts</span>
        </div>
        
        <div className="px-4 py-3 text-(--accent) text-sm cursor-pointer hover:bg-(--background)/50">
           Daha fazla göster
        </div>
      </section>
    </div>
  );
}