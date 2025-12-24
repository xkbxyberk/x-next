import { getDictionary } from '@/app/get-dictionary';
import MainFeed from '@/app/components/feed/MainFeed';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "tr");

  return (
    <>
      <h1 className="hidden">{dict.common.title}</h1>
      <MainFeed dict={dict} />
    </>
  );
}