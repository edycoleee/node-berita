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
