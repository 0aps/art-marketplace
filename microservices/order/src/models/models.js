import mongoose from 'mongoose';
import Schemas from './schemas.js';

class CartModel {
  static async hasItem (itemId) {
    return Cart.exists({ 'items.id': itemId });
  }

  toClient () {
    return {
      id: this._id,
      user: this.user,
      items: this.items
    };
  }
}

class OrderModel {

}

class UserModel {
  toClient () {
    return {
      id: this._id,
      username: this.username
    };
  }
}

export const Cart = mongoose.model('Cart', Schemas.Cart.loadClass(CartModel));
export const Order = mongoose.model('Order', Schemas.Order.loadClass(OrderModel));
export const User = mongoose.model('User', Schemas.User.loadClass(UserModel));
