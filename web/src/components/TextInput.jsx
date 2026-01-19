import { useState } from 'react';
import './TextInput.css';

const MAX_CHARS = 10000;

function TextInput({ onAnalyzeText, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyzeText(text.trim());
    }
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="text-input">
      <form onSubmit={handleSubmit}>
        <div className="textarea-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collez ici le texte d'un email ou d'un message suspect..."
            disabled={isLoading}
            className="text-area"
            rows={8}
          />
          <div className={`char-counter ${isOverLimit ? 'over-limit' : ''}`}>
            {charCount.toLocaleString('fr-FR')} / {MAX_CHARS.toLocaleString('fr-FR')} caractères
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !text.trim() || isOverLimit}
          className="analyze-button"
        >
          {isLoading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              Analyse...
            </span>
          ) : (
            'Analyser ce texte'
          )}
        </button>
      </form>
      {isOverLimit && (
        <p className="error-hint">
          Le texte est trop long. Veuillez le réduire à {MAX_CHARS.toLocaleString('fr-FR')} caractères maximum.
        </p>
      )}
    </div>
  );
}

export default TextInput;
