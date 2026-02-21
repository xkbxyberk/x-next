'use client';

import { RefreshCw, Trash2, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

interface PostProps {
  data: {
    id: string;
    author: { name: string; handle: string; avatar: string; avatarDark?: string };
    content: string;
    image?: string;
    imageAlt?: string;
    timestamp: string;
  };
  priority?: boolean;
  dict?: any;
  isHistoryItem?: boolean;
  qualityBadge?: string;
  onReDownload?: () => void;
  onDelete?: () => void;
}

export default function PostCard({
  data,
  priority = false,
  dict,
  isHistoryItem = false,
  qualityBadge,
  onReDownload,
  onDelete
}: PostProps) {
  const formatContent = (text: string) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    <article
      id={data.id}
      className="border-b border-(--border) p-4 hover:bg-(--background-secondary) cursor-pointer scroll-mt-20 flex gap-4"
    >
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
          {formatContent(data.content)}
        </p>

        {data.image && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-(--border) w-full relative">
            <Image
              src={data.image}
              alt={data.imageAlt || "Post media"}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 600px"
              style={{ width: '100%', height: 'auto' }}
              priority={priority}
            />
            {isHistoryItem && qualityBadge && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 shadow-lg">
                <BadgeCheck size={14} className="text-(--accent)" />
                {qualityBadge}
              </div>
            )}
          </div>
        )}

        {isHistoryItem && (
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReDownload?.();
              }}
              className="flex-1 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              <RefreshCw size={18} />
              <span>{dict?.history?.reDownload || 'Re-download'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              title={dict?.common?.delete || 'Delete'}
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
