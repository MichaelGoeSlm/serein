const axios = require('axios');

const OPENNODE_API_KEY = process.env.OPENNODE_API_KEY;
const OPENNODE_API_URL = 'https://api.opennode.com/v1';

// Convertir EUR en sats (approximatif, OpenNode gère la conversion)
async function createInvoice(amountEuros, description, orderId) {
  try {
    const response = await axios.post(
      `${OPENNODE_API_URL}/charges`,
      {
        amount: amountEuros,
        currency: 'EUR',
        description: description || 'Serein Premium - 1 an',
        order_id: orderId,
        callback_url: process.env.BACKEND_URL + '/api/payment/webhook'
      },
      {
        headers: {
          'Authorization': OPENNODE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

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
    throw new Error('Failed to create Lightning invoice');
  }
}

async function checkInvoice(invoiceId) {
  try {
    const response = await axios.get(
      `${OPENNODE_API_URL}/charge/${invoiceId}`,
      {
        headers: {
          'Authorization': OPENNODE_API_KEY
        }
      }
    );

    const charge = response.data.data;
    return {
      invoiceId: charge.id,
      status: charge.status, // 'unpaid', 'processing', 'paid', 'expired'
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
