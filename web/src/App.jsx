import { useState } from 'react';
import LinkInput from './components/LinkInput';
import ImageInput from './components/ImageInput';
import TextInput from './components/TextInput';
import ResultCard from './components/ResultCard';
import { analyzeUrl, analyzeImages, analyzeText } from './services/api';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [activeMode, setActiveMode] = useState('link'); // 'link', 'image', 'text'

  const handleAnalyzeUrl = async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisType('url');
    setImageCount(0);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse');
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
      const data = await analyzeImages(imagesBase64Array);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse des images');
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
      const data = await analyzeText(text);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse du texte');
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
        return imageCount > 1 ? `les ${imageCount} images` : 'l\'image';
      case 'text':
        return 'le texte';
      default:
        return 'le contenu de la page';
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          <h1>Serein</h1>
        </div>
        <p className="tagline">Analysez vos liens, images et textes en toute sérénité</p>
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
            <span className="tab-label">Lien</span>
          </button>
          <button
            className={`mode-tab ${activeMode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeChange('image')}
            disabled={loading}
          >
            <span className="tab-icon">📷</span>
            <span className="tab-label">Image</span>
          </button>
          <button
            className={`mode-tab ${activeMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
            disabled={loading}
          >
            <span className="tab-icon">📝</span>
            <span className="tab-label">Texte</span>
          </button>
        </div>

        {/* Active Mode Input */}
        <div className="input-section">
          {activeMode === 'link' && (
            <LinkInput
              onAnalyzeUrl={handleAnalyzeUrl}
              isLoading={loading}
            />
          )}
          {activeMode === 'image' && (
            <ImageInput
              onAnalyzeImages={handleAnalyzeImages}
              isLoading={loading}
            />
          )}
          {activeMode === 'text' && (
            <TextInput
              onAnalyzeText={handleAnalyzeText}
              isLoading={loading}
            />
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Oups !</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-text">Analyse en cours...</p>
            <p className="loading-subtext">
              Nous examinons {getLoadingText()}
            </p>
          </div>
        )}

        {result && <ResultCard result={result} />}
      </main>

      <footer className="footer">
        <p>Propulsé par Claude AI • Fait avec 💙 pour votre sérénité</p>
      </footer>
    </div>
  );
}

export default App;
