# hua-i18n-sdk SDK Reference

> **hua-i18n-sdk v1.2.0** - React 애플리케이션을 위한 간단하고 강력한 국제화 SDK

---

## 🇰🇷 한국어 | 🇺🇸 [English](#-english)

---

## 🇰🇷 한국어

### 📋 목차

1. [주요 API](#1-주요-api)
2. [초보자용 API (v1.2.0)](#2-초보자용-api-v120)
3. [설정 옵션](#3-설정-옵션)
4. [타입 정의](#4-타입-정의)
5. [사용 예제](#5-사용-예제)
6. [고급 사용법](#6-고급-사용법)
7. [에러 처리](#7-에러-처리-v110)
8. [폴백 시스템](#8-폴백-시스템)
9. [마이그레이션 가이드 (v1.0.x → v1.1.0)](#9-마이그레이션-가이드-v10x--v110)
10. [마이그레이션 가이드](#10-마이그레이션-가이드)

---

### 1. 주요 API

#### 핵심 함수/훅/컴포넌트

| API | 타입 | 설명 | 예시 |
|-----|------|------|------|
| `useTranslation()` | Hook | 번역을 위한 메인 훅 | `const { t } = useTranslation();` |
| `useLanguageChange()` | Hook | 언어 변경을 위한 훅 | `const { changeLanguage } = useLanguageChange();` |
| `I18nProvider` | Component | i18n 컨텍스트 제공자 | `<I18nProvider config={config}>` |
| `ssrTranslate()` | Function | 서버 컴포넌트용 번역 함수 | `ssrTranslate({ translations, key, language })` |
| `Translator` | Class | 번역 처리 클래스 | `new Translator(config)` |

#### 헬퍼 함수들

| 함수 | 설명 | 예시 |
|------|------|------|
| `createI18nConfig()` | 기본 설정 생성 | `createI18nConfig({ ... })` |
| `createSimpleConfig()` | 간단한 설정 생성 | `createSimpleConfig({ defaultLanguage: 'ko' })` |
| `createFileLoader()` | 파일 기반 로더 생성 | `createFileLoader('./translations')` |
| `createApiLoader()` | API 기반 로더 생성 | `createApiLoader('https://api.example.com')` |
| `createDevConfig()` | 개발용 설정 생성 | `createDevConfig(config)` |

#### 에러 처리 유틸리티 (v1.1.0)

| 함수 | 설명 | 예시 |
|------|------|------|
| `createTranslationError()` | 구조화된 에러 생성 | `createTranslationError('LOAD_FAILED', error)` |
| `isRecoverableError()` | 재시도 가능한 에러 확인 | `isRecoverableError(error)` |
| `logTranslationError()` | 에러 로깅 | `logTranslationError(error, config)` |
| `createUserFriendlyError()` | 사용자 친화적 에러 메시지 | `createUserFriendlyError(error)` |

---

### 2. 초보자용 API (v1.2.0)

#### 🚀 withDefaultConfig() - 한 줄 설정

초보자를 위한 **한 줄 설정** API입니다. 복잡한 설정 없이 바로 시작할 수 있습니다.

| API | 타입 | 설명 | 예시 |
|-----|------|------|------|
| `withDefaultConfig()` | Function | 초보자용 한 줄 설정 | `export const I18nProvider = withDefaultConfig();` |
| `withDefaultConfig(options)` | Function | 커스터마이징 가능한 설정 | `withDefaultConfig({ defaultLanguage: 'en' })` |

#### 🎯 기본 설정값

`withDefaultConfig()`는 다음과 같은 기본값으로 설정됩니다:

```tsx
{
  defaultLanguage: 'ko',           // 기본 언어: 한국어
  fallbackLanguage: 'en',          // 폴백 언어: 영어
  namespaces: ['common'],          // 기본 네임스페이스
  debug: NODE_ENV === 'development', // 개발 모드에서만 디버그
  autoLanguageSync: true,          // 자동 언어 전환 감지
  loadTranslations: createFileLoader('./translations') // 기본 파일 로더
}
```

#### 🚀 Easy Entry Point - 초보자 전용

```tsx
// 초보자 전용 엔트리포인트 - 가장 간단한 방법
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk/easy';

// 한 줄로 끝! 복잡한 설정 없이 바로 시작
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

#### 🚀 기본 엔트리포인트 - 초보자용

```tsx
// 기본 엔트리포인트에서도 사용 가능
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk';

// 한 줄로 끝! 복잡한 설정 없이 바로 시작
export const I18nProvider = withDefaultConfig();

function App() {
  return (
    <I18nProvider>
      <MyComponent />
    </I18nProvider>
  );
}
```

#### ⚙️ withDefaultConfig() 옵션

필요한 부분만 커스터마이징할 수 있습니다:

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `defaultLanguage` | string | `'ko'` | 기본 언어 |
| `fallbackLanguage` | string | `'en'` | 폴백 언어 |
| `namespaces` | string[] | `['common']` | 네임스페이스 목록 |
| `debug` | boolean | `NODE_ENV === 'development'` | 디버그 모드 |
| `autoLanguageSync` | boolean | `true` | 자동 언어 전환 이벤트 감지 |

#### 📝 사용 예시

```tsx
// 1. 완전 기본 설정 (가장 간단)
export const I18nProvider = withDefaultConfig();

// 2. 언어만 변경
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en'
});

// 3. 여러 네임스페이스 추가
export const I18nProvider = withDefaultConfig({
  namespaces: ['common', 'auth', 'dashboard']
});

// 4. 디버그 모드 활성화
export const I18nProvider = withDefaultConfig({
  debug: true
});

// 5. 자동 언어 전환 비활성화
export const I18nProvider = withDefaultConfig({
  autoLanguageSync: false
});
```

#### Auto Language Sync

`autoLanguageSync` 옵션은 언어 전환 이벤트를 자동으로 감지합니다:

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

// 사용 예시
const changeLanguage = (language) => {
  // 이벤트 발생 → withDefaultConfig()가 자동으로 감지
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
    detail: language 
  }));
};
```

---

### 3. 설정 옵션

#### I18nConfig 인터페이스

| 옵션 | 타입 | 필수 | 설명 | 기본값 |
|------|------|------|------|--------|
| `defaultLanguage` | string | ✅ | 기본 언어 코드 | - |
| `fallbackLanguage` | string | ❌ | 대체 언어 코드 | `'en'` |
| `supportedLanguages` | LanguageConfig[] | ✅ | 지원 언어 목록 | - |
| `namespaces` | string[] | ❌ | 네임스페이스 목록 | `['common']` |
| `loadTranslations` | Function | ✅ | 번역 로딩 함수 | - |
| `debug` | boolean | ❌ | 디버그 모드 | `false` |
| `missingKeyHandler` | Function | ❌ | 누락 키 처리 함수 | `(key) => key` |
| `errorHandler` | Function | ❌ | 에러 처리 함수 | `console.error` |
| `cacheOptions` | CacheOptions | ❌ | 캐시 설정 | - |
| `performanceOptions` | PerformanceOptions | ❌ | 성능 설정 | - |
| `errorHandling` | ErrorHandlingOptions | ❌ | 에러 처리 설정 (v1.1.0) | - |

#### 새로운 설정 옵션 (v1.1.0)

##### CacheOptions

```typescript
interface CacheOptions {
  maxSize?: number;    // 최대 캐시 크기
  ttl?: number;        // Time to live (밀리초)
}
```

##### PerformanceOptions

```typescript
interface PerformanceOptions {
  preloadAll?: boolean;  // 모든 번역 미리 로드
  lazyLoad?: boolean;    // 지연 로딩
}
```

##### ErrorHandlingOptions

```typescript
interface ErrorHandlingOptions {
  recoveryStrategy?: ErrorRecoveryStrategy;  // 에러 복구 전략
  logging?: ErrorLoggingConfig;              // 에러 로깅 설정
  userFriendlyMessages?: boolean;            // 사용자 친화적 메시지
  suppressErrors?: boolean;                  // 에러 억제
}
```

#### LanguageConfig 인터페이스

| 속성 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `code` | string | ✅ | 언어 코드 | `'ko'` |
| `name` | string | ✅ | 언어 이름 (영어) | `'Korean'` |
| `nativeName` | string | ✅ | 원어 이름 | `'한국어'` |
| `tone` | string | ❌ | 톤 설정 | `'emotional'` |
| `formality` | string | ❌ | 격식 수준 | `'polite'` |

---

### 4. 타입 정의

#### 주요 타입들

| 타입명 | 설명 | 예시 |
|--------|------|------|
| `TranslationNamespace` | 네임스페이스 번역 객체 | `{ welcome: '환영합니다' }` |
| `TranslationData` | 전체 번역 데이터 | `{ common: {...}, auth: {...} }` |
| `TranslationParams` | 번역 파라미터 | `{ name: '철수', count: 5 }` |
| `TranslationKey<T>` | 타입 안전한 번역 키 | `'common.welcome'` |
| `I18nContextType` | i18n 컨텍스트 타입 | - |
| `TypedI18nContextType<T>` | 타입 안전한 컨텍스트 | - |

#### 새로운 타입들 (v1.1.0)

| 타입명 | 설명 | 예시 |
|--------|------|------|
| `TranslationError` | 구조화된 에러 타입 | `{ code: 'LOAD_FAILED', language: 'ko' }` |
| `ErrorRecoveryStrategy` | 에러 복구 전략 | `{ maxRetries: 3, retryDelay: 1000 }` |
| `ErrorLoggingConfig` | 에러 로깅 설정 | `{ enabled: true, level: 'error' }` |
| `UserFriendlyError` | 사용자 친화적 에러 | `{ message: '번역 파일을 불러오는데 실패했습니다' }` |
| `CacheEntry` | 캐시 엔트리 | `{ data: {...}, timestamp: 1234567890 }` |
| `LoadingState` | 로딩 상태 | `{ isLoading: true, error: null }` |
| `TranslationResult` | 번역 결과 | `{ text: '환영합니다', isFallback: false }` |

#### 톤 옵션

```typescript
type Tone = 'emotional' | 'encouraging' | 'calm' | 'gentle' | 'formal' | 'technical' | 'informal';
```

#### 격식 옵션

```typescript
type Formality = 'informal' | 'casual' | 'formal' | 'polite';
```

#### 에러 코드 (v1.1.0)

```typescript
type TranslationErrorCode = 
  | 'MISSING_KEY' 
  | 'LOAD_FAILED' 
  | 'INVALID_KEY' 
  | 'NETWORK_ERROR' 
  | 'INITIALIZATION_ERROR' 
  | 'VALIDATION_ERROR' 
  | 'CACHE_ERROR';
```

---

### 5. 사용 예제

#### 🚀 초보자용 (추천) - withDefaultConfig()

```tsx
// 초보자 전용 엔트리포인트
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

#### ⚙️ 중급자용 - 부분 커스터마이징

```tsx
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk';

// 필요한 부분만 커스터마이징
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en',
  namespaces: ['common', 'auth'],
  debug: true,
});

function App() {
  return (
    <I18nProvider>
      <MyComponent />
    </I18nProvider>
  );
}
```

#### 🔧 고급자용 - 완전 커스터마이징

```tsx
// 1. 설정
const i18nConfig: I18nConfig = {
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
  // v1.1.0: 에러 처리 옵션 추가
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => error.code === 'NETWORK_ERROR',
      onRetry: (error, attempt) => console.log(`재시도 ${attempt}회:`, error.message),
      onMaxRetriesExceeded: (error) => console.error('최대 재시도 횟수 초과:', error.message)
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

// 2. Provider 설정
function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyComponent />
    </I18nProvider>
  );
}

// 3. 번역 사용
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

#### 서버 컴포넌트 (SSR)

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

#### 언어 변경

```tsx
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

---

### 6. 고급 사용법

#### 타입 안전한 번역

```tsx
// 번역 데이터 타입 정의
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

// 타입 안전한 컨텍스트 사용
const { t } = useI18n<MyTranslations>();

// 자동완성 지원
t('common.welcome'); // ✅ 타입 안전
t('common.invalid'); // ❌ 타입 에러
```

#### 커스텀 로더

```tsx
// 파일 기반 로더
const fileLoader = createFileLoader('./translations');

// API 기반 로더
const apiLoader = createApiLoader('https://api.example.com', 'your-api-key');

// 커스텀 로더
const customLoader = async (language: string, namespace: string) => {
  // 커스텀 로직
  return await fetch(`/api/translations/${language}/${namespace}`);
};
```

#### 개발용 설정

```tsx
const devConfig = createDevConfig({
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common'],
  loadTranslations: fileLoader,
});

// 디버그 모드 활성화, 누락 키 표시, 에러 핸들링 포함
```

#### 에러 처리 고급 설정 (v1.1.0)

```tsx
// 커스텀 에러 복구 전략
const customRecoveryStrategy: ErrorRecoveryStrategy = {
  maxRetries: 5,
  retryDelay: 2000,
  backoffMultiplier: 1.5,
  shouldRetry: (error) => {
    // 네트워크 에러나 로딩 실패만 재시도
    return ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code);
  },
  onRetry: (error, attempt) => {
    console.log(`번역 로딩 재시도 ${attempt}회:`, error.message);
  },
  onMaxRetriesExceeded: (error) => {
    // 최대 재시도 후 사용자에게 알림
    alert('번역 데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
  }
};

// 커스텀 에러 로거
const customLogger = (error: TranslationError) => {
  // 외부 로깅 서비스로 전송
  analytics.track('translation_error', {
    code: error.code,
    language: error.language,
    namespace: error.namespace,
    key: error.key,
    timestamp: error.timestamp
  });
};

const config: I18nConfig = {
  // ... 기존 설정
  errorHandling: {
    recoveryStrategy: customRecoveryStrategy,
    logging: {
      enabled: true,
      level: 'error',
      includeStack: true,
      includeContext: true,
      customLogger
    },
    userFriendlyMessages: true
  }
};
```

---

### 7. 에러 처리 (v1.1.0)

#### 에러 타입과 코드

```typescript
// 에러 코드별 의미
const errorCodes = {
  MISSING_KEY: '번역 키를 찾을 수 없음',
  LOAD_FAILED: '번역 파일 로딩 실패',
  INVALID_KEY: '잘못된 번역 키 형식',
  NETWORK_ERROR: '네트워크 오류',
  INITIALIZATION_ERROR: '초기화 실패',
  VALIDATION_ERROR: '설정 검증 실패',
  CACHE_ERROR: '캐시 처리 오류'
};
```

#### 에러 복구 예제

```tsx
// 자동 재시도 예제
const config: I18nConfig = {
  // ... 기본 설정
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => {
        // 네트워크 에러나 로딩 실패만 재시도
        return ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code);
      },
      onRetry: (error, attempt) => {
        console.log(`재시도 ${attempt}회: ${error.message}`);
      },
      onMaxRetriesExceeded: (error) => {
        console.error('최대 재시도 횟수 초과:', error.message);
      }
    }
  }
};
```

#### 사용자 친화적 에러 메시지

```tsx
// 에러 발생 시 사용자에게 보여줄 메시지
const userFriendlyMessages = {
  MISSING_KEY: {
    message: '번역 키를 찾을 수 없습니다',
    suggestion: '번역 파일에 해당 키가 있는지 확인해주세요',
    action: '번역 파일 업데이트'
  },
  LOAD_FAILED: {
    message: '번역 파일을 불러오는데 실패했습니다',
    suggestion: '네트워크 연결과 파일 경로를 확인해주세요',
    action: '재시도'
  },
  NETWORK_ERROR: {
    message: '네트워크 오류가 발생했습니다',
    suggestion: '인터넷 연결을 확인하고 다시 시도해주세요',
    action: '재시도'
  }
};
```

#### 에러 로깅 설정

```tsx
// 다양한 로깅 레벨과 설정
const loggingConfigs = {
  development: {
    enabled: true,
    level: 'debug',
    includeStack: true,
    includeContext: true
  },
  production: {
    enabled: true,
    level: 'error',
    includeStack: false,
    includeContext: true,
    customLogger: (error) => {
      // 프로덕션에서는 외부 로깅 서비스로 전송
      sendToErrorTracking(error);
    }
  }
};
```

---

### 8. 폴백 시스템

#### 폴백 체인

hua-i18n-sdk는 강력한 폴백 시스템을 제공합니다:

```tsx
// 폴백 순서: 요청 언어 → 폴백 언어 → missing key handler
const config = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en', // 영어로 폴백
  // ...
};
```

#### 폴백 예시

```tsx
// 한국어 번역 파일에만 존재하는 키
// ko/common.json: { "koreanOnly": "이 메시지는 한국어에만 존재합니다" }
// en/common.json: { } (빈 객체)

// 영어 모드에서 사용 시
t('common.koreanOnly'); // → "이 메시지는 한국어에만 존재합니다" (폴백)
```

#### 개발/프로덕션 환경별 처리

```tsx
const config = {
  missingKeyHandler: (key: string, language: string) => {
    if (process.env.NODE_ENV === 'development') {
      return `[MISSING: ${key}]`; // 개발: 디버깅용
    }
    return key.split('.').pop() || 'Translation not found'; // 프로덕션: 사용자 친화적
  },
};
```

---

### 9. 마이그레이션 가이드 (v1.0.x → v1.1.0)

#### 호환성 보장

**✅ 기존 코드는 변경 없이 동작합니다**

```tsx
// v1.0.x 코드 (그대로 동작)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// v1.1.0에서도 동일하게 동작
```

#### 새로운 기능 활용 (선택사항)

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
    logging: {
      enabled: true,
      level: 'error'
    },
    userFriendlyMessages: true
  }
};
```

#### 타입 안전성 강화

```tsx
// v1.1.0: 새로운 타입가드 활용
import { isTranslationNamespace, validateI18nConfig } from 'hua-i18n-sdk';

// 설정 검증
if (!validateI18nConfig(config)) {
  throw new Error('Invalid configuration');
}

// 번역 데이터 검증
const data = await loadTranslations('ko', 'common');
if (!isTranslationNamespace(data)) {
  throw new Error('Invalid translation data');
}
```

#### 에러 처리 개선

```tsx
// v1.1.0: 구조화된 에러 처리
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

---

### 10. 마이그레이션 가이드

#### v1.2.0 마이그레이션 - 초보자 친화적 접근

**🎯 새로운 사용자: withDefaultConfig() 사용 권장**

```tsx
// v1.2.0: 초보자용 한 줄 설정 (추천)
import { withDefaultConfig } from 'hua-i18n-sdk/easy';

export const I18nProvider = withDefaultConfig();
```

**⚙️ 기존 사용자: 완전 호환**

```tsx
// v1.1.0 코드 (그대로 작동)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// v1.2.0에서도 동일하게 작동
```

#### v1.1.0 → v1.2.0 마이그레이션

**✅ 기존 코드는 변경 없이 작동**

```tsx
// v1.1.0 코드 (변경 없이 작동)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
  // v1.1.0: 에러 처리 옵션
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: {
      enabled: true,
      level: 'error'
    },
    userFriendlyMessages: true
  }
};

