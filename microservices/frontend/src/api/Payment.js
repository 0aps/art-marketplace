import Base from './Base';

class PaymentAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'payments';
  }

  getPaymentMethods (query) {
    // return this.apiClient.get(`${this.base}/cards`, {}, query);
    return [{
      id: 'abc123',
      createdAt: 1640819792,
      last4: '4444'
    },
    {
      id: '123abc',
      createdAt: 1640819792,
      last4: '5555'
    }];
  }

  create ({ id, ...payload }) {
    // return this.apiClient.post(`${this.base}`, payload);
    return {
      id: 'idorder',
      createdAt: 1640819792,
      cart: {
        items: []
      },
      total: 1040.23
    };
  }
}

export default PaymentAPI;
