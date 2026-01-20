const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n')
      })
    });
    console.log('Firebase Admin initialized for admin routes');
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

const db = admin.firestore();

// List of allowed admin emails
const ALLOWED_ADMINS = ['michaelparis23@gmail.com'];

// Middleware to verify admin credentials
const verifyAdmin = (req, res, next) => {
  const adminEmail = req.headers['x-admin-email'];
  const adminPassword = req.headers['x-admin-password'];

  if (!adminEmail || !adminPassword) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  if (!ALLOWED_ADMINS.includes(adminEmail)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  next();
};

// Apply middleware to all admin routes
router.use(verifyAdmin);

// GET /api/admin/stats - Get admin statistics
router.get('/stats', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const analysesSnapshot = await db.collection('analyses').get();

    let totalUsers = 0;
    let premiumUsers = 0;
    let freeUsers = 0;

    usersSnapshot.forEach((doc) => {
      totalUsers++;
      const data = doc.data();
      const subscription = data.subscription || {};

      if (subscription.status === 'active') {
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

    res.json({
      totalUsers,
      premiumUsers,
      freeUsers,
      totalAnalyses: analysesSnapshot.size
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email,
        name: data.name,
        photoURL: data.photoURL,
        createdAt: data.createdAt,
        subscription: data.subscription || {}
      });
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:userId - Update a user
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscription } = req.body;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {};

    if (subscription) {
      if (subscription.status !== undefined) {
        updateData['subscription.status'] = subscription.status;
      }
      if (subscription.endDate !== undefined) {
        updateData['subscription.endDate'] = subscription.endDate ? new Date(subscription.endDate) : null;
      }
      if (subscription.startDate !== undefined) {
        updateData['subscription.startDate'] = subscription.startDate ? new Date(subscription.startDate) : null;
      }
      if (subscription.analysesUsed !== undefined) {
        updateData['subscription.analysesUsed'] = subscription.analysesUsed;
      }
    }

    await userRef.update(updateData);

    console.log('User updated:', userId, updateData);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
