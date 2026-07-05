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
