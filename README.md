# Node Web Learning - Seri 07 (Berita + Upload)

## Cara Setup dan Menjalankan (Dari Nol)

## 1) Masuk ke folder backend

```bash
cd backend
```

## 2) Inisialisasi project

```bash
npm init -y
```

## 3) Install dependency utama

```bash
npm install express express-handlebars
```

## 4) Install dependency development

```bash
npm install -D nodemon
```

## 5) Pastikan scripts di package.json

```json
"scripts": {
	"dev": "nodemon server.js",
	"start": "node server.js"
}
```

## 6) Jalankan server

Mode development:

```bash
npm run dev
```

Mode normal:

```bash
npm start
```

## 7) Buka di browser

```text
http://localhost:3000
```

## 8) Mematikan server

Cara normal di terminal server:

```text
Ctrl + C
```

## 9) Jika port 3000 masih terkunci (Windows)

Cari PID:

```bash
netstat -ano | findstr :3000
```

Kill proses (ganti `PID_NYA`):

```bash
taskkill /PID PID_NYA /F
```

Alternatif PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

## Hasil Akhir

```text
Server berjalan di http://localhost:3000
```

---

# Rangkuman Pelajaran 07 (Berita + Upload)

Bagian ini merangkum seri pelajaran 07 sebagai lanjutan dari layout dan dinamis.

Fokus besarnya:

1. Memindahkan data berita dari object ke SQLite.
2. Menambahkan upload file gambar dan dokumen.
3. Menampilkan file sesuai kebutuhan (preview kecil, gambar besar, download).
4. Menjaga konsistensi data: database dan file fisik harus sama-sama dikelola.

## Daftar Materi 07

1. [07 - CRUD Berita SQLite](doc-learning/07-berita-sqlite.md)
	Inti: CRUD artikel berita dengan SQLite + Handlebars.
2. [07A - Upload Gambar Dasar](07a-uploud-gbr.md)
	Inti: upload gambar, preview kecil, klik untuk ukuran besar, hapus file.
3. [07B - Upload Multiple Dokumen](07b-uploud-file.md)
	Inti: upload banyak file PDF/DOCX/PPTX, akses paling sederhana lewat download.
4. [07C - Simpan Tanda Tangan Canvas](07c-uploud-ttd.md)
	Inti: canvas -> base64 PNG -> simpan file di server + catat di SQLite.
5. [07D - Integrasi Dinamis + SQLite + File Gambar](07d-berita-file.md)
	Inti: berita dari SQLite dengan thumbnail di list dan gambar besar di detail.

## Kompetensi yang Dicapai Siswa di Seri 07

1. Paham perbedaan data sementara (memory) vs data permanen (SQLite).
2. Mampu membuat tabel SQLite dan menjalankan query CRUD.
3. Mampu upload file ke server dengan validasi tipe dan ukuran.
4. Mampu menamai file secara unik agar tidak duplikasi.
5. Mampu mengelola file lifecycle: simpan, tampilkan, ganti, hapus.
6. Mampu menghubungkan alur backend (Express + SQLite) ke frontend Handlebars.

## Prinsip Penting yang Ditekankan

1. Saat update gambar, file lama harus dibersihkan jika diganti.
2. Saat delete data, file fisik juga harus dihapus.
3. Thumbnail dipakai untuk list agar ringan, gambar besar dipakai untuk detail.
4. Untuk PDF/DOCX/PPTX, pendekatan paling stabil adalah download lalu buka di perangkat user.

## Urutan Belajar yang Disarankan

1. Mulai dari [07 - CRUD Berita SQLite](doc-learning/07-berita-sqlite.md)
2. Lanjut ke [07A - Upload Gambar Dasar](07a-uploud-gbr.md)
3. Lanjut ke [07D - Integrasi Berita + File](07d-berita-file.md)
4. Tambahkan [07B - Dokumen Multiple](07b-uploud-file.md)
5. Tutup dengan [07C - Canvas Tanda Tangan](07c-uploud-ttd.md)

## Ringkasan Singkat Pelajaran 07

1. SQLite membuat data berita permanen.
2. Upload membuat konten lebih realistis dan siap dipakai di project nyata.
3. Manajemen file yang benar selalu berpasangan dengan manajemen data database.
4. Setelah seri 07, pondasi untuk masuk ke CMS/admin panel sudah kuat.