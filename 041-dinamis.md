# 4.1 Tahap 1 Dinamis: Persiapan Project dan Jalankan Halaman Sederhana

Tahap ini adalah pondasi sebelum masuk ke data dinamis.
Target utamanya sederhana: project backend siap dipakai dan server berhasil menampilkan halaman awal.

## Tujuan Pembelajaran

Setelah tahap ini, siswa diharapkan mampu:

1. Menyiapkan project Node.js dari nol di folder backend.
2. Menginstal requirement dasar Express dan Handlebars.
3. Menjalankan server development.
4. Mengecek bahwa halaman web sudah bisa diakses dari browser.

## Requirement

Paket yang dipakai:

1. `express` untuk server web.
2. `express-handlebars` untuk template engine.
3. `nodemon` untuk auto-restart saat development.

## Langkah Praktik (Dari Nol)

### 1) Masuk ke folder backend

```bash
cd backend
```

### 2) Inisialisasi project Node.js

```bash
npm init -y
```

### 3) Install dependency utama

```bash
npm install express express-handlebars
```

### 4) Install dependency development

```bash
npm install -D nodemon
```

### 5) Pastikan scripts di package.json

```json
"scripts": {
	"dev": "nodemon server.js",
	"start": "node server.js"
}
```

### 6) Buat file server.js sederhana

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
	res.send('Server jalan - siap lanjut ke layout berita');
});

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

### 7) Jalankan server

Mode development:

```bash
npm run dev
```

Mode normal:

```bash
npm start
```

### 8) Cek hasil di browser

```text
http://localhost:3000
```

Jika muncul teks "Server jalan - siap lanjut ke layout berita", berarti tahap persiapan berhasil.

## Troubleshooting Singkat

### Mematikan server

```text
Ctrl + C
```

### Jika port 3000 terkunci (Windows)

Cari PID:

```bash
netstat -ano | findstr :3000
```

Kill proses:

```bash
taskkill /PID PID_NYA /F
```

Alternatif PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

## Penutup Tahap 1

Pada tahap ini siswa belum fokus ke tampilan yang kompleks, tetapi fokus memastikan lingkungan kerja sudah benar.
Setelah ini, baru lanjut ke tahap berikutnya: membuat layout berita statis.

## Semua file

Bagian ini adalah **kunci jawaban Tahap 1**. Gunakan untuk mengecek hasil akhir siswa.

## Struktur Akhir Tahap 1

```text
backend/
|-- package.json
|-- server.js
`-- node_modules/
```

Catatan:

1. Folder `node_modules` otomatis terbentuk setelah `npm install`.
2. Di Tahap 1 belum wajib ada folder `views` dan `public`.

## Kunci Jawaban File 1: package.json

Contoh minimal yang benar:

```json
{
	"name": "backend",
	"version": "1.0.0",
	"main": "server.js",
	"scripts": {
		"dev": "nodemon server.js",
		"start": "node server.js"
	},
	"dependencies": {
		"express": "^4.21.2",
		"express-handlebars": "^7.1.3"
	},
	"devDependencies": {
		"nodemon": "^3.1.10"
	}
}
```

## Kunci Jawaban File 2: server.js

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
	res.send('Server jalan - siap lanjut ke layout berita');
});

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## Cek Cepat Kunci Jawaban

1. Jalankan `npm run dev`.
2. Buka `http://localhost:3000`.
3. Jika tampil teks `Server jalan - siap lanjut ke layout berita`, maka Tahap 1 sudah benar.