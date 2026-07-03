# Node Web Learning - Pelajaran 4 (Dinamis)

README ini sudah disesuaikan untuk alur Pelajaran 4: dari layout statis sampai data SQLite.

## Tujuan Besar Pelajaran 4

1. Siswa paham urutan belajar backend yang bertahap.
2. Siswa bisa membedakan tampilan HTML dan data API JSON.
3. Siswa bisa transisi dari object dummy ke database SQLite tanpa merusak layout.

## Urutan Materi Pelajaran 4

1. Tahap 4.1 - Persiapan project dan halaman sederhana.
   File materi: `041-dinamis.md`
2. Tahap 4.2 - Layout berita statis.
   File materi: `042-dinamis.md`
3. Tahap 4.3 - Data object dummy terhubung ke layout + detail slug + 404.
   File materi: `043-dinamis.md`
4. Tahap 4.4 - API GET (`/api/berita` dan `/api/berita/:slug`).
   File materi: `044-dinamis.md`
5. Tahap 4.5 - Pindah sumber data ke SQLite.
   File materi: `045-dinamis.md`

## Ringkasan Alur Belajar

```text
layout statis -> object dummy -> API GET -> SQLite
```

Pendekatan ini cocok untuk siswa SMA karena:

1. Hasil visual muncul lebih cepat.
2. Konsep bertambah sedikit demi sedikit.
3. Debugging lebih mudah karena masalah dipisah per tahap.

## Setup Backend (Sekali di Awal)

Masuk ke folder backend:

```bash
cd backend
```

Inisialisasi project:

```bash
npm init -y
```

Install dependency utama:

```bash
npm install express express-handlebars
```

Install dependency development:

```bash
npm install -D nodemon
```

Saat masuk Tahap 4.5 (SQLite), tambah package:

```bash
npm install sqlite3
```

Pastikan scripts di `package.json`:

```json
"scripts": {
	"dev": "nodemon server.js",
	"start": "node server.js"
}
```

## Menjalankan Project

Mode development:

```bash
npm run dev
```

Mode normal:

```bash
npm start
```

Buka browser:

```text
http://localhost:3000
```

Uji endpoint API (mulai Tahap 4.4):

```text
http://localhost:3000/api/berita
http://localhost:3000/api/berita/article-submission-camp
```

## Rute yang Dipelajari di Pelajaran 4

Rute halaman:

1. `/` -> beranda.
2. `/berita/:slug` -> detail berita.

Rute API:

1. `/api/berita` -> daftar berita JSON.
2. `/api/berita/:slug` -> detail berita JSON.

## Catatan Untuk Pengajar

Jika siswa sudah terbiasa React Router, jelaskan seperti ini:

1. React Router: route dieksekusi di browser.
2. Express + Handlebars: route dieksekusi di server.
3. API route: server mengirim JSON, bukan HTML.

Dengan pola ini, siswa mudah memahami bahwa satu aplikasi bisa punya dua output sekaligus: tampilan HTML dan data API.

## Troubleshooting Windows

Stop server di terminal:

```text
Ctrl + C
```

Jika port 3000 terkunci:

```bash
netstat -ano | findstr :3000
taskkill /PID PID_NYA /F
```

Alternatif PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```