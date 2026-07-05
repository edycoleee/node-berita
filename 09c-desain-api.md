# 09C. Desain API Standar + Error Seragam + Logger + Testing

Dokumen ini melanjutkan [09a-desain-db.md](09a-desain-db.md) dan [09b-auth-flow.md](09b-auth-flow.md).

Fokus 09c adalah menyusun API yang rapi dan konsisten untuk production-style learning:

1. API spec yang standar sesuai best practice.
2. Pesan error seragam dan informatif.
3. Logger yang mencatat semua request.
4. Struktur folder yang jelas.
5. Kunci jawaban semua file API.
6. Unit test otomatis.
7. REST client untuk uji manual.

## Apakah Urutanmu Sudah Baik?

Ya, urutanmu sudah baik.

Agar lebih kuat dalam implementasi, urutan eksekusi yang direkomendasikan adalah:

1. Tentukan API spec standar.
2. Tetapkan format response sukses dan error seragam.
3. Pasang request logger.
4. Bentuk struktur folder.
5. Implementasikan semua file API (kunci jawaban).
6. Buat unit test.
7. Verifikasi manual dengan REST client.

Kenapa seperti ini?

1. Spec dulu supaya tim punya kontrak yang sama.
2. Format error dulu supaya semua endpoint konsisten dari awal.
3. Logger dipasang awal agar debugging mudah saat implementasi.
4. Folder structure mempercepat kerja tim dan maintenance.

## Standar Response API

## 1) Success Response

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {
    "request_id": "b9c7...",
    "timestamp": "2026-07-05T10:00:00.000Z"
  }
}
```

## 2) Error Response (Seragam)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data tidak valid",
    "details": {
      "title": "Title wajib diisi"
    }
  },
  "meta": {
    "request_id": "b9c7...",
    "timestamp": "2026-07-05T10:00:00.000Z"
  }
}
```

## 3) Daftar Error Code yang Dipakai

1. `VALIDATION_ERROR` -> `400`
2. `UNAUTHORIZED` -> `401`
3. `FORBIDDEN` -> `403`
4. `NOT_FOUND` -> `404`
5. `CONFLICT` -> `409`
6. `INTERNAL_SERVER_ERROR` -> `500`

## API Specs (Final)

## A. Public API

1. `GET /api/public/landing`
2. `GET /api/public/news`
3. `GET /api/public/news/:slug`
4. `GET /api/public/videos`

## B. Auth API

1. `POST /api/auth/login`
2. `GET /api/auth/me`

Catatan:

1. 09c memakai token JWT untuk konsisten dengan 09b lanjutan.
2. Logout JWT di sisi client dilakukan dengan menghapus token.

## C. CMS API (Protected)

1. `GET /api/cms/ping` -> login wajib
2. `GET /api/cms/news` -> role `admin/editor`
3. `POST /api/cms/news` -> role `admin/editor`
4. `DELETE /api/cms/news/:id` -> role `admin`
5. `GET /api/cms/users` -> role `admin`

## Logger Request

Tujuan logger:

1. Tahu ada request masuk.
2. Tahu method, path, status code, durasi.
3. Tahu `request_id` agar mudah tracing log dan response.

Format log contoh:

```text
[2026-07-05T10:10:12.001Z] [REQ] id=4f8b4c method=GET path=/api/public/news
[2026-07-05T10:10:12.019Z] [RES] id=4f8b4c status=200 duration_ms=18
```

## Struktur Folder (Best Practice untuk Kelas)

```text
backend/
├── package.json
├── .env
├── .env.example
├── app.js
├── server.js
├── config/
│   └── env.js
├── db/
│   ├── sqlite.js
│   ├── init-schema.js
│   └── seed.js
├── middleware/
│   ├── request-id.js
│   ├── request-logger.js
│   ├── auth-jwt.js
│   └── error-handler.js
├── routes/
│   ├── public-api.js
│   ├── auth-api.js
│   └── cms-api.js
├── utils/
│   ├── response.js
│   └── logger.js
├── tests/
│   ├── auth.test.js
│   ├── public.test.js
│   └── cms.test.js
└── test-09c.http
```

---

## Kunci Jawaban Semua File (Final 09c)

## 1) Install Dependency

```bash
npm init -y
npm install express better-sqlite3 bcryptjs jsonwebtoken dotenv
npm install -D vitest supertest nodemon
```

## 2) package.json

```json
{
  "name": "node-berita-09c",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "vitest run --globals"
  }
}
```

Catatan best practice untuk CommonJS:

