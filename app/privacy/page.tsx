import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">Gizlilik Politikası</h1>
          <p className="text-xs text-(--text-secondary)">Son Güncelleme: 01/12/2025</p>
        </div>
      </div>

      {/* İçerik */}
      <div className="px-4 py-6 max-w-2xl mx-auto w-full text-(--text-primary)">
        
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">Giriş</h2>
          <p className="mb-4 text-[15px] leading-relaxed text-(--text-secondary)">
            XDownloaderz ("biz", "bizim") olarak gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, X (eski adıyla Twitter) platformundan medya indirmenizi sağlayan web tabanlı aracımızı kullandığınızda bilgilerinizin nasıl ele alındığını açıklar.
          </p>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            Hizmetimizi kullanarak, bu politikayı okuduğunuzu ve anladığınızı kabul etmiş sayılırsınız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">Topladığımız Bilgiler</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">1. Kişisel Bilgiler</h3>
            <p className="mb-2 text-[15px] text-(--text-secondary)">Hizmetimiz <strong>kayıt tutmama (non-retention)</strong> esasına göre çalışır. Aşağıdakiler gibi hiçbir "Kişisel Tanımlanabilir Bilgiyi" (PII) toplamıyor, saklamıyor ve paylaşmıyoruz:</p>
            <ul className="list-disc pl-5 space-y-1 text-[15px] text-(--text-secondary)">
              <li>İsim veya E-posta adresleri.</li>
              <li>Telefon numaraları.</li>
              <li>Sosyal medya giriş şifreleri.</li>
            </ul>
            <p className="mt-2 text-[15px] text-(--text-secondary)">Hizmetimizi kullanmak için üye olmanız veya giriş yapmanız gerekmemektedir.</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">2. Kullanım Verileri ve Log Dosyaları</h3>
            <p className="text-[15px] leading-relaxed text-(--text-secondary)">
              Çoğu standart web sunucusu gibi, biz de log (günlük) dosyaları kullanırız. Bu dosyalar; internet protokolü (IP) adresleri, tarayıcı türü, İnternet Servis Sağlayıcısı (ISP), yönlendirme/çıkış sayfaları, platform türü, tarih/saat damgası ve tıklama sayıları gibi verileri içerebilir. Bu bilgiler, trendleri analiz etmek, siteyi yönetmek ve kullanıcı hareketlerini toplu halde izlemek için kullanılır. Bu veriler, kimliğinizi belirleyebilecek hiçbir bilgiyle eşleştirilmez.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">3. URL'ler ve Medya İçerikleri</h3>
            <p className="text-[15px] leading-relaxed text-(--text-secondary)">
              Arama çubuğumuza bir bağlantı (URL) yapıştırdığınızda, bu bağlantı sunucularımız tarafından yalnızca ilgili medya dosyasını bulmak amacıyla geçici olarak işlenir. Gönderdiğiniz linklerin kalıcı bir geçmişini tutmayız.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">Çerezler ve Yerel Depolama</h2>
          <div className="mb-4">
            <h3 className="font-bold mb-2">1. Zorunlu Yerel Depolama</h3>
            <p className="text-[15px] text-(--text-secondary)">
              Tarayıcınızın yerel depolama (Local Storage) özelliklerini, yalnızca arayüz tercihlerinizi (örneğin, Karanlık/Aydınlık mod seçimi) hatırlamak amacıyla kullanırız.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">2. Üçüncü Taraf Analitikleri</h3>
            <p className="text-[15px] text-(--text-secondary)">
              Şu anda Google Analytics gibi üçüncü taraf izleme kodları kullanmıyoruz. Ancak, web sitemizin performansını artırmak amacıyla gelecekte anonim analitik araçları ekleme hakkımızı saklı tutarız.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">Üçüncü Taraf Hizmetleri</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            Hizmetimiz, <strong>X (Twitter)</strong> üzerindeki halka açık verilere erişim sağlayarak çalışır. Bir video indirdiğinizde, üçüncü taraf sunucularında barındırılan içeriğe erişmiş olursunuz. Etkileşimde bulunduğunuz platformların gizlilik politikalarını incelemenizi öneririz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">KVKK ve GDPR Uyumluluğu</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            Kişisel veri toplamadığımız ve bireysel kullanıcıları takip etmediğimiz için, Kişisel Verilerin Korunması Kanunu (KVKK) ve Genel Veri Koruma Tüzüğü (GDPR) kapsamındaki "veri minimizasyonu" (veriyi en azda tutma) ilkelerine tam uyumluyuz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">İletişim</h2>
          <p className="text-[15px] text-(--text-secondary)">
            Bu Gizlilik Politikası hakkında sorularınız varsa, lütfen web sitemiz üzerinden veya <Link href="/contact" className="text-(--accent) hover:underline">iletişim sayfamızdan</Link> bizimle iletişime geçin.
          </p>
        </section>
      </div>
    </div>
  );
}