import m2s from 'mongoose-to-swagger';
import { Cart, Order } from './models.js';

export const SwaggerSchemas = {
  Cart: m2s(Cart),
  Order: m2s(Order),

  OrderList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Order'
    }
  }
};
