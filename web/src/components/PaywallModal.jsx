import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './PaywallModal.css';

function PaywallModal({ onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate('/payment');
  };

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <div className="paywall-icon">🔒</div>
        <h2 className="paywall-title">{t('paywall.title')}</h2>
        <p className="paywall-subtitle">{t('paywall.subtitle')}</p>

        <div className="paywall-price">
          <span className="price-amount">{t('paywall.price')}</span>
          <span className="price-period">{t('paywall.perYear') || '/ an'}</span>
        </div>

        <button className="paywall-button primary" onClick={handlePayment}>
          {t('paywall.payWith')}
        </button>

        <button className="paywall-button secondary" onClick={onClose}>
          {t('paywall.later')}
        </button>
      </div>
    </div>
  );
}

export default PaywallModal;
