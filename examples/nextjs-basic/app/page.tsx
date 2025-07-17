'use client';

import { useTranslation } from 'hua-i18n-sdk';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TranslationDemo from '@/components/TranslationDemo';

// 클라이언트에서 번역 사용 예제
// 
// SSR 사용 예제 (참고용):
// ```
// import { ssrTranslate } from 'hua-i18n-sdk';
// 
// export default function ServerComponent() {
//   const title = ssrTranslate({
//     translations: translations.ko.demo(),
//     key: 'demo.title',
//     language: 'ko',
//   });
//   return <h1>{title}</h1>;
// }
// ```
export default function HomePage() {
  const { t } = useTranslation();

  const title = t('demo.title');
  const description = t('demo.description');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 language-transition">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto language-transition">
            {description}
          </p>
        </header>

        {/* 언어 전환기 */}
        <div className="flex justify-center mb-8 animate-slide-in">
          <LanguageSwitcher />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="max-w-4xl mx-auto animate-fade-in">
          <TranslationDemo />
        </main>

        {/* 푸터 */}
        <footer className="text-center mt-16 text-gray-500 animate-fade-in">
          <p>hua-i18n-sdk Demo - Next.js Integration Example</p>
        </footer>
      </div>
    </div>
  );
}
