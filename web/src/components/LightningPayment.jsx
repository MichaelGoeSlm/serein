import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './LightningPayment.css';

function LightningPayment({ invoice, onPaymentConfirmed }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [paid, setPaid] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Check payment status every 3 seconds
  useEffect(() => {
    if (!invoice || paid) return;

    const checkPayment = async () => {
      setChecking(true);
      try {
        const response = await fetch(`${API_URL}/api/payment/check-payment/${invoice.invoiceId}`);
        const data = await response.json();

        if (data.paid) {
          setPaid(true);
          onPaymentConfirmed?.(data);
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      } finally {
        setChecking(false);
      }
    };

    const interval = setInterval(checkPayment, 3000);
    checkPayment(); // Check immediately

    return () => clearInterval(interval);
  }, [invoice, paid, onPaymentConfirmed, API_URL]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invoice.paymentRequest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Generate QR code URL using a QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(invoice.paymentRequest)}`;

  if (paid) {
    return (
      <div className="lightning-payment success">
        <div className="success-icon">✅</div>
        <h2>{t('payment.success')}</h2>
        <p>{t('payment.redirecting') || 'Redirection...'}</p>
      </div>
    );
  }

  return (
    <div className="lightning-payment">
      <div className="payment-amount">
        <span className="amount-sats">{invoice.amountSats?.toLocaleString()} sats</span>
        <span className="amount-euros">({invoice.amountFiat || invoice.amountEuros} EUR)</span>
      </div>

      <div className="qr-container">
        <img src={qrCodeUrl} alt="Lightning Invoice QR Code" className="qr-code" />
      </div>

      <p className="payment-instruction">{t('payment.scanQR')}</p>

      <div className="invoice-copy">
        <p className="copy-label">{t('payment.orCopy')}</p>
        <div className="invoice-input">
          <input
            type="text"
            value={invoice.paymentRequest}
            readOnly
            className="invoice-text"
          />
          <button className="copy-button" onClick={handleCopy}>
            {copied ? t('payment.copied') : t('payment.copy')}
          </button>
        </div>
      </div>

      <div className="payment-status">
        <span className={`status-indicator ${checking ? 'checking' : ''}`}></span>
        <span>{t('payment.waiting')}</span>
      </div>
    </div>
  );
}

export default LightningPayment;
