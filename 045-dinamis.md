# 4.5 Tahap 5 Dinamis: Pindah dari Object Dummy ke SQLite

Pada tahap ini, sumber data berita dipindahkan dari array object ke database SQLite.
Tujuannya agar alur aplikasi lebih realistis seperti sistem produksi sederhana.

## Tujuan Pembelajaran

Setelah tahap ini, siswa diharapkan mampu:

1. Menginstal dan menggunakan SQLite pada project Node.js.
2. Membuat tabel berita dan data awal (seed).
3. Mengganti sumber data route HTML dan API dari object ke database.
4. Menangani response 404 saat data tidak ditemukan.
5. Menjaga layout tetap sama walau sumber data berubah.

## Konsep Inti

Sebelumnya:

1. Data berasal dari `beritaList` di memory.
2. Saat server restart, data kembali ke nilai awal hardcoded.

Sekarang:

1. Data disimpan di file database SQLite (`news.db`).
2. Route mengambil data melalui query SQL.
3. Data lebih siap untuk dikembangkan ke fitur tambah/edit/hapus.

## Requirement Tambahan

Install package SQLite:

```bash
npm install sqlite3
```

## Langkah Praktik

### 1) Buat folder dan file database helper

Buat folder dan file:

```text
backend/
`-- db/
    `-- sqlite.js
```

Fungsi file ini:

1. Koneksi ke SQLite.
2. Membuat tabel jika belum ada.
3. Menambahkan data awal jika tabel masih kosong.

### 2) Inisialisasi tabel berita

Struktur tabel minimal:

1. `id` INTEGER PRIMARY KEY AUTOINCREMENT
2. `slug` TEXT UNIQUE
3. `tanggal` TEXT
4. `judul` TEXT
5. `ringkasan` TEXT
6. `gambar` TEXT
7. `sumber` TEXT

### 3) Ganti route HTML agar ambil data dari DB

1. Route `/` -> `SELECT * FROM berita ORDER BY id DESC`.
2. Route `/berita/:slug` -> `SELECT * FROM berita WHERE slug = ?`.
3. Jika detail tidak ada -> render halaman `404-berita`.

### 4) Ganti route API GET agar ambil data dari DB

1. `/api/berita` -> JSON list dari query database.
2. `/api/berita/:slug` -> JSON detail dari query database.
3. Jika slug tidak ada -> JSON 404.

### 5) Uji hasil

1. Jalankan `npm run dev`.
2. Cek HTML:
   - `http://localhost:3000`
   - `http://localhost:3000/berita/article-submission-camp`
3. Cek API:
   - `http://localhost:3000/api/berita`
   - `http://localhost:3000/api/berita/article-submission-camp`

## Semua File (Kunci Jawaban Tahap 5)

## Struktur Akhir Tahap 5

```text
backend/
|-- db/
|   `-- sqlite.js
|-- public/
|   `-- css/
|       `-- style.css
|-- views/
|   |-- home.handlebars
|   |-- detail-berita.handlebars
|   |-- 404-berita.handlebars
|   |-- layouts/
|   |   `-- main.handlebars
|   `-- partials/
|       |-- navbar.handlebars
|       `-- footer.handlebars
|-- server.js
|-- package.json
`-- news.db
```

## File 1: db/sqlite.js

```js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'news.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run(
				`CREATE TABLE IF NOT EXISTS berita (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					slug TEXT UNIQUE NOT NULL,
					tanggal TEXT NOT NULL,
					judul TEXT NOT NULL,
					ringkasan TEXT NOT NULL,
					gambar TEXT NOT NULL,
					sumber TEXT NOT NULL
				)`
			);

			db.get('SELECT COUNT(*) AS total FROM berita', (err, row) => {
				if (err) return reject(err);
				if (row.total > 0) return resolve();

				const seed = db.prepare(
					'INSERT INTO berita (slug, tanggal, judul, ringkasan, gambar, sumber) VALUES (?, ?, ?, ?, ?, ?)'
				);

				seed.run(
					'article-submission-camp',
					'27 Juni 2026',
					'LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp',
					'Kegiatan ini mendorong peningkatan publikasi internasional melalui pendampingan intensif.',
					'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
					'https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/'
				);

				seed.run(
					'hibah-pengabdian',
					'30 Juni 2026',
					'Pengumuman Hibah Pengabdian Masyarakat',
					'Program hibah dibuka untuk mendorong dampak langsung kepada masyarakat sekitar kampus.',
					'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
					'https://lppm.undip.ac.id/'
				);

				seed.run(
					'seminar-luaran-penelitian',
					'28 Juni 2026',
					'Seminar Luaran Penelitian',
					'Seminar ini menjadi wadah publikasi hasil penelitian dan kolaborasi antar dosen.',
					'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
					'https://lppm.undip.ac.id/'
				);

				seed.finalize((finalErr) => {
					if (finalErr) return reject(finalErr);
					resolve();
				});
			});
		});
	});
}

function all(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
}

function get(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) return reject(err);
			resolve(row);
		});
	});
}

module.exports = {
	initDb,
	all,
	get
};
```

## File 2: server.js

```js
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const { initDb, all, get } = require('./db/sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine(
	'handlebars',
	engine({
		defaultLayout: 'main',
		layoutsDir: path.join(__dirname, 'views', 'layouts'),
		partialsDir: path.join(__dirname, 'views', 'partials')
	})
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
	const beritaList = await all('SELECT * FROM berita ORDER BY id DESC');
	return res.render('home', {
		title: 'Beranda',
		beritaList
	});
});

app.get('/berita/:slug', async (req, res) => {
	const berita = await get('SELECT * FROM berita WHERE slug = ?', [req.params.slug]);

	if (!berita) {
		return res.status(404).render('404-berita', {
			title: '404 - Berita Tidak Ditemukan',
			slug: req.params.slug
		});
	}

	return res.render('detail-berita', {
		title: berita.judul,
		berita
	});
});

app.get('/api/berita', async (req, res) => {
	const rows = await all('SELECT * FROM berita ORDER BY id DESC');
	return res.json({
		success: true,
		total: rows.length,
		data: rows
	});
});

app.get('/api/berita/:slug', async (req, res) => {
	const berita = await get('SELECT * FROM berita WHERE slug = ?', [req.params.slug]);

	if (!berita) {
		return res.status(404).json({
			success: false,
			message: 'Berita tidak ditemukan',
			slug: req.params.slug
		});
	}

	return res.json({
		success: true,
		data: berita
	});
});

initDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server berjalan di http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error('Gagal inisialisasi database:', err.message);
		process.exit(1);
	});
```

## File 3: package.json (bagian dependencies)

```json
"dependencies": {
	"express": "^4.21.2",
	"express-handlebars": "^7.1.3",
	"sqlite3": "^5.1.7"
}
```

## Checklist Nilai Cepat Tahap 5

1. Database `news.db` otomatis terbentuk saat server jalan.
2. Tabel `berita` otomatis dibuat jika belum ada.
3. Data seed otomatis masuk jika tabel masih kosong.
4. Route halaman dan route API membaca data dari SQLite.
5. Slug tidak valid tetap menampilkan 404 (HTML untuk halaman, JSON untuk API).

## Penutup Tahap 5

Di titik ini, siswa sudah mencapai alur backend yang lebih realistis: tampilan tetap sama, tetapi sumber data sudah naik level dari object dummy ke database SQLite.
Tahap berikutnya bisa dilanjutkan ke fitur CRUD (tambah, ubah, hapus berita).
