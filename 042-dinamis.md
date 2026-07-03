# 4.2 Tahap 2 Dinamis: Layout Dulu (Berita Statis)

Pada tahap ini, siswa belum fokus ke data dinamis.
Fokusnya adalah membentuk tampilan halaman berita yang rapi: ada navbar, hero, section berita, video, dan footer.

## Tujuan Pembelajaran

Setelah tahap ini, siswa diharapkan mampu:

1. Membuat struktur layout halaman utama secara utuh.
2. Memecah tampilan ke layout dan partial Handlebars.
3. Menampilkan berita statis dalam bentuk kartu.
4. Menyiapkan pondasi sebelum data diubah menjadi object dinamis.

## Target Hasil Tahap 2

1. Halaman beranda tampil lengkap dan rapi.
2. Kartu berita sudah muncul, walau isinya masih ditulis manual.
3. Struktur file siap dipakai pada tahap berikutnya (object dummy).

## Struktur File yang Dipakai

```text
backend/
|-- server.js
|-- public/
|   `-- css/
|       `-- style.css
`-- views/
    |-- home.handlebars
    |-- layouts/
    |   `-- main.handlebars
    `-- partials/
        |-- navbar.handlebars
        `-- footer.handlebars
```

## Langkah Praktik

### 1) Atur route beranda di server.js

```js
app.get('/', (req, res) => {
	res.render('home', {
		title: 'Beranda'
	});
});
```

Tujuan: memastikan route `/` langsung menampilkan halaman `home.handlebars`.

### 2) Buat layout utama main.handlebars

```html
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>{{title}}</title>
	<link rel="stylesheet" href="/css/style.css" />
</head>
<body>
	{{{body}}}
</body>
</html>
```

Tujuan: semua halaman memakai kerangka HTML yang sama.

### 3) Buat partial navbar dan footer

Contoh ide isi:

1. Navbar: brand + menu Beranda, Berita, Video, Kontak.
2. Footer: alamat, jam layanan, dan link penting.

Tujuan: siswa paham komponen yang berulang sebaiknya dipisah sebagai partial.

### 4) Buat home.handlebars dengan berita statis

Susun urutan section:

1. `{{> navbar}}`
2. Hero
3. Section Berita (3 kartu statis)
4. Section Video
5. `{{> footer}}`

Contoh kartu berita statis:

```html
<article class="news-card">
	<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Berita 1" />
	<div class="news-body">
		<p class="news-date">1 Juli 2026</p>
		<h3>Workshop Penelitian untuk Dosen Muda</h3>
		<p>Kegiatan ini bertujuan meningkatkan kualitas proposal penelitian di lingkungan kampus.</p>
	</div>
</article>
```

Tujuan: siswa melihat bentuk akhir UI sebelum masuk logika data.

### 5) Rapikan style.css

Minimal style yang perlu ada:

1. `.container`
2. `.topbar`, `.nav-menu`
3. `.hero`
4. `.news-grid`, `.news-card`
5. `.video-section`
6. `.site-footer`

Tujuan: siswa mengenal fondasi CSS layout modern (flex dan grid).

### 6) Uji hasil di browser

Jalankan:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

Checklist berhasil:

1. Navbar tampil.
2. Hero tampil.
3. Kartu berita statis tampil.
4. Video tampil.
5. Footer tampil.

## Catatan Mengajar

Pesan penting untuk siswa:

1. Di tahap ini belum ada data dari API atau database.
2. Tujuannya agar siswa paham bentuk halaman dulu.
3. Setelah layout stabil, baru data dipindah ke object dummy di tahap 3.

## Penutup Tahap 2

Tahap 2 menyiapkan panggung visual.
Tahap berikutnya (4.3) adalah mengubah berita statis menjadi data object dummy agar halaman mulai dinamis.

## Semua File

Bagian ini adalah **kunci jawaban Tahap 2**. Cocok untuk pengecekan akhir tugas siswa.

## Struktur Akhir Tahap 2

```text
backend/
|-- server.js
|-- package.json
|-- public/
|   `-- css/
|       `-- style.css
`-- views/
    |-- home.handlebars
    |-- layouts/
    |   `-- main.handlebars
    `-- partials/
        |-- navbar.handlebars
        `-- footer.handlebars
```

## Kunci Jawaban File 1: server.js

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

app.get('/', (req, res) => {
	res.render('home', {
		title: 'Beranda'
	});
});

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## Kunci Jawaban File 2: views/layouts/main.handlebars

```html
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>{{title}}</title>
	<link rel="stylesheet" href="/css/style.css" />
</head>
<body>
	{{{body}}}
</body>
</html>
```

## Kunci Jawaban File 3: views/partials/navbar.handlebars

```html
<header class="topbar">
	<div class="container nav-wrapper">
		<div class="brand">LPPM Kampus</div>

		<nav class="nav-menu">
			<a href="#hero">Beranda</a>
			<a href="#berita">Berita</a>
			<a href="#video">Video</a>
			<a href="#footer">Kontak</a>
		</nav>
	</div>
</header>
```

## Kunci Jawaban File 4: views/partials/footer.handlebars

```html
<footer class="site-footer" id="footer">
	<div class="container footer-grid">
		<div>
			<h3>LPPM Kampus</h3>
			<p>Gedung ICT Centre Lantai 4, Tembalang, Semarang</p>
			<p>Email: lppm@kampus.ac.id</p>
			<p>Telp: 024-0000000</p>
		</div>

		<div>
			<h3>Jam Layanan</h3>
			<p>Senin - Kamis: 07.30 - 16.00</p>
			<p>Jumat: 07.30 - 16.30</p>
		</div>

		<div>
			<h3>Link Penting</h3>
			<p><a href="#">Website Kampus</a></p>
			<p><a href="#">Sistem Penelitian</a></p>
			<p><a href="#">E-Journal</a></p>
		</div>
	</div>
</footer>
```

