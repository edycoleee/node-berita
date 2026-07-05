const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/sqlite');
const { requireCmsPageAuth } = require('../middleware/require-page-auth');

const router = express.Router();

router.get('/', (req, res) => {
  return res.render('landing', {
    user: req.session?.user || null
  });
});

router.get('/cms/login', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/cms/dashboard');
  }

  return res.render('cms-login', {
    error: null
  });
});

router.post('/cms/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  const user = db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(username);

  if (!user || user.is_active !== 1) {
    return res.status(401).render('cms-login', {
      error: 'Username atau password salah'
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).render('cms-login', {
      error: 'Username atau password salah'
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    full_name: user.full_name
  };

  return res.redirect('/cms/dashboard');
});

router.get('/cms/dashboard', requireCmsPageAuth, (req, res) => {
  return res.render('cms-dashboard', {
    user: req.session.user
  });
});

router.post('/cms/logout', requireCmsPageAuth, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
});

module.exports = router;