# hua-i18n-sdk

> 💡 **This library is optimized for the hua API style, but can be easily used in any React project.**
>
> ⚠️ This is not officially maintained/support may be limited. The way you import translation files may differ depending on your build environment (Next.js, Vite, Webpack, etc). See the environment-specific examples below.

A simple and powerful internationalization SDK for React applications, inspired by hua-api's translation system.

## Features

- 🚀 **Simple API**: hua-api style simple translation function
- ⚡ **Fast**: Pre-loaded translations with fallback support
- 🔧 **Developer Friendly**: Easy setup and debugging tools
- 🌍 **Multi-language**: Support for Korean, English, and more
- 🎯 **Type Safe**: Full TypeScript support
- 📦 **Lightweight**: Minimal bundle size

## Installation

```bash
npm install hua-i18n-sdk
```

## Quick Start

### 1. Create Translation Files

Create JSON translation files for each language and namespace:

```json
// translations/en/diary.json
{
  "todayEmotion": "Today's Emotion",
  "writeDiaryPrompt": "How was your day today?",
  "emotionTracking": "Emotion Tracking",
  "aiAnalysis": "AI Analysis",
  "patternAnalysis": "Pattern Analysis",
  "writeTodayDiary": "Write Today's Diary",
  "weeklyStats": "Weekly Statistics",
  "writtenDiaries": "Written Diaries",
  "averageEmotionScore": "Average Emotion Score",
  "consecutiveDays": "Consecutive Days",
  "recentDiaries": "Recent Diaries",
  "newStart": "New Beginning",
  "expectation": "Expectation",
  "quietDay": "Quiet Day",
  "tranquility": "Tranquility",
  "challengeDay": "Day of Challenge",
  "passion": "Passion"
}
```

### 2. Setup I18nProvider

```tsx
// app/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en', // Use English as fallback for global service
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['diary', 'admin', 'common'],
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
  missingKeyHandler: (key: string) => key,
};
```

```tsx
// app/layout.tsx
import { I18nProvider } from 'hua-i18n-sdk';
import { i18nConfig } from './i18n-config';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <I18nProvider config={i18nConfig}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 3. Use Translations

```tsx
// app/page.tsx
import { useTranslation } from 'hua-i18n-sdk';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('diary.todayEmotion')}</h1>
      <p>{t('diary.writeDiaryPrompt')}</p>
      <button>{t('diary.writeTodayDiary')}</button>
    </div>
  );
}
```

## Environment-specific translation file import examples

### Next.js (recommended)

```ts
const module = await import(`../translations/${language}/${namespace}.json`);
return module.default;
```

### Vite

```ts
// Use import.meta.glob in Vite
const modules = import.meta.glob('../translations/*/*.json');
const key = `../translations/${language}/${namespace}.json`;
const loader = modules[key];
if (loader) {
  const mod = await loader();
  return mod.default || mod;
}
return {};
```

### Webpack

```ts
// Use require.context in Webpack
const context = require.context('../translations', true, /\.json$/);
const key = `./${language}/${namespace}.json`;
if (context.keys().includes(key)) {
  return context(key);
}
return {};
```

---

## API Reference

### useTranslation()

The main hook for translations:

```tsx
const { t, tWithParams, currentLanguage, setLanguage, isLoading, supportedLanguages } = useTranslation();
```

#### `t(key: string, language?: string): string`

Simple translation function:

```tsx
// Basic usage
t('diary.todayEmotion') // "오늘의 감정"
// With specific language
t('diary.todayEmotion', 'en') // "Today's Emotion"
```

#### `tWithParams(key: string, params?: TranslationParams, language?: string): string`

Translation with parameter interpolation:

```tsx
// Translation file: { "welcome": "Hello, {{name}}!" }
tWithParams('diary.welcome', { name: 'Chulsoo' }) // "Hello, Chulsoo!"
```

### useLanguageChange()

Hook for language switching:

```tsx
const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageChange();
changeLanguage('en');
```

### Language Switcher Component

```tsx
import { useLanguageChange } from 'hua-i18n-sdk';

