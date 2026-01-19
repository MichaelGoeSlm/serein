import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { markOnboardingComplete } from '../firebase/firestore';
import './OnboardingPage.css';

function OnboardingPage() {
  const { t } = useLanguage();
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      // Mark onboarding as complete in Firestore
      if (user) {
        try {
          await markOnboardingComplete(user.uid);
          await refreshUserProfile();
        } catch (error) {
          console.error('Error completing onboarding:', error);
        }
      }
      navigate('/app');
    }
  };

  return (
    <div className="onboarding-page">
      <div className={`onboarding-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {/* Step 1: What Serein does */}
        {step === 1 && (
          <div className="onboarding-step">
            <div className="step-icon">🛡️</div>
            <h1 className="step-title">{t('onboarding.step1Title')}</h1>
            <p className="step-text">{t('onboarding.step1Text')}</p>
          </div>
        )}

        {/* Step 2: Privacy */}
        {step === 2 && (
          <div className="onboarding-step">
            <div className="step-icon">🔒</div>
            <h1 className="step-title">{t('onboarding.step2Title')}</h1>
            <ul className="privacy-list">
              <li>
                <span className="check-icon">✓</span>
                {t('onboarding.step2List1')}
              </li>
              <li>
                <span className="check-icon">✓</span>
                {t('onboarding.step2List2')}
              </li>
              <li>
                <span className="check-icon">✓</span>
                {t('onboarding.step2List3')}
              </li>
            </ul>
            <p className="step-text">{t('onboarding.step2Text')}</p>
          </div>
        )}

        {/* Step 3: How to use */}
        {step === 3 && (
          <div className="onboarding-step">
            <div className="step-icon">✨</div>
            <h1 className="step-title">{t('onboarding.step3Title')}</h1>
            <div className="how-to-list">
              <div className="how-to-item">
                <span className="step-number">1</span>
                <p>{t('onboarding.step3Item1')}</p>
              </div>
              <div className="how-to-item">
                <span className="step-number">2</span>
                <p>{t('onboarding.step3Item2')}</p>
              </div>
              <div className="how-to-item">
                <span className="step-number">3</span>
                <p>{t('onboarding.step3Item3')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="onboarding-footer">
        <button className="onboarding-button" onClick={handleNext}>
          {step === 3 ? t('onboarding.start') : t('onboarding.next')}
        </button>

        {/* Progress dots */}
        <div className="progress-dots">
          <span className={`dot ${step === 1 ? 'active' : ''}`}></span>
          <span className={`dot ${step === 2 ? 'active' : ''}`}></span>
          <span className={`dot ${step === 3 ? 'active' : ''}`}></span>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
