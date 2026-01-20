const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
    console.log('Firebase Admin initialized for auth routes');
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

const db = admin.firestore();

// Create email transporter (uses Gmail or SendGrid based on env)
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }

  // Fallback to Gmail
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// POST /api/auth/magic-link - Send a magic link
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email invalide' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token in Firestore
    await db.collection('magic_links').doc(token).set({
      email: email.toLowerCase(),
      expiresAt,
      used: false,
      createdAt: new Date()
    });

    // Magic link URL
    const magicLinkUrl = `${process.env.FRONTEND_URL || 'https://magnificent-beijinho-f18e1c.netlify.app'}/auth/verify?token=${token}`;

    // Create transporter and send email
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@serein.app',
      to: email,
      subject: 'Votre lien de connexion Serein',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Serein</h1>
            <p style="color: #666; margin-top: 5px;">Votre assistant anti-arnaque</p>
          </div>

          <h2 style="color: #333;">Connexion a Serein</h2>
          <p style="color: #555; line-height: 1.6;">Cliquez sur le bouton ci-dessous pour vous connecter :</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLinkUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Se connecter a Serein
            </a>
          </div>

          <p style="color: #888; font-size: 14px;">Ce lien expire dans 15 minutes.</p>
          <p style="color: #888; font-size: 14px;">Si vous n'avez pas demande ce lien, ignorez cet email.</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">Serein - Protegez-vous des arnaques en ligne</p>
        </body>
        </html>
      `
    });

    console.log('Magic link sent to:', email);
    res.json({ success: true, message: 'Lien envoye par email' });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du lien' });
  }
});

// POST /api/auth/verify-magic-link - Verify the token
router.post('/verify-magic-link', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const tokenDoc = await db.collection('magic_links').doc(token).get();

    if (!tokenDoc.exists) {
      return res.status(400).json({ error: 'Lien invalide' });
    }

    const tokenData = tokenDoc.data();

    if (tokenData.used) {
      return res.status(400).json({ error: 'Lien deja utilise' });
    }

    const expiresAt = tokenData.expiresAt.toDate ? tokenData.expiresAt.toDate() : new Date(tokenData.expiresAt);
    if (new Date() > expiresAt) {
      return res.status(400).json({ error: 'Lien expire' });
    }

    // Mark token as used
    await db.collection('magic_links').doc(token).update({ used: true });

    // Create or get Firebase user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(tokenData.email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await admin.auth().createUser({
          email: tokenData.email,
          emailVerified: true
        });

        // Create user profile in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          email: tokenData.email,
          name: tokenData.email.split('@')[0],
          createdAt: new Date(),
          onboardingCompleted: false,
          subscription: {
            status: 'free',
            analysesUsed: 0
          }
        });
      } else {
        throw error;
      }
    }

    // Create custom token for this user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    console.log('Magic link verified for:', tokenData.email);
    res.json({ success: true, customToken, email: tokenData.email });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({ error: 'Erreur de verification' });
  }
});

module.exports = router;
