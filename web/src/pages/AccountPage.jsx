import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAnalyses, updateUserProfile } from '../firebase/firestore';
import NavBar from '../components/NavBar';
import './AccountPage.css';

function AccountPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, userProfile, signOut, isPremium, analysesUsed, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  useEffect(() => {
    // Refresh user profile on mount to get latest data
    refreshUserProfile();
  }, []);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (user) {
        try {
          const data = await getAnalyses(user.uid);
          setAnalyses(data);
        } catch (error) {
          console.error('Error fetching analyses:', error);
        } finally {
          setLoadingAnalyses(false);
        }
      }
    };

    fetchAnalyses();
  }, [user]);

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    if (user) {
      try {
        await updateUserProfile(user.uid, { language: newLang });
        await refreshUserProfile();
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'fiable': return 'verdict-safe';
      case 'prudence': return 'verdict-caution';
      case 'suspect': return 'verdict-danger';
      default: return '';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'link': return '🔗';
      case 'image': return '📷';
      case 'text': return '📝';
      default: return '📄';
    }
  };

  const premiumEndDate = userProfile?.subscription?.endDate
    ? new Date(userProfile.subscription.endDate).toLocaleDateString(language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="account-page">
      <NavBar />

      <div className="account-content">
        <h1 className="account-title">{t('account.title')}</h1>

        {/* Profile Section */}
        <section className="account-section">
          <h2>{t('account.profile')}</h2>
          <div className="profile-card">
            <div className="profile-header">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="profile-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="profile-avatar-placeholder">👤</div>
              )}
              <div className="profile-info">
                <p className="profile-name">{user?.displayName || userProfile?.name}</p>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>

            <div className="language-selector-row">
              <span className="language-label">{t('account.language') || 'Langue'}:</span>
              <div className="language-buttons">
                <button
                  className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('fr')}
                >
                  🇫🇷 FR
                </button>
                <button
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  🇬🇧 EN
                </button>
                <button
                  className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('es')}
                >
                  🇪🇸 ES
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="account-section">
          <h2>{t('account.subscription')}</h2>
          <div className="subscription-card">
            {isPremium ? (
              <>
                <div className="subscription-badge premium">
                  <span>⭐</span> {t('account.premiumPlan')}
                </div>
                <p className="subscription-info">
                  {t('account.validUntil')} {premiumEndDate}
                </p>
              </>
            ) : (
              <>
                <div className="subscription-badge free">
                  {t('account.freePlan')}
                </div>
                <p className="subscription-info">
                  {analysesUsed}/3 {t('account.analysesUsed')}
                </p>
                <button
                  className="upgrade-button"
                  onClick={() => navigate('/payment')}
                >
                  {t('account.upgradeToPremium')} ⚡
                </button>
              </>
            )}
          </div>
        </section>

        {/* History Section */}
        <section className="account-section">
          <h2>{t('account.history')}</h2>
          <div className="history-list">
            {loadingAnalyses ? (
              <p className="history-loading">{t('account.loading') || 'Chargement...'}</p>
            ) : analyses.length === 0 ? (
              <p className="history-empty">{t('account.noHistory')}</p>
            ) : (
              analyses.map((analysis) => (
                <div key={analysis.id} className="history-item">
                  <span className="history-type">{getTypeIcon(analysis.type)}</span>
                  <div className="history-details">
                    <p className="history-input">
                      {analysis.input?.substring(0, 50)}
                      {analysis.input?.length > 50 ? '...' : ''}
                    </p>
                    <p className="history-date">{formatDate(analysis.createdAt)}</p>
                  </div>
                  <span className={`history-verdict ${getVerdictClass(analysis.verdict)}`}>
                    {t(`verdict.${analysis.verdict}`)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Logout Section */}
        <section className="account-section logout-section">
          <button className="logout-button" onClick={handleSignOut}>
            {t('account.logout')}
          </button>
        </section>
      </div>
    </div>
  );
}

export default AccountPage;
