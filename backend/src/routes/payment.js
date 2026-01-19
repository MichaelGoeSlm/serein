const express = require('express');
const router = express.Router();
const { createInvoice, checkInvoice } = require('../services/lightning');
const admin = require('firebase-admin');

// Initialise Firebase Admin si pas déjà fait
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

// Créer une facture
router.post('/create-invoice', async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const invoice = await createInvoice(29, `Serein Premium - ${email}`, userId);

    // Sauvegarder la facture dans Firestore
    await db.collection('payments').doc(invoice.invoiceId).set({
      userId,
      email,
      amount: 29,
      currency: 'EUR',
      amountSats: invoice.amountSats,
      paymentRequest: invoice.paymentRequest,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: invoice.expiresAt
    });

    res.json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Vérifier le statut du paiement
router.get('/check-payment/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const result = await checkInvoice(invoiceId);

    if (result.paid) {
      // Mettre à jour le paiement
      const paymentRef = db.collection('payments').doc(invoiceId);
      const paymentDoc = await paymentRef.get();

      if (paymentDoc.exists) {
        const payment = paymentDoc.data();

        // Mettre à jour le statut du paiement
        await paymentRef.update({
          status: 'paid',
          paidAt: new Date()
        });

        // Activer l'abonnement premium
        const userRef = db.collection('users').doc(payment.userId);
        const now = new Date();
        const oneYearLater = new Date(now);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        await userRef.update({
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': oneYearLater,
          'subscription.paymentMethod': 'lightning',
          'subscription.paymentId': invoiceId
        });
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

// Webhook OpenNode (pour confirmation automatique)
router.post('/webhook', async (req, res) => {
  try {
    const { id, status } = req.body;

    if (status === 'paid') {
      const paymentRef = db.collection('payments').doc(id);
      const paymentDoc = await paymentRef.get();

      if (paymentDoc.exists) {
        const payment = paymentDoc.data();

        await paymentRef.update({
          status: 'paid',
          paidAt: new Date()
        });

        const userRef = db.collection('users').doc(payment.userId);
        const now = new Date();
        const oneYearLater = new Date(now);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        await userRef.update({
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': oneYearLater,
          'subscription.paymentMethod': 'lightning',
          'subscription.paymentId': id
        });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
