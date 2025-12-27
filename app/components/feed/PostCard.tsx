'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';


import Image from 'next/image';

interface PostProps {
  data: {
    id: string;
    author: { name: string; handle: string; avatar: string; avatarDark?: string };
    content: string;
    image?: string;
    imageAlt?: string;
    timestamp: string;
    metrics: { likes: number; reposts: number; replies: number };
  };
  priority?: boolean;
  dict?: any;
}

export default function PostCard({ data, priority = false, dict }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.metrics.likes);

  const handleLike = () => {
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount((prev) => (newStatus ? prev + 1 : prev - 1));
  };

  return (
    // BURASI DEĞİŞTİ: id prop'u eklendi, Wrapper Div Flattened
    <article
      id={data.id}
      className="border-b border-(--border) p-4 hover:bg-(--background-secondary) cursor-pointer scroll-mt-20 flex gap-4"
    >
      {/* Wrapper removed, styles moved up */}
      <div className="shrink-0 relative w-10 h-10">
        <Image
          src={data.author.avatar}
          alt={data.author.name}
          fill
          className={`rounded-full object-cover ${data.author.avatarDark ? 'theme-light-only' : ''}`}
          sizes="40px"
        />
        {data.author.avatarDark && (
          <Image
            src={data.author.avatarDark}
            alt={data.author.name}
            fill
            className="rounded-full object-cover theme-dark-only"
            sizes="40px"
          />
        )}
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
          <div className="mt-3 rounded-2xl overflow-hidden border border-(--border) w-full">
            <Image
              src={data.image}
              alt={data.imageAlt || "Post media"}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 600px"
              style={{ width: '100%', height: 'auto' }}
              priority={priority}
            />
          </div>
        )}

        <div className="flex justify-between mt-3 text-(--text-secondary) max-w-100">
          <button
            className="group flex items-center gap-2 hover:text-blue-400"
            aria-label={dict?.feed?.accessibility?.reply || "Reply"}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-400/10">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs">{data.metrics.replies}</span>
          </button>

          <button
            className="group flex items-center gap-2 hover:text-green-400"
            aria-label={dict?.feed?.accessibility?.repost || "Repost"}
          >
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
            className={`group flex items-center gap-2 ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
            aria-label={dict?.feed?.accessibility?.like || "Like"}
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

          <button
            className="group flex items-center gap-2 hover:text-blue-400"
            aria-label={dict?.feed?.accessibility?.share || "Share"}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-400/10">
              <Share size={18} />
            </div>
          </button>
        </div>
      </div>
    </article >
  );
}