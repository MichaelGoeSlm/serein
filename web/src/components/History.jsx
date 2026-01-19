import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './History.css';

function History({ history, onSelectEntry, onClear }) {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return '📷';
      case 'text':
        return '📝';
      default:
        return '🔗';
    }
  };

  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'fiable':
        return 'verdict-safe';
      case 'suspect':
        return 'verdict-danger';
      default:
        return 'verdict-caution';
    }
  };

  const getPreview = (entry) => {
    if (entry.url) {
      try {
        const url = new URL(entry.url);
        return url.hostname;
      } catch {
        return entry.url.substring(0, 30);
      }
    }
    if (entry.title) {
      return entry.title.substring(0, 40);
    }
    if (entry.textLength) {
      return `${entry.textLength} ${t('characters')}`;
    }
    if (entry.imageCount) {
      return `${entry.imageCount} ${t('imageLimit')}`;
    }
    return '';
  };

  const handleClearClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    onClear();
    setShowConfirm(false);
  };

  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  return (
    <div className="history">
      <div className="history-header">
        <h3>{t('historyTitle')}</h3>
        <button
          type="button"
          className="history-clear-btn"
          onClick={handleClearClick}
        >
          {t('historyClear')}
        </button>
      </div>

      {showConfirm && (
        <div className="history-confirm">
          <p>{t('historyConfirmClear')}</p>
          <div className="history-confirm-buttons">
            <button
              type="button"
              className="btn-danger"
              onClick={handleConfirmClear}
            >
              {t('historyYes')}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelClear}
            >
              {t('historyNo')}
            </button>
          </div>
        </div>
      )}

      <div className="history-list">
        {history.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="history-item"
            onClick={() => onSelectEntry(entry)}
          >
            <span className="history-icon">{getTypeIcon(entry.type)}</span>
            <div className="history-content">
              <span className="history-preview">{getPreview(entry)}</span>
              <span className="history-date">{formatDate(entry.date)}</span>
            </div>
            <span className={`history-verdict ${getVerdictClass(entry.verdict)}`}>
              {t(`verdict.${entry.verdict}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default History;
