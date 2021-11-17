import mongoose from 'mongoose';
import Schemas from './schemas.js';

class UserModel {
}

export const User = mongoose.model('User', Schemas.User.loadClass(UserModel));
