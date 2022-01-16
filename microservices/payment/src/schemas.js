import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Payment: new Schema({
    amount: SchemaTypes.Number,
    user_id:  SchemaTypes.String,
    id_pago_stripe: SchemaTypes.String,
    date: SchemaTypes.Date,
    items: [{ type: mongoose.Schema.Types.Mixed }],
    cart_id: SchemaTypes.String
  }),
  User: new Schema({
    username: SchemaTypes.String,
    email: SchemaTypes.String,
    stripeAccount: SchemaTypes.String
  }),
};
