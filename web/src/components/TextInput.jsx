import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './TextInput.css';

const MAX_CHARS = 10000;

function TextInput({ onAnalyzeText, isLoading }) {
  const { t } = useLanguage();
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
            placeholder={t('textPlaceholder')}
            disabled={isLoading}
            className="text-area"
            rows={8}
          />
          <div className={`char-counter ${isOverLimit ? 'over-limit' : ''}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} {t('characters')}
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
              {t('analyzing')}
            </span>
          ) : (
            t('analyzeText')
          )}
        </button>
      </form>
      {isOverLimit && (
        <p className="error-hint">{t('textTooLong')}</p>
      )}
    </div>
  );
}

export default TextInput;
