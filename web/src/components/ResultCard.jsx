import { useLanguage } from '../i18n/LanguageContext';
import './ResultCard.css';

function ResultCard({ result }) {
  const { t } = useLanguage();

  if (!result) return null;

  const { analysis, url, title, type, imageCount, textLength } = result;
  const { confidence_score, verdict, summary, red_flags, reassurance } = analysis;
  const isImage = type === 'image';
  const isText = type === 'text';

  const getTitle = () => {
    if (isImage) {
      if (imageCount && imageCount > 1) {
        return `📷 ${imageCount} ${t('imageLimit')}`;
      }
      return `📷 ${t('tabImage')}`;
    }
    if (isText) {
      return `📝 ${t('tabText')} (${textLength} ${t('characters')})`;
    }
    return title || url || t('summary');
  };

  const getVerdictConfig = (v) => {
    switch (v) {
      case 'fiable':
        return {
          label: t('verdict.fiable'),
          className: 'verdict-safe',
          icon: '✓'
        };
      case 'prudence':
        return {
          label: t('verdict.prudence'),
          className: 'verdict-caution',
          icon: '⚠'
        };
      case 'suspect':
        return {
          label: t('verdict.suspect'),
          className: 'verdict-danger',
          icon: '✗'
        };
      default:
        return {
          label: t('verdict.prudence'),
          className: 'verdict-caution',
          icon: '?'
        };
    }
  };

  const verdictConfig = getVerdictConfig(verdict);

  return (
    <div className="result-card">
      <div className="result-header">
        <h2 className="result-title">{getTitle()}</h2>
        {url && <p className="result-url">{url}</p>}
      </div>

      <div className={`verdict-badge ${verdictConfig.className}`}>
        <span className="verdict-icon">{verdictConfig.icon}</span>
        <span className="verdict-label">{verdictConfig.label}</span>
      </div>

      <div className="confidence-section">
        <div className="confidence-header">
          <span>{t('trustLevel')}</span>
          <span className="confidence-value">{confidence_score}%</span>
        </div>
        <div className="confidence-bar">
          <div
            className={`confidence-fill ${verdictConfig.className}`}
            style={{ width: `${confidence_score}%` }}
          ></div>
        </div>
      </div>

      <div className="summary-section">
        <h3>{t('summary')}</h3>
        <p>{summary}</p>
      </div>

      {red_flags && red_flags.length > 0 && (
        <div className="red-flags-section">
          <h3>{t('redFlags')}</h3>
          <ul className="red-flags-list">
            {red_flags.map((flag, index) => (
              <li key={index} className="red-flag-item">
                <span className="red-flag-icon">⚠</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="reassurance-section">
        <div className="reassurance-icon">💙</div>
        <p className="reassurance-text">{reassurance}</p>
      </div>
    </div>
  );
}

export default ResultCard;
