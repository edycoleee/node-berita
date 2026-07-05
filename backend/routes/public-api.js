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
