import util from 'util';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Auth, Mailer } from 'art-marketplace-common';
import Schemas from './schemas.js';
import Constants from './constants.js';
import { PasswordLengthToShort, SelectedNameUnavailable, UnmatchedPassword } from './exceptions.js';
import moment from 'moment';

class UserModel {
  static hashPassword (password) {
    return bcrypt.hash(password, Constants.saltRounds);
  }

  static async new (form) {
    const user = new User({
      firstname: form.firstname,
      lastname: form.lastname,
      username: form.username,
      createdAt: moment().unix(),
      role: form.role,
      login: {
        provider: 'email',
        email: form.email.trim().toLowerCase(),
        password: await User.hashPassword(form.password)
      },
      info: {
        phone: form.phone,
        address: form.address
      }
    });

    return user.save();
  }

  static async validate (form) {
    if (form.email != null) {
      const existingUser = await User.findOne({ 'login.email': form.email });
      if (existingUser && existingUser.toClient().email === form.email) {
        return new SelectedNameUnavailable({ email: form.email });
      }
    }

    if (form.password != null && form.password.length < Constants.minPasswordLength) {
      return new PasswordLengthToShort();
    }

    if (form.password !== form.password_confirm) {
      return new UnmatchedPassword();
    }
  }

  async isValidPassword (password) {
    return bcrypt.compare(password, this.login.password);
  }

  isAdmin () {
    return this.role === 'admin';
  }

  isActive () {
    return this.login.state === 'active';
  }

  getLogin () {
    const user = this.toClient();
    const token = Auth.sign(user);

    return {
      ...user,
      token
    };
  }

  toClient () {
    return {
      id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      createdAt: this.createdAt,
      role: this.role,
      email: this.login.email,
      state: this.login.state,
      provider: this.login.provider,
      info: this.info
    };
  }
}

class ActivationModel {
  static encrypt (data) {
    return Auth.sign(data);
  }

  static async new (form) {
    const randomBytesAsync = util.promisify(crypto.randomBytes);
    const key = (await randomBytesAsync(48)).toString('base64url');
    const activation = new Activation({
      key: key,
      email: form.email.trim().toLowerCase(),
      data: Activation.encrypt(form)
    });
    return activation.save();
  }

  getUserData () {
    return Auth.verify(this.data);
  }

  async send (link) {
    return Mailer.send({
      email: this.email,
      subject: '[Artwork] Confirmación de correo electrónico',
      text: `¡Hola!\n\n Por favor confirma tu correo haciendo click en el siguiente enlace: ${link}?token=${this.key}\n\n¡Gracias!`
    });
  }
}

class RestoreModel {
  static async new (user) {
    const randomBytesAsync = util.promisify(crypto.randomBytes);
    const key = (await randomBytesAsync(48)).toString('base64url');
    const restore = new Restore({
      key: key,
      user: user._id,
      email: user.login.email
    });
    const restoreUser = await restore.save();
    return restoreUser.populate('user');
  }

  async send (link) {
    return Mailer.send({
      email: this.user.login.email,
      subject: '[Artwork] Solicitud de cambio de contraseña',
      text: `¡Hola!\n\n Cambia tu contraseña haciendo click en el siguiente enlace: ${link}?token=${this.key}\n\n¡Gracias!`
    });
  }
}

export const User = mongoose.model('User', Schemas.User.loadClass(UserModel));
export const Activation = mongoose.model('Activation', Schemas.Activation.loadClass(ActivationModel));
export const Restore = mongoose.model('Restore', Schemas.Restore.loadClass(RestoreModel));
