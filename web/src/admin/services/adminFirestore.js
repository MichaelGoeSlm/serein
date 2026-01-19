import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Get all users from Firestore
 */
export async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  try {
    // Get all users
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    let totalUsers = 0;
    let premiumUsers = 0;
    let freeUsers = 0;

    usersSnapshot.forEach((docSnap) => {
      totalUsers++;
      const data = docSnap.data();
      const subscription = data.subscription || {};

      if (subscription.status === 'active') {
        // Check if premium is still valid
        const endDate = subscription.endDate;
        if (endDate) {
          const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
          if (end > new Date()) {
            premiumUsers++;
          } else {
            freeUsers++;
          }
        } else {
          premiumUsers++;
        }
      } else {
        freeUsers++;
      }
    });

    // Get total analyses count
    const analysesRef = collection(db, 'analyses');
    const analysesCount = await getCountFromServer(analysesRef);

    return {
      totalUsers,
      premiumUsers,
      freeUsers,
      totalAnalyses: analysesCount.data().count
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
}

/**
 * Update user subscription status
 */
export async function updateUserSubscription(userId, subscriptionData) {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData = {};

    if (subscriptionData.status !== undefined) {
      updateData['subscription.status'] = subscriptionData.status;
    }

    if (subscriptionData.endDate !== undefined) {
      updateData['subscription.endDate'] = subscriptionData.endDate;
    }

    if (subscriptionData.startDate !== undefined) {
      updateData['subscription.startDate'] = subscriptionData.startDate;
    }

    if (subscriptionData.analysesUsed !== undefined) {
      updateData['subscription.analysesUsed'] = subscriptionData.analysesUsed;
    }

    await updateDoc(userRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

/**
 * Get user analyses count
 */
export async function getUserAnalysesCount(userId) {
  try {
    const analysesRef = collection(db, 'analyses');
    const q = query(analysesRef);
    const snapshot = await getDocs(q);

    let count = 0;
    snapshot.forEach((docSnap) => {
      if (docSnap.data().userId === userId) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error('Error getting user analyses count:', error);
    return 0;
  }
}
