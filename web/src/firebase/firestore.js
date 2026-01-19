import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
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
