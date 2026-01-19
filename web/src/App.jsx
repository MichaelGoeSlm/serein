import { useState } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import useHistory from './hooks/useHistory';
import LanguageSelector from './components/LanguageSelector';
import LinkInput from './components/LinkInput';
import ImageInput from './components/ImageInput';
import TextInput from './components/TextInput';
import ResultCard from './components/ResultCard';
import ProgressIndicator from './components/ProgressIndicator';
import HelpMessage from './components/HelpMessage';
import History from './components/History';
import { analyzeUrl, analyzeImages, analyzeText } from './services/api';
import './App.css';

function App() {
  const { t, language } = useLanguage();
  const { history, addToHistory, clearHistory } = useHistory();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeMode, setActiveMode] = useState('link');
  const [showResult, setShowResult] = useState(false);

  const handleAnalyzeUrl = async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeUrl(url, language);
      setResult(data);
      setShowResult(true);
      addToHistory(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImages = async (imagesBase64Array) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeImages(imagesBase64Array, language);
      setResult(data);
      setShowResult(true);
      addToHistory(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeText(text, language);
      setResult(data);
      setShowResult(true);
      addToHistory(data);
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    if (loading) return;
    setActiveMode(mode);
    setResult(null);
    setError(null);
    setShowHelp(false);
    setShowResult(false);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
    setShowHelp(false);
    setShowResult(false);
  };

  const handleSelectHistoryEntry = (entry) => {
    setResult({
      type: entry.type,
      url: entry.url,
      title: entry.title,
      textLength: entry.textLength,
      imageCount: entry.imageCount,
      analysis: entry.analysis
    });
    setShowResult(true);
    setError(null);
    setShowHelp(false);
  };

  const getInstruction = () => {
    switch (activeMode) {
      case 'image':
        return t('instructionImage');
      case 'text':
        return t('instructionText');
      default:
        return t('instructionLink');
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
        {/* Mode Tabs */}
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

        {/* Loading State */}
        {loading && <ProgressIndicator />}

        {/* Error with Help */}
        {error && !loading && (
          <>
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>{t('oops')}</strong>
                <p>{error}</p>
              </div>
            </div>
            {showHelp && (
              <HelpMessage type={activeMode} onClose={() => setShowHelp(false)} />
            )}
          </>
        )}

        {/* Result View */}
        {showResult && result && !loading && (
          <div className="result-view">
            <ResultCard result={result} />
            <button
              type="button"
              className="btn-primary new-analysis-btn"
              onClick={handleNewAnalysis}
            >
              {t('newAnalysis')}
            </button>
          </div>
        )}

        {/* Input Section - Only show when not loading and no result */}
        {!loading && !showResult && (
          <div className="input-section">
            <p className="instruction">{getInstruction()}</p>

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
        )}

        {/* History - Only show when not loading and no result */}
        {!loading && !showResult && (
          <History
            history={history}
            onSelectEntry={handleSelectHistoryEntry}
            onClear={clearHistory}
          />
        )}
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
