import { useState } from 'react';
import LinkInput from './components/LinkInput';
import ResultCard from './components/ResultCard';
import { analyzeUrl, analyzeImages } from './services/api';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState(null); // 'url' or 'image'
  const [imageCount, setImageCount] = useState(0);

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

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          <h1>Serein</h1>
        </div>
        <p className="tagline">Analysez vos liens et images en toute sérénité</p>
      </header>

      <main className="main">
        <LinkInput
          onAnalyzeUrl={handleAnalyzeUrl}
          onAnalyzeImages={handleAnalyzeImages}
          isLoading={loading}
        />

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
              {analysisType === 'image'
                ? `Nous examinons ${imageCount > 1 ? `les ${imageCount} images` : 'l\'image'}`
                : 'Nous examinons le contenu de la page'}
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
