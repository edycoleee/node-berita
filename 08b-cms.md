# 08b. CMS Auth Sederhana

Materi ini melanjutkan middleware auth ke bentuk CMS mini yang lebih nyata.

Fitur yang dibuat:

1. Landing login.
2. Dashboard setelah login.
3. Super admin hardcode: username `admin`, password `admin`.
4. Halaman admin untuk CRUD user (SQLite).
5. Halaman user yang bisa diakses role user.
6. Logout.

## Tujuan Belajar

Setelah tahap ini, siswa bisa:

1. Membuat login berbasis session.
2. Membagi hak akses berdasarkan role.
3. Membuat CRUD user dari database SQLite.
4. Memahami alur landing -> login -> dashboard -> halaman role masing-masing.

## Alur Aplikasi

```mermaid
flowchart TD
		A[Landing: /login] --> B[POST /login]
		B --> C{Cocok?}
		C -->|Tidak| D[Login gagal]
		C -->|Ya| E[Simpan req.session.user]
		E --> F[/dashboard]
		F --> G{Role}
		G -->|superadmin| H[/admin/users - CRUD user sqlite]
		G -->|user| I[/user - halaman user]
		H --> J[Logout]
		I --> J[Logout]
```

## Struktur Folder

```text
project-cms-auth/
├── package.json
├── server.js
├── middleware/
│   ├── auth.js
│   └── logger.js
├── db/
│   └── cms.db
└── views/
		├── layouts/
		│   └── main.handlebars
		├── login.handlebars
		├── dashboard.handlebars
		├── user-page.handlebars
		├── admin-users-list.handlebars
		└── admin-user-form.handlebars
```

## Semua File Kunci Jawaban

#### package.json

```json
{
	"name": "cms-auth-sederhana",
	"version": "1.0.0",
	"description": "CMS auth sederhana dengan sqlite dan role",
	"main": "server.js",
	"scripts": {
		"start": "node server.js",
		"dev": "nodemon server.js"
	},
	"dependencies": {
		"better-sqlite3": "^11.1.2",
		"express": "^4.19.2",
		"express-handlebars": "^7.1.2",
		"express-session": "^1.18.0"
	},
	"devDependencies": {
		"nodemon": "^3.1.4"
	}
}
```

#### middleware/logger.js

```js
function logger(req, res, next) {
	const start = Date.now();

	res.on('finish', () => {
		const ms = Date.now() - start;
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
	});

	next();
}

module.exports = logger;
```

#### middleware/auth.js

```js
function requireLogin(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	return next();
}

function requireSuperAdmin(req, res, next) {
	if (!req.session.user || req.session.user.role !== 'superadmin') {
		return res.status(403).send('Forbidden: hanya superadmin');
	}
	return next();
}

function requireUserPage(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login');
	}

	const role = req.session.user.role;
	if (role !== 'user' && role !== 'superadmin') {
		return res.status(403).send('Forbidden: role tidak diizinkan');
	}

	return next();
}

module.exports = {
	requireLogin,
	requireSuperAdmin,
	requireUserPage
};
```

#### server.js

```js
const path = require('path');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const Database = require('better-sqlite3');

const logger = require('./middleware/logger');
const { requireLogin, requireSuperAdmin, requireUserPage } = require('./middleware/auth');

const app = express();
const PORT = 3000;

const SUPER_ADMIN = {
	username: 'admin',
	password: 'admin',
	role: 'superadmin',
	nama: 'Super Admin'
};

const dbPath = path.join(__dirname, 'db', 'cms.db');
const db = new Database(dbPath);

db.exec(`
	CREATE TABLE IF NOT EXISTS tb_users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'user',
		nama TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	)
