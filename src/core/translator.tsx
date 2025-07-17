export interface TranslatorInterface {
  translate(key: string, language?: string): string;
  setLanguage(lang: string): void;
  getCurrentLanguage(): string;
  initialize(): Promise<void>;
  isReady(): boolean;
  debug(): any;
}

export class Translator implements TranslatorInterface {
  private cache = new Map();
  private loadedNamespaces = new Set<string>();
  private loadingPromises = new Map();
  private allTranslations: Record<string, Record<string, Record<string, string>>> = {};
  private isInitialized = false;
  private initializationError: Error | null = null;
  private config: any;
  private currentLang: string = 'en';

  constructor(config: any) {
    this.config = {
      fallbackLanguage: 'en',
      namespaces: ['common'],
      debug: false,
      missingKeyHandler: (key: string) => key,
      errorHandler: (error: Error) => console.warn('Translation error:', error),
      ...config
    };
    this.currentLang = config.defaultLanguage;
  }

  /**
   * 모든 번역 데이터를 미리 로드 (hua-api 스타일)
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Ensure allTranslations is initialized
      if (!this.allTranslations) {
        this.allTranslations = {};
      }
      
      const languages = [this.currentLang];
      if (this.config.fallbackLanguage && this.config.fallbackLanguage !== this.currentLang) {
        languages.push(this.config.fallbackLanguage);
      }

      console.log('Initializing translator with languages:', languages);
      console.log('Current language:', this.currentLang);
      console.log('Config namespaces:', this.config.namespaces);

      for (const language of languages) {
        console.log('Processing language:', language);
        if (!this.allTranslations[language]) {
          this.allTranslations[language] = {};
        }
        
        for (const namespace of this.config.namespaces || []) {
          console.log('Loading namespace:', namespace, 'for language:', language);
          try {
            const data = await this.config.loadTranslations(language, namespace);
            console.log('Loaded data for', language, namespace, ':', data);
            this.allTranslations[language][namespace] = data;
            this.cache.set(`${language}:${namespace}`, data);
          } catch (error) {
            const translationError = error as Error;
            if (this.config.errorHandler) {
              this.config.errorHandler(translationError, language, namespace);
            }
            // 폴백 언어로 시도
            if (language !== this.config.fallbackLanguage && this.config.fallbackLanguage) {
              try {
                const fallbackData = await this.config.loadTranslations(this.config.fallbackLanguage, namespace);
                this.allTranslations[language][namespace] = fallbackData;
                this.cache.set(`${language}:${namespace}`, fallbackData);
              } catch (fallbackError) {
                if (this.config.errorHandler) {
                  this.config.errorHandler(fallbackError as Error, this.config.fallbackLanguage, namespace);
                }
                // 최종 폴백: 빈 객체
                this.allTranslations[language][namespace] = {};
              }
            } else {
              // 폴백 언어도 실패하면 빈 객체
              this.allTranslations[language][namespace] = {};
            }
          }
        }
      }

      this.isInitialized = true;
      this.initializationError = null;
      console.log('Translator initialized successfully:', this.allTranslations);
    } catch (error) {
      this.initializationError = error as Error;
      if (this.config.errorHandler) {
        this.config.errorHandler(this.initializationError, this.currentLang, 'initialization');
      }
      throw this.initializationError;
    }
  }

  /**
   * hua-api 스타일의 간단한 번역 함수
   */
  translate(key: string, language?: string): string {
    if (!this.isInitialized) {
      if (this.initializationError) {
        console.warn('Translator not initialized due to error:', this.initializationError.message);
      } else {
        console.warn('Translator not initialized. Call initialize() first.');
      }
      return this.config.missingKeyHandler ? this.config.missingKeyHandler(key, language || this.currentLang, key) : key;
    }

    if (!key || typeof key !== 'string') {
      console.warn('Invalid translation key:', key);
      return '';
    }

    const targetLanguage = language || this.currentLang;

    try {
      // 키를 네임스페이스와 키로 분리
      const parts = key.split('.');
      if (parts.length === 1) {
        // 단일 키인 경우 common 네임스페이스에서 찾기
        return this.findInNamespace('common', parts[0], targetLanguage);
      }
      // 첫 번째 부분을 네임스페이스로, 나머지를 키로
      const namespace = parts[0];
      const translationKey = parts.slice(1).join('.');
      return this.findInNamespace(namespace, translationKey, targetLanguage);
    } catch (error) {
      console.error('Translation error for key:', key, error);
      return this.config.missingKeyHandler ? this.config.missingKeyHandler(key, targetLanguage, key) : key;
    }
  }

