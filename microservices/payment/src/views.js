import {
  createPayment,
  getPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod
} from './controller/payment_controller.js';

export default [{
  url: '/payments',
  methods: {
    post: createPayment
  },
  children: {
    cards: {
      url: '/cards',
      methods: {
        get: getPaymentMethods,
        post: createPaymentMethod
      },
      children: {
        item: {
          url: '/:cardId',
          methods: {
            delete: deletePaymentMethod
          }
        }
      }
    }
  }
}];
