const request = require('supertest');
const app = require('../app');

describe('CMS Page Flow', () => {
  it('GET / harus tampil landing sederhana', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Landing Sederhana');
  });

  it('GET /cms/dashboard tanpa login harus redirect ke /cms/login', async () => {
    const res = await request(app).get('/cms/dashboard');

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/cms/login');
  });

  it('login benar lalu dashboard bisa diakses', async () => {
    const agent = request.agent(app);

    const loginRes = await agent
      .post('/cms/login')
      .type('form')
      .send({
        username: process.env.SUPERADMIN_USERNAME || 'superadmin',
        password: process.env.SUPERADMIN_PASSWORD || 'superadmin123'
      });

    expect(loginRes.status).toBe(302);
    expect(loginRes.headers.location).toBe('/cms/dashboard');

    const dashboardRes = await agent.get('/cms/dashboard');
    expect(dashboardRes.status).toBe(200);
    expect(dashboardRes.text).toContain('Dashboard CMS');
  });

  it('logout harus menghapus session halaman CMS', async () => {
    const agent = request.agent(app);

    await agent
      .post('/cms/login')
      .type('form')
      .send({
        username: process.env.SUPERADMIN_USERNAME || 'superadmin',
        password: process.env.SUPERADMIN_PASSWORD || 'superadmin123'
      });

    const logoutRes = await agent.post('/cms/logout');
    expect(logoutRes.status).toBe(302);
    expect(logoutRes.headers.location).toBe('/');

    const dashboardAfterLogout = await agent.get('/cms/dashboard');
    expect(dashboardAfterLogout.status).toBe(302);
    expect(dashboardAfterLogout.headers.location).toBe('/cms/login');
  });
});