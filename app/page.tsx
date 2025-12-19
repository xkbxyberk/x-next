'use client';

import { useState } from 'react';
import PostCard from './components/feed/PostCard';
import { Globe, Music, Settings2, Moon, Sun, CloudMoon, Check } from 'lucide-react';
import { useTheme } from './components/ThemeProvider';

const posts = [
  {
    id: '1',
    author: {
      name: 'Dear Self.',
      handle: '@Dearme2_',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    content: "In 2026, we're gonna be so rich.",
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop&q=60',
    timestamp: '10s',
    metrics: { likes: 9000, reposts: 1000, replies: 66 },
  },
  {
    id: '2',
    author: {
      name: 'Elon Musk',
      handle: '@elonmusk',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    content: 'Optimistic UI is the future of perceived performance. Make it fast.',
    timestamp: '2h',
    metrics: { likes: 42000, reposts: 5000, replies: 1200 },
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [postContent, setPostContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border)">
        <div className="flex">
          <button
            onClick={() => setActiveTab('foryou')}
            className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer"
          >
            <span className={activeTab === 'foryou' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>
              Sana özel
            </span>
            {activeTab === 'foryou' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-16" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) transition-colors relative flex items-center justify-center cursor-pointer"
          >
            <span className={activeTab === 'following' ? 'font-bold text-(--text-primary)' : 'text-(--text-secondary)'}>
              Takip
            </span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-12" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="p-4 border-b border-(--border)">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Neler oluyor?"
                className="w-full bg-transparent text-xl outline-none placeholder-(--text-secondary) text-(--text-primary) resize-none min-h-12"
                rows={3}
              />
              
              {isFocused && (
                <button className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit transition-colors cursor-pointer">
                  <Globe size={16} />
                  <span>Herkes indirebilir</span>
                </button>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                    <Settings2 size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                    <Music size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                        <button className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer">
                            <Globe size={20} />
                        </button>
                        
                        <div className="relative">
                          <button
                              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                              className="p-2 rounded-full hover:bg-(--accent)/10 text-(--accent) transition-colors cursor-pointer"
                          >
                              <Moon size={20} />
                          </button>

                          {isThemeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50">
                              <button 
                                onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-blue-500 rounded-full text-white">
                                  <Sun size={16} />
                                </div>
                                <span className="font-bold text-sm">Varsayılan</span>
                                {theme === 'default' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600">
                                  <CloudMoon size={16} />
                                </div>
                                <span className="font-bold text-sm">Loş</span>
                                {theme === 'dim' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>

                              <button 
                                onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer"
                              >
                                <div className="p-2 bg-black rounded-full text-white border border-gray-800">
                                  <Moon size={16} />
                                </div>
                                <span className="font-bold text-sm">Işıklar Kapalı</span>
                                {theme === 'lights-out' && <Check className="ml-auto text-(--accent)" size={18} />}
                              </button>
                            </div>
                          )}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-(--border) mx-1"></div>

                    <button
                    disabled={!postContent.trim()}
                    className="bg-(--accent) text-white font-bold px-4 py-2 rounded-full hover:bg-(--accent-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                    Gönderi yayınla
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {posts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}