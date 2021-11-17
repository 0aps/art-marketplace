import mongoose from 'mongoose';
import Schemas from './schemas.js';

class OrderModel {
}

export const Order = mongoose.model('Order', Schemas.Order.loadClass(OrderModel));
