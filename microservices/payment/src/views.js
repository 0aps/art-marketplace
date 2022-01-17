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
    },
    customer: {
      url: '/customer',
      children: {
        paymentMethod: {
          url: '/payment_methods',
          methods: {
            post: createPaymentMethod
          },
          children: {
            item: {
              url: '/:customerId',
              methods: {
                get: getCustomerPaymentMethods
              }
            }
          }
        }
      }
    },
    paymentIntent: {
      url: '/payment_intent',
      children: {
        item: {
          url: '/',
          methods: {
            post: createPaymentIntent
          }
        }
      }
    }
  }
}];
