const express = require('express');
const router = express.Router();
const lightning = require('../services/lightning');

// Store pending payments (in production, use a database)
const pendingPayments = new Map();

/**
 * POST /api/payment/create-invoice
 * Create a new Lightning invoice for premium subscription
 */
router.post('/create-invoice', async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Create invoice for 29 EUR
    const invoice = await lightning.createInvoice(29, `Serein Premium - ${email || userId}`);

    // Store the pending payment
    pendingPayments.set(invoice.invoiceId, {
      userId,
      email,
      ...invoice
    });

    res.json({
      invoiceId: invoice.invoiceId,
      paymentRequest: invoice.paymentRequest,
      amountSats: invoice.amountSats,
      amountEuros: invoice.amountEuros,
      expiresAt: invoice.expiresAt
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

/**
 * GET /api/payment/check/:invoiceId
 * Check if an invoice has been paid
 */
router.get('/check/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const status = await lightning.checkInvoice(invoiceId);

    // Get pending payment info
    const payment = pendingPayments.get(invoiceId);

    if (status.paid && payment) {
      // Payment confirmed - return user info for frontend to update Firestore
      res.json({
        paid: true,
        userId: payment.userId,
        settledAt: status.settledAt
      });

      // Clean up
      pendingPayments.delete(invoiceId);
    } else {
      res.json({
        paid: false,
        invoiceId
      });
    }
  } catch (error) {
    console.error('Error checking invoice:', error);
    res.status(500).json({ error: 'Failed to check invoice' });
  }
});

/**
 * GET /api/payment/rate
 * Get current EUR to sats conversion rate
 */
router.get('/rate', async (req, res) => {
  try {
    const rate = await lightning.getEurToSatsRate();
    res.json({ rate, currency: 'EUR' });
  } catch (error) {
    console.error('Error getting rate:', error);
    res.status(500).json({ error: 'Failed to get rate' });
  }
});

module.exports = router;
