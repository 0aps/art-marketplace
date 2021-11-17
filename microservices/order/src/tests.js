import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';

describe('Order API endpoints', () => {
  let agent;
  beforeAll(() => {
    agent = request.agent(app.instance);
  });
  afterAll(async () => {
    return app.close();
  });

  test('should return the lists of orders', async () => {
    const response = await agent.get('/orders');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
  });
});
