import mongoose from 'mongoose';

const { Schema } = mongoose;

export default {
  User: new Schema({
    username: String,
    email: String
  }),
  Cart: new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.Mixed }],
    state: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }),
  Order: new Schema({
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    total: Number,
    createdAt: Number
  })
};
