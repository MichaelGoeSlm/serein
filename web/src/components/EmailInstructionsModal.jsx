import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './EmailInstructionsModal.css';

function EmailInstructionsModal({ onClose, onConfirm }) {
  const { t } = useLanguage();
  const [animationStep, setAnimationStep] = useState(0);

  // Animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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
          {/* Animated Email Demo */}
          <div className="email-demo-container">
            <div className="email-demo-phone">
              <div className="email-demo-screen">
                {/* Email Header */}
                <div className={`email-demo-header ${animationStep >= 1 ? 'expanded' : ''}`}>
                  <div className="email-demo-sender">
                    <div className="email-demo-avatar">B</div>
                    <div className="email-demo-sender-info">
                      <div className="email-demo-sender-name">
                        Banque Secure
                        <span className={`email-demo-chevron ${animationStep >= 1 ? 'rotated' : ''}`}>▼</span>
                      </div>
                      {animationStep >= 1 && (
                        <div className="email-demo-sender-email animate-expand">
                          alerte@banque-secure-fake.com
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="email-demo-subject">
                    ⚠️ Urgent: Vérifiez votre compte
                  </div>
                  {animationStep >= 1 && (
                    <div className="email-demo-date animate-expand">
                      Aujourd'hui, 14:32
                    </div>
                  )}
                </div>

                {/* Tap indicator */}
                {animationStep === 0 && (
                  <div className="email-demo-tap">
                    <div className="tap-circle"></div>
                    <div className="tap-finger">👆</div>
                  </div>
                )}

                {/* Arrow pointing to expanded area */}
                {animationStep >= 2 && (
                  <div className="email-demo-arrow">
                    <span className="arrow-icon">📸</span>
                    <span className="arrow-text">Capturez ici !</span>
                  </div>
                )}
              </div>
            </div>

            <div className="email-demo-caption">
              {animationStep === 0 && "👆 Appuyez sur l'expéditeur"}
              {animationStep === 1 && "✨ Les détails s'affichent"}
              {animationStep >= 2 && "📸 Faites une capture d'écran"}
            </div>
          </div>

          {/* Step 1 */}
          <div className="email-step">
            <div className="email-step-number">1</div>
            <div className="email-step-content">
              <h3>{t('email.step1Title')}</h3>
              <p>{t('email.step1Text')}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="email-step">
            <div className="email-step-number">2</div>
            <div className="email-step-content">
              <h3>{t('email.step2Title')}</h3>
              <p>{t('email.step2Text')}</p>
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
