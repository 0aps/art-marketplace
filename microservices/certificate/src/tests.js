import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';
import { Certificate } from './models.js';
import seed from './seed.js';

describe('Certificate API endpoints', () => {
  const base = '/api/v1/certificates';
  let agent;
  let certificateInfo;
  beforeAll(() => {
    agent = request.agent(app.instance);
    certificateInfo = {
      artName: 'obra',
      artDescription: 'description',
      artCreationDate: 1640009027,
      categoryName: 'category',
      username: 'user'
    };
    return initTestDatabase();
  });
  afterAll(async () => {
    await cleanTestDatabase();
    return app.close();
  });

  describe('POST method endpoints', () => {
    test('should return an error if payload is not correct', async () => {
      const response = await agent.post(base).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test('Should create a certificate if payload is correct', async () => {
      const response = await agent.post(base).send(certificateInfo);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      const certif = await Certificate.findOne({ artname: certificateInfo.artName });
      expect(certif).not.toBeNull();
    });
  });

  describe('GET all certificates endpoints', () => {
    test('Should return the lists of certificates', async () => {
      const response = await agent.get(base);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET one certificate endpoints', () => {
    test('Should return an error if certificateId is not valid', async () => {
      const response = await agent.get(`${base}/12`);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test('Should return a certificate if certificateID is valid', async () => {
      const certif = await Certificate.findOne({ artname: 'artname' });
      const response = await agent.get(`${base}/${certif.id}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });

  describe('PUT method endpoints', () => {
    test('Should return an error if certificateId is not valid', async () => {
      const response = await agent.put(`${base}/12`).send(certificateInfo);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test('Should return an error if payload is not valid', async () => {
      const certif = await Certificate.findOne({ artname: 'artname' });
      const response = await agent.put(`${base}/${certif.id}`).send({});
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test('Should update a certificate if certificateID and payload are valid', async () => {
      const certif = await Certificate.findOne({ artname: 'artname' });
      const response = await agent.put(`${base}/${certif.id}`).send(certificateInfo);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });

  describe('DELETE method endpoints', () => {
    test('Should return an error if certificateId is not valid', async () => {
      const response = await agent.put(`${base}/12`).send(certificateInfo);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test('Should delete the certificate if certificateID is valid', async () => {
      const certif = await Certificate.findOne({ artname: 'artname' });
      const response = await agent.delete(`${base}/${certif.id}`);
      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
    });
  });
});

const initTestDatabase = async () => {
  const certificate = seed;
  await Certificate.insertOne(certificate);
};

const cleanTestDatabase = async () => {
  await Certificate.deleteMany({});
};
