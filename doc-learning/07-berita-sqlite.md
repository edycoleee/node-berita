# 7. CRUD Artikel Berita dengan SQLite dan Handlebars

Pada materi sebelumnya, kita sudah membuat CRUD Todo dengan SQLite. Sekarang kita naik satu tingkat ke studi kasus yang lebih dekat dengan website kampus atau lembaga, yaitu **artikel berita**.

Di materi ini, data berita akan disimpan ke tabel SQLite bernama `tb_berita`.

## Tujuan Belajar

Setelah materi ini, siswa diharapkan bisa:

1. Membuat tabel berita di SQLite.
2. Menyimpan artikel berita baru.
3. Menampilkan daftar berita di halaman Handlebars.
4. Membuka detail berita.
5. Mengedit lalu menyimpan perubahan berita.
6. Menghapus berita.

## Struktur Tabel Berita

Anda sudah memulai struktur tabel seperti ini:

```js
function createTable() {
	const query = `
		CREATE TABLE IF NOT EXISTS tb_berita (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			judul TEXT NOT NULL,
			konten TEXT NOT NULL,
			penulis TEXT NOT NULL,
			kategori TEXT,
			status TEXT DEFAULT 'draft',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`;
}
```

Struktur ini sudah bagus untuk latihan CRUD berita. Kita hanya perlu melengkapinya agar query benar-benar dijalankan.

## Penjelasan Kolom

1. `id` adalah nomor unik otomatis.
2. `judul` adalah judul artikel.
3. `konten` adalah isi berita.
4. `penulis` adalah nama penulis berita.
5. `kategori` bisa dipakai untuk jenis berita, misalnya `Penelitian`, `Pengabdian`, atau `Pengumuman`.
6. `status` bisa berisi `draft` atau `publish`.
7. `created_at` mencatat waktu data dibuat.
8. `updated_at` mencatat waktu data terakhir diubah.

## Catatan Penting

Di SQLite, `updated_at` tidak berubah otomatis saat data diedit. Jadi saat melakukan `UPDATE`, kita perlu mengubah `updated_at` secara manual.

## Paket yang Digunakan

Untuk melanjutkan materi sebelumnya, kita tetap memakai:

1. `express`
2. `express-handlebars`
3. `better-sqlite3`

Instalasi:

```bash
npm install express express-handlebars better-sqlite3
```

## Struktur Folder

```text
node-web/
|-- server.js
|-- portal.db
|-- public/
|   `-- css/
|       `-- style.css
`-- views/
		|-- berita.handlebars
		|-- berita-tambah.handlebars
		|-- berita-edit.handlebars
		|-- berita-detail.handlebars
		`-- layouts/
				`-- main.handlebars
```

## Tahap 1: Membuka Database dan Membuat Tabel

Pertanyaan pentingnya adalah: **create table awalnya ditaruh di mana?**

Jawaban paling sederhana untuk siswa SMA:

1. Tulis di `server.js`.
2. Letakkan di bagian awal, setelah koneksi database dibuat.
3. Jalankan sekali saat server dinyalakan.

Artinya, urutannya seperti ini:

1. Import package.
2. Buat aplikasi Express.
3. Buka koneksi SQLite.
4. Buat function `createTable()`.
5. Panggil `createTable()`.
6. Baru tulis route-route aplikasi.

Kenapa diletakkan di awal `server.js`?

Karena sebelum aplikasi membaca, menambah, mengedit, atau menghapus berita, tabelnya harus sudah ada lebih dulu. Kalau tabel belum dibuat, query seperti `SELECT` atau `INSERT` akan gagal.

Jadi, `createTable()` adalah langkah persiapan awal saat aplikasi mulai berjalan.

### Urutan Sederhana di `server.js`

```js
const express = require('express');
const { engine } = require('express-handlebars');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;
const db = new Database('portal.db');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function createTable() {
	const query = `
		CREATE TABLE IF NOT EXISTS tb_berita (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			judul TEXT NOT NULL,
			konten TEXT NOT NULL,
			penulis TEXT NOT NULL,
			kategori TEXT,
			status TEXT DEFAULT 'draft',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`;

	db.prepare(query).run();
}

createTable();

app.get('/berita', (req, res) => {
	const berita = db.prepare('SELECT * FROM tb_berita ORDER BY created_at DESC').all();

	res.render('berita', {
		title: 'Daftar Berita',
		berita
	});
});
```

### Cara Menjelaskan ke Siswa

Gunakan logika sederhana seperti ini:

1. Aplikasi punya lemari penyimpanan data.
2. Lemari itu adalah database.
3. Di dalam lemari, kita harus membuat rak dulu.
4. Rak itu adalah tabel `tb_berita`.
5. Setelah rak ada, barulah data berita bisa disimpan.

Kalau belum ada rak, maka data tidak punya tempat untuk disimpan.

### Kapan `createTable()` Dijalanakan?

`createTable()` dijalankan saat server pertama kali menyala.

Contohnya saat kita menjalankan:

```bash
node server.js
```

Saat perintah itu dijalankan:

1. Node membaca file `server.js` dari atas ke bawah.
2. Koneksi database dibuat.
3. Function `createTable()` dibaca.
4. `createTable()` dipanggil.
5. SQLite mengecek apakah tabel `tb_berita` sudah ada.
6. Jika belum ada, tabel dibuat.
7. Jika sudah ada, SQLite tidak membuat ulang.

Jadi perintah `CREATE TABLE IF NOT EXISTS` aman dijalankan setiap kali server menyala.

### Kenapa Ada `IF NOT EXISTS`?

Bagian ini penting untuk dijelaskan:

```sql
CREATE TABLE IF NOT EXISTS tb_berita
```

Artinya:

1. Kalau tabel belum ada, buat tabel.
2. Kalau tabel sudah ada, jangan error dan jangan buat ulang.

Ini membuat program lebih aman dan praktis untuk pemula.

Contoh `server.js` awal:

```js
const express = require('express');
const { engine } = require('express-handlebars');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;
const db = new Database('portal.db');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function createTable() {
	const query = `
		CREATE TABLE IF NOT EXISTS tb_berita (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			judul TEXT NOT NULL,
			konten TEXT NOT NULL,
			penulis TEXT NOT NULL,
			kategori TEXT,
			status TEXT DEFAULT 'draft',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`;

	db.prepare(query).run();
}

createTable();
```

Penjelasan:

1. `portal.db` adalah file database.
2. Fungsi `createTable()` dijalankan sekali saat server mulai.
3. Jika tabel belum ada, SQLite akan membuatnya.

## Tahap 2: Read, Menampilkan Daftar Berita

Kita mulai dari menampilkan semua berita.

```js
app.get('/berita', (req, res) => {
	const berita = db
		.prepare('SELECT * FROM tb_berita ORDER BY created_at DESC')
		.all();

	res.render('berita', {
		title: 'Daftar Berita',
		berita
	});
});
```

Contoh `views/berita.handlebars`:

```html
<section class="berita-page">
	<div class="container">
		<h1>Daftar Berita</h1>

		<p>
			<a href="/berita/tambah">Tambah Berita Baru</a>
		</p>

		<div class="berita-list">
			{{#each berita}}
				<article class="berita-item">
					<h3>
						<a href="/berita/{{this.id}}">{{this.judul}}</a>
					</h3>
					<p>Penulis: {{this.penulis}}</p>
					<p>Kategori: {{this.kategori}}</p>
					<p>Status: {{this.status}}</p>

					<p>
						<a href="/berita/edit/{{this.id}}">Edit</a>
					</p>

					<form action="/berita/hapus/{{this.id}}" method="POST">
						<button type="submit">Hapus</button>
					</form>
				</article>
			{{/each}}
		</div>
	</div>
</section>
```

## Tahap 3: Menampilkan Form Tambah Berita

Sebelum menyimpan data, kita buat dulu halaman form.

```js
app.get('/berita/tambah', (req, res) => {
	res.render('berita-tambah', {
		title: 'Tambah Berita'
	});
});
```

Contoh `views/berita-tambah.handlebars`:

```html
<section class="berita-page">
	<div class="container">
		<h1>Tambah Berita</h1>

		<form action="/berita/tambah" method="POST" class="berita-form">
			<input type="text" name="judul" placeholder="Judul berita" required />
			<input type="text" name="penulis" placeholder="Nama penulis" required />
			<input type="text" name="kategori" placeholder="Kategori" />

			<select name="status">
				<option value="draft">Draft</option>
				<option value="publish">Publish</option>
			</select>

			<textarea name="konten" rows="10" placeholder="Isi berita" required></textarea>

			<button type="submit">Simpan Berita</button>
		</form>

		<p><a href="/berita">Kembali ke daftar</a></p>
	</div>
</section>
```

## Tahap 4: Create, Simpan Berita Baru

Sekarang proses simpan berita baru ke SQLite.

```js
app.post('/berita/tambah', (req, res) => {
	const { judul, konten, penulis, kategori, status } = req.body;

	db.prepare(`
		INSERT INTO tb_berita (judul, konten, penulis, kategori, status)
		VALUES (?, ?, ?, ?, ?)
	`).run(judul, konten, penulis, kategori, status);

	res.redirect('/berita');
});
```

Inilah proses **simpan berita baru**.

## Tahap 5: Detail Berita

Karena ini artikel berita, kita juga perlu halaman detail.

```js
app.get('/berita/:id', (req, res) => {
	const id = Number(req.params.id);
	const item = db.prepare('SELECT * FROM tb_berita WHERE id = ?').get(id);

	res.render('berita-detail', {
		title: item.judul,
		berita: item
	});
});
```

Contoh `views/berita-detail.handlebars`:

```html
<section class="berita-page">
	<div class="container">
		<h1>{{berita.judul}}</h1>
		<p>Penulis: {{berita.penulis}}</p>
		<p>Kategori: {{berita.kategori}}</p>
		<p>Status: {{berita.status}}</p>

		<article class="berita-konten">
			<p>{{berita.konten}}</p>
		</article>

		<p><a href="/berita">Kembali ke daftar berita</a></p>
	</div>
</section>
```

## Tahap 6: Menampilkan Form Edit

Sekarang kita buat halaman edit.

```js
app.get('/berita/edit/:id', (req, res) => {
	const id = Number(req.params.id);
	const item = db.prepare('SELECT * FROM tb_berita WHERE id = ?').get(id);

	res.render('berita-edit', {
		title: 'Edit Berita',
		berita: item
	});
});
```

Contoh `views/berita-edit.handlebars`:

```html
<section class="berita-page">
	<div class="container">
		<h1>Edit Berita</h1>

		<form action="/berita/edit/{{berita.id}}" method="POST" class="berita-form">
			<input type="text" name="judul" value="{{berita.judul}}" required />
			<input type="text" name="penulis" value="{{berita.penulis}}" required />
			<input type="text" name="kategori" value="{{berita.kategori}}" />

			<select name="status">
				<option value="draft" {{#ifCond berita.status 'draft'}}selected{{/ifCond}}>Draft</option>
				<option value="publish" {{#ifCond berita.status 'publish'}}selected{{/ifCond}}>Publish</option>
			</select>

			<textarea name="konten" rows="10" required>{{berita.konten}}</textarea>

			<button type="submit">Simpan Perubahan</button>
		</form>
	</div>
</section>
```

## Catatan Tentang `ifCond`

Di contoh edit di atas, ada `ifCond`. Itu adalah helper tambahan Handlebars untuk membandingkan dua nilai.

Tambahkan helper saat konfigurasi engine:

```js
app.engine(
	'handlebars',
	engine({
		helpers: {
			ifCond(a, b, options) {
				return a === b ? options.fn(this) : options.inverse(this);
			}
		}
	})
);
```

Kalau belum ingin memakai helper, Anda juga bisa membuat form edit lebih sederhana dengan dua tombol radio atau menjelaskan konsepnya dulu tanpa fokus ke bagian `selected`.

## Tahap 7: Update, Simpan Hasil Edit

Saat data diubah, kita simpan ke database dan ubah `updated_at`.

```js
app.post('/berita/edit/:id', (req, res) => {
	const id = Number(req.params.id);
	const { judul, konten, penulis, kategori, status } = req.body;

	db.prepare(`
		UPDATE tb_berita
		SET judul = ?,
				konten = ?,
				penulis = ?,
				kategori = ?,
				status = ?,
				updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`).run(judul, konten, penulis, kategori, status, id);

	res.redirect('/berita');
});
```

Inilah proses **edit lalu simpan berita**.

## Tahap 8: Delete, Hapus Berita

Terakhir, tambahkan proses hapus.

```js
app.post('/berita/hapus/:id', (req, res) => {
	const id = Number(req.params.id);

	db.prepare('DELETE FROM tb_berita WHERE id = ?').run(id);

	res.redirect('/berita');
});
```

## Gabungan Route Utama

```js
app.get('/berita', (req, res) => {
	const berita = db
		.prepare('SELECT * FROM tb_berita ORDER BY created_at DESC')
		.all();

	res.render('berita', {
		title: 'Daftar Berita',
		berita
	});
});

app.get('/berita/tambah', (req, res) => {
	res.render('berita-tambah', { title: 'Tambah Berita' });
});

app.post('/berita/tambah', (req, res) => {
	const { judul, konten, penulis, kategori, status } = req.body;

	db.prepare(`
		INSERT INTO tb_berita (judul, konten, penulis, kategori, status)
		VALUES (?, ?, ?, ?, ?)
	`).run(judul, konten, penulis, kategori, status);

	res.redirect('/berita');
});

app.get('/berita/:id', (req, res) => {
	const id = Number(req.params.id);
	const item = db.prepare('SELECT * FROM tb_berita WHERE id = ?').get(id);

	res.render('berita-detail', {
		title: item.judul,
		berita: item
	});
});

app.get('/berita/edit/:id', (req, res) => {
	const id = Number(req.params.id);
	const item = db.prepare('SELECT * FROM tb_berita WHERE id = ?').get(id);

	res.render('berita-edit', {
		title: 'Edit Berita',
		berita: item
	});
});

app.post('/berita/edit/:id', (req, res) => {
	const id = Number(req.params.id);
	const { judul, konten, penulis, kategori, status } = req.body;

	db.prepare(`
		UPDATE tb_berita
		SET judul = ?,
				konten = ?,
				penulis = ?,
				kategori = ?,
				status = ?,
				updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`).run(judul, konten, penulis, kategori, status, id);

	res.redirect('/berita');
});

app.post('/berita/hapus/:id', (req, res) => {
	const id = Number(req.params.id);
	db.prepare('DELETE FROM tb_berita WHERE id = ?').run(id);
	res.redirect('/berita');
});
```

## CSS Dasar

```css
.berita-page {
	padding: 40px 0;
}

.berita-form {
	display: grid;
	gap: 12px;
}

.berita-form input,
.berita-form textarea,
.berita-form select,
.berita-form button {
	padding: 10px 12px;
}

.berita-list {
	display: grid;
	gap: 16px;
}

.berita-item {
	background: #f8fafc;
	border: 1px solid #dbe3ee;
	border-radius: 8px;
	padding: 16px;
}
```

## Urutan Mengajar yang Disarankan

Supaya mudah dipahami siswa SMA, ajarkan dalam urutan ini:

1. Buat tabel `tb_berita`.
2. Tampilkan daftar berita.
3. Buat form tambah berita.
4. Simpan berita baru.
5. Buka detail berita.
6. Edit dan simpan perubahan.
7. Hapus berita.

## Hal Penting Untuk Dijelaskan ke Siswa

1. Artikel berita biasanya lebih kompleks daripada Todo karena punya judul, isi, penulis, kategori, dan status.
2. SQLite menyimpan semua data itu di file database.
3. Handlebars hanya menampilkan data yang dikirim dari Express.
4. Query SQL dipakai untuk membaca, menambah, mengubah, dan menghapus data.

## Latihan Untuk Siswa

1. Tambahkan kolom `gambar` pada tabel berita.
2. Tampilkan potongan isi berita di halaman daftar.
3. Buat filter berita berdasarkan kategori.
4. Tampilkan hanya berita dengan status `publish` di halaman publik.
5. Tampilkan tanggal `created_at` dan `updated_at` di halaman detail.

## Kesimpulan

Dengan SQLite, artikel berita bisa dikelola secara permanen seperti aplikasi portal berita sederhana. Materi ini sangat cocok sebagai lanjutan dari CRUD Todo, karena siswa belajar bahwa konsep CRUD yang sama bisa dipakai untuk data yang lebih nyata dan lebih kaya, seperti artikel berita pada website kampus atau lembaga.
