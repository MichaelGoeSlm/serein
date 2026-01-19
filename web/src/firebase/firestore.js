import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

/**
 * Create user profile in Firestore if it doesn't exist
 */
export async function createUserProfile(user, language = 'fr') {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newProfile = {
        email: user.email,
        name: user.displayName || '',
        language: language,
        createdAt: serverTimestamp(),
        onboardingCompleted: false,
        subscription: {
          status: 'free',
          analysesUsed: 0,
          startDate: null,
          endDate: null
        }
      };

      await setDoc(userRef, newProfile);
      return { ...newProfile, createdAt: new Date() };
    }

    return userSnap.data();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(userId, data) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Mark onboarding as complete
 */
export async function markOnboardingComplete(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      onboardingCompleted: true
    });
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
    throw error;
  }
}

/**
 * Save an analysis to Firestore
 */
export async function saveAnalysis(userId, analysis) {
  try {
    const analysesRef = collection(db, 'analyses');
    const analysisData = {
      userId,
      type: analysis.type,
      input: analysis.input || '',
      verdict: analysis.verdict,
      confidence: analysis.confidence || 0,
      summary: analysis.summary || '',
      redFlags: analysis.redFlags || [],
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(analysesRef, analysisData);
    return { id: docRef.id, ...analysisData };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
}

/**
 * Get all analyses for a user, sorted by date (newest first)
 */
export async function getAnalyses(userId) {
  try {
    const analysesRef = collection(db, 'analyses');
    const q = query(
      analysesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({ id: doc.id, ...doc.data() });
    });

    return analyses;
  } catch (error) {
    console.error('Error getting analyses:', error);
    throw error;
  }
}

/**
 * Increment the analyses used counter for a user
 */
export async function incrementAnalysesUsed(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.analysesUsed': increment(1)
    });
  } catch (error) {
    console.error('Error incrementing analyses used:', error);
    throw error;
  }
}

/**
 * Get the number of analyses used by a user
 */
export async function getAnalysesCount(userId) {
  try {
    const profile = await getUserProfile(userId);
    return profile?.subscription?.analysesUsed || 0;
  } catch (error) {
    console.error('Error getting analyses count:', error);
    throw error;
  }
}

/**
 * Activate premium subscription for a user
 */
export async function activatePremium(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const now = new Date();
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    await updateDoc(userRef, {
      'subscription.status': 'active',
      'subscription.startDate': now.toISOString(),
      'subscription.endDate': oneYearLater.toISOString()
    });
  } catch (error) {
    console.error('Error activating premium:', error);
    throw error;
  }
}
