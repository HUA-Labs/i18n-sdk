'use client';

import { useTranslation } from 'hua-i18n-sdk';
import { useState } from 'react';

export default function TranslationDemo() {
  const { t, tWithParams } = useTranslation();
  const [demoName, setDemoName] = useState('리듬');
  const [userCount, setUserCount] = useState(42);

  return (
    <div className="space-y-8">
      {/* 기능 소개 섹션 */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('demo.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'demo.features.ssr',
            'demo.features.csr',
            'demo.features.typescript',
            'demo.features.fallback',
            'demo.features.namespaces',
            'demo.features.dynamic'
          ].map((key) => (
            <div key={key} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">{t(key)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 사용 예제 섹션 */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('demo.examples.title')}
        </h2>
        
        <div className="space-y-6">
          {/* 간단한 번역 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              {t('demo.examples.simple')}
            </h3>
            <p className="text-gray-600">{t('demo.demo.greeting', { name: demoName })}</p>
            <input
              type="text"
              value={demoName}
              onChange={(e) => setDemoName(e.target.value)}
              className="mt-2 px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 파라미터가 있는 번역 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              {t('demo.examples.withParams')}
            </h3>
            <p className="text-gray-600">
              {tWithParams('demo.demo.welcomeMessage', { appName: 'hua-i18n-sdk' })}
            </p>
            <p className="text-gray-600 mt-2">
              {tWithParams('demo.demo.userCount', { count: userCount })}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={() => setUserCount(prev => Math.max(0, prev - 1))}
                className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                -
              </button>
              <span className="text-sm text-gray-600">{userCount}</span>
              <button
                onClick={() => setUserCount(prev => prev + 1)}
                className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
              >
                +
              </button>
            </div>
          </div>

          {/* 중첩된 키 번역 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              {t('demo.examples.nested')}
            </h3>
            <p className="text-gray-600">{t('demo.demo.nested.level1.level2')}</p>
          </div>

          {/* Fallback 예제 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              {t('demo.examples.fallback')}
            </h3>
            <p className="text-gray-600">
              {t('demo.demo.lastLogin', { date: new Date().toLocaleDateString() })}
            </p>
          </div>

          {/* 누락된 키 처리 */}
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              {t('demo.examples.missing')}
            </h3>
            <p className="text-gray-600">
              {t('demo.demo.missing.key.example')} {/* 이 키는 존재하지 않음 */}
            </p>
          </div>
        </div>
      </section>

      {/* 인터랙티브 버튼들 */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">인터랙티브 데모</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            {t('demo.buttons.changeLanguage')}
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            {t('demo.buttons.toggleTheme')}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            {t('demo.buttons.reload')}
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            {t('demo.buttons.testFallback')}
          </button>
        </div>
      </section>

      {/* 현재 언어 정보 */}
      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">현재 상태</h2>
        <div className="text-blue-700">
          <p>현재 언어: {t('common.currentLanguage')}</p>
          <p>언어 코드: {t('common.language')}</p>
        </div>
      </section>
    </div>
  );
} 