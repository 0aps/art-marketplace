import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  User: new Schema({
    username: SchemaTypes.String,
    email: SchemaTypes.String
  }),
  Artwork: new Schema({
    name: { type: SchemaTypes.String, required: true },
    description: SchemaTypes.String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    state: { type: SchemaTypes.String, required: true, enum: ['active', 'inactive', 'purchased'], default: 'active' },
    price: { type: SchemaTypes.Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    createdAt: SchemaTypes.Number,
    pictures: [{
      name: SchemaTypes.String,
      path: SchemaTypes.String,
      createdAt: SchemaTypes.Number
    }]
  }),
  Category: new Schema({
    name: SchemaTypes.String,
    description: SchemaTypes.String,
    createdAt: SchemaTypes.Number
  })
};
