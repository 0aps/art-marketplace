import m2s from 'mongoose-to-swagger';
import { Payment } from './models.js';

export const SwaggerSchemas = {
  Payment: m2s(Payment),

  PaymentPayload: {
    type: 'object',
    properties: {
      cartId: {
        type: 'string'
      },
      paymentMethod: {
        type: 'string'
      },
      items: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Item'
        }
      }
    }
  },
  Item: {
    type: 'object',
    properties: {
      price: {
        type: 'number'
      },
      id_artwork: {
        type: 'number'
      },
      name: {
        type: 'string'
      }
    }
  },
  PaymentMethodList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/PaymentMethod'
    }
  },
  PaymentMethod: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      object: { type: 'string' },
      billing_details: {
        type: 'object',
        properties: {
          address: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              country: { type: 'string' },
              line1: { type: 'string' },
              line2: { type: 'string' },
              postal_code: { type: 'string' },
              state: { type: 'string' }
            }
          },
          email: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' }
        }
      },
      card: {
        type: 'object',
        properties: {
          checks: {
            type: 'object',
            properties: {
              address_line1_check: { type: 'string' },
              address_postal_code_check: { type: 'string' },
              cvc_check: { type: 'string' }
            }
          },
          brand: { type: 'string' },
          country: { type: 'string' },
          exp_month: { type: 'number' },
          exp_year: { type: 'number' },
          fingerprint: { type: 'string' },
          funding: { type: 'string' },
          generated_from: { type: 'string' },
          last4: { type: 'string' }
        }
      },
      created: { type: 'number' },
      type: { type: 'string' }
    }
  },
  PaymentMethodPayload: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      }
    }
  }
};