`);

const countUsers = db.prepare('SELECT COUNT(*) AS total FROM tb_users').get();
if (countUsers.total === 0) {
	db.prepare('INSERT INTO tb_users (username, password, role, nama) VALUES (?, ?, ?, ?)')
		.run('user1', 'user1', 'user', 'User Satu');
}

app.engine('handlebars', engine({
	helpers: {
		eq: (a, b) => a === b
	}
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret-latihan-cms',
	resave: false,
	saveUninitialized: false
}));
app.use(logger);

app.get('/', (req, res) => {
	if (!req.session.user) return res.redirect('/login');
	return res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
	if (req.session.user) return res.redirect('/dashboard');
	return res.render('login', { title: 'Login CMS', error: null });
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
		req.session.user = {
			username: SUPER_ADMIN.username,
			nama: SUPER_ADMIN.nama,
			role: SUPER_ADMIN.role
		};
		return res.redirect('/dashboard');
	}

	const user = db.prepare(
		'SELECT id, username, role, nama FROM tb_users WHERE username = ? AND password = ?'
	).get(username, password);

	if (!user) {
		return res.status(401).render('login', {
			title: 'Login CMS',
			error: 'Username atau password salah'
		});
	}

	req.session.user = {
		id: user.id,
		username: user.username,
		nama: user.nama,
		role: user.role
	};

	return res.redirect('/dashboard');
});

app.get('/dashboard', requireLogin, (req, res) => {
	return res.render('dashboard', {
		title: 'Dashboard',
		user: req.session.user
	});
});

app.get('/user', requireUserPage, (req, res) => {
	return res.render('user-page', {
		title: 'Halaman User',
		user: req.session.user
	});
});

app.get('/admin/users', requireSuperAdmin, (req, res) => {
	const users = db.prepare(
		'SELECT id, username, role, nama, created_at FROM tb_users ORDER BY id DESC'
	).all();

	return res.render('admin-users-list', {
		title: 'Admin - CRUD User',
		user: req.session.user,
		users
	});
});

app.get('/admin/users/tambah', requireSuperAdmin, (req, res) => {
	return res.render('admin-user-form', {
		title: 'Tambah User',
		user: req.session.user,
		mode: 'tambah',
		data: { username: '', password: '', role: 'user', nama: '' }
	});
});

app.post('/admin/users/tambah', requireSuperAdmin, (req, res) => {
	const { username, password, role, nama } = req.body;
	db.prepare('INSERT INTO tb_users (username, password, role, nama) VALUES (?, ?, ?, ?)')
		.run(username, password, role, nama);
	return res.redirect('/admin/users');
});

app.get('/admin/users/edit/:id', requireSuperAdmin, (req, res) => {
	const userData = db.prepare('SELECT id, username, password, role, nama FROM tb_users WHERE id = ?')
		.get(req.params.id);

	if (!userData) return res.status(404).send('User tidak ditemukan');

	return res.render('admin-user-form', {
		title: 'Edit User',
		user: req.session.user,
		mode: 'edit',
		data: userData
	});
});

app.post('/admin/users/edit/:id', requireSuperAdmin, (req, res) => {
	const { username, password, role, nama } = req.body;
	db.prepare('UPDATE tb_users SET username = ?, password = ?, role = ?, nama = ? WHERE id = ?')
		.run(username, password, role, nama, req.params.id);
	return res.redirect('/admin/users');
});

app.post('/admin/users/hapus/:id', requireSuperAdmin, (req, res) => {
	db.prepare('DELETE FROM tb_users WHERE id = ?').run(req.params.id);
	return res.redirect('/admin/users');
});

app.post('/logout', requireLogin, (req, res) => {
	req.session.destroy(() => {
		res.redirect('/login');
	});
});

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

#### views/layouts/main.handlebars

```handlebars
<!doctype html>
<html lang="id">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>{{title}}</title>
	<style>
		body {
			font-family: sans-serif;
			max-width: 880px;
			margin: 28px auto;
			padding: 0 16px;
		}
		.card {
			border: 1px solid #ddd;
			border-radius: 10px;
			padding: 16px;
			margin-bottom: 14px;
		}
		input, select {
			display: block;
			width: 100%;
			padding: 9px;
			margin: 8px 0;
		}
		button, .btn {
			display: inline-block;
			padding: 9px 12px;
			border: 1px solid #bbb;
			background: #f6f6f6;
			text-decoration: none;
			color: #111;
			border-radius: 6px;
			cursor: pointer;
		}
		table {
			width: 100%;
			border-collapse: collapse;
		}
		th, td {
			border: 1px solid #ddd;
			padding: 8px;
			text-align: left;
		}
		.error {
			color: #b00020;
		}
	</style>
</head>
<body>
	{{{body}}}
