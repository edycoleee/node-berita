const request = require('supertest');
const app = require('../app');

describe('Public API', () => {
  it('GET /api/public/landing harus 200', async () => {
    const res = await request(app).get('/api/public/landing');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.news)).toBe(true);
  });

  it('GET /api/public/news/:slug tidak ditemukan harus 404', async () => {
    const res = await request(app).get('/api/public/news/slug-tidak-ada');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
