import {
  createPaymentIntent,
  createCustomer,
  getCustomerPaymentMethods,
  createPaymentMethod
} from './controller/payment_controller.js';

export default [{
  url: '/payments',
  methods: {
    get:
    // TODO
      async (req, res) => {
        res.json({ cosa: 1 });
      },
    post: createCustomer
  },
  children: {
    item: {
      url: '/:paymentId',
      methods: {
        // TODO
        get: (req, res, next) => {
          res.json({
            test: 'mychild'
          });
        }
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
