/**
 * hua-i18n-sdk/easy - 초보자 친화적 엔트리포인트
 * 
 * 이 모듈은 초보자들이 쉽게 시작할 수 있도록 설계되었습니다.
 * 복잡한 설정 없이 바로 사용할 수 있는 함수들만 제공합니다.
 */

import React from 'react';
import { I18nProvider, useI18n, useTranslation, useLanguageChange } from './hooks/useI18n';
import { I18nConfig } from './types';

// 기본 언어 설정
const defaultLanguages = [
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

// 기본 파일 로더 (translations/ko/common.json 형태)
function createDefaultFileLoader() {
  return async (language: string, namespace: string) => {
    try {
      // 동적 import를 사용하여 번역 파일 로드
      // 테스트 환경에서는 상대 경로가 다를 수 있으므로 여러 경로 시도
      const possiblePaths = [
        `../translations/${language}/${namespace}.json`,
        `./translations/${language}/${namespace}.json`,
        `translations/${language}/${namespace}.json`,
        `../../translations/${language}/${namespace}.json`,
      ];

      for (const path of possiblePaths) {
        try {
          const module = await import(path);
          return module.default || module;
        } catch (pathError) {
          // 다음 경로 시도
          continue;
        }
      }

      // 모든 경로가 실패하면 빈 객체 반환
      console.warn(`Failed to load translation file: ${language}/${namespace}.json`);
      return {};
    }
    catch (error) {
      console.warn(`Failed to load translation file: translations/${language}/${namespace}.json`);
      return {};
    }
  };
}

// 초보자용 기본 설정 함수
export function withDefaultConfig(options?: {
  defaultLanguage?: string;
  fallbackLanguage?: string;
  namespaces?: string[];
  debug?: boolean;
  autoLanguageSync?: boolean;
}) {
  const config: I18nConfig = {
    defaultLanguage: options?.defaultLanguage || 'ko',
    fallbackLanguage: options?.fallbackLanguage || 'en',
    supportedLanguages: defaultLanguages,
    namespaces: options?.namespaces || ['common'],
    loadTranslations: createDefaultFileLoader(),
    debug: options?.debug ?? (process.env.NODE_ENV === 'development'),
    missingKeyHandler: (key: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key}`);
        return `[MISSING: ${key}]`;
      }
      return key;
    },
    errorHandler: (error: any, language: string, namespace: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Translation error for ${language}:${namespace}:`, error);
      }
    },
    // 자동 언어 전환 이벤트 처리 (기본값: true)
    autoLanguageSync: options?.autoLanguageSync ?? true,
  };

  // Provider 컴포넌트 반환
  return function DefaultI18nProvider({ children }: { children: React.ReactNode }) {
    const { I18nProvider } = require('./hooks/useI18n');
    return React.createElement(I18nProvider, { config }, children);
  };
}

// 간단한 번역 훅들만 export
export { useTranslation, useLanguageChange };

// 타입 export
export type { I18nConfig }; 