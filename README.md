# hua-i18n-sdk

> 💡 **이 라이브러리는 hua API 스타일에 최적화되어 있으나, 일반 React 프로젝트에서도 손쉽게 사용 가능합니다.**
>
> ⚠️ 공식 유지보수/지원은 아니며, 빌드 환경(Next.js, Vite, Webpack 등)에 따라 번역 파일 import 방식이 다를 수 있습니다. 아래 환경별 예제를 참고하세요.

React 애플리케이션을 위한 간단하고 강력한 국제화 SDK입니다. hua-api의 번역 시스템에서 영감을 받았습니다.

## 특징

- 🚀 **간단한 API**: hua-api 스타일의 간단한 번역 함수
- ⚡ **빠른 성능**: 미리 로드된 번역과 폴백 지원
- 🔧 **개발자 친화적**: 쉬운 설정과 디버깅 도구
- 🌍 **다국어 지원**: 한국어, 영어 및 기타 언어 지원
- 🎯 **타입 안전성**: 완전한 TypeScript 지원
- 📦 **가벼운 번들**: 최소한의 번들 크기

## 설치

```bash
npm install hua-i18n-sdk
```

## 빠른 시작

### 1. 번역 파일 생성

각 언어와 네임스페이스별로 JSON 번역 파일을 생성합니다:

```json
// translations/ko/diary.json
{
  "todayEmotion": "오늘의 감정",
  "writeDiaryPrompt": "오늘 하루는 어땠나요?",
  "emotionTracking": "감정 추적",
  "aiAnalysis": "AI 분석",
  "patternAnalysis": "패턴 분석",
  "writeTodayDiary": "오늘 일기 쓰기",
  "weeklyStats": "주간 통계",
  "writtenDiaries": "작성된 일기",
  "averageEmotionScore": "평균 감정 점수",
  "consecutiveDays": "연속 작성일",
  "recentDiaries": "최근 일기",
  "newStart": "새로운 시작",
  "expectation": "기대감",
  "quietDay": "조용한 하루",
  "tranquility": "평온함",
  "challengeDay": "도전의 날",
  "passion": "열정"
}
```

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

### 2. I18nProvider 설정

```tsx
// app/i18n-config.ts
import { I18nConfig } from 'hua-i18n-sdk';

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'ko',
  fallbackLanguage: 'en', // 글로벌 서비스를 위해 영어로 변경
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

### 3. 번역 사용하기

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

## API 참조

### useTranslation()

번역을 위한 메인 훅:

```tsx
const { t, tWithParams, currentLanguage, setLanguage, isLoading, supportedLanguages } = useTranslation();
```

#### `t(key: string, language?: string): string`

간단한 번역 함수:

```tsx
// 기본 사용법
t('diary.todayEmotion') // "오늘의 감정"

// 특정 언어 지정
t('diary.todayEmotion', 'en') // "Today's Emotion"
```

#### `tWithParams(key: string, params?: TranslationParams, language?: string): string`

파라미터 치환이 있는 번역:

```tsx
// 번역 파일: { "welcome": "안녕하세요, {{name}}님!" }
tWithParams('diary.welcome', { name: '철수' }) // "안녕하세요, 철수님!"
```

### useLanguageChange()

언어 변경을 위한 훅:

```tsx
const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageChange();

// 언어 변경
changeLanguage('en');
```

### 언어 변경 컴포넌트

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

## 고급 사용법

### 디버그 페이지

개발자, 번역 담당자, 기획자를 위한 전용 디버그 페이지를 제공합니다:

```tsx
// app/i18n-debug/page.tsx
import { I18nDebugPage } from 'hua-i18n-sdk';

export default function DebugPage() {
  return <I18nDebugPage />;
}
```

이 페이지에서는 다음을 확인할 수 있습니다:

- 📊 번역 시스템 상태 (초기화, 언어, 네임스페이스)
- 🔍 실시간 번역 테스트
- 📚 모든 번역 데이터 검색 및 필터링
- 🗑️ 캐시 관리 및 번역 다시 로드
- ⚠️ 누락된 번역 키 및 오류 확인

### 디버그 도구 (프로그래밍 방식)

```tsx
import { useI18n } from 'hua-i18n-sdk';

function DebugPanel() {
  const { debug } = useI18n();
  
  return (
    <div>
      <p>현재 언어: {debug.getCurrentLanguage()}</p>
      <p>지원 언어: {debug.getSupportedLanguages().join(', ')}</p>
      <p>로드된 네임스페이스: {debug.getLoadedNamespaces().join(', ')}</p>
      <button onClick={() => debug.clearCache()}>캐시 클리어</button>
      <button onClick={() => debug.reloadTranslations()}>번역 다시 로드</button>
    </div>
  );
}
```

### 타입 안전성

TypeScript를 사용하여 번역 키의 자동완성과 타입 검사를 지원합니다:

```tsx
import { createTranslationKey } from 'hua-i18n-sdk';

// 타입 안전한 번역 키 생성
const keys = {
  diary: createTranslationKey('diary', 'todayEmotion'),
  admin: createTranslationKey('admin', 'dashboard'),
} as const;

// 사용 시 자동완성 지원
t(keys.diary); // ✅ 타입 안전
t('diary.todayEmotion'); // ✅ 문자열도 지원
```

### 커스텀 설정

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
    // 커스텀 로딩 로직
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

## 이전 버전에서 마이그레이션

### 이전 (복잡)

```tsx
import { useI18n, useAutoLoadNamespace } from 'hua-i18n-sdk';

export default function Page() {
  const { tSync } = useI18n();
  useAutoLoadNamespace('diary');
  
  return <h1>{tSync('todayEmotion', 'diary')}</h1>;
}
```

### 현재 (간단)

```tsx
import { useTranslation } from 'hua-i18n-sdk';

export default function Page() {
  const { t } = useTranslation();
  
  return <h1>{t('diary.todayEmotion')}</h1>;
}
```

## 모범 사례

1. **점 표기법 사용**: `namespace.key` 형식
2. **번역을 평면적으로 유지**: 깊은 중첩 피하기
3. **의미있는 네임스페이스 사용**: 관련 번역 그룹화
4. **폴백 번역 제공**: 글로벌 서비스의 경우 `ko → en → [MISSING]` 흐름 권장
5. **개발 모드에서 디버그 사용**: 누락된 번역 찾기
6. **타입 안전성 활용**: TypeScript와 함께 사용하여 번역 키 자동완성 활용

## 문제 해결

### 번역 키가 번역된 텍스트 대신 표시되는 경우

1. 네임스페이스가 설정에 포함되어 있는지 확인
2. 번역 파일이 존재하고 유효한 JSON인지 확인
3. 브라우저 콘솔에서 로딩 오류 확인
4. 디버그 모드를 사용하여 로드된 네임스페이스 확인

### 성능 문제

1. 모든 번역이 초기화 시 미리 로드됨
2. 디버그 도구를 사용하여 캐시 사용량 모니터링
3. 필요시 캐시 클리어: `debug.clearCache()`

## 라이선스

MIT

## TODO

- [ ] Storybook 예제 추가 예정
- [ ] 다양한 환경별 번역 파일 import 예제 보강
- [ ] 실전 프로젝트 예제 추가
