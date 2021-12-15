import {list_all_order, read_a_order, create_a_order, update_a_order, delete_a_order} from './controller/order_controller.js';

export default [{
  url: '/orders',
  methods: {
    get: list_all_order,
    post:create_a_order,
  },
  children: {
    item: {
      url: '/:orderId',
      methods: {
        get: read_a_order, 
        put: update_a_order,
        delete:delete_a_order,

      }
    }
  }
}];
