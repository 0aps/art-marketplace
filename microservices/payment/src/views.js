import {
  createPayment,
  getPaymentMethods,
  createPaymentMethod
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
      }
    }
  }
}];
