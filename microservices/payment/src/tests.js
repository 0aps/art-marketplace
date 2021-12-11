import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';

describe('Payment API endpoints', () => {
  const base = '/api/v1';
  let agent;
  beforeAll(() => {
    agent = request.agent(app.instance);
  });
  afterAll(async () => {
    return app.close();
  });

  test('should return the lists of payments', async () => {
    const response = await agent.get(base + '/payments');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
  });
});
