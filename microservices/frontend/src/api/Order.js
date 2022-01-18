import Base from './Base';

class OrderAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'orders';
  }

  list (query) {
    return this.apiClient.get(this.base, {}, query);
  }

  get (id) {
    const url = [this.base, '/', id].join('');
    return this.apiClient.get(url);
  }
}

export default OrderAPI;
