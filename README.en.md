# hua-i18n-sdk

> **v1.1.0** - Simple and powerful internationalization SDK for React applications

[![npm version](https://badge.fury.io/js/hua-i18n-sdk.svg)](https://badge.fury.io/js/hua-i18n-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Key Features

- **Simple API**: Intuitive and easy-to-use interface
- **Type Safety**: Full TypeScript support with type safety
- **SSR Support**: Perfect compatibility with Next.js server components
- **Robust Error Handling**: Automatic retry, recovery strategies, user-friendly messages
- **Lightweight Bundle**: Optimized size with tree-shaking support
- **Real-time Language Switching**: Dynamic language switching support
- **Developer Friendly**: Debug mode, missing key display, detailed logging

## Installation

```bash
npm install hua-i18n-sdk
# or
yarn add hua-i18n-sdk
# or
pnpm add hua-i18n-sdk
```

## Quick Start

### 1. Basic Configuration

```tsx
import { I18nProvider, useTranslation, createI18nConfig } from 'hua-i18n-sdk';

const i18nConfig = createI18nConfig({
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
  // v1.1.0: Enhanced error handling
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
```

### 2. Provider Setup

```tsx
function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <MyComponent />
    </I18nProvider>
  );
}
```

### 3. Translation Usage

```tsx
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

## Translation File Structure

```text
translations/
├── en/
│   ├── common.json
│   └── auth.json
└── ko/
    ├── common.json
    └── auth.json
```

### Translation File Examples

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

## Advanced Features

### Language Switching

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

### Server Components (SSR)

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

### Type-Safe Translations

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

// Autocomplete support
t('common.welcome'); // ✅ Type safe
t('common.invalid'); // ❌ Type error
```

## Error Handling (v1.1.0)

### Automatic Retry and Recovery

```tsx
const config = {
  // ... basic configuration
  errorHandling: {
    recoveryStrategy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => ['NETWORK_ERROR', 'LOAD_FAILED'].includes(error.code),
      onRetry: (error, attempt) => console.log(`Retry ${attempt}:`, error.message),
      onMaxRetriesExceeded: (error) => alert('Unable to load translation data')
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

### Custom Error Handling

```tsx
import { createTranslationError, logTranslationError } from 'hua-i18n-sdk';

try {
  // Translation loading
} catch (error) {
  const translationError = createTranslationError(
    'LOAD_FAILED',
    error.message,
    error,
    { language: 'en', namespace: 'common' }
  );
  
  logTranslationError(translationError);
}
```

## Migration (v1.0.x → v1.1.0)

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

### Utilizing New Features (Optional)

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
    logging: { enabled: true, level: 'error' },
    userFriendlyMessages: true
  }
};
```

## Documentation

- [SDK Reference](./docs/SDK_REFERENCE.md) - Complete API documentation
- [Changelog](./docs/CHANGELOG.md) - Version changes
- [Environment Guides](./docs/ENVIRONMENT_GUIDES.md) - Various environment setups
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project

## Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Building

```bash
npm run build
npm run build:types
```

## Contributing

If you'd like to contribute to the project, please refer to the [Contributing Guide](./CONTRIBUTING.md).

### Development Environment Setup

```bash
git clone https://github.com/HUA-Labs/i18n-sdk.git
cd hua-i18n-sdk
npm install
npm run dev
```

## License

This project is distributed under the [MIT License](./LICENSE).

## Acknowledgments

- [React](https://reactjs.org/) - Amazing UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Next.js](https://nextjs.org/) - SSR support
- Thanks to all contributors!

---

> **Made with ❤️ by the hua-i18n-sdk team**
