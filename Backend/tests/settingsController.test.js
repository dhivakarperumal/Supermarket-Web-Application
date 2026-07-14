const { normalizePaymentSettingsPayload } = require('../src/controllers/settingsController');

describe('normalizePaymentSettingsPayload', () => {
  test('preserves card fields for card-based payment configuration', () => {
    const payload = normalizePaymentSettingsPayload({
      cashSupport: true,
      onlinePaymentSupport: true,
      upiSupport: true,
      upiId: 'test@upi',
      cardSupport: true,
      paymentType: 'card',
      razorpayEnabled: true,
      razorpayKey: 'rzp_test_key',
      cardNumber: '4111 1111 1111 1111',
      cardExpiry: '12/30',
      cardCvv: '123',
    });

    expect(payload.paymentType).toBe('card');
    expect(payload.cardNumber).toBe('4111 1111 1111 1111');
    expect(payload.cardExpiry).toBe('12/30');
    expect(payload.cardCvv).toBe('123');
  });
});
