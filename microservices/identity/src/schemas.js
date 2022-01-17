import mongoose from 'mongoose';
import Constant from './constants.js';

const { Schema } = mongoose;

const LoginSchema = new Schema({
  provider: { type: String, required: true, enum: ['email', 'facebook', 'google', 'twitter', 'apple'] },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  state: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' }
});

export default {
  User: new Schema({
    firstname: String,
    lastname: String,
    username: { type: String, required: true },
    createdAt: Number,
    role: { type: String, required: true, enum: ['admin', 'artist', 'collector'] },
    login: LoginSchema,
    info: {
      phone: String,
      address: String
    }
  }),
  Activation: new Schema({
    key: { type: String, required: true, index: true },
    email: String,
    data: String,
    expireAt: { type: Date, default: Date.now, index: { expires: Constant.userExpires } }
  }),
  Restore: new Schema({
    key: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: String,
    expireAt: { type: Date, default: Date.now, index: { expires: Constant.userExpires } }
  })
};
