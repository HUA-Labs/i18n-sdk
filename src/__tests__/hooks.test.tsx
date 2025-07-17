import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useI18n, I18nProvider } from '../hooks/useI18n';
import { I18nConfig } from '../types';
import { TranslatorFactory } from '../core/translator-factory';

// Mock translations
const mockTranslations = {
  ko: {
    common: {
      welcome: '환영합니다',
      hello: '안녕하세요',
      greeting: '안녕하세요, {{name}}님!'
    },
    auth: {
      login: '로그인',
      logout: '로그아웃'
    }
  },
  en: {
    common: {
      welcome: 'Welcome',
      hello: 'Hello',
      greeting: 'Hello, {{name}}!'
    },
    auth: {
      login: 'Login',
      logout: 'Logout'
    }
  }
};

const mockConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ],
  namespaces: ['common', 'auth'],
  loadTranslations: async (language: string, namespace: string) => {
    return mockTranslations[language as keyof typeof mockTranslations][namespace as keyof typeof mockTranslations.ko];
  },
  debug: false
};

// Test component
const TestComponent = () => {
  const { t, tWithParams, currentLanguage, setLanguage, supportedLanguages } = useI18n();

  return (
    <div>
      <div data-testid="welcome">{t('common.welcome')}</div>
      <div data-testid="greeting">{tWithParams('common.greeting', { name: '철수' })}</div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="supported-languages">{supportedLanguages.map(lang => lang.code).join(',')}</div>
      <button 
        data-testid="change-language" 
        onClick={() => setLanguage('en')}
      >
        Change to English
      </button>
    </div>
  );
};

// Wrapper component
const TestWrapper = ({ config }: { config: I18nConfig }) => (
  <I18nProvider config={config}>
    <TestComponent />
  </I18nProvider>
);

describe('useI18n Hook', () => {
  beforeEach(() => {
    // TranslatorFactory 인스턴스 정리
    TranslatorFactory.clear();
    jest.clearAllMocks();
  });

  it('should provide translation function', async () => {
    render(<TestWrapper config={mockConfig} />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const welcomeElement = screen.getByTestId('welcome');
    expect(welcomeElement.textContent).toBe('환영합니다');
  });

  it('should provide translation with parameters', async () => {
    render(<TestWrapper config={mockConfig} />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const greetingElement = screen.getByTestId('greeting');
    expect(greetingElement.textContent).toBe('안녕하세요, 철수님!');
  });

  it('should provide current language', async () => {
    render(<TestWrapper config={mockConfig} />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const languageElement = screen.getByTestId('current-language');
    expect(languageElement.textContent).toBe('ko');
  });

  it('should provide supported languages', async () => {
    render(<TestWrapper config={mockConfig} />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const languagesElement = screen.getByTestId('supported-languages');
    expect(languagesElement.textContent).toBe('ko,en');
  });

  it('should change language when setLanguage is called', async () => {
    render(<TestWrapper config={mockConfig} />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Initially Korean
    const welcomeElement = screen.getByTestId('welcome');
    expect(welcomeElement.textContent).toBe('환영합니다');

    // Change to English
    await act(async () => {
      screen.getByTestId('change-language').click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should now be English
    expect(welcomeElement.textContent).toBe('Welcome');
    
    const languageElement = screen.getByTestId('current-language');
    expect(languageElement.textContent).toBe('en');
  });

  it('should handle missing translation keys', async () => {
    const MissingKeyComponent = () => {
      const { t } = useI18n();
      return <div data-testid="missing-key">{t('common.missing.key')}</div>;
    };

    render(
      <I18nProvider config={mockConfig}>
        <MissingKeyComponent />
      </I18nProvider>
    );
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const missingKeyElement = screen.getByTestId('missing-key');
    expect(missingKeyElement.textContent).toBe('common.missing.key');
  });

  it('should handle nested translation keys', async () => {
    const NestedKeyComponent = () => {
      const { t } = useI18n();
      return <div data-testid="nested-key">{t('auth.login')}</div>;
    };

    render(
      <I18nProvider config={mockConfig}>
        <NestedKeyComponent />
      </I18nProvider>
    );
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const nestedKeyElement = screen.getByTestId('nested-key');
    expect(nestedKeyElement.textContent).toBe('로그인');
  });

  it('should handle debug mode', async () => {
    const debugConfig: I18nConfig = {
      ...mockConfig,
      debug: true
    };

    const DebugComponent = () => {
      const { t } = useI18n();
      return <div data-testid="debug-test">{t('common.welcome')}</div>;
    };

    render(
      <I18nProvider config={debugConfig}>
        <DebugComponent />
      </I18nProvider>
    );
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // 디버그 모드에서 정상적으로 렌더링되는지만 확인
    const debugElement = screen.getByTestId('debug-test');
    expect(debugElement.textContent).toBe('환영합니다');
  });

  it('should handle custom missing key handler', async () => {
    const customConfig: I18nConfig = {
      ...mockConfig,
      loadTranslations: async () => ({}), // 정말로 빈 객체 반환
      missingKeyHandler: (key: string, language: string, namespace: string) => `[MISSING: ${key}]`
    };

    const CustomHandlerComponent = () => {
      const { t, isLoading } = useI18n();
      
      if (isLoading) {
        return <div data-testid="loading">Loading...</div>;
      }
      
      return <div data-testid="custom-handler">{t('auth.notexist')}</div>;
    };

    render(
      <I18nProvider config={customConfig}>
        <CustomHandlerComponent />
      </I18nProvider>
    );
    
    // 로딩이 완료될 때까지 대기
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // 로딩 상태 확인
    const loadingElement = screen.queryByTestId('loading');
    if (loadingElement) {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
    }

    const customHandlerElement = screen.getByTestId('custom-handler');
    expect(customHandlerElement.textContent).toBe('[MISSING: auth.notexist]');
  });

  it('should handle empty translation data', async () => {
    const emptyConfig: I18nConfig = {
      ...mockConfig,
      loadTranslations: async () => ({})
    };

    const EmptyDataComponent = () => {
      const { t, isLoading, debug } = useI18n();
      
      if (isLoading) {
        return <div data-testid="loading">Loading...</div>;
      }
      
      console.log('Empty data test - translations:', debug.getAllTranslations());
      return <div data-testid="empty-data">{t('common.welcome')}</div>;
    };

    render(
      <I18nProvider config={emptyConfig}>
        <EmptyDataComponent />
      </I18nProvider>
    );
    
    // 로딩이 완료될 때까지 대기
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // 로딩 상태 확인
    const loadingElement = screen.queryByTestId('loading');
    if (loadingElement) {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
    }

    const emptyDataElement = screen.getByTestId('empty-data');
    // 빈 번역 데이터가 있을 때는 키 자체가 반환되어야 함
    expect(emptyDataElement.textContent).toBe('common.welcome');
  });
}); 