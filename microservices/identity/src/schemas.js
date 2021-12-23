import mongoose from 'mongoose';
import Constant from './constants.js';

const { Schema, SchemaTypes } = mongoose;

const LoginSchema = new Schema({
  provider: { type: SchemaTypes.String, required: true, enum: ['email', 'facebook', 'google', 'twitter', 'apple'] },
  email: { type: SchemaTypes.String, required: true, index: true, unique: true },
  password: { type: SchemaTypes.String, required: true },
  state: { type: SchemaTypes.String, required: true, enum: ['active', 'inactive'], default: 'active' }
});

export default {
  User: new Schema({
    firstname: SchemaTypes.String,
    lastname: SchemaTypes.String,
    username: { type: SchemaTypes.String, required: true },
    createdAt: SchemaTypes.Number,
    role: { type: SchemaTypes.String, required: true, enum: ['admin', 'artist', 'collector'] },
    login: LoginSchema,
    info: {
      phone: SchemaTypes.String,
      address: SchemaTypes.String
    }
  }),
  Activation: new Schema({
    key: { type: SchemaTypes.String, required: true, index: true },
    email: SchemaTypes.String,
    data: SchemaTypes.String,
    expireAt: { type: Date, default: Date.now, index: { expires: Constant.userExpires } }
  }),
  Restore: new Schema({
    key: { type: SchemaTypes.String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: SchemaTypes.String,
    expireAt: { type: Date, default: Date.now, index: { expires: Constant.userExpires } }
  })
};
