import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'demo'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => `[MISSING: ${key}]`,
  errorHandler: (error: any, language: string, namespace: string) => {
    console.error(`Translation error for ${language}:${namespace}:`, error);
  },
};

// 번역 파일들을 미리 로드하여 타입 안전성 제공
export const translations = {
  ko: {
    common: () => import('../translations/ko/common.json'),
    demo: () => import('../translations/ko/demo.json'),
  },
  en: {
    common: () => import('../translations/en/common.json'),
    demo: () => import('../translations/en/demo.json'),
  },
} as const; 