import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { verifyMagicLink } from '../services/api';
import { signInWithCustomToken } from '../firebase/auth';
import './VerifyMagicLinkPage.css';

function VerifyMagicLinkPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError(t('login.verifyError'));
      return;
    }

    const verify = async () => {
      try {
        // Verify the magic link token with the backend
        const result = await verifyMagicLink(token);

        if (result.success && result.customToken) {
          // Sign in with the custom token
          await signInWithCustomToken(result.customToken);

          setStatus('success');

          // Redirect to app or onboarding after a short delay
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 1500);
        } else {
          throw new Error(t('login.verifyError'));
        }
      } catch (err) {
        console.error('Magic link verification error:', err);
        setStatus('error');
        setError(err.message || t('login.verifyError'));
      }
    };

    verify();
  }, [searchParams, navigate, t]);

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-card">
          {status === 'verifying' && (
            <div className="verify-loading">
              <div className="spinner"></div>
              <p>{t('login.verifying')}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-success">
              <span className="success-icon">✅</span>
              <h2>Connexion reussie !</h2>
              <p>Redirection en cours...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-error">
              <span className="error-icon">❌</span>
              <h2>{t('login.verifyError')}</h2>
              <p>{error}</p>
              <button
                className="retry-button"
                onClick={() => navigate('/login', { replace: true })}
              >
                Retour a la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyMagicLinkPage;
