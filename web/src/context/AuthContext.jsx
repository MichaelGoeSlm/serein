import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle, signOut as firebaseSignOut, onAuthStateChanged } from '../firebase/auth';
import { getUserProfile, createUserProfile } from '../firebase/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }

    try {
      let profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        // Create new profile if doesn't exist
        const browserLang = navigator.language?.split('-')[0] || 'fr';
        const lang = ['fr', 'en', 'es'].includes(browserLang) ? browserLang : 'fr';
        profile = await createUserProfile(firebaseUser, lang);
      }

      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await loadUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      await loadUserProfile(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Refresh user profile from Firestore
  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Compute subscription status
  const subscription = userProfile?.subscription || {};
  const isPremium = subscription.status === 'active' &&
    subscription.endDate &&
    new Date(subscription.endDate) > new Date();
  const analysesUsed = subscription.analysesUsed || 0;
  const analysesRemaining = isPremium ? Infinity : Math.max(0, 3 - analysesUsed);
  const canAnalyze = isPremium || analysesUsed < 3;

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    refreshUserProfile,
    isAuthenticated: !!user,
    // Subscription helpers
    isPremium,
    analysesUsed,
    analysesRemaining,
    canAnalyze
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
