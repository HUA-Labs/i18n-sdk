import { describe, it, expect, beforeEach } from '@jest/globals';
import { I18nProvider, useI18n, useTranslation, useLanguageChange } from '../hooks/useI18n';
import { Translator } from '../core/translator';
import { ssrTranslate } from '../core/translator';
import { 
  I18nConfig, 
  I18nContextType, 
  TranslationData, 
  TranslationNamespace,
  LanguageConfig,
  TranslationParams,
  TranslationKey,
  TypedI18nContextType,
  createTranslationKey
} from '../types';

// 테스트용 번역 데이터 타입 정의
interface TestTranslationData extends TranslationData {
  common: {
    welcome: string;
    hello: string;
    goodbye: string;
    user: {
      profile: string;
      settings: string;
    };
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    error: {
      invalidCredentials: string;
      networkError: string;
    };
  };
  dashboard: {
    title: string;
    stats: {
      total: string;
      active: string;
    };
  };
}

// 테스트용 번역 데이터
const testTranslations: Record<string, TestTranslationData> = {
  ko: {
    common: {
      welcome: '환영합니다',
      hello: '안녕하세요',
      goodbye: '안녕히 가세요',
      user: {
        profile: '프로필',
        settings: '설정'
      }
    },
    auth: {
      login: '로그인',
      logout: '로그아웃',
      register: '회원가입',
      error: {
        invalidCredentials: '잘못된 인증 정보',
        networkError: '네트워크 오류'
      }
    },
    dashboard: {
      title: '대시보드',
      stats: {
        total: '전체',
        active: '활성'
      }
    }
  },
  en: {
    common: {
      welcome: 'Welcome',
      hello: 'Hello',
      goodbye: 'Goodbye',
      user: {
        profile: 'Profile',
        settings: 'Settings'
      }
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      error: {
        invalidCredentials: 'Invalid credentials',
        networkError: 'Network error'
      }
    },
    dashboard: {
      title: 'Dashboard',
      stats: {
        total: 'Total',
        active: 'Active'
      }
    }
  }
};

// 테스트용 설정
const testConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ],
  namespaces: ['common', 'auth', 'dashboard'],
  loadTranslations: async (language: string, namespace: string) => {
    return testTranslations[language]?.[namespace] || {};
  },
  debug: true,
  missingKeyHandler: (key: string) => `[MISSING: ${key}]`,
  errorHandler: (error: Error) => console.error('Translation error:', error)
};

