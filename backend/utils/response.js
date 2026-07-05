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
