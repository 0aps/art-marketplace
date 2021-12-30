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
      last4: '4444'
    },
    {
      id: '123abc',
      last4: '5555'
    }];
  }

  create ({ id, ...payload }) {
    // return this.apiClient.post(`${this.base}`, payload);
    return {
      id: 'idorder',
      createdAt: 1641041356885,
      cart: {
        items: []
      },
      total: 1040.23
    };
  }
}

export default PaymentAPI;
