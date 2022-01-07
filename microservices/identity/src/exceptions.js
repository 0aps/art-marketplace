import { BaseError } from 'art-marketplace-common';
import Constants from './constants.js';

export class SelectedNameUnavailable extends BaseError {
  constructor ({ email, message = '' }) {
    super(message);
    this.message = `El correo (${email}) no está disponible. Por favor usar uno diferente.`;
  }
}

export class PasswordLengthToShort extends BaseError {
  constructor (message = '') {
    super(message);
    this.message = `El campo de contraseña debe tener un mínimo de ${Constants.minPasswordLength} caracteres.`;
  }
}

export class UnmatchedPassword extends BaseError {
  constructor (message = '') {
    super(message);
    this.message = 'Las contraseñas no son iguales. Por favor revisar.';
  }
}

export class InvalidLogin extends BaseError {
  constructor (message = '') {
    super(message);
    this.message = 'Las credenciales no son válidas. Por favor revisar.';
  }
}

export class InactiveUser extends BaseError {
  constructor (message = '') {
    super(message);
    this.message = 'El usuario no está activo. Por favor revisar.';
  }
}
