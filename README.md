# hua-i18n-sdk

> **React 애플리케이션을 위한 간단하고 강력한 국제화 SDK**
>
> **Korean & English** | **SSR/CSR Support** | **TypeScript Ready**

React 애플리케이션을 위한 간단하고 강력한 국제화 SDK입니다. hua-api의 번역 시스템에서 영감을 받았습니다.

## 핵심 기능

- **간단한 API**: `t('namespace.key')` 형태의 직관적인 번역 함수
- **SSR 지원**: 서버 컴포넌트에서 `ssrTranslate()` 사용으로 하이드레이션 이슈 해결
- **타입 안전성**: TypeScript로 번역 키 자동완성 지원
- **가벼운 번들**: ~15KB (gzipped)
- **다국어 지원**: 한국어, 영어 및 확장 가능

## 지원 환경

- **프레임워크**: Next.js (App Router), React, Vite, Webpack
- **언어**: TypeScript, JavaScript
- **런타임**: Node.js, 브라우저

## 설치

```bash
npm install hua-i18n-sdk
```

## 빠른 시작

### 1. 설정

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
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};
```

### 2. Provider 설정

```tsx
// app/layout.tsx
import { I18nProvider } from 'hua-i18n-sdk';

export default function RootLayout({ children }) {
  return (
    <I18nProvider config={i18nConfig}>
      {children}
    </I18nProvider>
  );
}
```

### 3. 번역 사용

```tsx
// 클라이언트 컴포넌트
const { t } = useTranslation();
return <h1>{t('common.welcome')}</h1>;

// 서버 컴포넌트 (SSR)
const title = ssrTranslate({ translations, key: 'common.welcome', language: 'ko' });
return <h1>{title}</h1>;
```

## 문서 & 예제

- **[API Reference](./docs/API_REFERENCE.md)** - 완전한 API 문서 (한국어/영어)
- **[Live Demo](./examples/nextjs-basic/)** - Next.js 통합 예제
- **[Changelog](./CHANGELOG.md)** - 버전 변경사항

## 주요 차별점

- **hua-api 스타일**: 기존 hua-api 사용자에게 친숙한 API
- **완벽한 SSR 지원**: Next.js App Router와 완벽 호환
- **타입 안전성**: TypeScript 자동완성으로 개발 경험 향상
- **실제 검증**: sum-diary 프로젝트에서 안정성 입증

## 관련 링크

- **[NPM Package](https://www.npmjs.com/package/hua-i18n-sdk)**
- **[GitHub Repository](https://github.com/HUA-Labs/i18n-sdk)**

## 기여하기

버그 리포트, 기능 제안, PR 모두 환영합니다!

- **[Issues](https://github.com/HUA-Labs/i18n-sdk/issues)**
- **[Discussions](https://github.com/HUA-Labs/i18n-sdk/discussions)**

---

> **자세한 사용법과 고급 기능은 [API Reference](./docs/API_REFERENCE.md)를 참조하세요!**
