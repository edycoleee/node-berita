const request = require('supertest');
const app = require('../app');

async function loginAdmin() {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin123'
    });

  return loginRes.body.data.token;
}

async function loginEditor() {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'editor1', password: 'editor123' });

  return loginRes.body.data.token;
}

describe('CMS API', () => {
  it('GET /api/cms/ping tanpa token harus 401', async () => {
    const res = await request(app).get('/api/cms/ping');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/cms/news oleh editor harus 201', async () => {
    const token = await loginEditor();

    const res = await request(app)
      .post('/api/cms/news')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Berita Baru Editor',
        content: 'Isi berita dari editor',
        slug: `berita-editor-${Date.now()}`,
        status: 'draft'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/cms/users oleh editor harus 403', async () => {
    const token = await loginEditor();

    const res = await request(app)
      .get('/api/cms/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('GET /api/cms/users oleh admin harus 200', async () => {
    const token = await loginAdmin();

    const res = await request(app)
      .get('/api/cms/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
