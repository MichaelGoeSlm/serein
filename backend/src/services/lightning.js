const axios = require('axios');

const OPENNODE_API_KEY = process.env.OPENNODE_API_KEY;

async function createInvoice(amountEuros, description, orderId) {
  // Si pas de clé API, utiliser le mode mock pour tester
  if (!OPENNODE_API_KEY || OPENNODE_API_KEY === 'your_opennode_api_key') {
    console.log('OpenNode: Mode mock activé (pas de clé API)');
    return {
      invoiceId: 'mock_' + Date.now(),
      paymentRequest: 'lnbc290n1mock_invoice_for_testing_only',
      amountSats: 50000,
      amountFiat: amountEuros,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      status: 'unpaid',
      mock: true
    };
  }

  try {
    console.log('OpenNode: Creating invoice for', amountEuros, 'EUR');

    const response = await axios.post(
      'https://api.opennode.com/v1/charges',
      {
        amount: amountEuros,
        currency: 'EUR',
        description: description || 'Serein Premium - 1 an',
        order_id: orderId || 'order_' + Date.now()
      },
      {
        headers: {
          'Authorization': OPENNODE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OpenNode: Invoice created successfully');
    const charge = response.data.data;

    return {
      invoiceId: charge.id,
      paymentRequest: charge.lightning_invoice.payreq,
      amountSats: charge.amount,
      amountFiat: amountEuros,
      expiresAt: charge.expires_at,
      status: charge.status
    };
  } catch (error) {
    console.error('OpenNode createInvoice error:', error.response?.data || error.message);
    throw new Error('Failed to create Lightning invoice: ' + (error.response?.data?.message || error.message));
  }
}

async function checkInvoice(invoiceId) {
  // Mode mock
  if (invoiceId.startsWith('mock_')) {
    console.log('OpenNode: Mode mock - simulating paid invoice');
    return {
      invoiceId: invoiceId,
      status: 'paid',
      paid: true,
      amountSats: 50000,
      paidAt: new Date().toISOString()
    };
  }

  if (!OPENNODE_API_KEY || OPENNODE_API_KEY === 'your_opennode_api_key') {
    return { invoiceId, status: 'unpaid', paid: false };
  }

  try {
    const response = await axios.get(
      `https://api.opennode.com/v1/charge/${invoiceId}`,
      {
        headers: {
          'Authorization': OPENNODE_API_KEY
        }
      }
    );

    const charge = response.data.data;
    return {
      invoiceId: charge.id,
      status: charge.status,
      paid: charge.status === 'paid',
      amountSats: charge.amount,
      paidAt: charge.status === 'paid' ? charge.created_at : null
    };
  } catch (error) {
    console.error('OpenNode checkInvoice error:', error.response?.data || error.message);
    throw new Error('Failed to check invoice status');
  }
}

module.exports = { createInvoice, checkInvoice };
