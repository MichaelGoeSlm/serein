import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './LinkInput.css';

function LinkInput({ onAnalyzeUrl, isLoading }) {
  const { t } = useLanguage();
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
            placeholder={t('linkPlaceholder')}
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
              {t('analyzing')}
            </span>
          ) : (
            t('analyzeLink')
          )}
        </button>
      </form>
      <p className="input-hint">{t('linkHint')}</p>
    </div>
  );
}

export default LinkInput;
