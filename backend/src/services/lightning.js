const axios = require('axios');

const OPENNODE_API_KEY = process.env.OPENNODE_API_KEY;

async function createInvoice(amountEuros, description, orderId) {
  if (!OPENNODE_API_KEY) {
    console.log('OpenNode: Pas de clé API configurée');
    throw new Error('OpenNode API key not configured');
  }

  try {
    console.log('OpenNode: Creating charge for', amountEuros, 'EUR');

    // Selon la doc OpenNode: https://developers.opennode.com/reference/create-charge
    const response = await axios.post(
      'https://api.opennode.com/v1/charges',
      {
        amount: amountEuros,
        currency: 'EUR',
        description: description || 'Serein Premium - 1 an',
        order_id: orderId || 'order_' + Date.now(),
        success_url: 'https://magnificent-beijinho-f18e1c.netlify.app/payment-success',
        auto_settle: false
      },
      {
        headers: {
          'Authorization': OPENNODE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OpenNode response:', JSON.stringify(response.data, null, 2));

    const charge = response.data.data;

    return {
      invoiceId: charge.id,
      paymentRequest: charge.lightning_invoice?.payreq || charge.lightning_invoice,
      amountSats: charge.amount,
      amountFiat: amountEuros,
      expiresAt: charge.expires_at,
      status: charge.status,
      hostedCheckoutUrl: charge.hosted_checkout_url
    };
  } catch (error) {
    console.error('OpenNode FULL ERROR:', {
      status: error.response?.status,
      data: JSON.stringify(error.response?.data, null, 2),
      message: error.message
    });
    throw new Error(error.response?.data?.message || error.message);
  }
}

async function checkInvoice(invoiceId) {
  if (!OPENNODE_API_KEY) {
    throw new Error('OpenNode API key not configured');
  }

  try {
    // Selon la doc: https://developers.opennode.com/reference/get-charge
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
      paidAt: charge.settled_at || null
    };
  } catch (error) {
    console.error('OpenNode check error:', error.response?.data || error.message);
    throw new Error('Failed to check invoice status');
  }
}

module.exports = { createInvoice, checkInvoice };