// v1.2.0에서도 동일하게 작동
```

#### 새로운 기능 활용 (선택사항)

**🚀 초보자용 접근법**

```tsx
// v1.2.0: 초보자용 한 줄 설정
import { withDefaultConfig } from 'hua-i18n-sdk/easy';

export const I18nProvider = withDefaultConfig();

// 또는 부분 커스터마이징
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en',
  namespaces: ['common', 'auth'],
  debug: true,
});
```

**🔄 자동 언어 전환**

```tsx
// v1.2.0: 자동 언어 전환 이벤트 감지
const config = withDefaultConfig({
  autoLanguageSync: true, // 기본값: true
});

// 다른 컴포넌트에서 언어 변경 시
const changeLanguage = (language) => {
  // 이벤트 발생 → withDefaultConfig()가 자동으로 감지
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
    detail: language 
  }));
};
```

#### v1.0.x → v1.1.0 마이그레이션

---

## 🇺🇸 English

---

### 📋 Table of Contents

1. [Core APIs](#1-core-apis)
2. [Beginner-friendly APIs (v1.2.0)](#2-beginner-friendly-apis-v120)
3. [Configuration Options](#3-configuration-options)
4. [Type Definitions](#4-type-definitions)
5. [Usage Examples](#5-usage-examples)
6. [Advanced Usage](#6-advanced-usage)
7. [Error Handling](#7-error-handling-v110)
8. [Fallback System](#8-fallback-system)
9. [Migration Guide (v1.0.x → v1.1.0)](#9-migration-guide-v10x--v110)
10. [Migration Guide](#10-migration-guide)

---

### 1. Core APIs

#### Core Functions/Hooks/Components

| API | Type | Description | Example |
|-----|------|-------------|---------|
| `useTranslation()` | Hook | Main hook for translation | `const { t } = useTranslation();` |
| `useLanguageChange()` | Hook | Hook for language switching | `const { changeLanguage } = useLanguageChange();` |
| `I18nProvider` | Component | i18n context provider | `<I18nProvider config={config}>` |
| `ssrTranslate()` | Function | Translation function for server components | `ssrTranslate({ translations, key, language })` |
| `Translator` | Class | Translation processing class | `new Translator(config)` |

#### Helper Functions

| Function | Description | Example |
|----------|-------------|---------|
| `createI18nConfig()` | Create basic configuration | `createI18nConfig({ ... })` |
| `createSimpleConfig()` | Create simple configuration | `createSimpleConfig({ defaultLanguage: 'ko' })` |
| `createFileLoader()` | Create file-based loader | `createFileLoader('./translations')` |
| `createApiLoader()` | Create API-based loader | `createApiLoader('https://api.example.com')` |
| `createDevConfig()` | Create development configuration | `createDevConfig(config)` |

#### Error Handling Utilities (v1.1.0)

| Function | Description | Example |
|----------|-------------|---------|
| `createTranslationError()` | Create structured error | `createTranslationError('LOAD_FAILED', error)` |
| `isRecoverableError()` | Check if error is recoverable | `isRecoverableError(error)` |
| `logTranslationError()` | Log error | `logTranslationError(error, config)` |
| `createUserFriendlyError()` | Create user-friendly error message | `createUserFriendlyError(error)` |

---

### 2. Beginner-friendly APIs (v1.2.0)

#### 🚀 withDefaultConfig() - One-line Setup

Beginner-friendly **one-line setup** API. Start immediately without complex configuration.

| API | Type | Description | Example |
|-----|------|-------------|---------|
| `withDefaultConfig()` | Function | Beginner-friendly one-line setup | `export const I18nProvider = withDefaultConfig();` |
| `withDefaultConfig(options)` | Function | Customizable configuration | `withDefaultConfig({ defaultLanguage: 'en' })` |

#### 🎯 Default Configuration Values

`withDefaultConfig()` sets up with the following default values:

```tsx
{
  defaultLanguage: 'ko',           // Default language: Korean
  fallbackLanguage: 'en',          // Fallback language: English
  namespaces: ['common'],          // Default namespace
  debug: NODE_ENV === 'development', // Debug only in development mode
  autoLanguageSync: true,          // Auto language change detection
  loadTranslations: createFileLoader('./translations') // Default file loader
}
```

#### 🚀 Easy Entry Point - Beginner Only

```tsx
// Beginner-only entry point - Simplest method
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk/easy';

