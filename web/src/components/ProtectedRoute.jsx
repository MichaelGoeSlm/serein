import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if onboarding is completed (stored in localStorage for now)
  // Later this can be fetched from Firestore user document
  if (requireOnboarding) {
    const onboardingCompleted = localStorage.getItem(`serein_onboarding_${user.uid}`);
    if (!onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
