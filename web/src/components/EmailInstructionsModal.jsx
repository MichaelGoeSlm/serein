import { useLanguage } from '../i18n/LanguageContext';
import './EmailInstructionsModal.css';

function EmailInstructionsModal({ onClose, onConfirm }) {
  const { t } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="email-modal-header">
          <h2>{t('email.modalTitle')}</h2>
          <button className="email-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="email-modal-content">
          {/* Step 1 */}
          <div className="email-step">
            <div className="email-step-number">1</div>
            <div className="email-step-content">
              <h3>{t('email.step1Title')}</h3>
              <p>{t('email.step1Text')}</p>
              <div className="email-step-icon">📧</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="email-step">
            <div className="email-step-number">2</div>
            <div className="email-step-content">
              <h3>{t('email.step2Title')}</h3>
              <p>{t('email.step2Text')}</p>
              <div className="email-step-icon">📄</div>
            </div>
          </div>

          {/* Important notice */}
          <div className="email-important">
            <div className="email-important-icon">⚠️</div>
            <div className="email-important-content">
              <h4>{t('email.important')}</h4>
              <p>{t('email.importantText')}</p>
            </div>
          </div>
        </div>

        <div className="email-modal-footer">
          <button className="email-btn-cancel" onClick={onClose}>
            {t('email.cancelButton')}
          </button>
          <button className="email-btn-confirm" onClick={handleConfirm}>
            {t('email.understoodButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailInstructionsModal;
