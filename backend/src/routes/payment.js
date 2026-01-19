const express = require('express');
const router = express.Router();
const { createInvoice, checkInvoice } = require('../services/lightning');
const admin = require('firebase-admin');

// Initialise Firebase Admin si pas déjà fait
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n')
      })
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

const db = admin.firestore();

// Créer une facture
router.post('/create-invoice', async (req, res) => {
  try {
    const { userId, email } = req.body;

    console.log('Creating invoice for user:', userId, email);

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const invoice = await createInvoice(29, `Serein Premium - ${email || 'user'}`, userId);

    // Sauvegarder la facture dans Firestore
    await db.collection('payments').doc(invoice.invoiceId).set({
      userId,
      email: email || '',
      amount: 29,
      currency: 'EUR',
      amountSats: invoice.amountSats,
      paymentRequest: invoice.paymentRequest,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Invoice created and saved:', invoice.invoiceId);

    res.json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create invoice' });
  }
});

// Vérifier le statut du paiement
router.get('/check-payment/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;

    console.log('Checking payment:', invoiceId);

    const result = await checkInvoice(invoiceId);

    console.log('Payment status:', result.status, 'paid:', result.paid);

    if (result.paid) {
      // Récupérer le paiement pour avoir le userId
      const paymentDoc = await db.collection('payments').doc(invoiceId).get();

      if (paymentDoc.exists) {
        const payment = paymentDoc.data();
        console.log('Updating user subscription for:', payment.userId);

        // Mettre à jour le paiement
        await db.collection('payments').doc(invoiceId).update({
          status: 'paid',
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Activer l'abonnement premium
        const now = new Date();
        const oneYearLater = new Date(now);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        await db.collection('users').doc(payment.userId).update({
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': oneYearLater,
          'subscription.paymentMethod': 'lightning',
          'subscription.paymentId': invoiceId
        });

        console.log('User subscription updated to premium!');
      } else {
        console.log('Payment document not found, trying to update user directly');
        // Fallback: essayer de mettre à jour via l'order_id (qui est le userId)
        const usersSnapshot = await db.collection('users').limit(100).get();
        // Le invoiceId d'OpenNode contient parfois des infos, sinon on log l'erreur
        console.log('Payment doc not found for invoice:', invoiceId);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Check payment error:', error.message);
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

// Route manuelle pour activer premium (utile pour débug)
router.post('/activate-premium', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    await db.collection('users').doc(userId).update({
      'subscription.status': 'active',
      'subscription.startDate': now,
      'subscription.endDate': oneYearLater,
      'subscription.paymentMethod': 'manual'
    });

    console.log('Premium activated manually for:', userId);

    res.json({ success: true, message: 'Premium activated' });
  } catch (error) {
    console.error('Activate premium error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
