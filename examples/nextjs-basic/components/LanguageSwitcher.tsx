'use client';

import { useLanguageChange } from 'hua-i18n-sdk';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageChange();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      >
        <span className="text-lg">🌐</span>
        <span className="font-medium text-gray-700">
          {currentLang?.nativeName || currentLang?.name || currentLanguage}
        </span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                language.code === currentLanguage
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {language.code === 'ko' ? '🇰🇷' : '🇺🇸'}
                </span>
                <span>{language.nativeName}</span>
                {language.code !== 'ko' && (
                  <span className="text-xs text-gray-400">({language.name})</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 배경 클릭 시 닫기 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 