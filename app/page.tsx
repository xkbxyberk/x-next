'use client';

import { useState } from 'react';
import PostCard from './components/feed/PostCard';
import { Image, Smile, BarChart3, Calendar, MapPin, Globe } from 'lucide-react';

// Mock Data
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    headline: 'Latest Updates',
    author: {
      '@type': 'Organization',
      name: 'X-Next Platform',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('foryou')}
            className="flex-1 py-4 text-center font-semibold hover:bg-white/5 transition-colors relative flex items-center justify-center"
          >
            <span className={activeTab === 'foryou' ? 'font-bold' : 'text-gray-500'}>
              Sana özel
            </span>
            {activeTab === 'foryou' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-blue-500 rounded-full w-16" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className="flex-1 py-4 text-center font-semibold hover:bg-white/5 transition-colors relative flex items-center justify-center"
          >
            <span className={activeTab === 'following' ? 'font-bold' : 'text-gray-500'}>
              Takip
            </span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-blue-500 rounded-full w-12" />
            )}
          </button>
        </div>
      </div>

      {/* İçerik Akışı */}
      <div className="flex flex-col">
        {/* Enhanced Input Area */}
        <div className="p-4 border-b border-gray-800">
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
                className="w-full bg-transparent text-xl outline-none placeholder-gray-500 resize-none min-h-12"
                rows={3}
              />
              
              {/* Herkes indirebilir - Sadece focus olduğunda göster */}
              {isFocused && (
                <button className="flex items-center gap-2 text-blue-500 font-semibold text-sm hover:bg-blue-500/10 rounded-full px-3 py-1 w-fit transition-colors">
                  <Globe size={16} />
                  <span>Herkes indirebilir</span>
                </button>
              )}
              
              {/* Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="Görsel ekle"
                  >
                    <Image size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="GIF ekle"
                  >
                    <span className="text-sm font-bold">GIF</span>
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="Anket oluştur"
                  >
                    <BarChart3 size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="Emoji ekle"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="Tarih ekle"
                  >
                    <Calendar size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors"
                    aria-label="Konum ekle"
                  >
                    <MapPin size={20} />
                  </button>
                </div>
                
                <button
                  disabled={!postContent.trim()}
                  className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gönderi yayınla
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Listesi */}
        {posts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}