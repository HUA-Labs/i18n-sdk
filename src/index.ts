// Types
export * from './types';

// Core
export { Translator } from './core/translator';

// Hooks
export { 
  I18nProvider, 
  useI18n, 
  useTranslation, 
  useLanguageChange,
  usePreloadTranslations,
  useAutoLoadNamespace
} from './hooks/useI18n';

// Components
export { I18nDebugPage } from './components/I18nDebugPage';

// 기본 설정 헬퍼 함수들
export function createI18nConfig(config: {
  defaultLanguage: string;
  fallbackLanguage?: string;
  supportedLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
    tone?: 'formal' | 'informal' | 'emotional' | 'technical';
  }>;
  namespaces?: string[];
  loadTranslations: (language: string, namespace: string) => Promise<Record<string, any>>;
  debug?: boolean;
  missingKeyHandler?: (key: string, language: string, namespace: string) => string;
  errorHandler?: (error: Error, language: string, namespace: string) => void;
}) {
  return config;
}

// 간단한 설정 함수들
export function createSimpleConfig(options: {
  defaultLanguage: string;
  fallbackLanguage?: string;
  loadTranslations: (language: string, namespace: string) => Promise<Record<string, any>>;
  debug?: boolean;
}) {
  const supportedLanguages = [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  return createI18nConfig({
    defaultLanguage: options.defaultLanguage,
    fallbackLanguage: options.fallbackLanguage || 'en',
    supportedLanguages,
    namespaces: ['common'],
    loadTranslations: options.loadTranslations,
    debug: options.debug || false,
  });
}

// 파일 기반 번역 로더 (일반적인 사용 사례)
export function createFileLoader(basePath: string) {
  return async (language: string, namespace: string) => {
    try {
      // 동적 import를 사용하여 번역 파일 로드
      const module = await import(`${basePath}/${language}/${namespace}.json`);
      return module.default || module;
    } catch (error) {
      console.warn(`Failed to load translation file: ${basePath}/${language}/${namespace}.json`);
      return {};
    }
  };
}

// API 기반 번역 로더
export function createApiLoader(apiUrl: string, apiKey?: string) {
  return async (language: string, namespace: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${apiUrl}/translations/${language}/${namespace}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`Failed to load translations from API: ${apiUrl}/translations/${language}/${namespace}`);
      return {};
    }
  };
}

// 개발용 설정 (디버그 모드 활성화)
export function createDevConfig(config: any) {
  return {
    ...config,
    debug: true,
    missingKeyHandler: (key: string) => `[MISSING: ${key}]`,
    errorHandler: (error: Error, language: string, namespace: string) => {
      console.error(`Translation error for ${language}:${namespace}:`, error);
    },
  };
} 