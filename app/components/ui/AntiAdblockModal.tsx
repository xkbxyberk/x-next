'use client';

import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAdblockDetector } from '@/lib/hooks/use-adblock-detector';

export default function AntiAdblockModal() {
  const isAdblockDetected = useAdblockDetector();

  useEffect(() => {
    document.body.style.overflow = isAdblockDetected ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdblockDetected]);

  if (!isAdblockDetected) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-(--background)/85 backdrop-blur-xl">
      <div className="mx-4 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-(--border) bg-(--background-secondary) p-8 shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <ShieldAlert size={32} className="text-red-500" />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-bold text-(--text-primary)">
            Adblocker Detected
          </h2>
          <p className="text-sm leading-6 text-(--text-secondary)">
            XDownloaderz is a free service that relies on being accessible to all users. Please disable your adblocker and refresh the page to continue.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-full bg-(--accent) py-3 font-bold text-white transition-colors hover:bg-(--accent-hover)"
        >
          I've Disabled It — Retry
        </button>
      </div>
    </div>
  );
}
