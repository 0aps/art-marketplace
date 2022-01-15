import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Payment: new Schema({
    amount: SchemaTypes.Number,
    paymentIntent: SchemaTypes.String,
    date: SchemaTypes.Date
  }),
  User: new Schema({
    username: SchemaTypes.String,
    email: SchemaTypes.String,
    stripeAccount: SchemaTypes.String
  }),
};
