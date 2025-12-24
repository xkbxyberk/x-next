import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">Kullanım Koşulları</h1>
          <p className="text-xs text-(--text-secondary)">Son Güncelleme: 01/12/2025</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto w-full text-(--text-primary)">
        
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">1. Şartların Kabulü</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            XDownloaderz web sitesine erişerek ve kullanarak, bu anlaşmanın şartlarını ve hükümlerini kabul etmiş sayılırsınız. Eğer bu şartları kabul etmiyorsanız, lütfen hizmeti kullanmayınız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">2. Bağlılık Reddi (Disclaimer)</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            XDownloaderz; X Corp. (eski adıyla Twitter), yan kuruluşları veya iştirakleri ile <strong>HİÇBİR ŞEKİLDE</strong> bağlantılı değildir, bu kurumlar tarafından yetkilendirilmemiştir veya desteklenmemektedir. Resmi X web sitesine twitter.com veya x.com adreslerinden ulaşılabilir. "X", "Twitter" isimleri ve ilgili markalar, amblemler ve görseller ilgili hak sahiplerinin tescilli ticari markalarıdır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">3. Fikri Mülkiyet ve Telif Hakkı</h2>
          <div className="space-y-4">
             <div>
                <h3 className="font-bold text-sm">Kullanıcı Sorumluluğu</h3>
                <p className="text-[15px] text-(--text-secondary)">XDownloaderz'ın sadece halka açık medyaları indirmeyi sağlayan teknik bir araç olduğunu kabul edersiniz. Hizmetimiz aracılığıyla indirilen hiçbir içeriğin mülkiyetini talep etmeyiz.</p>
             </div>
             <div>
                <h3 className="font-bold text-sm">Telif Hakkı Uyumluluğu</h3>
                <p className="text-[15px] text-(--text-secondary)">Bu hizmeti yalnızca indirme hakkına sahip olduğunuz içerikler için veya kişisel kullanım (Adil Kullanım) amacıyla kullanmayı kabul edersiniz. Bu aracı başkalarının telif haklarını ihlal etmek için kullanamazsınız.</p>
             </div>
             <div>
                <h3 className="font-bold text-sm">İçerik Hakları</h3>
                <p className="text-[15px] text-(--text-secondary)">Videolar, görseller ve seslerle ilgili tüm fikri mülkiyet hakları, içerik oluşturucularına ve barındırma platformuna aittir.</p>
             </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">4. Yasaklanmış Faaliyetler</h2>
          <p className="mb-2 text-[15px] text-(--text-secondary)">Hizmeti aşağıdaki amaçlarla kullanmamayı kabul edersiniz:</p>
          <ul className="list-disc pl-5 space-y-1 text-[15px] text-(--text-secondary)">
            <li>Telif hakkıyla korunan materyalleri izinsiz dağıtmak veya ticari kazanç sağlamak.</li>
            <li>Virüs veya kötü amaçlı kod yüklemek veya iletmek.</li>
            <li>Sunucularımızı aşırı yüklemeye, spam yapmaya veya kilitlemeye çalışmak.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">5. "Olduğu Gibi" ve Sorumluluk Sınırlaması</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary) mb-3">
            Hizmet, "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU ŞEKİLDE" sağlanmaktadır. Hizmetin kesintisiz, hatasız veya tamamen güvenli olacağını garanti etmeyiz.
          </p>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            XDownloaderz, hizmetin kullanımı veya kullanılamaması sonucunda ortaya çıkan veri kaybı veya telif hakkı anlaşmazlıkları dahil ancak bunlarla sınırlı olmamak üzere, doğrudan veya dolaylı hiçbir zarardan sorumlu tutulamaz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">6. Şartlarda Değişiklik</h2>
          <p className="text-[15px] text-(--text-secondary)">
            Bu şartları dilediğimiz zaman değiştirme hakkımız saklıdır. Yapılan değişikliklerden sonra web sitesini kullanmaya devam etmeniz, yeni Hizmet Şartlarını kabul ettiğiniz anlamına gelir.
          </p>
        </section>
      </div>
    </div>
  );
}