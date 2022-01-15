import {
  createPaymentIntent,
  createCustomer,
  getCustomerPaymentMethods,
  createPaymentMethod
} from './controller/payment_controller.js';

export default [{
  url: '/payments',
  access: 'public',
  methods: {
    get:
    // TODO
      async (req, res) => {
        res.json({cosa:1});
      },
    post: createCustomer
  }
  ,
  children: {
    item: {
      url: '/:paymentId',
      access: 'public',
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
      access: 'public',
      children: {
        paymentMethod: {
          url: '/payment_methods',
          access: 'public',
          methods: {
            post: createPaymentMethod
          },
          children: {
            item: {
              url: '/:customerId',
              access: 'public',
              methods: {
                get: getCustomerPaymentMethods,
              }
            }
          }
        },
      }
    },
    paymentIntent: {
      url: '/payment_intent',
      access: 'public',
      children: {
        item: {
          url: '/',
          access: 'public',
          methods: {
            post: createPaymentIntent
          }
        }
      }
    }
  }
}];
