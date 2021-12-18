import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';
import { User, Activation, Restore } from './models.js';
import seed from './seed.js';

describe('Identity API endpoints', () => {
  const base = '/api/v1/users';
  let agent;
  let artist, admin;
  beforeAll(() => {
    agent = request.agent(app.instance);
    artist = {
      firstname: 'Angel',
      lastname: 'Pina Santana',
      username: '0aps',
      email: 'test.artist@gmail.com',
      password: 'longpassword2',
      password_confirm: 'longpassword2',
      phone: '8297413515',
      address: 'my address, my address2',
      role: 'artist'
    };
    admin = { ...artist, email: 'test.admin@gmail.com' };
    return initTestDatabase();
  });
  afterAll(async () => {
    await cleanTestDatabase();
    return app.close();
  });

  describe('Users endpoints', () => {
    test('should return an error if user is not authenticated', async () => {
      const response = await agent.get(base);
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('message');
    });

    test('should return an error if user is not authorized', async () => {
      const $artist = await agent.post(`${base}/login`).send({ email: artist.email, password: artist.password });
      const response = await agent.set('Authorization', `Bearer ${$artist.body.token}`).get(base);
      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('message');
    });

    test('should return the lists of users if admin', async () => {
      const $admin = await agent.post(`${base}/login`).send({ email: admin.email, password: admin.password });
      const response = await agent.set('Authorization', `Bearer ${$admin.body.token}`).get(base);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Register endpoints', () => {
    test('should return an error if password is too short', async () => {
      const $user = { ...artist, password: 'short', password_confirm: 'short' };
      const response = await agent.post(`${base}/register`).send($user);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    });

    test('should return an error if password\'s don\'t match', async () => {
      const $user = { ...artist, password_confirm: 'newpassword' };
      const response = await agent.post(`${base}/register`).send($user);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    });

    test('should create an user if payload is valid', async () => {
      const $user = { ...artist, email: 'test.newuser@gmail.com' };
      const response = await agent.post(`${base}/register`).send($user);
      const activation = await Activation.findOne({ email: $user.email });

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).not.toHaveProperty('password');
      expect(activation).not.toBeNull();
    });

    test('should return an error if email already exists', async () => {
      const $user = { ...artist };
      const response = await agent.post(`${base}/register`).send($user);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Confirmation endpoints', () => {
    test('should return an error if token field is missing', async () => {
      const response = await agent.post(`${base}/confirm`).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });

    test('should return an error if token is invalid', async () => {
      const response = await agent.post(`${base}/confirm`).send({ token: 'invalidtoken' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });

    test('should create the actual user if token is valid', async () => {
      const activation = await Activation.findOne({ email: 'test.newuser@gmail.com' });
      const response = await agent.post(`${base}/confirm`).send({ token: activation.key });
      const user = await User.findOne({ 'login.email': artist.email });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(user).not.toBeNull();
    });
  });

  describe('Login endpoints', () => {
    test('should return an error if email field is missing', async () => {
      const response = await agent.post(`${base}/login`).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });

    test('should return an error if user doesn\'t exists', async () => {
      const response = await agent.post(`${base}/login`).send({
        email: 'not.found@gmail.com',
        password: 'longpassword'
      });
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    });

    test('should return an error if wrong credentials', async () => {
      const response = await agent.post(`${base}/login`).send({
        email: 'test.artist@gmail.com',
        password: 'longpassword'
      });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    });

    test('should return the token if login success', async () => {
      const response = await agent.post(`${base}/login`).send({
        email: 'test.artist@gmail.com',
        password: 'longpassword2'
      });
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('ForgotPassword endpoints', () => {
    test('should return an error if email field is missing', async () => {
      const response = await agent.post(`${base}/forgotPassword`).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });

    test('should return an error if user email doesn\'t exists', async () => {
      const response = await agent.post(`${base}/forgotPassword`).send({ email: 'invalid@gmail.com' });
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toBeInstanceOf(Object);
    });

    test('should create the user forgot password request', async () => {
      const $user = { ...artist, email: 'test.newuser@gmail.com' };
      const response = await agent.post(`${base}/forgotPassword`).send({ email: $user.email });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    test('should return an error if user already requested forgot password', async () => {
      const $user = { ...artist, email: 'test.newuser@gmail.com' };
      const response = await agent.post(`${base}/forgotPassword`).send({ email: $user.email });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('Restore endpoints', () => {
    test('should return an error if token field is missing', async () => {
      const response = await agent.post(`${base}/restore`).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });
    test('should return an error if passwords fields are missing', async () => {
      const response = await agent.post(`${base}/restore`).send({ token: 'test' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toBeInstanceOf(Object);
    });
    test('should update the password of an user', async () => {
      const restore = await Restore.findOne({ email: 'test.newuser@gmail.com' });
      const response = await agent.post(`${base}/restore`).send({
        token: restore.key,
        password: 'abc123',
        password_confirm: 'abc123'
      });
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});

const initTestDatabase = async () => {
  const { admin, artist } = seed;
  await User.insertMany([admin, artist]);
};

const cleanTestDatabase = async () => {
  await Restore.deleteMany({ email: /.*test.*/i });
  await User.deleteMany({ 'login.email': /.*test.*/i });
  await Activation.deleteMany({ email: /.*test.*/i });
};
