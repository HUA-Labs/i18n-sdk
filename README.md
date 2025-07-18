# hua-i18n-sdk

> **v1.2.0** - React 애플리케이션을 위한 간단하고 강력한 국제화 SDK

[![npm version](https://badge.fury.io/js/hua-i18n-sdk.svg)](https://badge.fury.io/js/hua-i18n-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/HUA-Labs/i18n-sdk?style=social)](https://github.com/HUA-Labs/i18n-sdk)

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

## 주요 특징

- **간단한 API**: 직관적이고 사용하기 쉬운 인터페이스
- **초보자 친화적**: `withDefaultConfig()`로 한 줄 설정
- **타입 안전성**: TypeScript로 완전한 타입 지원
- **SSR 지원**: Next.js 서버 컴포넌트와 완벽 호환
- **강력한 에러 처리**: 자동 재시도, 복구 전략, 사용자 친화적 메시지
- **가벼운 번들**: Tree-shaking 지원으로 최적화된 크기
- **실시간 언어 변경**: 동적 언어 전환 지원
- **개발자 친화적**: 디버그 모드, 누락 키 표시, 상세한 로깅

## 설치

```bash
npm install hua-i18n-sdk
# 또는
yarn add hua-i18n-sdk
# 또는
pnpm add hua-i18n-sdk
```

## 빠른 시작

### 🚀 초보자용 (추천) - Easy Entry Point

```tsx
// 초보자 전용 엔트리포인트 - 복잡한 설정 없이 바로 시작!
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk/easy';

// 한 줄로 끝! 기본 설정으로 시작
export const I18nProvider = withDefaultConfig();

function App() {
  return (
    <I18nProvider>
      <MyComponent />
    </I18nProvider>
  );
}

function MyComponent() {
  const { t, tWithParams } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{tWithParams('common.greeting', { name: '철수' })}</p>
    </div>
  );
}
```

### 🚀 초보자용 (추천) - 기본 엔트리포인트

```tsx
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk';

// 한 줄로 끝! 기본 설정으로 시작
export const I18nProvider = withDefaultConfig();

function App() {
  return (
    <I18nProvider>
      <MyComponent />
    </I18nProvider>
  );
}

function MyComponent() {
  const { t, tWithParams } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{tWithParams('common.greeting', { name: '철수' })}</p>
    </div>
  );
}
```

### ⚙️ 중급자용 (일부 커스터마이징)

```tsx
import { withDefaultConfig } from 'hua-i18n-sdk';

// 필요한 부분만 커스터마이징
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en',
  namespaces: ['common', 'auth'],
  debug: true,
});
```

### 🔧 고급자용 (완전 커스터마이징)

```tsx
import { I18nProvider, useTranslation, createI18nConfig } from 'hua-i18n-sdk';

const i18nConfig = createI18nConfig({
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'auth'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
  // v1.1.0: 에러 처리 강화
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: { enabled: true, level: 'error' },
    userFriendlyMessages: true
  }
});

function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyComponent />
    </I18nProvider>
  );
}
```

## 번역 파일 구조

```text
translations/
├── ko/
│   ├── common.json
│   └── auth.json
└── en/
    ├── common.json
    └── auth.json
```

### 번역 파일 예시

```json
// translations/ko/common.json
{
  "welcome": "환영합니다",
  "greeting": "안녕하세요, {{name}}님!",
  "buttons": {
    "save": "저장",
    "cancel": "취소"
  }
}
```

```json
// translations/en/common.json
{
  "welcome": "Welcome",
  "greeting": "Hello, {{name}}!",
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

## withDefaultConfig() 옵션

```tsx
export const I18nProvider = withDefaultConfig({
  // 기본 언어 (기본값: 'ko')
  defaultLanguage: 'en',
  
  // 폴백 언어 (기본값: 'en')
  fallbackLanguage: 'ko',
  
  // 네임스페이스 (기본값: ['common'])
  namespaces: ['common', 'auth', 'dashboard'],
  
  // 디버그 모드 (기본값: NODE_ENV === 'development')
  debug: true,
  
  // 자동 언어 전환 이벤트 처리 (기본값: true)
  // 이벤트 리스너 자동 등록: huaI18nLanguageChange, i18nLanguageChanged
  // 브라우저 언어 변경이나 외부 언어 전환 이벤트를 자동으로 감지
  autoLanguageSync: true,
});
```

### autoLanguageSync 옵션 상세 설명

`autoLanguageSync` 옵션은 언어 전환 이벤트를 자동으로 감지하고 처리합니다:

```tsx
// 자동으로 감지하는 이벤트들
window.addEventListener('huaI18nLanguageChange', (event) => {
  // SDK 내부 언어 변경 이벤트
  const newLanguage = event.detail;
});

window.addEventListener('i18nLanguageChanged', (event) => {
  // 일반적인 언어 변경 이벤트
  const newLanguage = event.detail;
});
```

**사용 예시:**

```tsx
// 다른 컴포넌트에서 언어 변경 시
const changeLanguage = (language) => {
  // 이벤트 발생 → withDefaultConfig()가 자동으로 감지
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
    detail: language 
  }));
};
```

## 고급 기능

### 언어 변경

```tsx
import { useLanguageChange } from 'hua-i18n-sdk';

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageChange();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {supportedLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
```

### 서버 컴포넌트 (SSR)

```tsx
import { ssrTranslate } from 'hua-i18n-sdk';

export default function ServerComponent() {
  const title = ssrTranslate({
    translations: translations.ko.common(),
    key: 'common.welcome',
    language: 'ko',
  });

  return <h1>{title}</h1>;
}
```

### 타입 안전한 번역

```tsx
interface MyTranslations {
  common: {
    welcome: string;
    greeting: string;
  };
  auth: {
    login: string;
    logout: string;
  };
}

const { t } = useI18n<MyTranslations>();

// 자동완성 지원
t('common.welcome'); // ✅ 타입 안전
t('common.invalid'); // ❌ 타입 에러
```

## 에러 처리 (v1.1.0)

### 자동 재시도 및 복구

```tsx
const config = {
  // ... 기본 설정
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code),
      onRetry: (error, attempt) => console.log(`재시도 ${attempt}회:`, error.message),
      onMaxRetriesExceeded: (error) => alert('번역 데이터를 불러올 수 없습니다')
    },
    logging: {
      enabled: true,
      level: 'error',
      includeStack: true,
      includeContext: true
    },
    userFriendlyMessages: true
  }
};
```

### 커스텀 에러 처리

```tsx
import { createTranslationError, logTranslationError } from 'hua-i18n-sdk';

