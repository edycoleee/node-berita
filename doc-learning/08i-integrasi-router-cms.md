# 8I. Integrasi Final Router CMS (Semua Modul Jadi Satu)

Dokumen ini menyatukan semua modul CMS yang sudah dibuat:

1. [08d-implementasi-cms-news.md](08d-implementasi-cms-news.md)
2. [08e-implementasi-cms-hero.md](08e-implementasi-cms-hero.md)
3. [08f-implementasi-cms-video.md](08f-implementasi-cms-video.md)
4. [08g-implementasi-cms-menu-settings.md](08g-implementasi-cms-menu-settings.md)
5. [08h-implementasi-cms-user-management.md](08h-implementasi-cms-user-management.md)

Target utama:

1. Struktur route rapi dan mudah dipelajari siswa.
2. Tidak menulis route panjang di satu file saja.
3. Proteksi auth-role konsisten di semua modul.

## Gambaran Besar Integrasi

```mermaid
flowchart LR
  A[server.js] --> B[/api/auth]
  A --> C[/api/public]
  A --> D[/api/cms]
  D --> E[news router]
  D --> F[hero router]
  D --> G[videos router]
  D --> H[menus router]
  D --> I[settings router]
  D --> J[users router admin-only]
```

## Tahap 1 - Buat Struktur Folder yang Rapi

Contoh struktur sederhana:

```text
project/
  server.js
  db.js
  middleware/
    auth.js
  routes/
    auth.routes.js
    public.routes.js
    cms/
      index.js
      news.routes.js
      hero.routes.js
      videos.routes.js
      menus.routes.js
      settings.routes.js
      users.routes.js
```

Penjelasan untuk siswa:

1. Satu file route untuk satu modul.
2. File `routes/cms/index.js` jadi pintu masuk semua route CMS.
3. `middleware/auth.js` dipakai ulang di semua modul.

## Tahap 2 - Pisahkan Middleware Auth ke Satu File

Buat `middleware/auth.js`:

```js
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
```

## Tahap 3 - Buat Router CMS Gabungan

Buat `routes/cms/index.js`:

```js
const express = require('express');
const { requireAuth } = require('../../middleware/auth');

const newsRoutes = require('./news.routes');
const heroRoutes = require('./hero.routes');
const videosRoutes = require('./videos.routes');
const menusRoutes = require('./menus.routes');
const settingsRoutes = require('./settings.routes');
const usersRoutes = require('./users.routes');

const router = express.Router();

// Semua route CMS wajib login
router.use(requireAuth);

router.use('/news', newsRoutes);
router.use('/hero', heroRoutes);
router.use('/videos', videosRoutes);
router.use('/menus', menusRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usersRoutes);

module.exports = router;
```

## Tahap 4 - Contoh Router Modul News

Buat `routes/cms/news.routes.js`:

```js
const express = require('express');
const { requireRole } = require('../../middleware/auth');

const router = express.Router();

// Tahap awal: admin + editor sama-sama boleh
router.use(requireRole('admin', 'editor'));

router.get('/', (req, res) => {
  return res.json({ success: true, message: 'List news' });
});

router.get('/:id', (req, res) => {
  return res.json({ success: true, message: 'Detail news' });
});

router.post('/', (req, res) => {
  return res.status(201).json({ success: true, message: 'Create news' });
});

router.put('/:id', (req, res) => {
  return res.json({ success: true, message: 'Update news' });
});

router.delete('/:id', (req, res) => {
  return res.json({ success: true, message: 'Delete news' });
});

module.exports = router;
```

Catatan:

1. Isi handler bisa diganti pakai SQL dari 08d.
2. Struktur route sudah siap dipasang ke database logic.

## Tahap 5 - Contoh Router Users (Admin Only)

Buat `routes/cms/users.routes.js`:

```js
const express = require('express');
const { requireRole } = require('../../middleware/auth');

const router = express.Router();

// Modul users sensitif: hanya admin
router.use(requireRole('admin'));

router.get('/', (req, res) => {
  return res.json({ success: true, message: 'List users' });
});

router.post('/', (req, res) => {
  return res.status(201).json({ success: true, message: 'Create user' });
});

router.put('/:id/active', (req, res) => {
  return res.json({ success: true, message: 'Set active user' });
});

router.put('/:id/reset-password', (req, res) => {
  return res.json({ success: true, message: 'Reset password user' });
});

router.delete('/:id', (req, res) => {
  return res.json({ success: true, message: 'Delete user' });
});

module.exports = router;
```

## Tahap 6 - Wiring di server.js

Contoh `server.js` minimal:

```js
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const cmsRoutes = require('./routes/cms');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ganti-secret-lokal',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/cms', cmsRoutes);

app.get('/', (req, res) => {
  res.send('Server integrasi CMS siap');
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
```

## Tahap 7 - Integrasi Bertahap Per Modul

Urutan pas untuk kelas:

1. Pasang router news dulu.
2. Lalu hero.
3. Lalu videos.
4. Lalu menus.
5. Lalu settings.
6. Terakhir users (admin only).

Kenapa urutan ini bagus:

1. Dari data paling sering dipakai (news) ke data pengaturan (settings/users).
2. Siswa melihat pola route yang berulang, jadi cepat paham.

## Tahap 8 - Checklist Uji Integrasi

Cek minimum sebelum lanjut frontend:

1. Semua endpoint `/api/cms/*` tanpa login -> 401.
2. Login editor:
3. News, hero, videos, menus, settings -> boleh.
4. Users -> 403.
5. Login admin:
6. Semua modul CMS termasuk users -> boleh.
7. Logout:
8. Endpoint CMS kembali 401.

## Tahap 9 - Single Tone Kode dan Nama Endpoint

Agar proyek terasa rapi dan konsisten, pakai gaya yang sama di semua modul:

1. Nama path jamak: `/news`, `/videos`, `/menus`, `/users`.
2. Status response seragam: `success`, `message`, `data`.
3. Urutan handler seragam: validasi -> cek data -> query -> response.
4. Penamaan variabel seragam: `id`, `existing`, `updated`, `errors`.

## Ringkasan untuk Siswa

1. Router modular membuat backend lebih mudah dirawat.
2. Middleware global di `/api/cms` memastikan semua route CMS wajib login.
3. Middleware role per modul membuat hak akses lebih aman.
4. Setelah tahap ini, backend CMS siap dipakai untuk integrasi frontend.
