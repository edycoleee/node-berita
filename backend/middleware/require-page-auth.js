function requireCmsPageAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/cms/login');
  }

  next();
}

module.exports = { requireCmsPageAuth };