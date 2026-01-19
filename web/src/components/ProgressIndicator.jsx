import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './ProgressIndicator.css';

const STEP_DURATION = 5000; // 5 seconds per step

function ProgressIndicator() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { key: 'progressFetching', percent: 25 },
    { key: 'progressAnalyzing', percent: 50 },
    { key: 'progressSearching', percent: 75 },
    { key: 'progressAlmostDone', percent: 90 }
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = steps[currentStep]?.percent || 90;
        if (prev < target) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    // Step change
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, STEP_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [currentStep]);

  return (
    <div className="progress-indicator card">
      <div className="progress-spinner"></div>

      <h2 className="progress-title">{t('pleaseWait')}</h2>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="progress-step">{t(steps[currentStep].key)}</p>

      <p className="progress-hint">{t('analysisTime')}</p>
    </div>
  );
}

export default ProgressIndicator;
