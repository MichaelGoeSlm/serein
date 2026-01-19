/**
 * Lightning Network payment service
 * Uses Alby API for Lightning invoices, with mock fallback for testing
 */

const ALBY_API_KEY = process.env.ALBY_API_KEY;
const ALBY_API_URL = 'https://api.getalby.com';

// Store invoices in memory for mock mode
const mockInvoices = new Map();

/**
 * Get current EUR to sats conversion rate
 * In production, this would fetch real exchange rate
 */
async function getEurToSatsRate() {
  // Approximate rate: 1 EUR ~ 2500 sats (this varies)
  // In production, fetch from API like CoinGecko
  return 2500;
}

/**
 * Create a Lightning invoice
 * @param {number} amountEuros - Amount in euros
 * @param {string} memo - Invoice description
 * @returns {Object} Invoice details
 */
async function createInvoice(amountEuros, memo = 'Serein Premium - 1 year') {
  const rate = await getEurToSatsRate();
  const amountSats = Math.round(amountEuros * rate);

  // If Alby API key is configured, use real API
  if (ALBY_API_KEY) {
    try {
      const response = await fetch(`${ALBY_API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ALBY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountSats,
          description: memo,
          expiry: 3600 // 1 hour
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const data = await response.json();
      return {
        invoiceId: data.payment_hash,
        paymentRequest: data.payment_request,
        amountSats,
        amountEuros,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        memo
      };
    } catch (error) {
      console.error('Alby API error:', error);
      throw error;
    }
  }

  // Mock mode for testing
  console.log('⚡ Lightning mock mode - creating test invoice');
  const invoiceId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const mockPaymentRequest = `lnbc${amountSats}n1mock${invoiceId}`;

  const invoice = {
    invoiceId,
    paymentRequest: mockPaymentRequest,
    amountSats,
    amountEuros,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    memo,
    createdAt: Date.now(),
    paid: false
  };

  mockInvoices.set(invoiceId, invoice);
  return invoice;
}

/**
 * Check if an invoice has been paid
 * @param {string} invoiceId - Invoice ID to check
 * @returns {Object} Payment status
 */
async function checkInvoice(invoiceId) {
  // If Alby API key is configured, use real API
  if (ALBY_API_KEY) {
    try {
      const response = await fetch(`${ALBY_API_URL}/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${ALBY_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check invoice');
      }

      const data = await response.json();
      return {
        paid: data.settled === true,
        invoiceId,
        settledAt: data.settled_at
      };
    } catch (error) {
      console.error('Alby API error:', error);
      throw error;
    }
  }

  // Mock mode - auto-pay after 10 seconds for testing
  const invoice = mockInvoices.get(invoiceId);
  if (!invoice) {
    return { paid: false, error: 'Invoice not found' };
  }

  const elapsed = Date.now() - invoice.createdAt;
  const paid = elapsed > 10000; // Auto-pay after 10 seconds

  if (paid && !invoice.paid) {
    invoice.paid = true;
    invoice.settledAt = new Date().toISOString();
    mockInvoices.set(invoiceId, invoice);
    console.log(`⚡ Mock invoice ${invoiceId} marked as paid`);
  }

  return {
    paid,
    invoiceId,
    settledAt: invoice.settledAt
  };
}

module.exports = {
  createInvoice,
  checkInvoice,
  getEurToSatsRate
};