// One line setup! Start immediately without complex configuration
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
      <p>{tWithParams('common.greeting', { name: 'John' })}</p>
    </div>
  );
}
```

#### 🚀 Default Entry Point - Beginner-friendly

```tsx
// Also available in default entry point
import { withDefaultConfig, useTranslation } from 'hua-i18n-sdk';

// One line setup! Start immediately without complex configuration
export const I18nProvider = withDefaultConfig();

function App() {
  return (
    <I18nProvider>
      <MyComponent />
    </I18nProvider>
  );
}
```

#### ⚙️ withDefaultConfig() Options

Customize only what you need:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultLanguage` | string | `'ko'` | Default language |
| `fallbackLanguage` | string | `'en'` | Fallback language |
| `namespaces` | string[] | `['common']` | Namespace list |
| `debug` | boolean | `NODE_ENV === 'development'` | Debug mode |
| `autoLanguageSync` | boolean | `true` | Auto language change event detection |

#### 📝 Usage Examples

```tsx
// 1. Complete default configuration (simplest)
export const I18nProvider = withDefaultConfig();

// 2. Change language only
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en'
});

// 3. Add multiple namespaces
export const I18nProvider = withDefaultConfig({
  namespaces: ['common', 'auth', 'dashboard']
});

// 4. Enable debug mode
export const I18nProvider = withDefaultConfig({
  debug: true
});

// 5. Disable auto language sync
export const I18nProvider = withDefaultConfig({
  autoLanguageSync: false
});
```

