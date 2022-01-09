import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './index.js';

describe('Order API endpoints', () => {
  const base = '/api/v1';
  let agent;
  beforeAll(() => {
    agent = request.agent(app.instance);
  });
  afterAll(async () => {
    return app.close();
  });

  test('should return an error if not authenticated', async () => {
    const response = await agent.get(base + '/cart/orders');
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toHaveProperty('message');
  });
});
