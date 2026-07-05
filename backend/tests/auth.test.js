const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('POST /api/auth/login sukses mengembalikan token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.SUPERADMIN_USERNAME || 'superadmin',
        password: process.env.SUPERADMIN_PASSWORD || 'superadmin123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.token).toBe('string');
  });

  it('POST /api/auth/login salah harus 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'superadmin', password: 'salah' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
