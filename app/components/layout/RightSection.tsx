import { Search } from 'lucide-react';

export default function RightSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="group relative">
        <div className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-500">
           <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Ara" 
          className="w-full bg-[#202327] rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:bg-black focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Bento Grid: Trends Container */}
      <section className="bg-[#16181c] rounded-2xl overflow-hidden border border-gray-800">
        <h2 className="text-xl font-bold px-4 py-3">İlginizi çekebilir</h2>
        
        {/* Trend Item */}
        <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">Türkiye konumunda gündem</span>
            <span className="text-gray-500 text-xs">...</span>
          </div>
          <p className="font-bold">#Teknoloji</p>
          <span className="text-xs text-gray-500">12,5 B posts</span>
        </div>

        {/* Trend Item */}
        <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex justify-between items-start">
             <span className="text-xs text-gray-500">Yazılım · Gündemdekiler</span>
          </div>
          <p className="font-bold">Next.js 15</p>
          <span className="text-xs text-gray-500">45 B posts</span>
        </div>
        
        <div className="px-4 py-3 text-blue-400 text-sm cursor-pointer hover:bg-white/5">
           Daha fazla göster
        </div>
      </section>
    </div>
  );
}