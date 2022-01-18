import {
  createPayment,
  getPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod
} from './controller/payment_controller.js';

export default [
  {
    url: '/payments',
    methods: {
      /**
       * @swagger
       * /payments:
       *   post:
       *     description: Process a payment
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/PaymentPayload'
       *     responses:
       *       200:
       *         description: The payment model result
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Payment'
       */
      post: createPayment
    },
    children: {
      cards: {
        url: '/cards',
        methods: {
          /**
           * @swagger
           * /payments/cards:
           *   get:
           *     description: Get the list of all payment Methods
           *     responses:
           *       200:
           *         description: An array with the list of payment methods
           *         content:
           *           application/json:
           *             schema:
           *               $ref: '#/components/schemas/PaymentMethodList'
           */
          get: getPaymentMethods,
          /**
           * @swagger
           * /payments/cards:
           *   post:
           *     description: Creates a payment method
           *     requestBody:
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             $ref: '#/components/schemas/PaymentMethodPayload'
           *     responses:
           *       200:
           *         description: The payment model result
           *         content:
           *           application/json:
           *             schema:
           *               $ref: '#/components/schemas/PaymentMethod'
           */
          post: createPaymentMethod
        },
        children: {
          item: {
            url: '/:cardId',
            methods: {
              /**
               * @swagger
               * /payments/cards/cardId:
               *   delete:
               *     description: Delete a particular payment method
               *     parameters:
               *       - name: cardId
               *         type: string
               *         in: path
               *         required: true
               *     responses:
               *       204:
               *         description: Payment method was deleted successfully
               */
              delete: deletePaymentMethod
            }
          }
        }
      }
    }
  }
];
