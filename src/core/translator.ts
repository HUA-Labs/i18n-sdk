import { TranslationNamespace, TranslationData, I18nConfig, TranslationParams } from '../types';

export class Translator {
  private config: I18nConfig;
  private cache: Map<string, TranslationNamespace> = new Map();
  private currentLanguage: string;
  private loadedNamespaces: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<TranslationNamespace>> = new Map();
  private allTranslations: Record<string, Record<string, any>> = {};
  private isInitialized: boolean = false;
  private initializationError: Error | null = null;

  constructor(config: I18nConfig) {
    this.config = {
      fallbackLanguage: 'en', // 글로벌 서비스를 위해 영어로 변경
      namespaces: ['common'],
      debug: false,
      missingKeyHandler: (key: string) => key,
      errorHandler: (error: Error) => console.warn('Translation error:', error),
      ...config
    };
    this.currentLanguage = config.defaultLanguage;
  }

  /**
   * 모든 번역 데이터를 미리 로드 (hua-api 스타일)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const languages = [this.currentLanguage];
      if (this.config.fallbackLanguage && this.config.fallbackLanguage !== this.currentLanguage) {
        languages.push(this.config.fallbackLanguage);
      }

      for (const language of languages) {
        this.allTranslations[language] = {};
        
        for (const namespace of this.config.namespaces || []) {
          try {
            const data = await this.config.loadTranslations(language, namespace);
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
                  this.config.errorHandler(fallbackError as Error, this.config.fallbackLanguage!, namespace);
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
    } catch (error) {
      this.initializationError = error as Error;
      if (this.config.errorHandler) {
        this.config.errorHandler(this.initializationError, this.currentLanguage, 'initialization');
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
      return this.config.missingKeyHandler ? this.config.missingKeyHandler(key, language || this.currentLanguage, '') : key;
    }

    if (!key || typeof key !== 'string') {
      console.warn('Invalid translation key:', key);
      return '';
    }

    const targetLanguage = language || this.currentLanguage;
    
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
      return this.config.missingKeyHandler ? this.config.missingKeyHandler(key, targetLanguage, '') : key;
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

      // 2차: 폴백 언어에서 찾기 (ko → en → [MISSING] 흐름)
      if (language !== this.config.fallbackLanguage && this.config.fallbackLanguage) {
        const fallbackValue = this.getNestedValue(
          this.allTranslations[this.config.fallbackLanguage]?.[namespace], 
          key
        );
        if (typeof fallbackValue === 'string') {
          if (this.config.debug) {
            console.log(`[i18n] Fallback: ${language} → ${this.config.fallbackLanguage} for key: ${namespace}.${key}`);
          }
          return fallbackValue;
        }
      }

      // 3차: common 네임스페이스에서 찾기 (다른 네임스페이스인 경우)
      if (namespace !== 'common') {
        const commonValue = this.getNestedValue(this.allTranslations[language]?.['common'], key);
        if (typeof commonValue === 'string') {
          if (this.config.debug) {
            console.log(`[i18n] Common fallback for key: ${namespace}.${key}`);
          }
          return commonValue;
        }
      }

      // 4차: 번역 키를 찾을 수 없는 경우
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
  private getNestedValue(obj: any, path: string): string | undefined {
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
  private interpolate(text: string, params?: TranslationParams): string {
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
  translateWithParams(key: string, params?: TranslationParams, language?: string): string {
    try {
      const translated = this.translate(key, language);
      return this.interpolate(translated, params);
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

    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
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
    return this.currentLanguage;
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
      getCurrentLanguage: () => this.currentLanguage,
      getSupportedLanguages: () => this.getSupportedLanguages(),
      getLoadedNamespaces: () => Array.from(this.loadedNamespaces),
      getAllTranslations: () => this.allTranslations,
      isReady: () => this.isReady(),
      getInitializationError: () => this.getInitializationError(),
      clearCache: () => this.clearCache(),
    };
  }

  // 기존 메서드들 (하위 호환성을 위해 유지)
  async translateAsync(key: string, params?: TranslationParams): Promise<string> {
    try {
      const { namespace, key: translationKey } = this.parseKey(key);
      
      // 현재 언어로 번역 시도
      let translationData = await this.loadTranslationData(this.currentLanguage, namespace);
      let translation = this.getNestedValue(translationData, translationKey);
      
      // 현재 언어에서 찾지 못한 경우 폴백 언어로 시도
      if (!translation && this.currentLanguage !== this.config.fallbackLanguage) {
        translationData = await this.loadTranslationData(this.config.fallbackLanguage!, namespace);
        translation = this.getNestedValue(translationData, translationKey);
      }
      
      // 번역을 찾지 못한 경우
      if (!translation) {
        if (this.config.missingKeyHandler) {
          return this.config.missingKeyHandler(key, this.currentLanguage, namespace);
        }
        if (this.config.debug) {
          console.warn(`Translation not found for key: ${key}`);
        }
        return key;
    }

      return this.interpolate(translation, params);
    } catch (error) {
      console.error('Error in translateAsync:', error);
      return key;
    }
  }

  translateSync(key: string, params?: TranslationParams): string {
    try {
      const { namespace, key: translationKey } = this.parseKey(key);
      
      // 현재 언어의 캐시된 데이터 확인
      const currentCacheKey = `${this.currentLanguage}:${namespace}`;
      if (this.cache.has(currentCacheKey)) {
        const translationData = this.cache.get(currentCacheKey)!;
        const translation = this.getNestedValue(translationData, translationKey);
        if (translation) {
          return this.interpolate(translation, params);
        }
      }
      
      // 폴백 언어의 캐시된 데이터 확인
      if (this.currentLanguage !== this.config.fallbackLanguage) {
        const fallbackCacheKey = `${this.config.fallbackLanguage}:${namespace}`;
        if (this.cache.has(fallbackCacheKey)) {
          const translationData = this.cache.get(fallbackCacheKey)!;
          const translation = this.getNestedValue(translationData, translationKey);
          if (translation) {
            return this.interpolate(translation, params);
          }
        }
      }
      
      // 캐시에 없으면 키 반환
      if (this.config.missingKeyHandler) {
        return this.config.missingKeyHandler(key, this.currentLanguage, namespace);
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

  private async loadTranslationData(language: string, namespace: string): Promise<TranslationNamespace> {
    const cacheKey = `${language}:${namespace}`;
    
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
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

  private async _loadTranslationData(language: string, namespace: string): Promise<TranslationNamespace> {
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
          const fallbackData = await this.config.loadTranslations(this.config.fallbackLanguage!, namespace);
          this.cache.set(cacheKey, fallbackData);
          this.loadedNamespaces.add(namespace);
          return fallbackData;
        } catch (fallbackError) {
          if (this.config.errorHandler) {
            this.config.errorHandler(fallbackError as Error, this.config.fallbackLanguage!, namespace);
          }
        }
      }
      
      return {};
    }
  }
} 