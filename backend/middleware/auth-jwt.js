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
