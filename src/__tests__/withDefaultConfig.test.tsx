import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { I18nProvider, useTranslation } from '../hooks/useI18n';
import { I18nConfig } from '../types';

// Mock translations
const mockTranslations = {
  ko: {
    common: {
      welcome: '환영합니다',
      greeting: '안녕하세요, {{name}}님!'
    }
  },
  en: {
    common: {
      welcome: 'Welcome',
      greeting: 'Hello, {{name}}!'
    }
  }
};

// Mock config that simulates withDefaultConfig
const createMockConfig = (options?: any): I18nConfig => ({
  defaultLanguage: options?.defaultLanguage || 'ko',
  fallbackLanguage: options?.fallbackLanguage || 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: options?.namespaces || ['common'],
  loadTranslations: async (language: string, namespace: string) => {
    return mockTranslations[language as keyof typeof mockTranslations][namespace as keyof typeof mockTranslations.ko];
  },
  debug: options?.debug ?? false,
  missingKeyHandler: (key: string) => {
    if (options?.debug) {
      console.warn(`Missing translation key: ${key}`);
      return `[MISSING: ${key}]`;
    }
    return key;
  },
  errorHandler: (error: any, language: string, namespace: string) => {
    if (options?.debug) {
      console.error(`Translation error for ${language}:${namespace}:`, error);
    }
  },
  autoLanguageSync: options?.autoLanguageSync ?? true,
});

describe('withDefaultConfig', () => {
  it('should create a provider with default configuration', async () => {
    const config = createMockConfig();
    
    const TestComponent = () => {
      const { t } = useTranslation();
      return <div data-testid="test">{t('common.welcome')}</div>;
    };

    render(
      <I18nProvider config={config}>
        <TestComponent />
      </I18nProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const element = screen.getByTestId('test');
    expect(element.textContent).toBe('환영합니다');
  });

  it('should accept custom options', async () => {
    const config = createMockConfig({
      defaultLanguage: 'en',
      namespaces: ['common'],
      debug: true,
    });
    
    const TestComponent = () => {
      const { t } = useTranslation();
      return <div data-testid="test">{t('common.welcome')}</div>;
    };

    render(
      <I18nProvider config={config}>
        <TestComponent />
      </I18nProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const element = screen.getByTestId('test');
    expect(element.textContent).toBe('Welcome');
  });

  it('should handle missing translation keys gracefully', async () => {
    const config = createMockConfig({
      debug: true,
    });
    
    const TestComponent = () => {
      const { t } = useTranslation();
      return <div data-testid="test">{t('common.missing_key')}</div>;
    };

    render(
      <I18nProvider config={config}>
        <TestComponent />
      </I18nProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should return the missing indicator in debug mode
    const element = screen.getByTestId('test');
    expect(element.textContent).toBe('[MISSING: common.missing_key]');
  });

  it('should support parameter interpolation', async () => {
    const config = createMockConfig();
    
    const TestComponent = () => {
      const { tWithParams } = useTranslation();
      return <div data-testid="test">{tWithParams('common.greeting', { name: '철수' })}</div>;
    };

    render(
      <I18nProvider config={config}>
        <TestComponent />
      </I18nProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const element = screen.getByTestId('test');
    expect(element.textContent).toBe('안녕하세요, 철수님!');
  });
}); 