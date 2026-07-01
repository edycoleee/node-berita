# 3. Membuat Berita yang Bisa Diklik ke Halaman Detail dan Kembali ke Beranda

Pada tahap ini, kita akan membuat kartu berita di halaman utama yang jika diklik akan menuju ke halaman berita berikut:

https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/

Setelah itu, siswa juga memahami cara kembali ke halaman utama.

## Tujuan Belajar

1. Membuat judul atau kartu berita bisa diklik.
2. Mengarahkan pengunjung ke halaman berita tujuan.
3. Memahami perbedaan link internal dan link eksternal.
4. Mengetahui cara kembali ke halaman utama.

## Konsep Dasar

Pada HTML, perpindahan halaman dilakukan dengan tag `a`.

Contoh paling sederhana:

```html
<a href="https://contoh.com">Buka halaman</a>
```

Jika link diarahkan ke website lain, maka itu disebut **link eksternal**.

Karena halaman tujuan berada di situs luar, kita **tidak bisa menambahkan tombol kembali di halaman situs luar tersebut** dari project kita. Maka ada 2 cara yang bisa diajarkan:

1. Buka artikel di tab yang sama, lalu kembali dengan tombol Back di browser.
2. Buka artikel di tab baru, sehingga halaman utama tetap terbuka.

Untuk siswa SMA, cara paling mudah dipahami adalah mulai dari tab yang sama.

## Cara 1: Klik Berita Menuju Halaman Artikel di Tab yang Sama

Contoh pada `home.handlebars`:

```html
<section class="news-section" id="berita">
	<div class="container">
		<h2>Berita Terkini</h2>

		<article class="news-card">
			<img
				src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
				alt="Article Submission Camp"
			/>

			<div class="news-body">
				<p class="news-date">27 Juni 2026</p>

				<h3>
					<a
						href="https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/"
						class="news-link">
						LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp
					</a>
				</h3>

				<p>
					Klik judul berita untuk membuka halaman artikel lengkap.
				</p>
			</div>
		</article>
	</div>
</section>
```

Jika judul diklik, browser akan berpindah ke halaman artikel LPPM UNDIP.

## Cara Kembali ke Halaman Utama

Karena halaman tujuan adalah website luar, cara kembali yang paling sederhana adalah:

1. Klik tombol Back di browser.
2. Browser akan kembali ke halaman utama project kita.

Penjelasan untuk siswa:

- Dari halaman utama, kita pindah ke artikel.
- Untuk kembali, gunakan tombol kembali pada browser.

## CSS Link Berita

Supaya link judul terlihat rapi:

```css
.news-link {
	color: #0b3d91;
	text-decoration: none;
}

.news-link:hover {
	text-decoration: underline;
}
```

## Cara 2: Klik Berita di Tab Baru

Kalau ingin halaman utama tetap terbuka, tambahkan `target="_blank"`.

```html
<a
	href="https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/"
	target="_blank"
	rel="noreferrer"
	class="news-link">
	Lihat berita lengkap
</a>
```

Hasilnya:

1. Artikel terbuka di tab baru.
2. Halaman utama project kita tetap terbuka di tab lama.
3. Siswa tidak perlu menekan Back.

## Mana yang Sebaiknya Dipakai?

Untuk latihan dasar, gunakan dulu **tab yang sama**, karena siswa akan lebih mudah memahami konsep perpindahan halaman.

Untuk kenyamanan pengguna, **tab baru** juga sering dipakai jika link menuju website luar.

## Jika Ingin Ada Tombol Kembali di Project Kita

Kalau Anda ingin benar-benar ada tombol `Kembali ke Beranda`, maka halaman detail beritanya harus dibuat **di project kita sendiri**, bukan langsung memakai halaman situs luar.

Alurnya menjadi seperti ini:

1. Halaman utama menampilkan daftar berita.
2. Ketika berita diklik, masuk ke route lokal misalnya `/berita/article-submission-camp`.
3. Di halaman detail lokal itu kita bisa tambahkan tombol `Kembali ke Beranda`.

Contoh route Express:

```js
app.get('/', (req, res) => {
	res.render('home', {
		title: 'Beranda'
	});
});

app.get('/berita/article-submission-camp', (req, res) => {
	res.render('detail-berita', {
		title: 'Detail Berita',
		judul: 'LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp',
		sumber: 'https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/'
	});
});
```

Contoh link berita di halaman utama:

```html
<a href="/berita/article-submission-camp" class="news-link">
	LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp
</a>
```

Contoh `detail-berita.handlebars`:

```html
<section class="detail-berita">
	<div class="container">
		<h1>{{judul}}</h1>
		<p>
			Ini adalah halaman detail berita di project kita.
			Untuk membaca sumber aslinya, buka link berikut.
		</p>

		<p>
			<a href="{{sumber}}" target="_blank" rel="noreferrer">Buka sumber asli berita</a>
		</p>

		<p>
			<a href="/" class="btn-back">Kembali ke Beranda</a>
		</p>
	</div>
</section>
```

Dengan cara ini, tombol kembali benar-benar bisa dibuat karena halaman detailnya ada di project kita sendiri.

## Rekomendasi Mengajar

Urutan terbaik untuk siswa SMA:

1. Ajarkan dulu link eksternal sederhana pada judul berita.
2. Tunjukkan bahwa tombol Back browser bisa mengembalikan ke halaman utama.
3. Setelah itu baru ajarkan route lokal untuk halaman detail berita.
4. Terakhir, tambahkan tombol `Kembali ke Beranda` di halaman detail lokal.

## Kesimpulan

Jika berita langsung mengarah ke halaman LPPM UNDIP, maka klik berita cukup dibuat dengan tag `a` dan kembali ke halaman utama dilakukan dengan tombol Back browser atau dengan membuka artikel di tab baru. Jika ingin ada tombol `Kembali ke Beranda` di dalam sistem yang kita buat, maka halaman detail beritanya harus dibuat sebagai halaman lokal di project Express kita.
