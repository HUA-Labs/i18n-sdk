import { Translator } from '../core/translator';
import { I18nConfig } from '../types';

const mockConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en',
  supportedLanguages: [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  namespaces: ['common', 'diary'],
  loadTranslations: jest.fn().mockImplementation(async (language: string, namespace: string) => {
    const translations: Record<string, Record<string, Record<string, string>>> = {
      ko: {
        common: {
          welcome: '환영합니다',
          hello: '안녕하세요',
        },
        diary: {
          todayEmotion: '오늘의 감정',
          writeDiary: '일기 쓰기',
        },
      },
      en: {
        common: {
          welcome: 'Welcome',
          hello: 'Hello',
        },
        diary: {
          todayEmotion: "Today's Emotion",
          writeDiary: 'Write Diary',
        },
      },
    };
    
    return translations[language]?.[namespace] || {};
  }),
  debug: false,
};

describe('Translator', () => {
  let translator: Translator;

  beforeEach(async () => {
    translator = new Translator(mockConfig);
    await translator.initialize();
  });

  describe('translate', () => {
    it('should translate basic keys', () => {
      expect(translator.translate('common.welcome')).toBe('환영합니다');
      expect(translator.translate('diary.todayEmotion')).toBe('오늘의 감정');
    });

    it('should translate with specific language', () => {
      expect(translator.translate('common.welcome', 'en')).toBe('Welcome');
      expect(translator.translate('diary.todayEmotion', 'en')).toBe("Today's Emotion");
    });

    it('should fallback to default language when translation not found', () => {
      translator.setLanguage('en');
      expect(translator.translate('common.welcome')).toBe('Welcome');
    });

    it('should return key when translation not found', () => {
      expect(translator.translate('nonexistent.key')).toBe('nonexistent.key');
    });
  });

  describe('translateWithParams', () => {
    it('should interpolate parameters', async () => {
      const configWithParams = {
        ...mockConfig,
        loadTranslations: jest.fn().mockResolvedValue({
          greeting: '안녕하세요, {{name}}님!',
        }),
      };
      
      const translatorWithParams = new Translator(configWithParams);
      await translatorWithParams.initialize();
      
      expect(translatorWithParams.translateWithParams('common.greeting', { name: '철수' }))
        .toBe('안녕하세요, 철수님!');
    });
  });

  describe('language switching', () => {
    it('should change current language', () => {
      translator.setLanguage('en');
      expect(translator.getCurrentLanguage()).toBe('en');
    });

    it('should return supported languages', () => {
      expect(translator.getSupportedLanguages()).toEqual(['ko', 'en']);
    });
  });

  describe('debug tools', () => {
    it('should provide debug information', () => {
      const debug = translator.debug();
      expect(debug.getCurrentLanguage()).toBe('ko');
      expect(debug.getSupportedLanguages()).toEqual(['ko', 'en']);
    });
  });
}); 