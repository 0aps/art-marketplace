import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';

describe('Identity API endpoints', () => {
  const base = '/api/v1';
  let agent;
  beforeAll(() => {
    agent = request.agent(app.instance);
  });
  afterAll(async () => {
    return app.close();
  });

  test('should return the lists of users', async () => {
    const response = await agent.get(base + '/users');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
  });
});