export function LanguageSwitcher() {
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

## Advanced Usage

### Debug Page

A dedicated debug page for developers, translators, and product managers:

```tsx
// app/i18n-debug/page.tsx
import { I18nDebugPage } from 'hua-i18n-sdk';

export default function DebugPage() {
  return <I18nDebugPage />;
}
```

This page lets you:

- 📊 Check translation system status (init, language, namespaces)
- 🔍 Test translations in real time
- 📚 Search and filter all translation data
- 🗑️ Manage cache and reload translations
- ⚠️ See missing keys and errors

### Debug Tools (Programmatic)

```tsx
import { useI18n } from 'hua-i18n-sdk';

function DebugPanel() {
  const { debug } = useI18n();
  
  return (
    <div>
      <p>Current Language: {debug.getCurrentLanguage()}</p>
      <p>Supported Languages: {debug.getSupportedLanguages().join(', ')}</p>
      <p>Loaded Namespaces: {debug.getLoadedNamespaces().join(', ')}</p>
      <button onClick={() => debug.clearCache()}>Clear Cache</button>
      <button onClick={() => debug.reloadTranslations()}>Reload Translations</button>
    </div>
  );
}
```

### Type Safety

TypeScript support for translation key autocomplete and type checking:

```tsx
import { createTranslationKey } from 'hua-i18n-sdk';

// Type-safe translation key creation
const keys = {
  diary: createTranslationKey('diary', 'todayEmotion'),
  admin: createTranslationKey('admin', 'dashboard'),
} as const;

t(keys.diary); // ✅ Type safe
t('diary.todayEmotion'); // ✅ String also supported
```

### Custom Configuration

```tsx
const customConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ],
  namespaces: ['common', 'diary', 'admin'],
  loadTranslations: async (language: string, namespace: string) => {
    // Custom loading logic
    const response = await fetch(`/api/translations/${language}/${namespace}`);
    return response.json();
  },
  debug: true,
  missingKeyHandler: (key: string, language: string, namespace: string) => {
    console.warn(`Missing translation: ${key} (${language}:${namespace})`);
    return `[MISSING: ${key}]`;
  },
  errorHandler: (error: Error, language: string, namespace: string) => {
    console.error(`Translation error for ${language}:${namespace}:`, error);
  },
};
```

## Migration from Previous Version

### Before (Complex)

```tsx
import { useI18n, useAutoLoadNamespace } from 'hua-i18n-sdk';

export default function Page() {
  const { tSync } = useI18n();
  useAutoLoadNamespace('diary');
  
  return <h1>{tSync('todayEmotion', 'diary')}</h1>;
}
```

### After (Simple)

```tsx
import { useTranslation } from 'hua-i18n-sdk';

export default function Page() {
  const { t } = useTranslation();
  
  return <h1>{t('diary.todayEmotion')}</h1>;
}
```

## Best Practices

1. **Use dot notation for keys**: `namespace.key` format
2. **Keep translations flat**: Avoid deep nesting
3. **Use meaningful namespaces**: Group related translations
4. **Provide fallback translations**: For global services, use `ko → en → [MISSING]` flow
5. **Use debug mode in development**: Helps catch missing translations
6. **Leverage type safety**: Use TypeScript for translation key autocomplete

## Troubleshooting

### Translation keys showing instead of translated text

1. Check if the namespace is included in the config
2. Verify the translation file exists and is valid JSON
3. Check browser console for loading errors
4. Use debug mode to see loaded namespaces

### Performance Issues

1. All translations are pre-loaded on initialization
2. Use the debug tools to monitor cache usage
3. Clear cache if needed: `debug.clearCache()`

## License

MIT

## TODO

- [ ] Add Storybook example
- [ ] More environment-specific import examples
- [ ] Add real-world project example
