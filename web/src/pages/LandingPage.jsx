import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import './LandingPage.css';

function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="landing">
      {/* Hero Section */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="landing-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">Serein</span>
          </div>
          <LanguageSelector />
        </div>

        <div className="hero">
          <h1 className="hero-title">{t('landing.heroTitle')}</h1>
          <p className="hero-subtitle">{t('landing.heroSubtitle')}</p>
          <Link to="/login" className="cta-button">
            {t('landing.cta')}
          </Link>
        </div>
      </header>

      {/* How it works */}
      <section className="section how-it-works">
        <h2 className="section-title">{t('landing.howItWorks')}</h2>
        <div className="steps">
          <div className="step">
            <span className="step-icon">📋</span>
            <p className="step-text">{t('landing.step1')}</p>
          </div>
          <div className="step">
            <span className="step-icon">🔍</span>
            <p className="step-text">{t('landing.step2')}</p>
          </div>
          <div className="step">
            <span className="step-icon">✅</span>
            <p className="step-text">{t('landing.step3')}</p>
          </div>
        </div>
      </section>

      {/* Why Serein */}
      <section className="section why-serein">
        <h2 className="section-title">{t('landing.whySerein')}</h2>
        <ul className="benefits">
          <li className="benefit">
            <span className="benefit-check">✓</span>
            {t('landing.benefit1')}
          </li>
          <li className="benefit">
            <span className="benefit-check">✓</span>
            {t('landing.benefit2')}
          </li>
          <li className="benefit">
            <span className="benefit-check">✓</span>
            {t('landing.benefit3')}
          </li>
          <li className="benefit">
            <span className="benefit-check">✓</span>
            {t('landing.benefit4')}
          </li>
        </ul>
      </section>

      {/* Pricing */}
      <section className="section pricing">
        <h2 className="section-title">{t('landing.pricingTitle')}</h2>
        <div className="pricing-card">
          <p className="pricing-free">{t('landing.pricingFree')}</p>
          <p className="pricing-paid">{t('landing.pricingPaid')}</p>
          <p className="pricing-note">{t('landing.pricingNote')}</p>
          <Link to="/login" className="cta-button">
            {t('landing.cta')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Serein - {t('landing.footer')}</p>
      </footer>
    </div>
  );
}

export default LandingPage;