#### Auto Language Sync

The `autoLanguageSync` option automatically detects language change events:

```tsx
// Events automatically detected
window.addEventListener('huaI18nLanguageChange', (event) => {
  // SDK internal language change event
  const newLanguage = event.detail;
});

window.addEventListener('i18nLanguageChanged', (event) => {
  // General language change event
  const newLanguage = event.detail;
});

// Usage example
const changeLanguage = (language) => {
  // Event dispatch → withDefaultConfig() automatically detects
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
    detail: language 
  }));
};
```

---

### 3. Configuration Options

#### I18nConfig Interface

| Option | Type | Required | Description | Default |
|--------|------|----------|-------------|---------|
| `defaultLanguage` | string | ✅ | Default language code | - |
| `fallbackLanguage` | string | ❌ | Fallback language code | `'en'` |
| `supportedLanguages` | LanguageConfig[] | ✅ | Supported languages list | - |
| `namespaces` | string[] | ❌ | Namespace list | `['common']` |
| `loadTranslations` | Function | ✅ | Translation loading function | - |
| `debug` | boolean | ❌ | Debug mode | `false` |
| `missingKeyHandler` | Function | ❌ | Missing key handler function | `(key) => key` |
| `errorHandler` | Function | ❌ | Error handler function | `console.error` |
| `cacheOptions` | CacheOptions | ❌ | Cache settings | - |
| `performanceOptions` | PerformanceOptions | ❌ | Performance settings | - |
| `errorHandling` | ErrorHandlingOptions | ❌ | Error handling settings (v1.1.0) | - |