</body>
</html>
```

#### views/login.handlebars

```handlebars
<section class="card">
	<h1>Landing Login CMS</h1>
	<p>Super admin hardcode: admin / admin</p>
	<p>User demo dari SQLite: user1 / user1</p>

	{{#if error}}
		<p class="error">{{error}}</p>
	{{/if}}

	<form method="post" action="/login">
		<label>Username</label>
		<input type="text" name="username" required />

		<label>Password</label>
		<input type="password" name="password" required />

		<button type="submit">Masuk</button>
	</form>
</section>
```

#### views/dashboard.handlebars

```handlebars
<section class="card">
	<h1>Dashboard</h1>
	<p>Halo, {{user.nama}} ({{user.username}})</p>
	<p>Role: <strong>{{user.role}}</strong></p>

	{{#if user}}
		<a class="btn" href="/user">Halaman User</a>
	{{/if}}

	{{#if (eq user.role "superadmin")}}
		<a class="btn" href="/admin/users">Admin CRUD User</a>
	{{/if}}

	<form method="post" action="/logout" style="margin-top:12px;">
		<button type="submit">Logout</button>
	</form>
</section>
```

#### views/user-page.handlebars

```handlebars
<section class="card">
	<h1>Halaman User</h1>
	<p>Halaman ini bisa diakses role user dan superadmin.</p>
	<p>Login sebagai: {{user.username}} ({{user.role}})</p>
	<a class="btn" href="/dashboard">Kembali ke Dashboard</a>
</section>
```

#### views/admin-users-list.handlebars

```handlebars
<section class="card">
	<h1>Admin - CRUD User (SQLite)</h1>
	<a class="btn" href="/admin/users/tambah">Tambah User</a>
	<a class="btn" href="/dashboard">Kembali Dashboard</a>
</section>

<section class="card">
	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Username</th>
				<th>Nama</th>
				<th>Role</th>
				<th>Aksi</th>
			</tr>
		</thead>
		<tbody>
			{{#each users}}
				<tr>
					<td>{{this.id}}</td>
					<td>{{this.username}}</td>
					<td>{{this.nama}}</td>
					<td>{{this.role}}</td>
					<td>
						<a class="btn" href="/admin/users/edit/{{this.id}}">Edit</a>
						<form method="post" action="/admin/users/hapus/{{this.id}}" style="display:inline;">
							<button type="submit">Hapus</button>
						</form>
					</td>
				</tr>
			{{/each}}
		</tbody>
	</table>
</section>
```

#### views/admin-user-form.handlebars

```handlebars
<section class="card">
	{{#if data.id}}
		<h1>Edit User</h1>
		<form method="post" action="/admin/users/edit/{{data.id}}">
	{{else}}
		<h1>Tambah User</h1>
		<form method="post" action="/admin/users/tambah">
	{{/if}}

		<label>Username</label>
		<input type="text" name="username" value="{{data.username}}" required />

		<label>Password</label>
		<input type="text" name="password" value="{{data.password}}" required />

		<label>Nama</label>
		<input type="text" name="nama" value="{{data.nama}}" required />

		<label>Role</label>
		<select name="role">
			<option value="user">user</option>
			<option value="editor">editor</option>
		</select>

		<button type="submit">Simpan</button>
		<a class="btn" href="/admin/users">Batal</a>
	</form>
</section>
```

## Cara Uji

1. Jalankan `npm install`.
2. Jalankan `npm run dev`.
3. Buka `http://localhost:3000/login`.
4. Login super admin: `admin / admin`.
5. Buka `Admin CRUD User`, lalu tambah/edit/hapus user SQLite.
6. Logout.
7. Login user biasa `user1 / user1`, lalu buka `/user`.
8. User biasa harus gagal jika akses `/admin/users`.

## Catatan Keamanan (Penting)

1. Contoh ini masih menyimpan password user SQLite dalam plain text supaya mudah dipahami tahap dasar.
2. Tahap berikutnya wajib upgrade password ke hash bcrypt.
3. Session secret jangan hardcode di project produksi, pindahkan ke environment variable.

## Rest Client Testing

Bagian ini fokus ke testing manual pakai ekstensi REST Client di VS Code.

Karena auth di materi ini memakai session, alurnya adalah:

1. Login.
2. Ambil nilai `Set-Cookie` dari response login.
3. Tempel ke header `Cookie` untuk request berikutnya.

Buat file `test-cms-auth.http` lalu isi:

```http
@baseUrl = http://localhost:3000

### 1) Landing login page (harus 200)
GET {{baseUrl}}/login

### 2) Login superadmin (admin/admin)
# Setelah kirim request ini, copy nilai set-cookie dari response header.
POST {{baseUrl}}/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin

### 3) Dashboard superadmin (pakai Cookie dari langkah login)
GET {{baseUrl}}/dashboard
Cookie: connect.sid=ISI_DARI_SET_COOKIE

### 4) Admin users list (superadmin boleh)
GET {{baseUrl}}/admin/users
Cookie: connect.sid=ISI_DARI_SET_COOKIE

### 5) Tambah user baru (superadmin)
POST {{baseUrl}}/admin/users/tambah
Content-Type: application/x-www-form-urlencoded
Cookie: connect.sid=ISI_DARI_SET_COOKIE

username=user2&password=user2&role=user&nama=User%20Dua

### 6) Halaman user (superadmin juga boleh)
GET {{baseUrl}}/user
Cookie: connect.sid=ISI_DARI_SET_COOKIE

### 7) Logout
POST {{baseUrl}}/logout
Cookie: connect.sid=ISI_DARI_SET_COOKIE

### 8) Akses dashboard setelah logout (harus redirect ke /login)
GET {{baseUrl}}/dashboard
Cookie: connect.sid=ISI_DARI_SET_COOKIE
```

## Skenario User Biasa

Uji role user biasa untuk memastikan halaman admin ditolak.

```http
@baseUrl = http://localhost:3000

### 1) Login user biasa (seed awal: user1/user1)
POST {{baseUrl}}/login
Content-Type: application/x-www-form-urlencoded

username=user1&password=user1

### 2) Akses halaman user (boleh)
GET {{baseUrl}}/user
Cookie: connect.sid=ISI_COOKIE_USER1

### 3) Akses halaman admin users (harus 403)
GET {{baseUrl}}/admin/users
Cookie: connect.sid=ISI_COOKIE_USER1
```

## Checklist Hasil Testing

1. Login superadmin sukses dan bisa akses `/admin/users`.
2. Superadmin bisa tambah user baru.
3. Login user biasa sukses dan bisa akses `/user`.
4. User biasa ditolak saat akses `/admin/users` (403).
5. Setelah logout, session tidak bisa dipakai lagi untuk akses dashboard.

## Tips Agar Lebih Mudah

1. Jalankan request satu per satu dari atas.
2. Setiap selesai login, langsung copy `connect.sid` terbaru.
3. Jika bingung, ulang dari request login agar session fresh.

## Implementasi Unit Test

Bagian ini menjelaskan unit test dengan bahasa sederhana.

Bayangkan seperti ini:

1. Kamu punya tombol di game.
2. Setiap update game, kamu cek tombol itu masih berfungsi.
3. Unit test itu "cek otomatis" supaya fitur tidak rusak.

Di project ini, kita test 4 hal penting:

1. Halaman login bisa dibuka.
2. Login superadmin berhasil.
3. User biasa tidak boleh masuk ke halaman admin.
4. Logout membuat session tidak valid.

## Tools yang Dipakai

1. `vitest`: mesin test.
2. `supertest`: kirim request ke app Express tanpa buka browser.

## Langkah 1: Install Package Test

```bash
npm install -D vitest supertest
```

## Strutur folder setelah install package test:

```text
project-cms-auth/
├── package.json
├── server.js 
├── middleware/
│   ├── auth.js
│   └── logger.js
├── db/
│   └── cms.db
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── login.handlebars
│   ├── dashboard.handlebars
│   ├── user-page.handlebars
│   ├── admin-users-list.handlebars
│   └── admin-user-form.handlebars
└── tests/
    └── auth.test.js
```


## Langkah 2: Pisahkan app dan server (agar mudah di-test)

Kenapa dipisah?

1. `app.js` berisi route dan middleware.
2. `server.js` hanya menjalankan `app.listen`.
3. File test cukup import `app`, jadi cepat dan stabil.

### File: app.js

```js
const path = require('path');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const Database = require('better-sqlite3');

const logger = require('./middleware/logger');
const { requireLogin, requireSuperAdmin, requireUserPage } = require('./middleware/auth');

const app = express();

const SUPER_ADMIN = {
	username: 'admin',
	password: 'admin',
	role: 'superadmin',
	nama: 'Super Admin'
};

const dbPath = path.join(__dirname, 'db', 'cms.db');
const db = new Database(dbPath);

db.exec(`
	CREATE TABLE IF NOT EXISTS tb_users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'user',
		nama TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	)
`);

const countUsers = db.prepare('SELECT COUNT(*) AS total FROM tb_users').get();
if (countUsers.total === 0) {
	db.prepare('INSERT INTO tb_users (username, password, role, nama) VALUES (?, ?, ?, ?)')
		.run('user1', 'user1', 'user', 'User Satu');
}

app.engine('handlebars', engine({
	helpers: {
		eq: (a, b) => a === b
	}
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret-latihan-cms',
	resave: false,
	saveUninitialized: false
}));
app.use(logger);

app.get('/', (req, res) => {
	if (!req.session.user) return res.redirect('/login');
	return res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
	if (req.session.user) return res.redirect('/dashboard');
	return res.render('login', { title: 'Login CMS', error: null });
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
		req.session.user = {
			username: SUPER_ADMIN.username,
			nama: SUPER_ADMIN.nama,
			role: SUPER_ADMIN.role
		};
		return res.redirect('/dashboard');
	}

	const user = db.prepare(
		'SELECT id, username, role, nama FROM tb_users WHERE username = ? AND password = ?'
	).get(username, password);

	if (!user) {
		return res.status(401).render('login', {
			title: 'Login CMS',
			error: 'Username atau password salah'
		});
	}

	req.session.user = {
		id: user.id,
		username: user.username,
		nama: user.nama,
		role: user.role
	};

	return res.redirect('/dashboard');
});

app.get('/dashboard', requireLogin, (req, res) => {
	return res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

app.get('/user', requireUserPage, (req, res) => {
	return res.render('user-page', { title: 'Halaman User', user: req.session.user });
});

app.get('/admin/users', requireSuperAdmin, (req, res) => {
	const users = db.prepare(
		'SELECT id, username, role, nama, created_at FROM tb_users ORDER BY id DESC'
	).all();

	return res.render('admin-users-list', {
		title: 'Admin - CRUD User',
		user: req.session.user,
		users
	});
});

app.post('/logout', requireLogin, (req, res) => {
	req.session.destroy(() => {
		res.redirect('/login');
	});
});

module.exports = app;
```

### File: server.js

```js
const app = require('./app');

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## Langkah 3: Tambahkan Script Test di package.json

Tambahkan script berikut:

```json
{
	"scripts": {
		"dev": "nodemon server.js",
		"test": "vitest run"
	}
}
```

## Langkah 4: Buat File Unit Test

### File: tests/auth.test.js

```js
const request = require('supertest');
const { describe, it, expect } = require('vitest');
const app = require('../app');

describe('CMS Auth Sederhana', () => {
	it('GET /login harus berhasil (200)', async () => {
		const res = await request(app).get('/login');
		expect(res.status).toBe(200);
		expect(res.text).toContain('Landing Login CMS');
	});

	it('Login superadmin admin/admin harus redirect ke /dashboard', async () => {
		const res = await request(app)
			.post('/login')
			.type('form')
			.send({ username: 'admin', password: 'admin' });

		expect(res.status).toBe(302);
		expect(res.headers.location).toBe('/dashboard');
	});

	it('User biasa tidak boleh akses /admin/users (403)', async () => {
		const agent = request.agent(app);

		await agent
			.post('/login')
			.type('form')
			.send({ username: 'user1', password: 'user1' });

		const res = await agent.get('/admin/users');
		expect(res.status).toBe(403);
	});

	it('Logout membuat akses dashboard kembali diarahkan ke /login', async () => {
		const agent = request.agent(app);

		await agent
			.post('/login')
			.type('form')
			.send({ username: 'admin', password: 'admin' });

		await agent.post('/logout');

		const res = await agent.get('/dashboard');
		expect(res.status).toBe(302);
		expect(res.headers.location).toBe('/login');
	});
});
```

## Langkah 5: Jalankan Test

```bash
npm test
```

Jika semua benar, kamu akan melihat hasil test `passed`.

## Penjelasan Super Sederhana (Untuk Anak SMA)

1. `request(app).get('/login')` artinya kita pura-pura membuka halaman login.
2. `expect(res.status).toBe(200)` artinya kita cek apakah hasilnya sukses.
3. `request.agent(app)` artinya kita simpan session seperti browser sungguhan.
4. Setelah `logout`, kita cek lagi: kalau diarahkan ke `/login`, berarti session benar-benar hilang.

## Checklist Belajar

1. Bisa menjalankan `npm test` tanpa error.
2. Mengerti bedanya test login sukses dan test akses ditolak.
3. Mengerti kenapa session perlu `request.agent`.
4. Tahu manfaat unit test: mencegah fitur rusak saat kode berubah.
