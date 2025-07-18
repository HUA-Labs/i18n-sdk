# 환경별 번역 파일 Import 가이드

이 문서는 다양한 빌드 환경에서 hua-i18n-sdk를 사용할 때 번역 파일을 효율적으로 import하는 방법을 설명합니다.

## 📋 목차

- [Next.js](#nextjs)
- [Vite](#vite)
- [Webpack](#webpack)
- [Rollup](#rollup)
- [기타 환경](#기타-환경)

---

## Next.js

### App Router (권장)

```tsx
// app/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Next.js App Router에서 권장하는 방식
      const module = await import(`@/translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

### Pages Router

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Pages Router에서 사용하는 방식
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

### SSR 최적화

```tsx
// lib/translations.ts (SSR용 통합 번역)
import koCommon from '@/translations/ko/common.json';
import koDiary from '@/translations/ko/diary.json';
import enCommon from '@/translations/en/common.json';
import enDiary from '@/translations/en/diary.json';

export const translations = {
  ko: { common: koCommon, diary: koDiary },
  en: { common: enCommon, diary: enDiary },
};

// app/layout.tsx에서 사용
import { ssrTranslate } from 'hua-i18n-sdk';
import { translations } from '@/lib/translations';

const title = ssrTranslate({
  translations,
  key: 'common.siteTitle',
  language: 'ko',
});
```

---

## Vite

### 기본 설정

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Vite에서 권장하는 방식
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: import.meta.env.DEV,
  missingKeyHandler: (key: string) => key,
};
```

### import.meta.glob 사용 (고급)

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

// Vite의 import.meta.glob을 사용한 동적 로딩
const translationModules = import.meta.glob('../translations/*/*.json', { eager: true });

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      const key = `../translations/${language}/${namespace}.json`;
      const module = translationModules[key];
      return module?.default || module || {};
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: import.meta.env.DEV,
  missingKeyHandler: (key: string) => key,
};
```

---

## Webpack

### 기본 설정

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Webpack에서 권장하는 방식
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

### require.context 사용 (고급)

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

// Webpack의 require.context를 사용한 동적 로딩
const translationContext = require.context('../translations', true, /\.json$/);

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      const key = `./${language}/${namespace}.json`;
      if (translationContext.keys().includes(key)) {
        return translationContext(key);
      }
      return {};
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

---

## Rollup

### 기본 설정

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Rollup에서 권장하는 방식
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

### Rollup 플러그인 설정

```js
// rollup.config.js
import json from '@rollup/plugin-json';

export default {
  // ... 기타 설정
  plugins: [
    json({
      // JSON 파일을 ES 모듈로 변환
      compact: true,
      namedExports: true,
    }),
    // ... 기타 플러그인
  ],
};
```

---

## 기타 환경

### Parcel

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // Parcel은 자동으로 JSON을 처리
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

### ESBuild

```tsx
// lib/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    try {
      // ESBuild에서 권장하는 방식
      const module = await import(`../translations/${language}/${namespace}.json`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:${namespace}`, error);
      return {};
    }
  },
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (key: string) => key,
};
```

---

## 🔧 성능 최적화 팁

### 1. 번들 크기 최적화

```tsx
// 필요한 번역만 로드
const loadTranslations = async (language: string, namespace: string) => {
  // 프로덕션에서는 필요한 네임스페이스만 로드
  if (process.env.NODE_ENV === 'production') {
    const allowedNamespaces = ['common', 'diary']; // 필요한 것만
    if (!allowedNamespaces.includes(namespace)) {
      return {};
    }
  }
  
  try {
    const module = await import(`../translations/${language}/${namespace}.json`);
    return module.default;
  } catch (error) {
    return {};
  }
};
```

### 2. 캐싱 전략

```tsx
// 번역 캐싱
const translationCache = new Map();

const loadTranslations = async (language: string, namespace: string) => {
  const cacheKey = `${language}:${namespace}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    const module = await import(`../translations/${language}/${namespace}.json`);
    const translations = module.default;
    translationCache.set(cacheKey, translations);
    return translations;
  } catch (error) {
    return {};
  }
};
```

### 3. 지연 로딩

```tsx
// 사용자가 언어를 변경할 때만 로드
const loadLanguageTranslations = async (language: string) => {
  const namespaces = ['common', 'diary', 'admin'];
  const translations = {};
  
  for (const namespace of namespaces) {
    try {
      const module = await import(`../translations/${language}/${namespace}.json`);
      translations[namespace] = module.default;
    } catch (error) {
      translations[namespace] = {};
    }
  }
  
  return translations;
};
```

---

## 주의사항

1. **경로 설정**: 각 환경에 맞는 절대 경로 설정 필요
2. **타입 안전성**: TypeScript 사용 시 JSON 모듈 타입 선언 필요
3. **번들 크기**: 불필요한 번역 파일이 번들에 포함되지 않도록 주의
4. **캐싱**: 브라우저 캐싱과 번역 캐싱을 적절히 활용

---

## 추가 리소스

- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Vite Import Glob](https://vitejs.dev/guide/features.html#glob-import)
- [Webpack Dynamic Imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
- [Rollup JSON Plugin](https://github.com/rollup/plugins/tree/master/packages/json)
