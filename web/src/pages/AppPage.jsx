import { useState } from 'react';
import { Link, Camera, FileText, Mail, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveAnalysis, incrementAnalysesUsed } from '../firebase/firestore';
import NavBar from '../components/NavBar';
import LinkInput from '../components/LinkInput';
import ImageInput from '../components/ImageInput';
import TextInput from '../components/TextInput';
import ResultCard from '../components/ResultCard';
import ProgressIndicator from '../components/ProgressIndicator';
import HelpMessage from '../components/HelpMessage';
import PaywallModal from '../components/PaywallModal';
import EmailInstructionsModal from '../components/EmailInstructionsModal';
import { analyzeUrl, analyzeImages, analyzeText } from '../services/api';
import './AppPage.css';

function AppPage() {
  const { t, language } = useLanguage();
  const { user, canAnalyze, analysesRemaining, isPremium, refreshUserProfile } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeMode, setActiveMode] = useState('link');
  const [showResult, setShowResult] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [previousMode, setPreviousMode] = useState('link');

  const saveAnalysisToFirestore = async (data, input, type) => {
    if (!user) return;

    try {
      await saveAnalysis(user.uid, {
        type,
        input: input?.substring(0, 200) || '',
        verdict: data.analysis?.verdict,
        confidence: data.analysis?.confidence,
        summary: data.analysis?.summary,
        redFlags: data.analysis?.redFlags || []
      });

      // Increment analyses used counter (only for free users)
      if (!isPremium) {
        await incrementAnalysesUsed(user.uid);
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  const handleAnalyzeUrl = async (url) => {
    // Check if user can analyze
    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeUrl(url, language);
      setResult(data);
      setShowResult(true);
      await saveAnalysisToFirestore(data, url, 'link');
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImages = async (imagesBase64Array) => {
    // Check if user can analyze
    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeImages(imagesBase64Array, language);
      setResult(data);
      setShowResult(true);
      await saveAnalysisToFirestore(data, `[${imagesBase64Array.length} image(s)]`, 'image');
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async (text) => {
    // Check if user can analyze
    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowHelp(false);
    setShowResult(false);

    try {
      const data = await analyzeText(text, language);
      setResult(data);
      setShowResult(true);
      await saveAnalysisToFirestore(data, text, 'text');
    } catch (err) {
      setError(err.message || t('errorAnalysis'));
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    if (loading) return;

    // Special handling for email tab
    if (mode === 'email') {
      setPreviousMode(activeMode);
      setShowEmailModal(true);
      return;
    }

    setActiveMode(mode);
    setResult(null);
    setError(null);
    setShowHelp(false);
    setShowResult(false);
  };

  const handleEmailModalConfirm = () => {
    // Switch to image tab after user understands
    setActiveMode('image');
    setResult(null);
    setError(null);
    setShowHelp(false);
    setShowResult(false);
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    // Stay on previous mode (don't switch to email)
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
    setShowHelp(false);
    setShowResult(false);
  };

  const getInstruction = () => {
    switch (activeMode) {
      case 'image':
        return t('instructionImage');
      case 'text':
        return t('instructionText');
      default:
        return t('instructionLink');
    }
  };

  return (
    <div className="app-page">
      <NavBar />

      <main className="main">
        {/* Analyses remaining indicator for free users */}
        {!isPremium && (
          <div className="analyses-remaining">
            <span className="analyses-count">
              {analysesRemaining}/3 {t('analysesRemaining') || 'analyses restantes'}
            </span>
          </div>
        )}

        {/* Mode Tabs */}
        <div className="mode-tabs tabs-modern">
          <button
            className={`tab-modern ${activeMode === 'link' ? 'active' : ''}`}
            onClick={() => handleModeChange('link')}
            disabled={loading}
          >
            <Link size={18} />
            <span>{t('tabLink')}</span>
          </button>
          <button
            className={`tab-modern ${activeMode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeChange('image')}
            disabled={loading}
          >
            <Camera size={18} />
            <span>{t('tabImage')}</span>
          </button>
          <button
            className={`tab-modern ${activeMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
            disabled={loading}
          >
            <FileText size={18} />
            <span>{t('tabText')}</span>
          </button>
          <button
            className="tab-modern"
            onClick={() => handleModeChange('email')}
            disabled={loading}
          >
            <Mail size={18} />
            <span>{t('email.tabName')}</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && <ProgressIndicator />}

        {/* Error with Help */}
        {error && !loading && (
          <>
            <div className="alert-modern alert-error">
              <AlertTriangle size={20} />
              <div className="error-content">
                <strong>{t('oops')}</strong>
                <p>{error}</p>
              </div>
            </div>
            {showHelp && (
              <HelpMessage type={activeMode} onClose={() => setShowHelp(false)} />
            )}
          </>
        )}

        {/* Result View */}
        {showResult && result && !loading && (
          <div className="result-view animate-fadeInUp">
            <ResultCard result={result} />
            <button
              type="button"
              className="btn-modern btn-primary-gradient new-analysis-btn"
              onClick={handleNewAnalysis}
            >
              {t('newAnalysis')}
            </button>
          </div>
        )}

        {/* Input Section - Only show when not loading and no result */}
        {!loading && !showResult && (
          <div className="input-section">
            <p className="instruction">{getInstruction()}</p>

            {activeMode === 'link' && (
              <LinkInput onAnalyzeUrl={handleAnalyzeUrl} isLoading={loading} />
            )}
            {activeMode === 'image' && (
              <ImageInput onAnalyzeImages={handleAnalyzeImages} isLoading={loading} />
            )}
            {activeMode === 'text' && (
              <TextInput onAnalyzeText={handleAnalyzeText} isLoading={loading} />
            )}
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} />
      )}

      {/* Email Instructions Modal */}
      {showEmailModal && (
        <EmailInstructionsModal
          onClose={handleEmailModalClose}
          onConfirm={handleEmailModalConfirm}
        />
      )}
    </div>
  );
}

export default AppPage;
