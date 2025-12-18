'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

interface PostProps {
  data: {
    id: string;
    author: { name: string; handle: string; avatar: string };
    content: string;
    image?: string;
    timestamp: string;
    metrics: { likes: number; reposts: number; replies: number };
  };
}

export default function PostCard({ data }: PostProps) {
  // Optimistic UI State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.metrics.likes);

  const handleLike = () => {
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount((prev) => (newStatus ? prev + 1 : prev - 1));
  };

  return (
    <article className="border-b border-gray-800 p-4 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={data.author.avatar}
            alt={data.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {/* Header */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="font-bold text-white hover:underline">
              {data.author.name}
            </span>
            <span>{data.author.handle}</span>
            <span>·</span>
            {/* DÜZELTME: Burası data.data.timestamp idi, data.timestamp yapıldı */}
            <time>{data.timestamp}</time>
          </div>

          {/* Text Content */}
          <p className="text-[15px] leading-normal whitespace-pre-wrap">
            {data.content}
          </p>

          {/* Media */}
          {data.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800 max-h-125">
              <img
                src={data.image}
                alt="Post media"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between mt-3 text-gray-500 max-w-100">
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
              className={`group flex items-center gap-2 transition-colors ${
                isLiked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-600/10 relative">
                <Heart
                  size={18}
                  fill={isLiked ? 'currentColor' : 'none'}
                  className={`transition-transform duration-200 ${
                    isLiked ? 'scale-110' : 'scale-100'
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