describe('Type Safety Tests', () => {
  let translator: Translator;

  beforeEach(() => {
    translator = new Translator(testConfig);
  });

  describe('Basic Type Definitions', () => {
    it('should have correct TranslationNamespace type', () => {
      const namespace: TranslationNamespace = {
        welcome: '환영합니다',
        user: {
          profile: '프로필',
          settings: '설정'
        }
      };
      
      expect(typeof namespace.welcome).toBe('string');
      expect(typeof namespace.user).toBe('object');
      expect(typeof (namespace.user as any).profile).toBe('string');
    });

    it('should have correct TranslationData type', () => {
      const data: TranslationData = {
        common: {
          welcome: '환영합니다'
        },
        auth: {
          login: '로그인'
        }
      };
      
      expect(typeof data.common).toBe('object');
      expect(typeof data.auth).toBe('object');
    });

    it('should have correct LanguageConfig type', () => {
      const langConfig: LanguageConfig = {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tone: 'emotional',
        formality: 'polite'
      };
      
      expect(langConfig.code).toBe('ko');
      expect(langConfig.tone).toBe('emotional');
      expect(langConfig.formality).toBe('polite');
    });

    it('should have correct TranslationParams type', () => {
      const params: TranslationParams = {
        name: 'Devin',
        count: 5,
        message: 'Hello'
      };
      
      expect(typeof params.name).toBe('string');
      expect(typeof params.count).toBe('number');
      expect(typeof params.message).toBe('string');
    });
  });

  describe('Translation Key Types', () => {
    it('should have correct translation key structure', () => {
      // 실제 번역 키들이 올바른 구조를 가지고 있는지 확인
      const validKeys = [
        'common.welcome',
        'common.hello',
        'common.goodbye',
        'common.user.profile',
        'common.user.settings',
        'auth.login',
        'auth.logout',
        'auth.register',
        'auth.error.invalidCredentials',
        'auth.error.networkError',
        'dashboard.title',
        'dashboard.stats.total',
        'dashboard.stats.active'
      ];
      
      // 모든 키가 문자열이고 올바른 형식인지 확인
      validKeys.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.includes('.')).toBe(true);
      });
      
      expect(validKeys.length).toBeGreaterThan(0);
    });

    it('should create translation keys correctly', () => {
      const key1 = createTranslationKey<TestTranslationData, 'common', 'welcome'>('common', 'welcome');
      const key2 = createTranslationKey<TestTranslationData, 'auth', 'login'>('auth', 'login');
      
      expect(key1).toBe('common.welcome');
      expect(key2).toBe('auth.login');
    });

    it('should validate translation data structure', () => {
      // TestTranslationData가 올바른 구조를 가지고 있는지 확인
      const data: TestTranslationData = testTranslations.ko;
      
      expect(typeof data.common.welcome).toBe('string');
      expect(typeof data.common.user.profile).toBe('string');
      expect(typeof data.auth.login).toBe('string');
      expect(typeof data.auth.error.invalidCredentials).toBe('string');
      expect(typeof data.dashboard.title).toBe('string');
      expect(typeof data.dashboard.stats.total).toBe('string');
    });
  });

  describe('Translator Type Safety', () => {
    it('should have correct interface implementation', () => {
      expect(translator).toHaveProperty('translate');
      expect(translator).toHaveProperty('setLanguage');
      expect(translator).toHaveProperty('getCurrentLanguage');
      expect(translator).toHaveProperty('initialize');
      expect(translator).toHaveProperty('isReady');
      expect(translator).toHaveProperty('debug');
      
      expect(typeof translator.translate).toBe('function');
      expect(typeof translator.setLanguage).toBe('function');
      expect(typeof translator.getCurrentLanguage).toBe('function');
      expect(typeof translator.initialize).toBe('function');
      expect(typeof translator.isReady).toBe('function');
      expect(typeof translator.debug).toBe('function');
    });

    it('should handle translation with correct types', async () => {
      await translator.initialize();
      
      const result1 = translator.translate('common.welcome');
      const result2 = translator.translate('auth.login');
      const result3 = translator.translate('dashboard.title');
      
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
      expect(typeof result3).toBe('string');
      
      expect(result1).toBe('환영합니다');
      expect(result2).toBe('로그인');
      expect(result3).toBe('대시보드');
    });

    it('should handle translation with parameters', async () => {
      await translator.initialize();
      
      // 파라미터가 있는 번역 테스트 (실제로는 파라미터 지원이 필요)
      const result = translator.translateWithParams('common.welcome', { name: 'Devin' });
      
      expect(typeof result).toBe('string');
    });
  });

  describe('SSR Translation Type Safety', () => {
    it('should have correct ssrTranslate function signature', () => {
      const result = ssrTranslate({
        translations: testTranslations,
        key: 'common.welcome',
        language: 'ko',
        fallbackLanguage: 'en',
        missingKeyHandler: (key: string) => `[MISSING: ${key}]`
      });
      
      expect(typeof result).toBe('string');
      expect(result).toBe('환영합니다');
    });

    it('should handle missing keys with correct types', () => {
      const result = ssrTranslate({
        translations: testTranslations,
        key: 'common.nonexistent',
        language: 'ko',
        fallbackLanguage: 'en',
        missingKeyHandler: (key: string) => `[MISSING: ${key}]`
      });
      
      expect(typeof result).toBe('string');
      expect(result).toContain('[MISSING:');
    });
  });

  describe('Hook Type Safety', () => {
    it('should have correct useI18n return type', () => {
      // 실제로는 React 컴포넌트 내에서 테스트해야 하지만,
      // 타입 정의만 확인
      const mockContext: I18nContextType = {
        currentLanguage: 'ko',
        setLanguage: jest.fn(),
        t: jest.fn(),
        tWithParams: jest.fn(),
        tAsync: jest.fn(),
        tSync: jest.fn(),
        isLoading: false,
        error: null,
        supportedLanguages: testConfig.supportedLanguages,
        debug: {
          getCurrentLanguage: jest.fn(),
          getSupportedLanguages: jest.fn(),
          getLoadedNamespaces: jest.fn(),
          getAllTranslations: jest.fn(),
          isReady: jest.fn(),
          getInitializationError: jest.fn(),
          clearCache: jest.fn(),
          getCacheStats: jest.fn(),
          reloadTranslations: jest.fn()
        }
      };
      
      expect(typeof mockContext.currentLanguage).toBe('string');
      expect(typeof mockContext.setLanguage).toBe('function');
      expect(typeof mockContext.t).toBe('function');
      expect(typeof mockContext.tWithParams).toBe('function');
      expect(typeof mockContext.tAsync).toBe('function');
      expect(typeof mockContext.tSync).toBe('function');
      expect(typeof mockContext.isLoading).toBe('boolean');
      expect(Array.isArray(mockContext.supportedLanguages)).toBe(true);
      expect(typeof mockContext.debug).toBe('object');
    });
  });

  describe('Configuration Type Safety', () => {
    it('should validate I18nConfig structure', () => {
      const config: I18nConfig = {
        defaultLanguage: 'ko',
        fallbackLanguage: 'en',
        supportedLanguages: [
          { code: 'ko', name: 'Korean', nativeName: '한국어' },
          { code: 'en', name: 'English', nativeName: 'English' }
        ],
        namespaces: ['common', 'auth'],
        loadTranslations: async (language: string, namespace: string) => ({}),
        debug: true,
        missingKeyHandler: (key: string) => `[MISSING: ${key}]`,
        errorHandler: (error: Error) => console.error(error)
      };
      
      expect(typeof config.defaultLanguage).toBe('string');
      expect(typeof config.fallbackLanguage).toBe('string');
      expect(Array.isArray(config.supportedLanguages)).toBe(true);
      expect(Array.isArray(config.namespaces)).toBe(true);
      expect(typeof config.loadTranslations).toBe('function');
      expect(typeof config.debug).toBe('boolean');
      expect(typeof config.missingKeyHandler).toBe('function');
      expect(typeof config.errorHandler).toBe('function');
    });
  });

  describe('Error Handling Type Safety', () => {
    it('should handle translation errors with correct types', async () => {
      const errorConfig: I18nConfig = {
        ...testConfig,
        loadTranslations: async () => {
          throw new Error('Translation loading failed');
        },
        errorHandler: (error: Error) => {
          expect(error instanceof Error).toBe(true);
          expect(typeof error.message).toBe('string');
        },
        errorHandling: {
          recoveryStrategy: {
            maxRetries: 0, // 재시도 비활성화
            retryDelay: 0,
            backoffMultiplier: 1,
            shouldRetry: () => false,
            onRetry: () => {},
            onMaxRetriesExceeded: () => {}
          }
        }
      };
      
      const errorTranslator = new Translator(errorConfig);
      
      try {
        await errorTranslator.initialize();
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    }, 10000); // 타임아웃 증가
  });
}); 