import Base from './Base';

class OrderAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'orders';
  }

  list (query) {
    return this.apiClient.get(this.base, {}, query);
  }
}

export default OrderAPI;