  /**
   * 특정 네임스페이스에서 키 찾기 (개선된 fallback 체인)
   */
  private findInNamespace(namespace: string, key: string, language: string): string {
    try {
      // 1차: 요청된 언어에서 찾기
      const value = this.getNestedValue(this.allTranslations[language]?.[namespace], key);
      if (typeof value === 'string') {
        return value;
      }

      // 2: 폴백 언어에서 찾기 (ko → en → [MISSING] 흐름)
      if (language !== this.config.fallbackLanguage && this.config.fallbackLanguage) {
        const fallbackValue = this.getNestedValue(this.allTranslations[this.config.fallbackLanguage]?.[namespace], key);
        if (typeof fallbackValue === 'string') {
          if (this.config.debug) {
            console.log(`[i18n] Fallback: ${language} → ${this.config.fallbackLanguage} for key: ${namespace}.${key}`);
          }
          return fallbackValue;
        }
      }

      //3차: common 네임스페이스에서 찾기 (다른 네임스페이스인 경우)
      if (namespace !== 'common') {
        const commonValue = this.getNestedValue(this.allTranslations[language]?.['common'], key);
        if (typeof commonValue === 'string') {
          if (this.config.debug) {
            console.log(`[i18n] Common fallback for key: ${namespace}.${key}`);
          }
          return commonValue;
        }
      }

      //4: 번역 키를 찾을 수 없는 경우
      if (this.config.missingKeyHandler) {
        return this.config.missingKeyHandler(`${namespace}.${key}`, language, namespace);
      }
      return `${namespace}.${key}`;
    } catch (error) {
      console.error('Error finding translation for namespace:', namespace, 'key:', key, error);
      return `${namespace}.${key}`;
    }
  }

