import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './OnboardingPage.css';

function OnboardingPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save onboarding completed in localStorage
      if (user) {
        localStorage.setItem(`serein_onboarding_${user.uid}`, 'true');
      }
      navigate('/app');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress indicator */}
        <div className="onboarding-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="onboarding-step">
            <span className="step-emoji">🌍</span>
            <h2>{t('onboarding.step1Title')}</h2>
            <p className="step-description">{t('onboarding.step1Description')}</p>

            <div className="language-options">
              <button
                className={`language-option ${selectedLanguage === 'fr' ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect('fr')}
              >
                <span className="lang-flag">🇫🇷</span>
                <span className="lang-name">Francais</span>
              </button>
              <button
                className={`language-option ${selectedLanguage === 'en' ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect('en')}
              >
                <span className="lang-flag">🇬🇧</span>
                <span className="lang-name">English</span>
              </button>
              <button
                className={`language-option ${selectedLanguage === 'es' ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect('es')}
              >
                <span className="lang-flag">🇪🇸</span>
                <span className="lang-name">Espanol</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: How it works */}
        {step === 2 && (
          <div className="onboarding-step">
            <span className="step-emoji">🔍</span>
            <h2>{t('onboarding.step2Title')}</h2>
            <p className="step-description">{t('onboarding.step2Description')}</p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🔗</span>
                <div className="feature-text">
                  <strong>{t('onboarding.feature1Title')}</strong>
                  <p>{t('onboarding.feature1Description')}</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📷</span>
                <div className="feature-text">
                  <strong>{t('onboarding.feature2Title')}</strong>
                  <p>{t('onboarding.feature2Description')}</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <div className="feature-text">
                  <strong>{t('onboarding.feature3Title')}</strong>
                  <p>{t('onboarding.feature3Description')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Ready to go */}
        {step === 3 && (
          <div className="onboarding-step">
            <span className="step-emoji">✅</span>
            <h2>{t('onboarding.step3Title')}</h2>
            <p className="step-description">{t('onboarding.step3Description')}</p>

            <div className="ready-box">
              <p className="ready-text">{t('onboarding.freeAnalyses')}</p>
              <p className="ready-note">{t('onboarding.upgradeNote')}</p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="onboarding-nav">
          {step > 1 && (
            <button className="nav-button secondary" onClick={handleBack}>
              {t('onboarding.back')}
            </button>
          )}
          <button className="nav-button primary" onClick={handleNext}>
            {step === 3 ? t('onboarding.start') : t('onboarding.next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
