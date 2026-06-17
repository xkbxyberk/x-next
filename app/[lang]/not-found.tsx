import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

// not-found.tsx params almaz; bu yüzden dil-nötr/İngilizce tutuyoruz.
// Ana sayfa linki "/" -> proxy.ts kullanıcının diline göre /{locale}'e yönlendirir.
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">404</h1>
          <p className="text-xs text-(--text-secondary)">Page not found</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-5xl font-black tracking-tighter text-(--text-primary)">404</p>
        <h2 className="mt-4 text-xl font-bold text-(--text-primary)">
          This page doesn&apos;t exist
        </h2>
        <p className="mt-2 max-w-sm text-[15px] text-(--text-secondary)">
          The page you are looking for may have been moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Home size={18} />
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
