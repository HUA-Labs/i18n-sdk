# hua-i18n-sdk API Reference

> **hua-i18n-sdk v0.4.0** - React 애플리케이션을 위한 간단하고 강력한 국제화 SDK

---

## 🇰🇷 한국어 | 🇺🇸 [English](#-english)

---

## 🇰🇷 한국어

### 📋 목차

1. [주요 API](#1-주요-api)
2. [설정 옵션](#2-설정-옵션)
3. [타입 정의](#3-타입-정의)
4. [사용 예제](#4-사용-예제)
5. [고급 사용법](#5-고급-사용법)

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

---

### 2. 설정 옵션

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

#### LanguageConfig 인터페이스

| 속성 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `code` | string | ✅ | 언어 코드 | `'ko'` |
| `name` | string | ✅ | 언어 이름 (영어) | `'Korean'` |
| `nativeName` | string | ✅ | 원어 이름 | `'한국어'` |
| `tone` | string | ❌ | 톤 설정 | `'emotional'` |
| `formality` | string | ❌ | 격식 수준 | `'polite'` |

---

### 3. 타입 정의

#### 주요 타입들

| 타입명 | 설명 | 예시 |
|--------|------|------|
| `TranslationNamespace` | 네임스페이스 번역 객체 | `{ welcome: '환영합니다' }` |
| `TranslationData` | 전체 번역 데이터 | `{ common: {...}, auth: {...} }` |
| `TranslationParams` | 번역 파라미터 | `{ name: '철수', count: 5 }` |
| `TranslationKey<T>` | 타입 안전한 번역 키 | `'common.welcome'` |
| `I18nContextType` | i18n 컨텍스트 타입 | - |
| `TypedI18nContextType<T>` | 타입 안전한 컨텍스트 | - |

#### 톤 옵션

```typescript
type Tone = 'emotional' | 'encouraging' | 'calm' | 'gentle' | 'formal' | 'technical' | 'informal';
```

#### 격식 옵션

```typescript
type Formality = 'informal' | 'casual' | 'formal' | 'polite';
```

---

### 4. 사용 예제

#### 기본 사용법

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

### 5. 고급 사용법

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

---

---

## 🇺🇸 English

### 📋 Table of Contents

1. [Main API](#1-main-api)
2. [Configuration Options](#2-configuration-options)
3. [Type Definitions](#3-type-definitions)
4. [Usage Examples](#4-usage-examples)
5. [Advanced Usage](#5-advanced-usage)

---

### 1. Main API

#### Core Functions/Hooks/Components

| API | Type | Description | Example |
|-----|------|-------------|---------|
| `useTranslation()` | Hook | Main translation hook | `const { t } = useTranslation();` |
| `useLanguageChange()` | Hook | Language change hook | `const { changeLanguage } = useLanguageChange();` |
| `I18nProvider` | Component | i18n context provider | `<I18nProvider config={config}>` |
| `ssrTranslate()` | Function | Server component translation | `ssrTranslate({ translations, key, language })` |
| `Translator` | Class | Translation processing class | `new Translator(config)` |

#### Helper Functions

| Function | Description | Example |
|----------|-------------|---------|
| `createI18nConfig()` | Create basic config | `createI18nConfig({ ... })` |
| `createSimpleConfig()` | Create simple config | `createSimpleConfig({ defaultLanguage: 'en' })` |
| `createFileLoader()` | Create file-based loader | `createFileLoader('./translations')` |
| `createApiLoader()` | Create API-based loader | `createApiLoader('https://api.example.com')` |
| `createDevConfig()` | Create dev config | `createDevConfig(config)` |

---

### 2. Configuration Options

#### I18nConfig Interface

| Option | Type | Required | Description | Default |
|--------|------|----------|-------------|---------|
| `defaultLanguage` | string | ✅ | Default language code | - |
| `fallbackLanguage` | string | ❌ | Fallback language code | `'en'` |
| `supportedLanguages` | LanguageConfig[] | ✅ | Supported languages list | - |
| `namespaces` | string[] | ❌ | Namespaces list | `['common']` |
| `loadTranslations` | Function | ✅ | Translation loading function | - |
| `debug` | boolean | ❌ | Debug mode | `false` |
| `missingKeyHandler` | Function | ❌ | Missing key handler | `(key) => key` |
| `errorHandler` | Function | ❌ | Error handler | `console.error` |

#### LanguageConfig Interface

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `code` | string | ✅ | Language code | `'en'` |
| `name` | string | ✅ | Language name (English) | `'English'` |
| `nativeName` | string | ✅ | Native language name | `'English'` |
| `tone` | string | ❌ | Tone setting | `'formal'` |
| `formality` | string | ❌ | Formality level | `'polite'` |

---

### 3. Type Definitions

#### Main Types

| Type | Description | Example |
|------|-------------|---------|
| `TranslationNamespace` | Namespace translation object | `{ welcome: 'Welcome' }` |
| `TranslationData` | Complete translation data | `{ common: {...}, auth: {...} }` |
| `TranslationParams` | Translation parameters | `{ name: 'John', count: 5 }` |
| `TranslationKey<T>` | Type-safe translation key | `'common.welcome'` |
| `I18nContextType` | i18n context type | - |
| `TypedI18nContextType<T>` | Type-safe context | - |

#### Tone Options

```typescript
type Tone = 'emotional' | 'encouraging' | 'calm' | 'gentle' | 'formal' | 'technical' | 'informal';
```

#### Formality Options

```typescript
type Formality = 'informal' | 'casual' | 'formal' | 'polite';
```

---

### 4. Usage Examples

#### Basic Usage

```tsx
// 1. Configuration
const i18nConfig: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common', 'auth'],
  loadTranslations: async (language, namespace) => {
    const module = await import(`./translations/${language}/${namespace}.json`);
    return module.default;
  },
};

// 2. Provider Setup
function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyComponent />
    </I18nProvider>
  );
}

// 3. Translation Usage
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

#### Server Component (SSR)

```tsx
import { ssrTranslate } from 'hua-i18n-sdk';

export default function ServerComponent() {
  const title = ssrTranslate({
    translations: translations.en.common(),
    key: 'common.welcome',
    language: 'en',
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

### 5. Advanced Usage

#### Type-Safe Translation

```tsx
// Translation data type definition
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

// Type-safe context usage
const { t } = useI18n<MyTranslations>();

// Auto-completion support
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
  defaultLanguage: 'en',
  fallbackLanguage: 'ko',
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ],
  namespaces: ['common'],
  loadTranslations: fileLoader,
});

// Debug mode enabled, missing key display, error handling included
```

---

## 📊 Performance & Statistics

- **Bundle Size**: ~15KB (gzipped)
- **Supported**: React 16.8+, Next.js, SSR/CSR
- **Languages**: Korean, English, and extensible
- **TypeScript**: Full support with auto-completion

---

## 🔗 Related Links

- [GitHub Repository](https://github.com/HUA-Labs/i18n-sdk)
- [NPM Package](https://www.npmjs.com/package/hua-i18n-sdk)
- [Example Project](./examples/nextjs-basic/)
- [Changelog](./CHANGELOG.md)