1. Pakai `vitest run --globals` agar `describe`, `it`, `expect` bisa dipakai tanpa import `vitest`.
2. Hindari `require('vitest')` pada file test CommonJS karena bisa gagal di beberapa versi Vitest.

## 3) .env.example

```env
PORT=3000
JWT_SECRET=rahasia-jwt-09c
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123
SUPERADMIN_FULL_NAME=Super Admin
```

## 4) .env

```env
PORT=3000
JWT_SECRET=rahasia-jwt-09c
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123
SUPERADMIN_FULL_NAME=Super Admin
```

## 5) config/env.js

```js
require('dotenv').config();

function getEnv(name, fallback) {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`ENV ${name} wajib diisi`);
  }
  return value;
}

module.exports = {
  port: Number(getEnv('PORT', 3000)),
  jwtSecret: getEnv('JWT_SECRET'),
  superAdminUsername: getEnv('SUPERADMIN_USERNAME', 'superadmin'),
  superAdminPassword: getEnv('SUPERADMIN_PASSWORD', 'superadmin123'),
  superAdminFullName: getEnv('SUPERADMIN_FULL_NAME', 'Super Admin')
};
```

## 6) db/sqlite.js

```js
const path = require('path');
const Database = require('better-sqlite3');

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(__dirname, 'lembaga.db');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('foreign_keys = ON');
  }
  return dbInstance;
}

module.exports = { getDb };
```

## 7) db/init-schema.js

```js
const { getDb } = require('./sqlite');

function initSchema() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      role TEXT NOT NULL DEFAULT 'editor',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      image TEXT,
      category TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      slug TEXT NOT NULL UNIQUE,
      published_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS youtube_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      thumbnail TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { initSchema };
```

## 8) db/seed.js

```js
const bcrypt = require('bcryptjs');
const { getDb } = require('./sqlite');
const env = require('../config/env');

function seedData() {
  const db = getDb();

  const adminHash = bcrypt.hashSync(env.superAdminPassword, 10);
  db.prepare(
    'INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run(env.superAdminUsername, adminHash, env.superAdminFullName, 'admin', 1);

  const editorHash = bcrypt.hashSync('editor123', 10);
  db.prepare(
    'INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run('editor1', editorHash, 'Editor Satu', 'editor', 1);

  db.prepare(
    'INSERT OR IGNORE INTO news (title, summary, content, image, category, status, slug, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Workshop Penelitian 2026',
    'Ringkasan workshop penelitian 2026',
    'Isi berita workshop penelitian 2026',
    '/uploads/news/news-1.jpg',
    'Kegiatan',
    'publish',
    'workshop-penelitian-2026',
    '2026-06-01 09:00:00'
  );

  const videoCount = db.prepare('SELECT COUNT(*) AS total FROM youtube_links').get().total;
  if (videoCount === 0) {
    db.prepare(
      'INSERT INTO youtube_links (title, youtube_url, thumbnail, sort_order, is_active) VALUES (?, ?, ?, ?, ?)' 
    ).run(
      'Profil Lembaga',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      1,
      1
    );
  }
}

module.exports = { seedData };
```

## 9) utils/logger.js

```js
function info(message) {
  console.log(`${new Date().toISOString()} INFO ${message}`);
}

function error(message) {
  console.error(`${new Date().toISOString()} ERROR ${message}`);
}

module.exports = { info, error };
```

## 10) utils/response.js

```js
function buildMeta(req) {
  return {
    request_id: req.requestId,
    timestamp: new Date().toISOString()
  };
}

function ok(req, res, data, message = 'OK', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta: buildMeta(req)
  });
}

function fail(req, res, status, code, message, details = null) {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: buildMeta(req)
  });
}

module.exports = { ok, fail };
```

## 11) middleware/request-id.js

```js
const { randomUUID } = require('crypto');

function requestId(req, res, next) {
  req.requestId = randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
}

module.exports = { requestId };
```

## 12) middleware/request-logger.js

```js
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  const started = Date.now();

  logger.info(`[REQ] id=${req.requestId} method=${req.method} path=${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - started;
    logger.info(`[RES] id=${req.requestId} status=${res.statusCode} duration_ms=${duration}`);
  });

  next();
}

module.exports = { requestLogger };
```

## 13) middleware/auth-jwt.js

```js
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuthToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Token Bearer wajib dikirim'
    });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (err) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Token tidak valid'
    });
  }
}

