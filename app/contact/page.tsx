import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">İletişim</h1>
          <p className="text-xs text-(--text-secondary)">Bize Ulaşın</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 mt-10 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-(--background-secondary) rounded-full flex items-center justify-center mb-6">
            <Mail size={40} className="text-(--text-secondary)" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-(--text-primary)">Görüşlerinizi Önemsiyoruz</h2>
        <p className="text-(--text-secondary) mb-8">
            Hatalı bir indirme işlemi bildirmek, telif hakkı ihlali iletmek veya sadece merhaba demek için bize e-posta gönderebilirsiniz.
        </p>

        <a 
            href="mailto:support@xdownloaderz.com" 
            className="flex items-center gap-3 px-8 py-4 bg-(--text-primary) text-(--background) rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
        >
            <Mail size={20} />
            E-Posta Gönder
        </a>

        <p className="mt-8 text-sm text-(--text-secondary)">
            Veya <Link href="/about" className="text-(--accent) hover:underline">Hakkımızda</Link> sayfasını ziyaret ederek projemiz hakkında daha fazla bilgi alabilirsiniz.
        </p>
      </div>
    </div>
  );
}