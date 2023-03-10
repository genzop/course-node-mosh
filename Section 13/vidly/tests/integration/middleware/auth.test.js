const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

let server;

describe('auth middleware', () => {
  let token;

  beforeEach(() => {
    server = require('../../../index');
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  const execute = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  it('should return 401 if no token is provided', async () => {
    token = '';

    const response = await execute();

    expect(response.status).toBe(401);
  });

  it('should return 400 if invalid token is provided', async () => {
    token = null;

    const response = await execute();

    expect(response.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const response = await execute();

    expect(response.status).toBe(200);
  });
});
