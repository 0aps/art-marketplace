import Base from './Base';

class PaymentAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'payments';
  }

  addPaymentMethod (payload) {
    return this.apiClient.post(`${this.base}/cards`, payload);
  }

  getPaymentMethods (query) {
    return this.apiClient.get(`${this.base}/cards`, {}, query);
  }

  deletePaymentMethod (id) {
    return this.apiClient.delete(`${this.base}/cards/${id}`);
  }

  create ({ ...payload }) {
    return this.apiClient.post(`${this.base}`, payload);
  }
}

export default PaymentAPI;
