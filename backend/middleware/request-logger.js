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
