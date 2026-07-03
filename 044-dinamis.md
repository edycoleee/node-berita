# 4.4 Tahap 4 Dinamis: Membuat API GET dari Data Berita

Pada tahap ini, siswa mulai mengenal API tanpa mengubah total layout yang sudah jadi.
Fokusnya adalah menyediakan data berita dalam format JSON melalui endpoint GET.

## Tujuan Pembelajaran

Setelah tahap ini, siswa diharapkan mampu:

1. Memahami perbedaan route halaman HTML dan route API JSON.
2. Membuat endpoint GET untuk semua data berita.
3. Membuat endpoint GET untuk detail berita berdasarkan slug.
4. Mengirim response 404 dalam format JSON jika data tidak ditemukan.
5. Menguji API dengan browser atau Postman.

## Konsep Inti

Di tahap sebelumnya:

1. Route / mengirim halaman Handlebars.
2. Route /berita/:slug mengirim halaman detail berita.

Di tahap ini ditambah:

1. Route /api/berita mengirim JSON list berita.
2. Route /api/berita/:slug mengirim JSON detail berita.

Jadi dalam satu aplikasi, kita punya dua jenis output:

1. HTML untuk tampilan.
2. JSON untuk data API.

## Langkah Praktik

### 1) Gunakan data object yang sama

Tetap pakai beritaList di server.js agar siswa paham satu sumber data bisa dipakai untuk:

1. Render halaman.
2. Response API.

### 2) Tambah endpoint GET semua berita

```js
app.get('/api/berita', (req, res) => {
	return res.json({
		success: true,
		total: beritaList.length,
		data: beritaList
	});
});
```

### 3) Tambah endpoint GET detail per slug

```js
app.get('/api/berita/:slug', (req, res) => {
	const berita = beritaList.find((item) => item.slug === req.params.slug);

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
```

### 4) Uji endpoint API

Uji di browser:

1. http://localhost:3000/api/berita
2. http://localhost:3000/api/berita/article-submission-camp
3. http://localhost:3000/api/berita/slug-tidak-ada

Atau pakai Postman dengan method GET.

### 5) Jelaskan ke siswa perbedaan hasil

1. Endpoint halaman: tampil visual HTML.
2. Endpoint API: tampil data JSON.

## Semua File (Kunci Jawaban Tahap 4)

## Struktur Akhir Tahap 4

```text
backend/
|-- server.js
|-- package.json
|-- public/
|   `-- css/
|       `-- style.css
`-- views/
    |-- home.handlebars
    |-- detail-berita.handlebars
    |-- 404-berita.handlebars
    |-- layouts/
    |   `-- main.handlebars
    `-- partials/
        |-- navbar.handlebars
        `-- footer.handlebars
```

## File Utama yang Diupdate: server.js

```js
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

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

const beritaList = [
	{
		slug: 'article-submission-camp',
		tanggal: '27 Juni 2026',
		judul: 'LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp',
		ringkasan:
			'Kegiatan ini mendorong peningkatan publikasi internasional melalui pendampingan intensif.',
		gambar:
			'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
		sumber:
			'https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/'
	},
	{
		slug: 'hibah-pengabdian',
		tanggal: '30 Juni 2026',
		judul: 'Pengumuman Hibah Pengabdian Masyarakat',
		ringkasan:
			'Program hibah dibuka untuk mendorong dampak langsung kepada masyarakat sekitar kampus.',
		gambar:
			'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
		sumber: 'https://lppm.undip.ac.id/'
	},
	{
		slug: 'seminar-luaran-penelitian',
		tanggal: '28 Juni 2026',
		judul: 'Seminar Luaran Penelitian',
		ringkasan:
			'Seminar ini menjadi wadah publikasi hasil penelitian dan kolaborasi antar dosen.',
		gambar:
			'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
		sumber: 'https://lppm.undip.ac.id/'
	}
];

app.get('/', (req, res) => {
	res.render('home', {
		title: 'Beranda',
		beritaList
	});
});

app.get('/berita/:slug', (req, res) => {
	const berita = beritaList.find((item) => item.slug === req.params.slug);

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

app.get('/api/berita', (req, res) => {
	return res.json({
		success: true,
		total: beritaList.length,
		data: beritaList
	});
});

app.get('/api/berita/:slug', (req, res) => {
	const berita = beritaList.find((item) => item.slug === req.params.slug);

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

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## Contoh Response API

### GET /api/berita

```json
{
	"success": true,
	"total": 3,
	"data": [
		{
			"slug": "article-submission-camp",
			"tanggal": "27 Juni 2026",
			"judul": "LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp",
			"ringkasan": "Kegiatan ini mendorong peningkatan publikasi internasional melalui pendampingan intensif.",
			"gambar": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
			"sumber": "https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/"
		}
	]
}
```

### GET /api/berita/slug-tidak-ada

```json
{
	"success": false,
	"message": "Berita tidak ditemukan",
	"slug": "slug-tidak-ada"
}
```

## Checklist Nilai Cepat Tahap 4

1. Endpoint GET /api/berita berjalan.
2. Endpoint GET /api/berita/:slug berjalan.
3. Slug valid mengembalikan data JSON.
4. Slug tidak valid mengembalikan JSON 404.
5. Halaman HTML dari tahap 3 tetap berjalan normal.

## Penutup Tahap 4

Tahap 4 membuat siswa paham bahwa satu sumber data dapat dipakai untuk dua kebutuhan sekaligus: halaman web dan API.
Setelah ini, tahap berikutnya adalah memindahkan sumber data dari object dummy ke SQLite agar alur menjadi lebih realistis.
