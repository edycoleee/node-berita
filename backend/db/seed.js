const bcrypt = require('bcryptjs');
const { getDb } = require('./sqlite');
const env = require('../config/env');

function seedData() {
  const db = getDb();

  const adminHash = bcrypt.hashSync(env.superAdminPassword, 10);
  db.prepare(
    'INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run(env.superAdminUsername, adminHash, env.superAdminFullName, 'admin', 1);

  const editorHash = bcrypt.hashSync('editor123', 10);
  db.prepare(
    'INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)'
  ).run('editor1', editorHash, 'Editor Satu', 'editor', 1);

  db.prepare(
    'INSERT OR IGNORE INTO news (title, summary, content, image, category, status, slug, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Workshop Penelitian 2026',
    'Ringkasan workshop penelitian 2026',
    'Isi berita workshop penelitian 2026',
    '/uploads/news/news-1.jpg',
    'Kegiatan',
    'publish',
    'workshop-penelitian-2026',
    '2026-06-01 09:00:00'
  );

  const videoCount = db.prepare('SELECT COUNT(*) AS total FROM youtube_links').get().total;
  if (videoCount === 0) {
    db.prepare(
      'INSERT INTO youtube_links (title, youtube_url, thumbnail, sort_order, is_active) VALUES (?, ?, ?, ?, ?)'
    ).run(
      'Profil Lembaga',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      1,
      1
    );
  }
}

module.exports = { seedData };