#### New Configuration Options (v1.1.0)

##### CacheOptions

```typescript
interface CacheOptions {
  maxSize?: number;    // Maximum cache size
  ttl?: number;        // Time to live (milliseconds)
}
```

##### PerformanceOptions

```typescript
interface PerformanceOptions {
  preloadAll?: boolean;  // Preload all translations
  lazyLoad?: boolean;    // Lazy loading
}
```

##### ErrorHandlingOptions

```typescript
interface ErrorHandlingOptions {
  recoveryStrategy?: ErrorRecoveryStrategy;  // Error recovery strategy
  logging?: ErrorLoggingConfig;              // Error logging settings
  userFriendlyMessages?: boolean;            // User-friendly messages
  suppressErrors?: boolean;                  // Suppress errors
}
```

#### LanguageConfig Interface

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `code` | string | ✅ | Language code | `'ko'` |
| `name` | string | ✅ | Language name (English) | `'Korean'` |
| `nativeName` | string | ✅ | Native language name | `'한국어'` |
| `tone` | string | ❌ | Tone setting | `'emotional'` |
| `formality` | string | ❌ | Formality level | `'polite'` |

---

### 4. Type Definitions

#### Core Types

| Type Name | Description | Example |
|-----------|-------------|---------|
| `TranslationNamespace` | Namespace translation object | `{ welcome: 'Welcome' }` |
| `TranslationData` | Complete translation data | `{ common: {...}, auth: {...} }` |
| `TranslationParams` | Translation parameters | `{ name: 'John', count: 5 }` |
| `TranslationKey<T>` | Type-safe translation key | `'common.welcome'` |
| `I18nContextType` | i18n context type | - |
| `TypedI18nContextType<T>` | Type-safe context | - |

