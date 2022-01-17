import m2s from 'mongoose-to-swagger';
import { User, Activation, Restore } from './models.js';

export const SwaggerSchemas = {
  User: m2s(User),
  Activation: m2s(Activation),
  Restore: m2s(Restore),
  UserList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/User'
    }
  },
  UserPayload: {
    type: 'object',
    properties: {
      firstname: {
        type: 'string'
      },
      lastname: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      password_confirm: {
        type: 'string'
      },
      phone: {
        type: 'number'
      },
      address: {
        type: 'string'
      },
      role: {
        type: 'string'
      }
    }
  },
  ConfirmationPayload: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      }
    }
  },
  LoginPayload: {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    }
  },
  ForgotPasswordPayload: {
    type: 'object',
    properties: {
      email: {
        type: 'string'
      }
    }
  },
  RestorePayload: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      }
    }
  }
};
