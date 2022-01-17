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
  roles: {
    get: ['admin']
  },
  methods: {
    /**
     * @swagger
     * /users:
     *   get:
     *     description: Get the list of all users
     *     responses:
     *       200:
     *         description: An array with the list of users
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserList'
     */
    get: async (req, res) => {
      const records = await User.find({});
      res.json(records.map(record => record.toClient()));
    },
    /**
     * @swagger
     * /users:
     *   post:
     *     description: Create a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserPayload'
     *     responses:
     *       201:
     *         description: Object with the new user created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    post: async (req, res, next) => {
      const form = req.body;

      try {
        const validationResult = await User.validate(form);
        if (validationResult instanceof BaseError) {
          return next(validationResult);
        }

        const user = await User.new(form);
        res.status(StatusCodes.CREATED).json(user.toClient());
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
        /**
         * @swagger
         * /users/register:
         *   post:
         *     description: Register a new user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UserPayload'
         *     responses:
         *       201:
         *         description: The user was registered successfully
         */
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
        /**
         * @swagger
         * /users/confirm:
         *   post:
         *     description: Confirm registration of a new user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ConfirmationPayload'
         *     responses:
         *       201:
         *         description: The user was activated successfully
         */
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
            const user = await User.new(data);
            await existingActivation.remove();

            await res.publish('user-create', user);
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
        /**
         * @swagger
         * /users/login:
         *   post:
         *     description: Login the user into the system
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginPayload'
         *     responses:
         *       200:
         *         description: The user session was created
         */
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
        /**
         * @swagger
         * /users/forgotPassword:
         *   post:
         *     description: Trigger reset password of user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ForgotPasswordPayload'
         *     responses:
         *       201:
         *         description: The restore record was created
         */
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
        /**
         * @swagger
         * /users/restore:
         *   post:
         *     description: Restore the user password
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RestorePayload'
         *     responses:
         *       200:
         *         description: The user password was updated successfully
         */
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
        /**
         * @swagger
         * /users/me:
         *   get:
         *     description: Get the current user information
         *     responses:
         *       200:
         *         description: User in the current session
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         */
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
        put: ['artist', 'collector', 'admin'],
        delete: ['admin']
      },
      methods: {
        /**
         * @swagger
         * /users/{userId}:
         *   get:
         *     description: Get a particular user information
         *     parameters:
         *       - name: userId
         *         type: string
         *         in: path
         *         required: true
         *     responses:
         *       200:
         *         description: User information
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         */
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
        /**
         * @swagger
         * /users/{userId}:
         *   put:
         *     description: Update a particular user information
         *     parameters:
         *       - name: userId
         *         type: string
         *         in: path
         *         required: true
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UserPayload'
         *     responses:
         *       200:
         *         description: User information
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         */
        put: async (req, res, next) => {
          try {
            const { user } = req.app.locals;
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
          }
        },
        /**
         * @swagger
         * /users/{userId}:
         *   delete:
         *     description: Delete a particular user information
         *     parameters:
         *       - name: userId
         *         type: string
         *         in: path
         *         required: true
         *     responses:
         *       204:
         *         description: User was deleted successfully
         */
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