#### New Types (v1.1.0)

| Type Name | Description | Example |
|-----------|-------------|---------|
| `TranslationError` | Structured error type | `{ code: 'LOAD_FAILED', language: 'ko' }` |
| `ErrorRecoveryStrategy` | Error recovery strategy | `{ maxRetries: 3, retryDelay: 1000 }` |
| `ErrorLoggingConfig` | Error logging settings | `{ enabled: true, level: 'error' }` |
| `UserFriendlyError` | User-friendly error | `{ message: 'Failed to load translation file' }` |
| `CacheEntry` | Cache entry | `{ data: {...}, timestamp: 1234567890 }` |
| `LoadingState` | Loading state | `{ isLoading: true, error: null }` |
| `TranslationResult` | Translation result | `{ text: 'Welcome', isFallback: false }` |

#### Tone Options

```typescript
type Tone = 'emotional' | 'encouraging' | 'calm' | 'gentle' | 'formal' | 'technical' | 'informal';
```

#### Formality Options

```typescript
type Formality = 'informal' | 'casual' | 'formal' | 'polite';
```

---

### 5. Usage Examples

#### Basic Usage

```tsx
// 1. Configuration setup
const i18nConfig = createI18nConfig({
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
});

// 2. Provider setup
function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyComponent />
    </I18nProvider>
  );
}

// 3. Translation usage
function MyComponent() {
  const { t, tWithParams } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{tWithParams('common.greeting', { name: 'John' })}</p>
    </div>
  );
}
```

