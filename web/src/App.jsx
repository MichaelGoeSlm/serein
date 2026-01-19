import { useState } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import LinkInput from './components/LinkInput';
import ImageInput from './components/ImageInput';
import TextInput from './components/TextInput';
import ResultCard from './components/ResultCard';
import { analyzeUrl, analyzeImages, analyzeText } from './services/api';
import './App.css';

function App() {
  const { t, language } = useLanguage();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [activeMode, setActiveMode] = useState('link');

  const handleAnalyzeUrl = async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisType('url');
    setImageCount(0);

    try {
      const data = await analyzeUrl(url, language);
      setResult(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImages = async (imagesBase64Array) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisType('image');
    setImageCount(imagesBase64Array.length);

    try {
      const data = await analyzeImages(imagesBase64Array, language);
      setResult(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisType('text');
    setImageCount(0);

    try {
      const data = await analyzeText(text, language);
      setResult(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setResult(null);
    setError(null);
  };

  const getLoadingText = () => {
    switch (analysisType) {
      case 'image':
        return imageCount > 1
          ? t('examiningImages').replace('{count}', imageCount)
          : t('examiningImage');
      case 'text':
        return t('examiningText');
      default:
        return t('examiningContent');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <LanguageSelector />
        </div>
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          <h1>{t('appName')}</h1>
        </div>
        <p className="tagline">{t('tagline')}</p>
      </header>

      <main className="main">
        <div className="mode-tabs">
          <button
            className={`mode-tab ${activeMode === 'link' ? 'active' : ''}`}
            onClick={() => handleModeChange('link')}
            disabled={loading}
          >
            <span className="tab-icon">🔗</span>
            <span className="tab-label">{t('tabLink')}</span>
          </button>
          <button
            className={`mode-tab ${activeMode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeChange('image')}
            disabled={loading}
          >
            <span className="tab-icon">📷</span>
            <span className="tab-label">{t('tabImage')}</span>
          </button>
          <button
            className={`mode-tab ${activeMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
            disabled={loading}
          >
            <span className="tab-icon">📝</span>
            <span className="tab-label">{t('tabText')}</span>
          </button>
        </div>

        <div className="input-section">
          {activeMode === 'link' && (
            <LinkInput onAnalyzeUrl={handleAnalyzeUrl} isLoading={loading} />
          )}
          {activeMode === 'image' && (
            <ImageInput onAnalyzeImages={handleAnalyzeImages} isLoading={loading} />
          )}
          {activeMode === 'text' && (
            <TextInput onAnalyzeText={handleAnalyzeText} isLoading={loading} />
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>{t('oops')}</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t('analyzingInProgress')}</p>
            <p className="loading-subtext">{getLoadingText()}</p>
          </div>
        )}

        {result && <ResultCard result={result} />}
      </main>

      <footer className="footer">
        <p>
          {t('poweredBy')} • {t('madeWith')} 💙 {t('forYourPeace')}
        </p>
      </footer>
    </div>
  );
}

export default App;
