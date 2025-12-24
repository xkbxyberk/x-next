import Link from 'next/link';
import { ArrowLeft, Zap, ShieldCheck, Download } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">Hakkımızda</h1>
          <p className="text-xs text-(--text-secondary)">@xdownloaderz</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto w-full">
        
        {/* Banner veya Logo Alanı */}
        <div className="w-full h-32 bg-linear-to-r from-blue-500 to-cyan-400 rounded-2xl mb-6 flex items-center justify-center">
            <h1 className="text-3xl font-black text-white tracking-tighter">XDownloaderz</h1>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3 text-(--text-primary)">Ne Yapıyoruz?</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary) mb-4">
            XDownloaderz, sosyal medya akışları ile kişisel cihazlarınız arasındaki boşluğu doldurmak için tasarlanmış, güçlü ve ücretsiz bir web aracıdır. X (eski adıyla Twitter) üzerindeki videoları ve medyaları doğrudan bilgisayarınıza, tabletinize veya akıllı telefonunuza indirmeniz için sorunsuz bir yol sunuyoruz.
          </p>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            Yazılım kurulumu veya üyelik gerektiren diğer hizmetlerin aksine, aracımız gelişmiş web teknolojilerini kullanarak tamamen tarayıcınızda çalışır. <strong>1080p Full HD</strong> kalitesine kadar mevcut en yüksek çözünürlüğü bulur ve medya formatlarını anında dönüştürme seçenekleri sunar.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-(--text-primary)">Nasıl Çalışır?</h2>
          <div className="grid gap-4">
             <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
                <div className="bg-blue-500/10 p-3 rounded-full h-fit text-blue-500"><Download size={24} /></div>
                <div>
                    <h3 className="font-bold text-(--text-primary)">1. Yapıştır</h3>
                    <p className="text-sm text-(--text-secondary)">İndirmek istediğiniz videoyu içeren X (Twitter) gönderisinin bağlantısını kopyalayın ve arama kutumuza yapıştırın.</p>
                </div>
             </div>
             <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
                <div className="bg-purple-500/10 p-3 rounded-full h-fit text-purple-500"><Zap size={24} /></div>
                <div>
                    <h3 className="font-bold text-(--text-primary)">2. Çözümle</h3>
                    <p className="text-sm text-(--text-secondary)">Akıllı motorumuz, video dosyasını ve mevcut kalite seçeneklerini (örn. 720p, 1080p) bulmak için platformun halka açık altyapısıyla iletişim kurar.</p>
                </div>
             </div>
             <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
                <div className="bg-green-500/10 p-3 rounded-full h-fit text-green-500"><ShieldCheck size={24} /></div>
                <div>
                    <h3 className="font-bold text-(--text-primary)">3. İndir</h3>
                    <p className="text-sm text-(--text-secondary)">Tercih ettiğiniz kaliteyi seçersiniz ve dosya, sunucularımızda depolanmadan doğrudan cihazınıza kaydedilir.</p>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-(--text-primary)">Neden Biz?</h2>
          <ul className="space-y-3">
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) mt-2 shrink-0" />
                <p className="text-[15px] text-(--text-secondary)"><strong className="text-(--text-primary)">Üyelik Gerekmez:</strong> Zamanınıza ve gizliliğinize saygı duyuyoruz. Özelliklerimizi kullanmak için hesap oluşturmanıza veya e-posta adresi vermenize gerek yoktur.</p>
             </li>
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) mt-2 shrink-0" />
                <p className="text-[15px] text-(--text-secondary)"><strong className="text-(--text-primary)">Yüksek Kalite:</strong> Her video için mevcut olan en yüksek bit hızını (kaliteyi) bulmaya öncelik veriyoruz.</p>
             </li>
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) mt-2 shrink-0" />
                <p className="text-[15px] text-(--text-secondary)"><strong className="text-(--text-primary)">İstemci Taraflı İşleme:</strong> Videoları verimli bir şekilde işlemek için modern tarayıcı yeteneklerini (FFmpeg teknolojisi dahil) kullanıyoruz; bu sayede güvenlikten ödün vermeden hızlı indirme sağlıyoruz.</p>
             </li>
             <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) mt-2 shrink-0" />
                <p className="text-[15px] text-(--text-secondary)"><strong className="text-(--text-primary)">%100 Ücretsiz:</strong> Aracımız herkes için tamamen ücretsizdir.</p>
             </li>
          </ul>
        </section>
      </div>
    </div>
  );
}