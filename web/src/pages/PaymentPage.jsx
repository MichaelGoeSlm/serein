import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LightningPayment from '../components/LightningPayment';
import './PaymentPage.css';

function PaymentPage() {
  const { t } = useLanguage();
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://serein-backend.onrender.com';

  useEffect(() => {
    const createInvoice = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${API_URL}/api/payment/create-invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create invoice');
        }

        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        console.error('Error creating invoice:', err);
        setError(t('payment.error') || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    createInvoice();
  }, [user, API_URL, t]);

  const handlePaymentConfirmed = async (paymentData) => {
    try {
      // Backend already activated premium, just refresh user profile
      await refreshUserProfile();

      // Redirect to app after short delay
      setTimeout(() => {
        navigate('/app');
      }, 2000);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <Link to="/app" className="back-link">
          <span className="back-arrow">←</span>
          <span>{t('payment.backToApp') || 'Retour'}</span>
        </Link>
      </div>

      <div className="payment-content">
        <div className="payment-card">
          <div className="payment-title-section">
            <span className="payment-icon">⚡</span>
            <h1>{t('payment.title')}</h1>
          </div>

          {loading && (
            <div className="payment-loading">
              <div className="loading-spinner"></div>
              <p>{t('payment.creating') || 'Creation de la facture...'}</p>
            </div>
          )}

          {error && (
            <div className="payment-error">
              <span>⚠️</span>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                {t('payment.retry')}
              </button>
            </div>
          )}

          {invoice && !loading && !error && (
            <LightningPayment
              invoice={invoice}
              onPaymentConfirmed={handlePaymentConfirmed}
            />
          )}
        </div>

        <div className="payment-info">
          <h3>{t('payment.whyBitcoin') || 'Pourquoi Bitcoin ?'}</h3>
          <ul>
            <li>🔒 {t('payment.reason1') || 'Paiement anonyme et securise'}</li>
            <li>⚡ {t('payment.reason2') || 'Instantane avec Lightning'}</li>
            <li>🌍 {t('payment.reason3') || 'Accessible partout dans le monde'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
