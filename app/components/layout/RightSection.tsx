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

      <section className="flex flex-col gap-4">
        {/* Reklam Alanı 1 */}
        <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center">
            <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 1</span>
        </div>

        {/* Reklam Alanı 2 */}
        <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center">
            <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 2</span>
        </div>

        {/* Reklam Alanı 3 */}
        <div className="bg-(--background-secondary) rounded-2xl overflow-hidden border border-(--border) min-h-62.5 flex items-center justify-center">
            <span className="text-(--text-secondary) text-xs font-bold tracking-widest opacity-50">REKLAM ALANI 3</span>
        </div>
      </section>
    </div>
  );
}