## Kunci Jawaban File 5: views/home.handlebars

```html
{{> navbar}}

<section class="hero" id="hero">
	<div class="container hero-content">
		<div>
			<p class="eyebrow">Lembaga Penelitian dan Pengabdian</p>
			<h1>Mendorong Riset, Inovasi, dan Pengabdian Masyarakat</h1>
			<p>
				Halaman utama ini menjadi pusat informasi kegiatan, pengumuman,
				publikasi, dan dokumentasi lembaga.
			</p>
			<a href="#berita" class="btn-primary">Lihat Berita</a>
		</div>
	</div>
</section>

<section class="news-section" id="berita">
	<div class="container">
		<h2>Berita Terkini</h2>

		<div class="news-grid">
			<article class="news-card">
				<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Berita 1" />
				<div class="news-body">
					<p class="news-date">1 Juli 2026</p>
					<h3>Workshop Penelitian untuk Dosen Muda</h3>
					<p>Kegiatan ini bertujuan meningkatkan kualitas proposal penelitian di lingkungan kampus.</p>
				</div>
			</article>

			<article class="news-card">
				<img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80" alt="Berita 2" />
				<div class="news-body">
					<p class="news-date">30 Juni 2026</p>
					<h3>Pengumuman Hibah Pengabdian Masyarakat</h3>
					<p>Program hibah dibuka untuk mendorong dampak langsung kepada masyarakat sekitar.</p>
				</div>
			</article>

			<article class="news-card">
				<img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Berita 3" />
				<div class="news-body">
					<p class="news-date">28 Juni 2026</p>
					<h3>Seminar Luaran Penelitian</h3>
					<p>Seminar ini menjadi wadah publikasi hasil penelitian dan kolaborasi antar dosen.</p>
				</div>
			</article>
		</div>
	</div>
</section>

<section class="video-section" id="video">
	<div class="container">
		<h2>Video Kegiatan</h2>
		<p>Dokumentasi kegiatan penelitian, pengabdian, dan seminar kampus.</p>

		<div class="video-wrapper">
			<iframe
				src="https://www.youtube.com/embed/dQw4w9WgXcQ"
				title="Video kegiatan"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen>
			</iframe>
		</div>
	</div>
</section>

{{> footer}}
```

## Kunci Jawaban File 6: public/css/style.css

```css
* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	line-height: 1.6;
	color: #1f2937;
}

.container {
	width: 90%;
	max-width: 1200px;
	margin: 0 auto;
}

.topbar {
	background: #0b3d91;
	color: #fff;
	padding: 16px 0;
}

.nav-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 24px;
}

.brand {
	font-weight: 700;
	font-size: 20px;
}

.nav-menu a {
	color: #fff;
	text-decoration: none;
	margin-left: 18px;
	font-weight: 600;
}

.hero {
	background: linear-gradient(rgba(11, 61, 145, 0.75), rgba(11, 61, 145, 0.75)),
		url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80') center/cover;
	color: #fff;
	padding: 100px 0;
}

.hero-content {
	max-width: 700px;
}

.eyebrow {
	text-transform: uppercase;
	font-weight: 700;
	letter-spacing: 1px;
}

.hero h1 {
	font-size: 44px;
	margin: 12px 0 16px;
	line-height: 1.2;
}

.btn-primary {
	display: inline-block;
	background: #f4b400;
	color: #1a1a1a;
	padding: 12px 20px;
	text-decoration: none;
	font-weight: 700;
	border-radius: 8px;
}

.news-section {
	padding: 70px 0;
	background: #f5f7fb;
}

.news-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
}

.news-card {
	background: #fff;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.news-card img {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

.news-body {
	padding: 18px;
}

.news-date {
	color: #6b7280;
	font-size: 14px;
	margin-bottom: 8px;
}

.video-section {
	padding: 70px 0;
	background: #fff;
}

.video-wrapper {
	position: relative;
	padding-bottom: 56.25%;
	height: 0;
	overflow: hidden;
	border-radius: 12px;
}

.video-wrapper iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.site-footer {
	background: #0f172a;
	color: #fff;
	padding: 50px 0;
}

.footer-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
}

.site-footer a {
	color: #cbd5e1;
	text-decoration: none;
}

@media (max-width: 960px) {
	.news-grid,
	.footer-grid {
		grid-template-columns: 1fr 1fr;
	}

	.hero h1 {
		font-size: 36px;
	}
}

@media (max-width: 640px) {
	.nav-wrapper {
		flex-direction: column;
		align-items: flex-start;
	}

	.nav-menu a {
		margin: 0 14px 0 0;
	}

	.news-grid,
	.footer-grid {
		grid-template-columns: 1fr;
	}

	.hero {
		padding: 70px 0;
	}

	.hero h1 {
		font-size: 30px;
	}
}
```

## Checklist Nilai Cepat

1. Route `/` menampilkan `home.handlebars`.
2. `main.handlebars` sudah memuat `{{{body}}}` dan `style.css`.
3. `home.handlebars` sudah memanggil `{{> navbar}}` dan `{{> footer}}`.
4. Halaman beranda menampilkan hero, berita statis, video, dan footer.
5. CSS membuat layout rapi di desktop dan mobile.