# 4.3 Tahap 3 Dinamis: Data Object Dummy Terhubung ke Layout

Pada tahap ini, berita tidak lagi ditulis statis di `home.handlebars`.
Kita pindahkan data ke object JavaScript (`beritaList`) di `server.js`, lalu render dinamis dengan Handlebars.

## Tujuan Pembelajaran

Setelah tahap ini, siswa diharapkan mampu:

1. Menyimpan data berita dalam array object.
2. Mengirim data dari route Express ke view Handlebars.
3. Menampilkan daftar berita dinamis dengan `{{#each}}`.
4. Membuat halaman detail berita berdasarkan `slug`.
5. Menangani kasus data tidak ditemukan (404).

## Alur Belajar Tahap 3

1. Data berita dipusatkan di `server.js`.
2. Route `/` kirim `beritaList` ke `home.handlebars`.
3. Tiap judul berita mengarah ke `/berita/:slug`.
4. Route detail cari data berdasarkan slug.
5. Jika slug tidak ada, tampilkan halaman 404 berita.

## Langkah Praktik

### 1) Buat object dummy `beritaList` di `server.js`

Contoh field minimal:

1. `slug`
2. `tanggal`
3. `judul`
4. `ringkasan`
5. `gambar`
6. `sumber`

### 2) Kirim data ke route beranda

```js
app.get('/', (req, res) => {
	res.render('home', {
		title: 'Beranda',
		beritaList
	});
});
```

### 3) Ubah berita statis menjadi dinamis di `home.handlebars`

Gunakan looping:

```handlebars
{{#each beritaList}}
	...
{{/each}}
```

### 4) Tambahkan route detail `/berita/:slug`

```js
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
```

### 5) Buat halaman detail dan 404

1. `detail-berita.handlebars` untuk menampilkan berita terpilih.
2. `404-berita.handlebars` untuk slug yang tidak ditemukan.

## Semua File (Kunci Jawaban Tahap 3)

## Struktur Akhir Tahap 3

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

## File 1: server.js

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

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## File 2: views/home.handlebars

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
			{{#each beritaList}}
				<article class="news-card">
					<img src="{{this.gambar}}" alt="{{this.judul}}" />
					<div class="news-body">
						<p class="news-date">{{this.tanggal}}</p>
						<h3>
							<a href="/berita/{{this.slug}}" class="news-link">{{this.judul}}</a>
						</h3>
						<p>{{this.ringkasan}}</p>
					</div>
				</article>
			{{/each}}
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

## File 3: views/detail-berita.handlebars

```html
{{> navbar}}

<section class="detail-berita">
	<div class="container detail-card">
		<p class="news-date">{{berita.tanggal}}</p>
		<h1>{{berita.judul}}</h1>

		<img src="{{berita.gambar}}" alt="{{berita.judul}}" class="detail-image" />

		<p>{{berita.ringkasan}}</p>
		<p>
			Ini adalah halaman detail berita lokal di project. Siswa bisa membaca ringkasan
			berita di sini, lalu membuka sumber asli jika dibutuhkan.
		</p>

		<div class="detail-actions">
			<a href="{{berita.sumber}}" target="_blank" rel="noreferrer" class="btn-secondary">
				Buka Sumber Asli
			</a>
			<a href="/" class="btn-back">Kembali ke Beranda</a>
		</div>
	</div>
</section>

{{> footer}}
```

## File 4: views/404-berita.handlebars

```html
{{> navbar}}

<section class="not-found-section">
	<div class="container not-found-card">
		<p class="not-found-code">404</p>
		<h1>Berita Tidak Ditemukan</h1>
		<p>
			Maaf, berita dengan slug <strong>{{slug}}</strong> tidak tersedia.
			Periksa kembali link atau pilih berita lain dari halaman beranda.
		</p>

		<div class="not-found-actions">
			<a href="/" class="btn-back">Kembali ke Beranda</a>
			<a href="/#berita" class="btn-secondary">Lihat Daftar Berita</a>
		</div>
	</div>
</section>

{{> footer}}
```

## File 5: CSS tambahan yang wajib ada di public/css/style.css

```css
.news-link {
	color: #0b3d91;
	text-decoration: none;
}

.news-link:hover {
	text-decoration: underline;
}

.detail-berita {
	padding: 56px 0;
	background: #f5f7fb;
}

.detail-card {
	background: #fff;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
	max-width: 860px;
}

.detail-actions,
.not-found-actions {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	margin-top: 20px;
}

.btn-secondary {
	background: #e5e7eb;
	color: #111827;
	display: inline-block;
	border-radius: 8px;
	padding: 12px 18px;
	text-decoration: none;
	font-weight: 700;
}

.btn-back {
	background: #0b3d91;
	color: #fff;
	display: inline-block;
	border-radius: 8px;
	padding: 12px 18px;
	text-decoration: none;
	font-weight: 700;
}

.not-found-section {
	padding: 56px 0;
	background: #f5f7fb;
}

.not-found-card {
	background: #fff;
	border-radius: 12px;
	padding: 28px;
	box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
	max-width: 760px;
}
```

## Checklist Nilai Cepat Tahap 3

1. Berita di beranda ditampilkan dari `beritaList` (bukan hardcoded di HTML).
2. Link berita menuju `/berita/:slug`.
3. Halaman detail menampilkan judul, tanggal, gambar, ringkasan.
4. Tombol `Kembali ke Beranda` berfungsi.
5. Slug salah menampilkan halaman `404-berita.handlebars`.
