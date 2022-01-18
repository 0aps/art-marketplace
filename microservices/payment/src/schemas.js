import mongoose from 'mongoose';

const { Schema } = mongoose;

export default {
  Payment: new Schema({
    userId: String,
    cartId: String,
    stripePaymentId: String,
    amount: Number,
    createdAt: Date,
    items: [{ type: Schema.Types.Mixed }]
  }),
  User: new Schema({
    username: String,
    email: String,
    stripeAccount: String
  })
};
