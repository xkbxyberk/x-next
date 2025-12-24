import Link from 'next/link';
import { ArrowLeft, Zap, ShieldCheck, Download } from 'lucide-react';
import { getDictionary } from '@/app/get-dictionary';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");
  const a = dict.about;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border) px-4 py-3 flex items-center gap-6">
        <Link href={`/${lang}`} className="p-2 -ml-2 rounded-full hover:bg-(--background-secondary) transition-colors text-(--text-primary)">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight text-(--text-primary)">{a.title}</h1>
          <p className="text-xs text-(--text-secondary)">{a.handle}</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto w-full">

        {/* Banner veya Logo Alanı */}
        <div className="w-full h-32 bg-linear-to-r from-blue-500 to-cyan-400 rounded-2xl mb-6 flex items-center justify-center">
          <h1 className="text-3xl font-black text-white tracking-tighter">{a.logoTitle}</h1>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3 text-(--text-primary)">{a.whatWeDo.title}</h2>
          <p className="text-[15px] leading-relaxed text-(--text-secondary) mb-4">
            {a.whatWeDo.p1}
          </p>
          <p className="text-[15px] leading-relaxed text-(--text-secondary)" dangerouslySetInnerHTML={{ __html: a.whatWeDo.p2 }} />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-(--text-primary)">{a.howItWorks.title}</h2>
          <div className="grid gap-4">
            <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
              <div className="bg-blue-500/10 p-3 rounded-full h-fit text-blue-500"><Download size={24} /></div>
              <div>
                <h3 className="font-bold text-(--text-primary)">{a.howItWorks.step1.title}</h3>
                <p className="text-sm text-(--text-secondary)">{a.howItWorks.step1.desc}</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
              <div className="bg-purple-500/10 p-3 rounded-full h-fit text-purple-500"><Zap size={24} /></div>
              <div>
                <h3 className="font-bold text-(--text-primary)">{a.howItWorks.step2.title}</h3>
                <p className="text-sm text-(--text-secondary)">{a.howItWorks.step2.desc}</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 border border-(--border) rounded-xl bg-(--background-secondary)/30">
              <div className="bg-green-500/10 p-3 rounded-full h-fit text-green-500"><ShieldCheck size={24} /></div>
              <div>
                <h3 className="font-bold text-(--text-primary)">{a.howItWorks.step3.title}</h3>
                <p className="text-sm text-(--text-secondary)">{a.howItWorks.step3.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-(--text-primary)">{a.whyUs.title}</h2>
          <ul className="space-y-3">
            {a.whyUs.items.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) mt-2 shrink-0" />
                <p className="text-[15px] text-(--text-secondary)"><strong className="text-(--text-primary)">{item.title}</strong> {item.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}