function requireRole() {
  const roles = Array.from(arguments);

  return (req, res, next) => {
    if (!req.user) {
      return next({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'User belum login'
      });
    }

    if (!roles.includes(req.user.role)) {
      return next({
        status: 403,
        code: 'FORBIDDEN',
        message: `Role ${req.user.role} tidak diizinkan`
      });
    }

    return next();
  };
}

module.exports = { requireAuthToken, requireRole };
```

## 14) middleware/error-handler.js

```js
const { fail } = require('../utils/response');
const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  return fail(req, res, 404, 'NOT_FOUND', 'Endpoint tidak ditemukan');
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Terjadi kesalahan pada server';
  const details = err.details || null;

  if (status >= 500) {
    logger.error(`[ERR] id=${req.requestId} ${message}`);
  }

  return fail(req, res, status, code, message, details);
}

module.exports = { notFoundHandler, errorHandler };
```

## 15) routes/public-api.js

```js
const express = require('express');
const { getDb } = require('../db/sqlite');
const { ok } = require('../utils/response');

const router = express.Router();

router.get('/landing', (req, res) => {
  const db = getDb();

  const hero = [];

  const news = db.prepare(
    `SELECT id, title, summary, image, category, slug, published_at
     FROM news
     WHERE status = 'publish'
     ORDER BY published_at DESC, id DESC
     LIMIT 9`
  ).all();

  const videos = db.prepare(
    `SELECT id, title, youtube_url, thumbnail, sort_order
     FROM youtube_links
     WHERE is_active = 1
     ORDER BY sort_order ASC, id ASC`
  ).all();

  return ok(req, res, { hero, news, videos, menus: [], settings: {} });
});

router.get('/news', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT id, title, summary, image, category, slug, published_at
     FROM news
     WHERE status = 'publish'
     ORDER BY published_at DESC, id DESC`
  ).all();
  return ok(req, res, rows);
});

router.get('/news/:slug', (req, res, next) => {
  const db = getDb();
  const row = db.prepare(
    `SELECT id, title, summary, content, image, category, slug, published_at
     FROM news
     WHERE status = 'publish' AND slug = ?`
  ).get(req.params.slug);

  if (!row) {
    return next({
      status: 404,
      code: 'NOT_FOUND',
      message: 'Berita tidak ditemukan'
    });
  }

  return ok(req, res, row);
});

router.get('/videos', (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT id, title, youtube_url, thumbnail, sort_order
     FROM youtube_links
     WHERE is_active = 1
     ORDER BY sort_order ASC, id ASC`
  ).all();

  return ok(req, res, rows);
});

module.exports = router;
```

## 16) routes/auth-api.js

```js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { getDb } = require('../db/sqlite');
const { ok } = require('../utils/response');

const router = express.Router();

router.post('/login', (req, res, next) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return next({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Username dan password wajib diisi',
      details: {
        username: !username ? 'Username wajib diisi' : null,
        password: !password ? 'Password wajib diisi' : null
      }
    });
  }

  const db = getDb();
  const user = db.prepare(
    `SELECT id, username, password_hash, full_name, role, is_active
     FROM users
     WHERE username = ?
     LIMIT 1`
  ).get(username);

  if (!user || user.is_active !== 1) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Username atau password salah'
    });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Username atau password salah'
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );

  return ok(req, res, { token }, 'Login berhasil');
});

router.get('/me', (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Token Bearer wajib dikirim'
    });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    return ok(req, res, payload);
  } catch (err) {
    return next({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Token tidak valid'
    });
  }
});

module.exports = router;
```

## 17) routes/cms-api.js

```js
const express = require('express');
const { getDb } = require('../db/sqlite');
const { ok } = require('../utils/response');
const { requireAuthToken, requireRole } = require('../middleware/auth-jwt');

const router = express.Router();

router.get('/ping', requireAuthToken, (req, res) => {
  return ok(req, res, { user: req.user }, 'Auth OK');
});

router.get('/news', requireAuthToken, requireRole('admin', 'editor'), (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT id, title, status, slug, published_at FROM news ORDER BY id DESC').all();
  return ok(req, res, rows);
});