#### Server Components (SSR)

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

#### Language Switching

```tsx
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

---

### 6. Advanced Usage

#### Type-safe Translation

```tsx
// Define translation data types
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

// Use type-safe context
const { t } = useI18n<MyTranslations>();

// Autocomplete support
t('common.welcome'); // ✅ Type safe
t('common.invalid'); // ❌ Type error
```

#### Custom Loaders

```tsx
// File-based loader
const fileLoader = createFileLoader('./translations');

// API-based loader
const apiLoader = createApiLoader('https://api.example.com', 'your-api-key');

// Custom loader
const customLoader = async (language: string, namespace: string) => {
  // Custom logic
  return await fetch(`/api/translations/${language}/${namespace}`);
};
```

#### Development Configuration

```tsx
const devConfig = createDevConfig({
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common'],
  loadTranslations: fileLoader,
});

// Includes debug mode, missing key display, error handling
```

#### Advanced Error Handling (v1.1.0)

```tsx
// Custom error recovery strategy
const customRecoveryStrategy: ErrorRecoveryStrategy = {
  maxRetries: 5,
  retryDelay: 2000,
  backoffMultiplier: 1.5,
  shouldRetry: (error) => {
    // Retry only network errors or loading failures
    return ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code);
  },
  onRetry: (error, attempt) => {
    console.log(`Translation loading retry ${attempt}:`, error.message);
  },
  onMaxRetriesExceeded: (error) => {
    // Notify user after max retries
    alert('Unable to load translation data. Please refresh the page.');
  }
};

// Custom error logger
const customLogger = (error: TranslationError) => {
  // Send to external logging service
  analytics.track('translation_error', {
    code: error.code,
    language: error.language,
    namespace: error.namespace,
    key: error.key,
    timestamp: error.timestamp
  });
};

const config: I18nConfig = {
  // ... existing configuration
  errorHandling: {
    recoveryStrategy: customRecoveryStrategy,
    logging: {
      enabled: true,
      level: 'error',
      includeStack: true,
      includeContext: true,
      customLogger
    },
    userFriendlyMessages: true
  }
};
```

---

### 7. Error Handling (v1.1.0)

#### Error Types and Codes

```typescript
// Error code meanings
const errorCodes = {
  MISSING_KEY: 'Translation key not found',
  LOAD_FAILED: 'Translation file loading failed',
  INVALID_KEY: 'Invalid translation key format',
  NETWORK_ERROR: 'Network error',
  INITIALIZATION_ERROR: 'Initialization failed',
  VALIDATION_ERROR: 'Configuration validation failed',
  CACHE_ERROR: 'Cache processing error'
};
```

#### Error Recovery Examples

```tsx
// Automatic retry example
const config: I18nConfig = {
  // ... basic configuration
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => {
        // Retry only network errors or loading failures
        return ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code);
      },
      onRetry: (error, attempt) => {
        console.log(`Retry ${attempt}:`, error.message);
      },
      onMaxRetriesExceeded: (error) => {
        // Handle max retries exceeded
        console.error('Max retries exceeded:', error);
      }
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

#### User-friendly Error Messages

```tsx
// Development vs Production error handling
const config: I18nConfig = {
  // ... basic configuration
  missingKeyHandler: (key, language, namespace) => {
    if (process.env.NODE_ENV === 'development') {
      return `[MISSING: ${key}]`; // Development: Show missing key
    }
    return key.split('.').pop() || 'Translation not found'; // Production: User-friendly
  },
};
```

---

### 8. Fallback System

#### Fallback Chain

The SDK implements a robust fallback system that ensures translations are always available:

```tsx
// Fallback chain: ko.common → en.common → key
const config: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  namespaces: ['common'],
  // ... other config
};
```