  /**
   * 중첩된 객체에서 키 값을 찾기
   */
  private getNestedValue(obj: any, path: string): any {
    if (!obj || typeof obj !== 'object') {
      return undefined;
    }

    try {
      return path.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
      }, obj);
    } catch (error) {
      console.error('Error accessing nested value for path:', path, error);
      return undefined;
    }
  }

  /**
   * 번역 텍스트에서 파라미터 치환
   */
  private interpolate(text: string, params: Record<string, any>): string {
    if (!params || typeof text !== 'string') {
      return text;
    }

    try {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const value = params[key];
        if (value === undefined || value === null) {
          console.warn(`Missing parameter: ${key} in translation: ${text}`);
          return match;
        }
        return value.toString();
      });
    } catch (error) {
      console.error('Error interpolating parameters:', error);
      return text;
    }
  }

  /**
   * 파라미터가 있는 번역 함수
   */
  translateWithParams(key: string, params?: Record<string, any>, language?: string): string {
    try {
      const translated = this.translate(key, language);
      return params ? this.interpolate(translated, params) : translated;
    } catch (error) {
      console.error('Error in translateWithParams:', error);
      return key;
    }
  }

  /**
   * 언어 변경
   */
  setLanguage(language: string): void {
    if (!language || typeof language !== 'string') {
      console.warn('Invalid language:', language);
      return;
    }

    if (this.currentLang !== language) {
      this.currentLang = language;
      // 새로운 언어의 번역 데이터가 없으면 로드
      if (!this.allTranslations[language]) {
        this.loadLanguageData(language).catch(error => {
          console.error('Error loading language data for:', language, error);
        });
      }
    }
  }

  /**
   * 새로운 언어 데이터 로드
   */
  private async loadLanguageData(language: string): Promise<void> {
    try {
      this.allTranslations[language] = {};
      for (const namespace of this.config.namespaces || []) {
        try {
          const data = await this.config.loadTranslations(language, namespace);
          this.allTranslations[language][namespace] = data;
          this.cache.set(`${language}:${namespace}`, data);
        } catch (error) {
          if (this.config.errorHandler) {
            this.config.errorHandler(error as Error, language, namespace);
          }
          // 에러 발생 시 빈 객체로 설정
          this.allTranslations[language][namespace] = {};
        }
      }
    } catch (error) {
      console.error('Failed to load language data for:', language, error);
      throw error;
    }
  }

  /**
   * 현재 언어 반환
   */
  getCurrentLanguage(): string {
    return this.currentLang;
  }

  /**
   * 지원 언어 목록 반환
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.allTranslations);
  }

  /**
   * 초기화 상태 확인
   */
  isReady(): boolean {
    return this.isInitialized && !this.initializationError;
  }

  /**
   * 초기화 에러 확인
   */
  getInitializationError(): Error | null {
    return this.initializationError;
  }

  /**
   * 캐시 클리어
   */
  clearCache(): void {
    this.cache.clear();
    this.loadedNamespaces.clear();
    this.loadingPromises.clear();
  }

  /**
   * 개발자 도구
   */
  debug() {
    return {
      getCurrentLanguage: () => this.currentLang,
      getSupportedLanguages: () => this.getSupportedLanguages(),
      getLoadedNamespaces: () => Array.from(this.loadedNamespaces),
      getAllTranslations: () => this.allTranslations,
      isReady: () => this.isReady(),
      getInitializationError: () => this.getInitializationError(),
      clearCache: () => this.clearCache(),
    };
  }

  /**
   * SSR에서 하이드레이션을 위한 데이터 설정
   */
  hydrateFromSSR(translations: Record<string, Record<string, any>>) {
    this.allTranslations = translations;
    // 캐시도 함께 채움
    for (const language of Object.keys(translations)) {
      for (const namespace of Object.keys(translations[language])) {
        this.cache.set(`${language}:${namespace}`, translations[language][namespace]);
      }
    }
    this.isInitialized = true;
  }

  // 기존 메서드들 (하위 호환성을 위해 유지)
  async translateAsync(key: string, params?: Record<string, any>): Promise<string> {
    try {
      const { namespace, key: translationKey } = this.parseKey(key);
      // 현재 언어로 번역 시도
      let translationData = await this.loadTranslationData(this.currentLang, namespace);
      let translation = this.getNestedValue(translationData, translationKey);
      // 현재 언어에서 찾지 못한 경우 폴백 언어로 시도
      if (!translation && this.currentLang !== this.config.fallbackLanguage) {
        translationData = await this.loadTranslationData(this.config.fallbackLanguage, namespace);
        translation = this.getNestedValue(translationData, translationKey);
      }
      // 번역을 찾지 못한 경우
      if (!translation) {
        if (this.config.missingKeyHandler) {
          return this.config.missingKeyHandler(key, this.currentLang, namespace);
        }
        if (this.config.debug) {
          console.warn(`Translation not found for key: ${key}`);
        }
        return key;
      }
      return params ? this.interpolate(translation, params) : translation;
    } catch (error) {
      console.error('Error in translateAsync:', error);
      return key;
    }
  }

  translateSync(key: string, params?: Record<string, any>): string {
    try {
      const { namespace, key: translationKey } = this.parseKey(key);
      // 현재 언어의 캐시된 데이터 확인
      const currentCacheKey = `${this.currentLang}:${namespace}`;
      if (this.cache.has(currentCacheKey)) {
        const translationData = this.cache.get(currentCacheKey);
        const translation = this.getNestedValue(translationData, translationKey);
        if (translation) {
          return params ? this.interpolate(translation, params) : translation;
        }
      }
      // 폴백 언어의 캐시된 데이터 확인
      if (this.currentLang !== this.config.fallbackLanguage) {
        const fallbackCacheKey = `${this.config.fallbackLanguage}:${namespace}`;
        if (this.cache.has(fallbackCacheKey)) {
          const translationData = this.cache.get(fallbackCacheKey);
          const translation = this.getNestedValue(translationData, translationKey);
          if (translation) {
            return params ? this.interpolate(translation, params) : translation;
          }
        }
      }
      // 캐시에 없으면 키 반환
      if (this.config.missingKeyHandler) {
        return this.config.missingKeyHandler(key, this.currentLang, namespace);
      }
      return key;
    } catch (error) {
      console.error('Error in translateSync:', error);
      return key;
    }
  }

  private parseKey(key: string): { namespace: string; key: string } {
    const parts = key.split('.');
    if (parts.length === 1) {
      return { namespace: 'common', key: parts[0] };
    }
    return { namespace: parts[0], key: parts.slice(1).join('.') };
  }

  private async loadTranslationData(language: string, namespace: string): Promise<Record<string, any>> {
    const cacheKey = `${language}:${namespace}`;
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const loadingPromise = this._loadTranslationData(language, namespace);
    this.loadingPromises.set(cacheKey, loadingPromise);
    try {
      const result = await loadingPromise;
      this.loadingPromises.delete(cacheKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  private async _loadTranslationData(language: string, namespace: string): Promise<Record<string, any>> {
    const cacheKey = `${language}:${namespace}`;
    try {
      const data = await this.config.loadTranslations(language, namespace);
      this.cache.set(cacheKey, data);
      this.loadedNamespaces.add(namespace);
      if (this.config.debug) {
        console.log(`Loaded translations for ${language}:${namespace}`, data);
      }
      return data;
    } catch (error) {
      if (this.config.errorHandler) {
        this.config.errorHandler(error as Error, language, namespace);
      }
      if (language !== this.config.fallbackLanguage) {
        try {
          const fallbackData = await this.config.loadTranslations(this.config.fallbackLanguage, namespace);
          this.cache.set(cacheKey, fallbackData);
          this.loadedNamespaces.add(namespace);
          return fallbackData;
        } catch (fallbackError) {
          if (this.config.errorHandler) {
            this.config.errorHandler(fallbackError as Error, this.config.fallbackLanguage, namespace);
          }
        }
      }
      return {};
    }
  }
}

/**
 * SSR 전용 번역 함수 (서버에서 동기적으로 번역)
 */
export function ssrTranslate({
  translations, 
  key, 
  language = 'ko', 
  fallbackLanguage = 'en', 
  missingKeyHandler = (key: string) => key 
}: {
  translations: Record<string, Record<string, any>>;
  key: string;
  language?: string;
  fallbackLanguage?: string;
  missingKeyHandler?: (key: string) => string;
}): string {
  if (!key || typeof key !== 'string') {
    return '';
  }
  try {
    // 키를 네임스페이스와 키로 분리
    const parts = key.split('.');
    if (parts.length === 1) {
      // 단일 키인 경우 common 네임스페이스에서 찾기
      return ssrFindInNamespace(translations, 'common', parts[0], language, fallbackLanguage, missingKeyHandler);
    }
    // 첫 번째 부분을 네임스페이스로, 나머지를 키로
    const namespace = parts[0];
    const translationKey = parts.slice(1).join('.');
    return ssrFindInNamespace(translations, namespace, translationKey, language, fallbackLanguage, missingKeyHandler);
  }
  catch (error) {
    console.error('SSR Translation error for key:', key, error);
    return missingKeyHandler(key);
  }
}

/**
 * SSR에서 특정 네임스페이스에서 키 찾기
 */
function ssrFindInNamespace(
  translations: Record<string, Record<string, any>>, 
  namespace: string, 
  key: string, 
  language: string, 
  fallbackLanguage: string, 
  missingKeyHandler: (key: string) => string
): string {
  try {
    // 1차: 요청된 언어에서 찾기
    const value = getNestedValue(translations[language]?.[namespace], key);
    if (typeof value === 'string') {
      return value;
    }
    // 2: 폴백 언어에서 찾기 (ko → en → [MISSING] 흐름)
    if (language !== fallbackLanguage) {
      const fallbackValue = getNestedValue(translations[fallbackLanguage]?.[namespace], key);
      if (typeof fallbackValue === 'string') {
        return fallbackValue;
      }
    }
    //3차: common 네임스페이스에서 찾기 (다른 네임스페이스인 경우)
    if (namespace !== 'common') {
      const commonValue = getNestedValue(translations[language]?.['common'], key);
      if (typeof commonValue === 'string') {
        return commonValue;
      }
    }
    //4: 번역 키를 찾을 수 없는 경우
    return missingKeyHandler(`${namespace}.${key}`);
  }
  catch (error) {
    console.error('Error finding SSR translation for namespace:', namespace, 'key:', key, error);
    return missingKeyHandler(`${namespace}.${key}`);
  }
}

/**
 * 중첩된 객체에서 키 값을 찾기 (SSR용)
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  try {
    return path.split('.').reduce((current: any, key: string) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }
  catch (error) {
    console.error('Error accessing nested value for path:', path, error);
    return undefined;
  }
}