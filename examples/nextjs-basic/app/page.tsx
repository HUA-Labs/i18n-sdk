import { ssrTranslate } from 'hua-i18n-sdk';
import { translations } from '@/lib/i18n-config';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TranslationDemo from '@/components/TranslationDemo';

// SSR에서 번역 사용 예제
export default function HomePage() {
  const title = ssrTranslate({
    translations: translations.ko.demo(),
    key: 'demo.title',
    language: 'ko',
  });

  const description = ssrTranslate({
    translations: translations.ko.demo(),
    key: 'demo.description',
    language: 'ko',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </header>

        {/* 언어 전환기 */}
        <div className="flex justify-center mb-8">
          <LanguageSwitcher />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="max-w-4xl mx-auto">
          <TranslationDemo />
        </main>

        {/* 푸터 */}
        <footer className="text-center mt-16 text-gray-500">
          <p>hua-i18n-sdk Demo - Next.js Integration Example</p>
        </footer>
      </div>
    </div>
  );
}
