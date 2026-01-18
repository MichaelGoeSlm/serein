import { useState } from 'react';
import './LinkInput.css';

function LinkInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form className="link-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez votre lien ici (ex: https://exemple.com)"
          disabled={isLoading}
          className="url-input"
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="analyze-button"
        >
          {isLoading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              Analyse...
            </span>
          ) : (
            'Analyser'
          )}
        </button>
      </div>
      <p className="input-hint">
        Entrez l'URL d'un site web pour vérifier sa fiabilité
      </p>
    </form>
  );
}

export default LinkInput;