try {
  // 번역 로딩
} catch (error) {
  const translationError = createTranslationError(
    'LOAD_FAILED',
    error.message,
    error,
    { language: 'ko', namespace: 'common' }
  );
  
  logTranslationError(translationError);
}
```

## 마이그레이션 (v1.0.x → v1.1.0)

**✅ 기존 코드는 변경 없이 동작합니다**

```tsx
// v1.0.x 코드 (그대로 동작)
const config: I18nConfig = {
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

// v1.1.0에서도 동일하게 동작
```

### 새로운 기능 활용 (선택사항)

```tsx
// v1.1.0: 에러 처리 강화 (선택적)
const config: I18nConfig = {
  // ... 기존 설정
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: { enabled: true, level: 'error' },
    userFriendlyMessages: true
  }
};
```

## 문서

- [SDK 레퍼런스](./docs/SDK_REFERENCE.md) - 완전한 API 문서
- [변경 로그](./docs/CHANGELOG.md) - 버전별 변경사항
- [환경 설정 가이드](./docs/ENVIRONMENT_GUIDES.md) - 다양한 환경 설정
- [환경별 예제](./docs/ENVIRONMENT_EXAMPLES.md) - 환경별 설정 예제
- [기여 가이드](./CONTRIBUTING.md) - 프로젝트 기여 방법

## 테스트

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 빌드

```bash
npm run build
```

## 기여하기

프로젝트에 기여하고 싶으시다면 [기여 가이드](./CONTRIBUTING.md)를 참고해주세요.

### 개발 환경 설정

```bash
git clone https://github.com/HUA-Labs/i18n-sdk.git
cd hua-i18n-sdk
npm install
npm run dev
```

## 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE) 하에 배포됩니다.

## 감사의 말

- [React](https://reactjs.org/) - 멋진 UI 라이브러리
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성
- [Next.js](https://nextjs.org/) - SSR 지원
- 모든 기여자분들께 감사드립니다!

---

> **Made with ❤️ by the hua-i18n-sdk team**
