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
