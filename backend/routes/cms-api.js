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
