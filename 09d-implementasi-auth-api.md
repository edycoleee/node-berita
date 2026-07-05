# 09D. Implementasi Auth API Bertahap (Session-Based, Siap Copy-Paste)

Dokumen ini adalah lanjutan dari:

1. [09c-desain-api.md](09c-desain-api.md)
2. [09b-auth-flow.md](09b-auth-flow.md)

Posisi materi 09d:

1. 09d fokus pada auth berbasis session agar konsep dasar mudah dipahami siswa.
2. 09c fokus standar API yang lebih production-style (error seragam, logger, struktur folder, unit test).

Target dokumen ini:

1. Siswa bisa membuat auth dari nol.
2. Kode ditulis bertahap, bukan langsung sekaligus.
3. Tiap tahap punya hasil uji yang jelas.

## Gambaran Besar

Urutan belajar yang dipakai:

1. Install paket
2. Setup server dasar
3. Setup database users
4. Setup session
5. Buat middleware auth + role
6. Buat endpoint login
7. Buat endpoint me
8. Buat endpoint logout
9. Proteksi endpoint CMS
10. Uji end-to-end

## Tahap 1 - Install Paket

Jalankan:

```bash
npm install express better-sqlite3 express-session bcryptjs dotenv
npm install -D nodemon
```

Fungsi paket:

1. express: web server
2. better-sqlite3: akses SQLite
3. express-session: simpan login state
4. bcryptjs: hash dan cek password
5. dotenv: membaca konfigurasi aman dari file .env

Tambahkan file .env sederhana:

```env
PORT=3000
SESSION_SECRET=session-rahasia-untuk-belajar
```

## Tahap 2 - Buat Server Dasar

Buat file server.js:

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server auth siap');
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
```

Cek:

1. Jalankan node server.js
2. Buka browser ke /, harus muncul teks Server auth siap

## Tahap 3 - Setup Database dan Tabel Users

Tambahkan di atas route:

```js
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK(role IN ('admin', 'editor')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT
  )
`);
```

Seed admin awal (sekali saja):

```js
const hash = bcrypt.hashSync('admin123', 10);
db.prepare(
  `INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active)
   VALUES (?, ?, ?, ?, ?)`
).run('admin', hash, 'Administrator', 'admin', 1);

console.log('Seed admin dipastikan ada: username=admin, password=admin123');
```

Kenapa pakai INSERT OR IGNORE?

1. Aman saat server restart berulang.
2. Mencegah error duplikasi username.

Cek:

1. Restart server
2. Pastikan log seed muncul sekali (tidak berulang terus)

## Tahap 4 - Setup Session

Tambahkan import dan middleware session:

```js
const session = require('express-session');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
```

Catatan untuk siswa:

1. Session menyimpan status login di server.
2. Browser hanya pegang id session lewat cookie.
3. Secret session sebaiknya disimpan di .env, bukan hardcoded di kode.

## Tahap 5 - Buat Middleware Auth dan Role

Tambahkan fungsi:

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
```

## Tahap 6 - Endpoint Login

Tambahkan route login:

```js
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username dan password wajib diisi'
    });
  }

  const user = db
    .prepare('SELECT * FROM users WHERE username = ? LIMIT 1')
    .get(username);

  if (!user || user.is_active !== 1) {
    return res.status(401).json({
      success: false,
      message: 'Username atau password salah'
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Username atau password salah'
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role
  };

  return res.json({
    success: true,
    message: 'Login berhasil',
    data: req.session.user
  });
});
```

Cek cepat (pakai Postman/Insomnia):

1. POST /api/auth/login dengan admin/admin123 -> 200
2. Password salah -> 401

## Tahap 7 - Endpoint Me

Tambahkan route:

```js
app.get('/api/auth/me', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: 'Belum login'
    });
  }

  return res.json({
    success: true,
    message: 'OK',
    data: req.session.user
  });
});
```

Cek:

1. Setelah login, GET /api/auth/me -> data user
2. Sebelum login, GET /api/auth/me -> 401

## Tahap 8 - Endpoint Logout

Tambahkan route:

```js
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Gagal logout'
      });
    }

    res.clearCookie('connect.sid');

    return res.json({
      success: true,
      message: 'Logout berhasil'
    });
  });
});
```

Cek:

1. Login dulu
2. POST /api/auth/logout
3. Coba GET /api/auth/me -> harus 401

## Tahap 9 - Proteksi Endpoint CMS

Contoh endpoint umum CMS (admin/editor boleh):

```js
app.get('/api/cms/news', requireAuth, requireRole('admin', 'editor'), (req, res) => {
  return res.json({
    success: true,
    message: 'News CMS bisa diakses',
    data: []
  });
});
```

Contoh endpoint admin-only:

```js
app.delete('/api/cms/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  return res.json({
    success: true,
    message: 'User dihapus (contoh)'
  });
});
```

## Tahap 10 - Uji End-to-End di Kelas

Urutan uji yang disarankan:

1. Akses endpoint CMS tanpa login -> 401
2. Login sebagai editor -> berhasil
3. Akses endpoint news CMS -> boleh
4. Akses endpoint admin-only -> 403
5. Login sebagai admin -> akses admin-only boleh
6. Logout -> endpoint CMS kembali 401

## Contoh Lengkap server.js (Ringkas)

Jika siswa ingin melihat gabungan semua tahap, pakai contoh ini:

```js
const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 3000;
const db = new Database('app.db');

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

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK(role IN ('admin', 'editor')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT
  )
`);

const hash = bcrypt.hashSync('admin123', 10);
db.prepare(
  `INSERT OR IGNORE INTO users (username, password_hash, full_name, role, is_active)
   VALUES (?, ?, ?, ?, ?)`
).run('admin', hash, 'Administrator', 'admin', 1);

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  const user = db
    .prepare('SELECT * FROM users WHERE username = ? LIMIT 1')
    .get(username);

  if (!user || user.is_active !== 1) {
    return res.status(401).json({ success: false, message: 'Username atau password salah' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Username atau password salah' });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role
  };

  return res.json({ success: true, message: 'Login berhasil', data: req.session.user });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ success: false, message: 'Belum login' });
  }

  return res.json({ success: true, message: 'OK', data: req.session.user });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal logout' });
    }

    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logout berhasil' });
  });
});

app.get('/api/cms/news', requireAuth, requireRole('admin', 'editor'), (req, res) => {
  return res.json({ success: true, message: 'News CMS bisa diakses', data: [] });
});

app.delete('/api/cms/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  return res.json({ success: true, message: 'User dihapus (contoh)' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
```

## Ringkasan untuk Siswa

1. Login berhasil membuat session user.
2. Middleware requireAuth mengecek sudah login atau belum.
3. Middleware requireRole mengecek hak akses role.
4. Logout menghapus session, jadi akses CMS tertutup lagi.

Kalimat kunci siswa:

Session = tanda masuk.
Auth = cek sudah masuk.
Role = cek boleh masuk ruangan mana.
