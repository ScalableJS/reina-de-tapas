import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Page as PageType } from '@/payload-types';

// Асинхронный компонент страницы для App Router Next.js (Next 15)
export default async function Page() {

  const headersList = await headers()
  const headerLocale = headersList.get('accept-language');
  // Простейший выбор: берем первый язык из списка и отсекаем регион (например, ru-RU -> ru)
  const locale = headerLocale ? headerLocale.split(',')[0].split('-')[0] : 'en';

  // Формируем запрос к Payload API для получения документа с пустым slug (т.е. главной страницы)
  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/pages?where[slug][equals]=&locale=${locale}&depth=2`;

  const res = await fetch(url, { next: { revalidate: 10 } });
  const data = await res.json();


  if (!data.docs || data.docs.length === 0) {
    notFound();
  }

  const page: PageType = data.docs[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header с насыщенным цветом, подходящим для фуршетной тематики */}
      <header className="bg-rose-900 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold">{page.title}</h1>
          <p className="text-sm opacity-75">{locale.toUpperCase()} version</p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto p-6">
        <article className="prose prose-lg max-w-none">
          {/* Поле content предполагается как HTML-код (richText), сохранённый в CMS */}
          {/*<div dangerouslySetInnerHTML={{ __html: page.content || '' }} />*/}
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-rose-900 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Reina de Tapas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}