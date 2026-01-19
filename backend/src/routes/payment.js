const express = require('express');
const router = express.Router();
const { createInvoice, checkInvoice } = require('../services/lightning');

// Créer une facture
router.post('/create-invoice', async (req, res) => {
  try {
    const { userId, email } = req.body;

    console.log('Creating invoice for user:', userId, email);

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const invoice = await createInvoice(29, `Serein Premium - ${email || 'user'}`, userId);

    console.log('Invoice created:', invoice.invoiceId);

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

    const result = await checkInvoice(invoiceId);

    res.json(result);
  } catch (error) {
    console.error('Check payment error:', error.message);
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

module.exports = router;
