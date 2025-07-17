# hua-i18n-sdk

> **A lightweight and powerful internationalization SDK for React applications**
>
> **SSR/CSR Support** | **TypeScript Ready** | **Enterprise Grade**

A simple and powerful internationalization SDK for React applications, inspired by hua-api's translation system.

## Core Features

- **Simple API**: `t('namespace.key')` style intuitive translation function
- **SSR Support**: Use `ssrTranslate()` in server components to avoid hydration issues
- **Type Safety**: TypeScript support with translation key autocomplete
- **Lightweight Bundle**: ~15KB (gzipped)
- **Multi-language Support**: Korean, English and extensible

## Supported Environments

- **Frameworks**: Next.js (App Router), React, Vite, Webpack
- **Languages**: TypeScript, JavaScript
- **Runtime**: Node.js, Browser

## Installation

```bash
npm install hua-i18n-sdk
```

## Quick Start

### 1. Configuration

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

### 2. Provider Setup

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

### 3. Using Translations

```tsx
// Client Component
const { t } = useTranslation();
return <h1>{t('common.welcome')}</h1>;

// Server Component (SSR)
const title = ssrTranslate({ translations, key: 'common.welcome', language: 'ko' });
return <h1>{title}</h1>;
```

## Documentation & Examples

- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Live Demo](./examples/nextjs-basic/)** - Next.js integration example
- **[Changelog](./CHANGELOG.md)** - Version history

## Key Differentiators

- **hua-api Style**: Familiar API for existing hua-api users
- **Perfect SSR Support**: Fully compatible with Next.js App Router
- **Type Safety**: TypeScript autocomplete for enhanced developer experience
- **Production Proven**: Stability verified in sum-diary project

## Related Links

- **[NPM Package](https://www.npmjs.com/package/hua-i18n-sdk)**
- **[GitHub Repository](https://github.com/HUA-Labs/i18n-sdk)**

## Contributing

Bug reports, feature suggestions, and PRs are all welcome!

- **[Issues](https://github.com/HUA-Labs/i18n-sdk/issues)**
- **[Discussions](https://github.com/HUA-Labs/i18n-sdk/discussions)**

---

> **For detailed usage and advanced features, see [API Reference](./docs/API_REFERENCE.md)!**