#### Fallback Priority

1. **Primary**: Requested language + namespace
2. **Secondary**: Fallback language + namespace  
3. **Tertiary**: Requested language + 'common' namespace
4. **Quaternary**: Fallback language + 'common' namespace
5. **Final**: Missing key handler

#### Fallback Examples

```tsx
// Example 1: Missing key in ko.common
// Request: t('common.welcome') in Korean
// Fallback: en.common.welcome

// Example 2: Missing namespace
// Request: t('auth.login') in Korean
// Fallback: ko.common.login → en.common.login

// Example 3: Missing key everywhere
// Request: t('unknown.key')
// Fallback: missingKeyHandler('unknown.key')
```

#### Custom Fallback Strategy

```tsx
const config: I18nConfig = {
  // ... basic configuration
  missingKeyHandler: (key, language, namespace) => {
    // Custom fallback logic
    if (namespace === 'auth') {
      return `[AUTH: ${key}]`; // Auth-specific fallback
    }
    return `[${key}]`; // General fallback
  },
};
```

---

### 9. Migration Guide (v1.0.x → v1.1.0)

#### Compatibility Guarantee

**✅ Existing code works without changes**

```tsx
// v1.0.x code (works as-is)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// Works identically in v1.1.0
```

#### New Features (Optional)

```tsx
// v1.1.0: Enhanced error handling (optional)
const config: I18nConfig = {
  // ... existing configuration
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: {
      enabled: true,
      level: 'error'
    },
    userFriendlyMessages: true
  }
};
```

#### Enhanced Type Safety

```tsx
// v1.1.0: New type guards
import { isTranslationNamespace, validateI18nConfig } from 'hua-i18n-sdk';

// Configuration validation
if (!validateI18nConfig(config)) {
  throw new Error('Invalid configuration');
}

// Translation data validation
const data = await loadTranslations('ko', 'common');
if (!isTranslationNamespace(data)) {
  throw new Error('Invalid translation data');
}
```

#### Improved Error Handling

```tsx
// v1.1.0: Structured error handling
import { createTranslationError, logTranslationError } from 'hua-i18n-sdk';

try {
  // Translation loading
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

---

### 10. Migration Guide

#### v1.2.0 Migration - Beginner-friendly Approach

**🎯 New Users: Recommended to use withDefaultConfig()**

```tsx
// v1.2.0: Beginner-friendly one-line setup (recommended)
import { withDefaultConfig } from 'hua-i18n-sdk/easy';

export const I18nProvider = withDefaultConfig();
```

**⚙️ Existing Users: Fully Compatible**

```tsx
// v1.1.0 code (works as-is)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// Works identically in v1.2.0
```

#### v1.1.0 → v1.2.0 Migration

**✅ Existing code works without changes**

```tsx
// v1.1.0 code (works without changes)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
  // v1.1.0: Error handling options
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: {
      enabled: true,
      level: 'error'
    },
    userFriendlyMessages: true
  }
};

// Works identically in v1.2.0
```

#### New Features (Optional)

**🚀 Beginner-friendly Approach**

```tsx
// v1.2.0: Beginner-friendly one-line setup
import { withDefaultConfig } from 'hua-i18n-sdk/easy';

export const I18nProvider = withDefaultConfig();

// Or partial customization
export const I18nProvider = withDefaultConfig({
  defaultLanguage: 'en',
  namespaces: ['common', 'auth'],
  debug: true,
});
```

**🔄 Auto Language Sync**

```tsx
// v1.2.0: Auto language change event detection
const config = withDefaultConfig({
  autoLanguageSync: true, // Default: true
});

// In other components when changing language
const changeLanguage = (language) => {
  // Event dispatch → withDefaultConfig() automatically detects
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { 
    detail: language 
  }));
};
```

#### v1.0.x → v1.1.0 Migration

**✅ Existing code works without changes**

```tsx
// v1.0.x code (works as-is)
const config: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// Works identically in v1.1.0
```

#### New Features (Optional)

```tsx
// v1.1.0: Enhanced error handling (optional)
const config: I18nConfig = {
  // ... existing configuration
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    },
    logging: {
      enabled: true,
      level: 'error'
    },
    userFriendlyMessages: true
  }
};
```

#### Enhanced Type Safety

```tsx
// v1.1.0: New type guards
import { isTranslationNamespace, validateI18nConfig } from 'hua-i18n-sdk';

// Configuration validation
if (!validateI18nConfig(config)) {
  throw new Error('Invalid configuration');
}

// Translation data validation
const data = await loadTranslations('ko', 'common');
if (!isTranslationNamespace(data)) {
  throw new Error('Invalid translation data');
}
```

#### Improved Error Handling

```tsx
// v1.1.0: Structured error handling
import { createTranslationError, logTranslationError } from 'hua-i18n-sdk';

try {
  // Translation loading
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
