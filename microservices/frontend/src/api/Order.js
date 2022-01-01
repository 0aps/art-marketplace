import Base from './Base';

class OrderAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'orders';
  }

  list (query) {
    // return this.apiClient.get(this.base, {}, query);
    return [{
      id: 'idorder',
      createdAt: 1640819792,
      cart: {
        items: []
      },
      total: 1040.23
    }];
  }
}

export default OrderAPI;
