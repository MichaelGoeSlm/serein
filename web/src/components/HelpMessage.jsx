import { useLanguage } from '../i18n/LanguageContext';
import './HelpMessage.css';

function HelpMessage({ type, onClose }) {
  const { t } = useLanguage();

  const getMessages = () => {
    switch (type) {
      case 'link':
        return [t('helpLinkFailed'), t('helpTryScreenshot'), t('helpCopyText')];
      case 'image':
        return [t('helpTryScreenshot')];
      case 'text':
        return [t('helpCopyText')];
      default:
        return [t('helpTryScreenshot'), t('helpCopyText')];
    }
  };

  const messages = getMessages();

  return (
    <div className="help-message">
      <div className="help-icon">💡</div>
      <div className="help-content">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <button
        type="button"
        className="help-close-btn"
        onClick={onClose}
      >
        {t('helpUnderstood')}
      </button>
    </div>
  );
}

export default HelpMessage;
