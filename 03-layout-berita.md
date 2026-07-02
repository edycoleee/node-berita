# 3. Layout Berita: Klik Kartu ke Detail Lokal + Tombol Kembali

Pada tahap ini, kita melanjutkan layout tahap 02 dengan menambahkan **halaman detail berita lokal** di project Express.

Alur yang dibuat:

1. Dari halaman beranda (`/`), siswa klik judul berita.
2. Masuk ke halaman detail lokal (`/berita/:slug`).
3. Dari halaman detail, klik tombol `Kembali ke Beranda`.

## Tujuan Belajar

1. Membuat judul berita pada kartu bisa diklik.
2. Mengarahkan pengguna ke route detail lokal (`/berita/:slug`).
3. Menambahkan tombol navigasi kembali ke halaman utama.
4. Memahami alur route list -> detail -> kembali.

## Konsep Dasar

Pada tahap ini kita menggunakan **link internal** (masih di aplikasi yang sama), bukan langsung ke website luar.

Keuntungan link internal:

1. Kita bebas mengatur tampilan halaman detail.
2. Kita bisa menambahkan tombol `Kembali ke Beranda`.
3. Siswa lebih mudah memahami alur navigasi antar route di Express.

## Struktur File yang Dipakai

```text
backend/
|-- server.js
|-- public/
|   `-- css/
|       `-- style.css
`-- views/
    |-- home.handlebars
    |-- detail-berita.handlebars
    |-- layouts/
    |   `-- main.handlebars
    `-- partials/
        |-- navbar.handlebars
        `-- footer.handlebars
```

## 1) Route Beranda dan Route Detail Berita

Contoh pada `backend/server.js`:

```js
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
		return res.status(404).send('Berita tidak ditemukan');
	}

	return res.render('detail-berita', {
		title: berita.judul,
		berita
	});
});
```

Penjelasan singkat:

1. Data berita disimpan di array `beritaList`.
2. `/` menampilkan daftar berita.
3. `/berita/:slug` menampilkan detail sesuai slug yang diklik.
4. Jika slug tidak ada, kirim status `404`.

## 2) Link Berita di Halaman Utama

Contoh pada `backend/views/home.handlebars`:

```html
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
```

Jika judul diklik, pengguna masuk ke route lokal `/berita/:slug`.

## 3) Halaman Detail Berita + Tombol Kembali

Contoh pada `backend/views/detail-berita.handlebars`:

```html
{{> navbar}}

<section class="detail-berita">
	<div class="container detail-card">
		<p class="news-date">{{berita.tanggal}}</p>
		<h1>{{berita.judul}}</h1>

		<img src="{{berita.gambar}}" alt="{{berita.judul}}" class="detail-image" />

		<p>{{berita.ringkasan}}</p>
		<p>
			Ini adalah halaman detail berita lokal di project.
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

Bagian penting untuk navigasi balik adalah:

```html
<a href="/" class="btn-back">Kembali ke Beranda</a>
```

## 4) CSS Tambahan untuk Link dan Tombol

Tambahkan di `backend/public/css/style.css`:

```css
.news-link {
	color: #0b3d91;
	text-decoration: none;
}

.news-link:hover {
	text-decoration: underline;
}

.detail-actions {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	margin-top: 20px;
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
```

## Rekomendasi Mengajar

Urutan terbaik untuk siswa SMA:

1. Tunjukkan dulu alur klik judul berita dari beranda ke detail lokal.
2. Jelaskan konsep `slug` pada route `/berita/:slug`.
3. Tunjukkan fungsi tombol `Kembali ke Beranda`.
4. Setelah paham route lokal, baru kenalkan link eksternal ke sumber asli.

## Kesimpulan

Untuk fitur navigasi yang jelas bagi siswa, pendekatan terbaik adalah membuat halaman detail berita **di project lokal**. Dengan begitu, berita bisa diklik dari beranda ke detail, lalu kembali lagi lewat tombol `Kembali ke Beranda` tanpa bergantung pada tombol Back browser.
