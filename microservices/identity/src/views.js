import { BaseError, InvalidRequest, RecordNotFound, UserForbidden } from 'art-marketplace-common';
import { Activation, Restore, User } from './models.js';
import {
  InactiveUser,
  InvalidLogin,
  PasswordLengthToShort,
  UnmatchedPassword
} from './exceptions.js';
import { StatusCodes } from 'http-status-codes';
import Constants from './constants.js';

export default [{
  url: '/users',
  access: {
    post: 'public'
  },
  roles: {
    get: ['admin']
  },
  methods: {
    get: async (req, res) => {
      const records = await User.find({});
      res.json(records.map(record => record.toClient()));
    },
    post: async (req, res, next) => {
      const form = req.body;

      try {
        const validationResult = await User.validate(form);
        if (validationResult instanceof BaseError) {
          return next(validationResult);
        }

        const user = await User.new(form);
        res.status(StatusCodes.CREATED).send(user.toClient());
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
      }
    }
  },
  children: {
    register: {
      url: '/register',
      access: 'public',
      methods: {
        post: async (req, res, next) => {
          const form = req.body;
          const { email } = form;

          if (!email) {
            return next(new InvalidRequest('El campo de correo es requerido.'));
          }

          try {
            const validationResult = await User.validate(form);
            if (validationResult instanceof BaseError) {
              return next(validationResult);
            }

            const existingActivation = await Activation.findOne({ email: email.trim() });
            if (existingActivation) {
              return next(new InvalidRequest('Ya tienes un solicitud con este correo. Por favor verificar.'));
            }

            const activation = await Activation.new(form);
            const link = `${req.protocol}://${req.get('host')}/#/confirmation`;
            await activation.send(link);

            res.sendStatus(StatusCodes.CREATED);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        }
      }
    },
    confirmation: {
      url: '/confirm',
      access: 'public',
      methods: {
        post: async (req, res, next) => {
          const { token } = req.body;

          if (!token) {
            return next(new InvalidRequest('El token es requerido. Favor verificar.'));
          }

          try {
            const existingActivation = await Activation.findOne({ key: token });
            if (!existingActivation) {
              return next(new InvalidRequest('El token provisto no existe. Favor verificar.'));
            }

            const data = await existingActivation.getUserData();
            await User.new(data);
            await existingActivation.remove();

            res.sendStatus(StatusCodes.CREATED);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        }
      }
    },
    login: {
      url: '/login',
      access: 'public',
      methods: {
        post: async (req, res, next) => {
          const { email, password } = req.body;

          if (!email) {
            return next(new InvalidRequest('El campo de correo es requerido.'));
          }

          try {
            const user = await User.findOne({ 'login.email': email.trim() });
            if (!user) {
              return next(new RecordNotFound());
            }

            const valid = await user.isValidPassword(password);
            if (valid) {
              if (user.isActive()) {
                const userClient = user.getLogin();
                res.status(StatusCodes.OK).json(userClient);
              } else {
                return next(new InactiveUser());
              }
            } else {
              return next(new InvalidLogin());
            }
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        }
      }
    },
    forgotPassword: {
      url: '/forgotPassword',
      access: 'public',
      methods: {
        post: async (req, res, next) => {
          const { email } = req.body;

          if (!email) {
            return next(new InvalidRequest('El campo de correo es requerido.'));
          }

          try {
            const user = await User.findOne({ 'login.email': email.trim() });
            if (!user) {
              return next(new RecordNotFound());
            }

            const existingRestore = await Restore.findOne({ user: user._id });
            if (existingRestore) {
              return next(new InvalidRequest('Ya tienes una solicitud. Espera un tiempo antes de volver a intentar.'));
            }

            const restore = await Restore.new(user);
            const link = `${req.protocol}://${req.get('host')}/#/restore`;
            await restore.send(link);

            res.sendStatus(StatusCodes.CREATED);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        }
      }
    },
    restore: {
      url: '/restore',
      access: 'public',
      methods: {
        post: async (req, res, next) => {
          const form = req.body;
          const token = form.token;

          if (!token) {
            return next(new InvalidRequest('El token es requerido. Favor verificar'));
          }

          if (!form.password || !form.password_confirm) {
            return next(new InvalidRequest('Los campos de contraseña son requeridos. Favor verificar'));
          }

          try {
            const existingRestore = await Restore.findOne({ key: token }).populate('user');
            if (!existingRestore) {
              return next(new RecordNotFound());
            }

            const validationResult = await User.validate(form);
            if (validationResult instanceof BaseError) {
              return next(validationResult);
            }

            existingRestore.user.login.password = await User.hashPassword(form.password);
            existingRestore.user.save();
            await existingRestore.remove();
            res.sendStatus(StatusCodes.OK);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        }
      }
    },
    me: {
      url: '/me',
      methods: {
        get: async (req, res, next) => {
          const existingUser = req.app.locals.user;
          const email = existingUser ? existingUser.email.trim() : '';

          try {
            const user = await User.findOne({ 'login.email': email });
            if (!user) {
              return next(new RecordNotFound());
            }

            if (user.isActive()) {
              res.status(StatusCodes.OK).json(user.toClient());
            } else {
              return next(new InactiveUser());
            }
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        }
      }
    },
    item: {
      url: '/:userId',
      roles: {
        get: ['admin'],
        delete: ['admin']
      },
      methods: {
        get: async (req, res, next) => {
          try {
            const record = await User.findById(req.params.userId);

            if (!record) {
              return next(new RecordNotFound());
            }

            res.json(record.toClient());
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        },
        put: async (req, res, next) => {
          try {
            const { user } = req.locals;
            const userId = req.params.userId;
            const payload = req.body;
            if (userId !== user.id && !(user.role === 'admin')) {
              return next(new UserForbidden());
            }

            const record = await User.findById(userId);
            if (!record) {
              return next(new RecordNotFound());
            }

            if (payload.password != null && payload.password.length <= Constants.minPasswordLength) {
              return next(new PasswordLengthToShort());
            }

            if (payload.password !== payload.password_confirm) {
              return next(new UnmatchedPassword());
            }

            if (payload.firstname) {
              record.firstname = payload.firstname;
            }

            if (payload.lastname) {
              record.lastname = payload.lastname;
            }

            if (payload.state) {
              record.login.state = payload.state;
            }

            if (payload.password) {
              record.login.password = await User.hashPassword(payload.password);
            }

            await record.save();

            res.json(record.toClient());
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        },
        delete: async (req, res, next) => {
          try {
            const record = await User.findById(req.params.userId);

            if (!record) {
              return next(new RecordNotFound());
            }

            await record.remove();

            res.sendStatus(StatusCodes.NO_CONTENT);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        }
      }
    }
  }
}];
