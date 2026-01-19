import { useState } from 'react';
import './LinkInput.css';

function LinkInput({ onAnalyzeUrl, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyzeUrl(url.trim());
    }
  };

  return (
    <div className="link-input">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Collez votre lien ici (ex: https://exemple.com)"
            disabled={isLoading}
            className="url-input"
          />
        </div>
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
            'Analyser ce lien'
          )}
        </button>
      </form>
      <p className="input-hint">
        Collez l'URL d'une page web, d'un article ou d'un site suspect
      </p>
    </div>
  );
}

export default LinkInput;
