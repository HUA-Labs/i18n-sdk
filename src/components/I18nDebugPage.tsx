import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

interface DebugInfo {
  currentLanguage: string;
  supportedLanguages: string[];
  loadedNamespaces: string[];
  allTranslations: Record<string, Record<string, any>>;
  isReady: boolean;
  initializationError: Error | null;
}

interface MissingKey {
  key: string;
  namespace: string;
  language: string;
  count: number;
}

export const I18nDebugPage: React.FC = () => {
  const { debug } = useI18n();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [missingKeys, setMissingKeys] = useState<MissingKey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [testKey, setTestKey] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        currentLanguage: debug.getCurrentLanguage(),
        supportedLanguages: debug.getSupportedLanguages(),
        loadedNamespaces: debug.getLoadedNamespaces(),
        allTranslations: debug.getAllTranslations(),
        isReady: debug.isReady(),
        initializationError: debug.getInitializationError(),
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [debug]);

  const testTranslation = () => {
    if (!testKey.trim()) return;
    
    const { t } = useI18n();
    const result = t(testKey);
    setTestResult(result);
  };

  const clearCache = () => {
    debug.clearCache();
    alert('캐시가 클리어되었습니다.');
  };

  const reloadTranslations = async () => {
    try {
      await debug.reloadTranslations();
      alert('번역이 다시 로드되었습니다.');
    } catch (error) {
      alert('번역 다시 로드 중 오류가 발생했습니다: ' + error);
    }
  };

  if (!debugInfo) {
    return <div className="i18n-debug-loading">로딩 중...</div>;
  }

  return (
    <div className="i18n-debug-page">
      <style>{`
        .i18n-debug-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        
        .debug-header {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .debug-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        
        .debug-subtitle {
          color: #666;
          margin-bottom: 20px;
        }
        
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .status-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }
        
        .status-card.error {
          border-left-color: #dc3545;
          background: #f8d7da;
        }
        
        .status-card.success {
          border-left-color: #28a745;
          background: #d4edda;
        }
        
        .status-label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }
        
        .status-value {
          color: #666;
        }
        
        .debug-section {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        }
        
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .control-group {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .control-group label {
          font-weight: bold;
          color: #333;
        }
        
        .control-group select,
        .control-group input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0056b3;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        
        .btn-danger:hover {
          background: #c82333;
        }
        
        .btn-warning {
          background: #ffc107;
          color: #212529;
        }
        
        .btn-warning:hover {
          background: #e0a800;
        }
        
        .translations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .translation-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }
        
        .translation-header {
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 5px;
        }
        
        .translation-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        
        .translation-key {
          font-family: monospace;
          color: #007bff;
          font-size: 12px;
        }
        
        .translation-value {
          color: #333;
          font-size: 12px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .test-section {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #b3d9ff;
        }
        
        .test-input {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .test-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .test-result {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
          font-family: monospace;
          font-size: 14px;
        }
        
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
          margin-bottom: 15px;
        }
      `}</style>

      <div className="debug-header">
        <h1 className="debug-title">🌐 i18n SDK 디버그 페이지</h1>
        <p className="debug-subtitle">
          번역 시스템 상태를 확인하고 디버깅할 수 있습니다.
        </p>
        
        <div className="status-grid">
          <div className={`status-card ${debugInfo.isReady ? 'success' : 'error'}`}>
            <div className="status-label">초기화 상태</div>
            <div className="status-value">
              {debugInfo.isReady ? '✅ 준비됨' : '❌ 초기화 실패'}
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-label">현재 언어</div>
            <div className="status-value">{debugInfo.currentLanguage}</div>
          </div>
          
          <div className="status-card">
            <div className="status-label">지원 언어</div>
            <div className="status-value">{debugInfo.supportedLanguages.join(', ')}</div>
          </div>
          
          <div className="status-card">
            <div className="status-label">로드된 네임스페이스</div>
            <div className="status-value">{debugInfo.loadedNamespaces.join(', ')}</div>
          </div>
        </div>

        {debugInfo.initializationError && (
          <div className="error-message">
            <strong>초기화 오류:</strong> {debugInfo.initializationError.message}
          </div>
        )}

        <div className="controls">
          <button className="btn btn-warning" onClick={clearCache}>
            🗑️ 캐시 클리어
          </button>
          <button className="btn btn-primary" onClick={reloadTranslations}>
            🔄 번역 다시 로드
          </button>
        </div>
      </div>

      <div className="debug-section">
        <h2 className="section-title">🔍 번역 테스트</h2>
        <div className="test-section">
          <div className="test-input">
            <input
              type="text"
              placeholder="번역 키를 입력하세요 (예: common.welcome)"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
            />
            <button className="btn btn-primary" onClick={testTranslation}>
              테스트
            </button>
          </div>
          {testResult && (
            <div className="test-result">
              <strong>결과:</strong> {testResult}
            </div>
          )}
        </div>
      </div>

      <div className="debug-section">
        <h2 className="section-title">📚 번역 데이터</h2>
        
        <div className="controls">
          <div className="control-group">
            <label>검색:</label>
            <input
              type="text"
              placeholder="번역 키 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>네임스페이스:</label>
            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
            >
              <option value="all">모든 네임스페이스</option>
              {debugInfo.loadedNamespaces.map(ns => (
                <option key={ns} value={ns}>{ns}</option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>언어:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">모든 언어</option>
              {debugInfo.supportedLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="translations-grid">
          {Object.entries(debugInfo.allTranslations).map(([language, namespaces]) => {
            if (selectedLanguage !== 'all' && language !== selectedLanguage) return null;
            
            return Object.entries(namespaces).map(([namespace, translations]) => {
              if (selectedNamespace !== 'all' && namespace !== selectedNamespace) return null;
              
              const filteredTranslations = Object.entries(translations).filter(([key, value]) => {
                const fullKey = `${namespace}.${key}`;
                return searchTerm === '' || 
                       fullKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()));
              });

              if (filteredTranslations.length === 0) return null;

              return (
                <div key={`${language}-${namespace}`} className="translation-card">
                  <div className="translation-header">
                    {language} / {namespace} ({filteredTranslations.length}개)
                  </div>
                  {filteredTranslations.map(([key, value]) => (
                    <div key={key} className="translation-item">
                      <span className="translation-key">{key}</span>
                      <span className="translation-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}; 