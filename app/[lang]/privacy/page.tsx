import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary } from '@/app/get-dictionary';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");
  const p = dict.privacy;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href={`/${lang}`} className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">{p.title}</h1>
          <p className="text-xs text-(--text-secondary)">{p.lastUpdated}</p>
        </div>
      </div>

      {/* İçerik */}
      <div className="px-4 py-6 max-w-2xl mx-auto w-full text-(--text-primary)">

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.intro.title}</h2>
          <p className="mb-4 text-[15px] leading-relaxed text-(--text-secondary)">
            {p.intro.p1}
          </p>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)">
            {p.intro.p2}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.collection.title}</h2>

          <div className="mb-4">
            <h3 className="font-bold mb-2">{p.collection.personal.title}</h3>
            <p className="mb-2 text-[15px] text-(--text-secondary)" dangerouslySetInnerHTML={{ __html: p.collection.personal.desc }} />
            <ul className="list-disc pl-5 space-y-1 text-[15px] text-(--text-secondary)">
              {p.collection.personal.list.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-[15px] text-(--text-secondary)">{p.collection.personal.note}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">{p.collection.usage.title}</h3>
            <p className="text-[15px] leading-relaxed text-(--text-secondary)">
              {p.collection.usage.desc}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">{p.collection.urls.title}</h3>
            <p className="text-[15px] leading-relaxed text-(--text-secondary)">
              {p.collection.urls.desc}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.cookies.title}</h2>
          <div className="mb-4">
            <h3 className="font-bold mb-2">{p.cookies.local.title}</h3>
            <p className="text-[15px] text-(--text-secondary)">
              {p.cookies.local.desc}
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">{p.cookies.analytics.title}</h3>
            <p className="text-[15px] text-(--text-secondary)">
              {p.cookies.analytics.desc}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.thirdParty.title}</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)" dangerouslySetInnerHTML={{ __html: p.thirdParty.desc }} />
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.gdpr.title}</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)" dangerouslySetInnerHTML={{ __html: p.gdpr.desc }} />
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{p.contact.title}</h2>
          <p className="text-[15px] text-(--text-secondary)">
            {p.contact.desc} <Link href={`/${lang}/contact`} className="text-(--accent) hover:underline">{p.contact.link}</Link> {p.contact.suffix}
          </p>
        </section>
      </div>
    </div>
  );
}