router.post('/news', requireAuthToken, requireRole('admin', 'editor'), (req, res, next) => {
  const { title, content, slug, status = 'draft' } = req.body || {};

  if (!title || !content || !slug) {
    return next({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Data berita belum lengkap',
      details: {
        title: !title ? 'Title wajib diisi' : null,
        content: !content ? 'Content wajib diisi' : null,
        slug: !slug ? 'Slug wajib diisi' : null
      }
    });
  }

  if (!['draft', 'publish'].includes(status)) {
    return next({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Status harus draft atau publish'
    });
  }

  const db = getDb();

  const exists = db.prepare('SELECT id FROM news WHERE slug = ?').get(slug);
  if (exists) {
    return next({
      status: 409,
      code: 'CONFLICT',
      message: 'Slug sudah digunakan'
    });
  }

  const result = db.prepare(
    'INSERT INTO news (title, content, slug, status, published_at) VALUES (?, ?, ?, ?, ?)'
  ).run(title, content, slug, status, status === 'publish' ? new Date().toISOString() : null);

  return ok(req, res, { id: result.lastInsertRowid }, 'Berita berhasil dibuat', 201);
});

router.delete('/news/:id', requireAuthToken, requireRole('admin'), (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  return ok(req, res, { id: Number(req.params.id) }, 'Berita berhasil dihapus');
});

router.get('/users', requireAuthToken, requireRole('admin'), (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, full_name, role, is_active FROM users ORDER BY id ASC').all();
  return ok(req, res, users);
});

module.exports = router;
```

## 18) app.js

```js
const express = require('express');
const env = require('./config/env');
const { initSchema } = require('./db/init-schema');
const { seedData } = require('./db/seed');
const { requestId } = require('./middleware/request-id');
const { requestLogger } = require('./middleware/request-logger');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

const publicApi = require('./routes/public-api');
const authApi = require('./routes/auth-api');
const cmsApi = require('./routes/cms-api');

const app = express();

app.set('port', env.port);
app.use(express.json());
app.use(requestId);
app.use(requestLogger);

initSchema();
seedData();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API 09c berjalan',
    data: {
      routes: [
        'GET /api/public/landing',
        'GET /api/public/news',
        'GET /api/public/news/:slug',
        'GET /api/public/videos',
        'POST /api/auth/login',
        'GET /api/auth/me',
        'GET /api/cms/ping',
        'GET /api/cms/news',
        'POST /api/cms/news',
        'DELETE /api/cms/news/:id',
        'GET /api/cms/users'
      ]
    }
  });
});

app.use('/api/public', publicApi);
app.use('/api/auth', authApi);
app.use('/api/cms', cmsApi);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
```

## 19) server.js

```js
const app = require('./app');

const port = app.get('port') || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
```

---

## 20) Unit Test

Best practice dari kasus gagal sebelumnya:

1. Untuk CommonJS, jangan `require('vitest')` di file test.
2. Jalankan Vitest dengan `--globals` dari script npm.
3. Seed data gunakan pola idempotent (`INSERT OR IGNORE`) agar aman saat test paralel.

## tests/auth.test.js

```js
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
```

## tests/public.test.js

```js
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
```

## tests/cms.test.js

```js
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
```

---

## 21) REST Client

## test-09c.http

```http
@baseUrl = http://localhost:3000

### Root
GET {{baseUrl}}/

### Public landing
GET {{baseUrl}}/api/public/landing

### Public list news
GET {{baseUrl}}/api/public/news

### Public detail by slug
GET {{baseUrl}}/api/public/news/workshop-penelitian-2026

### Login superadmin
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "superadmin123"
}

### Me (ganti TOKEN)
GET {{baseUrl}}/api/auth/me
Authorization: Bearer TOKEN

### CMS ping tanpa token (harus 401)
GET {{baseUrl}}/api/cms/ping

### CMS ping pakai token
GET {{baseUrl}}/api/cms/ping
Authorization: Bearer TOKEN

### Create news (admin/editor)
POST {{baseUrl}}/api/cms/news
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Judul dari REST Client",
  "content": "Isi berita dari REST Client",
  "slug": "judul-dari-rest-client-01",
  "status": "draft"
}

### Delete news (admin only)
DELETE {{baseUrl}}/api/cms/news/1
Authorization: Bearer TOKEN

### Admin only users list
GET {{baseUrl}}/api/cms/users
Authorization: Bearer TOKEN
```

---

## 22) Cara Menjalankan

```bash
npm run dev
npm test
```

## 23) Checklist 09c

1. API spec sudah baku dan konsisten.
2. Error response seragam di semua endpoint.
3. Logger request-respon aktif.
4. Struktur folder jelas dan scalable.
5. Kunci jawaban semua file tersedia.
6. Unit test utama berjalan.
7. REST client siap untuk uji manual.

## Kesimpulan

Urutan yang kamu usulkan sudah tepat. Dengan paket final 09c ini, siswa bisa belajar alur profesional dari kontrak API sampai verifikasi otomatis dan manual dalam satu modul.