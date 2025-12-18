import PostCard from './components/feed/PostCard';

// Mock Data: Gerçek senaryoda veritabanından gelir.
// Bu veri sunucuda oluşturulup istemciye "hazır HTML" olarak gider (SSR).
const posts = [
  {
    id: '1',
    author: {
      name: 'Dear Self.',
      handle: '@Dearme2_',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    content: "In 2026, we're gonna be so rich.",
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop&q=60', // Temsili görsel
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
  // Doc B: Schema Markup (JSON-LD) for AI Readability
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
      
      {/* Sticky Header (Glassmorphism) */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold">Sana özel</h1>
      </div>

      {/* İçerik Akışı */}
      <div className="flex flex-col">
        {/* Input Area (Placeholder) */}
        <div className="p-4 border-b border-gray-800 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
             <img src="https://i.pravatar.cc/150?u=me" alt="Me" />
          </div>
          <div className="flex-1">
             <input 
               type="text" 
               placeholder="Neler oluyor?" 
               className="w-full bg-transparent text-xl outline-none placeholder-gray-500"
             />
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