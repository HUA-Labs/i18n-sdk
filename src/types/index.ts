export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface TranslationData {
  [namespace: string]: TranslationNamespace;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  tone?: 'emotional' | 'encouraging' | 'calm' | 'gentle' | 'formal' | 'technical' | 'informal';
  formality?: 'informal' | 'casual' | 'formal' | 'polite';
}

export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage?: string;
  supportedLanguages: LanguageConfig[];
  namespaces?: string[];
  loadTranslations: (language: string, namespace: string) => Promise<TranslationNamespace>;
  // 개발 모드 설정
  debug?: boolean;
  // 번역 키가 없을 때의 동작
  missingKeyHandler?: (key: string, language: string, namespace: string) => string;
  // 번역 로딩 실패 시 동작
  errorHandler?: (error: Error, language: string, namespace: string) => void;
}

export interface I18nContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  // hua-api 스타일의 간단한 번역 함수
  t: (key: string, language?: string) => string;
  // 파라미터가 있는 번역 함수
  tWithParams: (key: string, params?: TranslationParams, language?: string) => string;
  // 기존 비동기 번역 함수 (하위 호환성)
  tAsync: (key: string, params?: TranslationParams) => Promise<string>;
  // 기존 동기 번역 함수 (하위 호환성)
  tSync: (key: string, namespace?: string, params?: TranslationParams) => string;
  isLoading: boolean;
  error: Error | null;
  supportedLanguages: LanguageConfig[];
  // 개발자 도구
  debug: {
    getCurrentLanguage: () => string;
    getSupportedLanguages: () => string[];
    getLoadedNamespaces: () => string[];
    getAllTranslations: () => Record<string, Record<string, any>>;
    isReady: () => boolean;
    getInitializationError: () => Error | null;
    clearCache: () => void;
    reloadTranslations: () => Promise<void>;
  };
}

export interface TranslationParams {
  [key: string]: string | number;
} 

// 타입 안전한 번역 키 시스템 (단순화된 버전)
export type TranslationKey<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends string
        ? K
        : T[K] extends Record<string, any>
          ? `${K & string}.${TranslationKey<T[K]> & string}`
          : never;
    }[keyof T]
  : never;

// 타입 안전한 번역 함수들
export interface TypedI18nContextType<T extends TranslationData> extends Omit<I18nContextType, 't' | 'tWithParams' | 'tSync'> {
  // 타입 안전한 번역 함수
  t: <K extends TranslationKey<T>>(key: K, language?: string) => string;
  tWithParams: <K extends TranslationKey<T>>(key: K, params?: TranslationParams, language?: string) => string;
  tSync: <K extends TranslationKey<T>>(key: K, namespace?: string, params?: TranslationParams) => string;
}

// 간단한 번역 키 타입 (무한 재귀 방지)
export type SimpleTranslationKey = string;

// 고급 번역 키 타입 (제한된 깊이)
export type TranslationKeyLegacy<T extends Record<string, any>, D extends number = 3> = 
  [D] extends [never] 
    ? never 
    : T extends Record<string, any>
      ? {
          [K in keyof T]: T[K] extends string 
            ? K 
            : T[K] extends Record<string, any>
              ? `${K & string}.${TranslationKeyLegacy<T[K], Prev<D>> & string}` 
              : never;
        }[keyof T]
      : never;

type Prev<T extends number> = T extends 0 ? never : T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : never;

// 유틸리티 타입들
export type ExtractTranslationKeys<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends string
        ? K
        : T[K] extends Record<string, any>
          ? `${K & string}.${ExtractTranslationKeys<T[K]> & string}`
          : never;
    }[keyof T]
  : never;

// 네임스페이스별 타입 정의를 위한 헬퍼
export type NamespaceKeys<T extends TranslationData, N extends keyof T> = ExtractTranslationKeys<T[N]>;

// 타입 안전한 번역 키 생성 헬퍼
export const createTranslationKey = <T extends TranslationData, N extends keyof T, K extends NamespaceKeys<T, N>>(
  namespace: N,
  key: K
): `${N & string}.${K & string}` => `${String(namespace)}.${String(key)}` as any; 