import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Link2, Camera, FileText, File, Star, Zap, AlertTriangle, X } from 'lucide-react';
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
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Debug logs
  console.log('🔍 AccountPage - isPremium:', isPremium);
  console.log('🔍 AccountPage - userProfile:', userProfile);
  console.log('🔍 AccountPage - subscription:', userProfile?.subscription);

  useEffect(() => {
    // Refresh user profile on mount to get latest data
    console.log('🔍 AccountPage - refreshing user profile on mount');
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
    // Mark that user has explicitly chosen a language
    localStorage.setItem('serein-language-chosen', 'true');
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
      case 'link': return <Link2 size={18} />;
      case 'image': return <Camera size={18} />;
      case 'text': return <FileText size={18} />;
      default: return <File size={18} />;
    }
  };

  // Handle Firestore Timestamp or Date string
  const getEndDateFormatted = () => {
    const endDate = userProfile?.subscription?.endDate;
    if (!endDate) return '';
    const date = endDate.toDate ? endDate.toDate() : new Date(endDate);
    return date.toLocaleDateString(language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const premiumEndDate = getEndDateFormatted();

  const formatFullDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'link': return t('tabLink');
      case 'image': return t('tabImage');
      case 'text': return t('tabText');
      default: return type;
    }
  };

  const getVerdictLabel = (verdict) => {
    return t(`verdict.${verdict}`) || verdict;
  };

  return (
    <div className="account-page">
      <NavBar />

      <div className="account-content">
        {/* Verify Content Button */}
        <button
          className="verify-content-button"
          onClick={() => navigate('/app')}
        >
          <Shield size={20} className="verify-icon" />
          {t('nav.verifyContent')}
        </button>

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
                <div className="profile-avatar-placeholder">
                  <User size={24} />
                </div>
              )}
              <div className="profile-info">
                <p className="profile-name">{user?.displayName || userProfile?.name}</p>
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
                  <Star size={16} /> {t('account.premiumPlan')}
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
                  {t('account.analysesUsed').replace('{count}', `${analysesUsed}/3`)}
                </p>
                <button
                  className="upgrade-button"
                  onClick={() => navigate('/payment')}
                >
                  {t('account.upgradeToPremium')} <Zap size={16} />
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
                <div
                  key={analysis.id}
                  className="history-item history-item-clickable"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
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
                  <span className="history-arrow">›</span>
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

      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="analysis-modal-overlay" onClick={() => setSelectedAnalysis(null)}>
          <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('history.viewDetails')}</h2>
              <button className="modal-close" onClick={() => setSelectedAnalysis(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {/* Date */}
              <div className="modal-section">
                <label>{t('history.analysisDate')}</label>
                <p>{formatFullDate(selectedAnalysis.createdAt)}</p>
              </div>

              {/* Type */}
              <div className="modal-section">
                <label>{t('history.contentType')}</label>
                <p>{getTypeIcon(selectedAnalysis.type)} {getTypeLabel(selectedAnalysis.type)}</p>
              </div>

              {/* Analyzed content */}
              <div className="modal-section">
                <label>{t('history.analyzedContent')}</label>
                {selectedAnalysis.type === 'image' ? (
                  <div className="modal-image-preview">
                    {selectedAnalysis.input?.startsWith('data:') ? (
                      <img src={selectedAnalysis.input} alt="Analyzed" />
                    ) : (
                      <p className="modal-text-content">{selectedAnalysis.input}</p>
                    )}
                  </div>
                ) : (
                  <p className="modal-text-content">{selectedAnalysis.input}</p>
                )}
              </div>

              {/* Verdict */}
              <div className="modal-section">
                <label>{t('trustLevel')}</label>
                <div className={`modal-verdict ${getVerdictClass(selectedAnalysis.verdict)}`}>
                  {getVerdictLabel(selectedAnalysis.verdict)}
                  {selectedAnalysis.confidence && (
                    <span className="modal-confidence"> ({selectedAnalysis.confidence}%)</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {selectedAnalysis.summary && (
                <div className="modal-section">
                  <label>{t('summary')}</label>
                  <p>{selectedAnalysis.summary}</p>
                </div>
              )}

              {/* Red flags */}
              {selectedAnalysis.redFlags && selectedAnalysis.redFlags.length > 0 && (
                <div className="modal-section">
                  <label>{t('redFlags')}</label>
                  <ul className="modal-red-flags">
                    {selectedAnalysis.redFlags.map((flag, index) => (
                      <li key={index}><AlertTriangle size={14} /> {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reassurance */}
              {selectedAnalysis.reassurance && (
                <div className="modal-section">
                  <label>{t('reassurance')}</label>
                  <p className="modal-reassurance">{selectedAnalysis.reassurance}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-close-btn" onClick={() => setSelectedAnalysis(null)}>
                {t('history.closeDetails')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
