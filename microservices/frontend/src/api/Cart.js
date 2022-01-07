import Base from './Base';

class CartAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'cart';
  }

  get () {
    return this.apiClient.get(`${this.base}`);
  }
}

export default CartAPI;
