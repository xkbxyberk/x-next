'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';


import Image from 'next/image';

interface PostProps {
  data: {
    id: string;
    author: { name: string; handle: string; avatar: string };
    content: string;
    image?: string;
    timestamp: string;
    metrics: { likes: number; reposts: number; replies: number };
  };
  priority?: boolean;
}

export default function PostCard({ data, priority = false }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.metrics.likes);

  const handleLike = () => {
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount((prev) => (newStatus ? prev + 1 : prev - 1));
  };

  return (
    // BURASI DEĞİŞTİ: id prop'u eklendi
    <article
      id={data.id}
      className="border-b border-(--border) p-4 hover:bg-(--background-secondary) transition-colors cursor-pointer scroll-mt-20"
    >
      <div className="flex gap-4">
        <div className="shrink-0 relative w-10 h-10">
          <Image
            src={data.author.avatar}
            alt={data.author.name}
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-(--text-secondary) text-sm">
            <span className="font-bold text-(--text-primary) hover:underline">
              {data.author.name}
            </span>
            <span>{data.author.handle}</span>
            <span>·</span>
            <time>{data.timestamp}</time>
          </div>

          <p className="text-[15px] leading-normal whitespace-pre-wrap text-(--text-primary)">
            {data.content}
          </p>

          {data.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-(--border) max-h-125 relative w-full aspect-video">
              <Image
                src={data.image}
                alt="Post media"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority={priority}
              />
            </div>
          )}

          <div className="flex justify-between mt-3 text-(--text-secondary) max-w-100">
            <button className="group flex items-center gap-2 hover:text-blue-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs">{data.metrics.replies}</span>
            </button>

            <button className="group flex items-center gap-2 hover:text-green-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-green-400/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-xs">{data.metrics.reposts}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`group flex items-center gap-2 transition-colors ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'
                }`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-600/10 relative">
                <Heart
                  size={18}
                  fill={isLiked ? 'currentColor' : 'none'}
                  className={`transition-transform duration-200 ${isLiked ? 'scale-110' : 'scale-100'
                    }`}
                />
              </div>
              <span className="text-xs">{likeCount}</span>
            </button>

            <button className="group flex items-center gap-2 hover:text-blue-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}