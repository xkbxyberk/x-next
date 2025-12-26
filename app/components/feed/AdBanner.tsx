'use client';

type AdBannerProps = {
  dict: any;
};

export default function AdBanner({ dict }: AdBannerProps) {
  return (
    <div className="border-b border-(--border) p-4 bg-(--background-secondary)/30">
      <div className="w-full h-32 bg-(--background-secondary) rounded-xl border border-(--border) flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-(--border)/50 transition-colors">
        <span className="text-(--text-secondary) text-[10px] font-bold tracking-widest absolute top-2 right-2">{dict.feed.ad.sponsored}</span>
        <div className="flex flex-col items-center gap-2">
          <span className="text-(--text-secondary) text-sm font-bold tracking-widest">{dict.feed.ad.label}</span>
          <span className="text-(--text-secondary) text-[10px]">{dict.feed.ad.provider}</span>
        </div>
      </div>
    </div>
  );
}
