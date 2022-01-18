import mongoose from 'mongoose';
import Schemas from './schemas.js';

class PaymentModel {
  toClient () {
    return {
      id: this._id,
      amount: this.amount,
      paymentIntent: this.paymentIntent,
      createdAt: this.createdAt
    };
  }
}

class UserModel {
  toClient () {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      stripeAccount: this.stripeAccount
    };
  }
}

export const Payment = mongoose.model('Payment', Schemas.Payment.loadClass(PaymentModel));
export const User = mongoose.model('User', Schemas.User.loadClass(UserModel));
