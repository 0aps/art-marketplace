import mongoose from 'mongoose';
import Schema from './schemas.js';

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
  toClient () {
    return {
      id: this._id,
      id_user: this.id_user,
      items: this.items
    };
  }
}

class UserModel {
  toClient () {
    return {
      id: this._id,
      username: this.username
    };
  }
}

export const Cart = mongoose.model('Cart', Schema.Cart.loadClass(CartModel));
export const Order = mongoose.model('Order', Schema.Order.loadClass(OrderModel));
export const User = mongoose.model('User', Schema.User.loadClass(UserModel));
