import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getDictionary, locales } from '@/app/get-dictionary';
import { renderRichText } from '@/lib/utils/rich-text';

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");
  const slug = '/terms';
  return {
    title: dict.terms.title,
    description: dict.common.description,
    alternates: {
      canonical: `/${lang}${slug}`,
      languages: {
        ...locales.reduce((acc, l) => { acc[l] = `/${l}${slug}`; return acc; }, {} as Record<string, string>),
        'x-default': `/en${slug}`,
      },
    },
  };
}

interface ListSection {
  title: string;
  subcontent: string;
  list: string[];
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");
  const t = dict.terms;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href={`/${lang}`} className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">{t.title}</h1>
          <p className="text-xs text-(--text-secondary)">{t.lastUpdated}</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto w-full text-(--text-primary)">

        {/* Sections 1-2 */}
        {t.sections.slice(0, 2).map((section: any, i: number) => (
          <section key={i} className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{section.title}</h2>
            <p className="text-[15px] leading-relaxed text-(--text-secondary)">{renderRichText(section.content)}</p>
          </section>
        ))}

        {/* Section 3 (IP - Custom Structure) */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{t.ip.title}</h2>
          <div className="space-y-4">
            {t.ip.items.map((item: any, i: number) => (
              <div key={i}>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-[15px] text-(--text-secondary)">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 (Prohibited - List) */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{(t.sections[2] as ListSection).title}</h2>
          <p className="mb-2 text-[15px] text-(--text-secondary)">{(t.sections[2] as ListSection).subcontent}</p>
          <ul className="list-disc pl-5 space-y-1 text-[15px] text-(--text-secondary)">
            {(t.sections[2] as ListSection).list.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Sections 5-6 */}
        {t.sections.slice(3).map((section: any, i: number) => (
          <section key={i} className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b border-(--border) pb-2">{section.title}</h2>
            <p className="text-[15px] leading-relaxed text-(--text-secondary) mb-3">{renderRichText(section.content)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}