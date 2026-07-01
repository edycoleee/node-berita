# Node Web Learning - Tahap 01 Dasar

## Resume

Pada tahap ini, project difokuskan ke pengenalan dasar web backend dengan Node.js.

Yang sudah dibuat:

1. Satu server sederhana menggunakan Express.
2. Template Handlebars dengan layout utama (`main.handlebars`) dan halaman konten (`home.handlebars`).
3. Satu route utama `/` yang menampilkan HTML dinamis dari data JavaScript.

Tujuan pembelajaran tahap ini:

1. Siswa paham bahwa Node.js bisa menjadi web server.
2. Siswa paham peran template engine Handlebars.
3. Siswa paham alur dasar: browser -> server -> template -> HTML.

## Struktur yang Sudah Dieksekusi

```text
node-web/
  .gitignore
  backend/
    server.js
    package.json
    package-lock.json
    views/
      home.handlebars
      layouts/
        main.handlebars
```

## Cara Setup dan Menjalankan (Dari Nol)

## 1) Masuk ke folder backend

Jalankan dari root project:

```bash
cd backend
```

## 2) Inisialisasi Node.js project

```bash
npm init -y
```

Perintah ini akan membuat `package.json`.

## 3) Install dependency utama

```bash
npm install express express-handlebars
```

## 4) Install dependency development

```bash
npm install -D nodemon
```

## 5) Pastikan script di package.json

Bagian scripts minimal:

```json
"scripts": {
	"dev": "nodemon server.js",
	"start": "node server.js"
}
```

## 6) Jalankan server

Mode development (auto restart saat file berubah):

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

## 8) Mematikan server (cara normal)

Di terminal tempat server berjalan, tekan:

```text
Ctrl + C
```

## 9) Jika port 3000 masih terkunci, paksa kill process (Windows)

Cari PID yang memakai port 3000:

```bash
netstat -ano | findstr :3000
```

Kill berdasarkan PID (ganti `PID_NYA`):

```bash
taskkill /PID PID_NYA /F
```

Alternatif PowerShell 1 baris:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

Catatan:

1. Jika `npm start` atau `npm run dev` error karena port dipakai, lakukan langkah kill port di atas.
2. Jika dependency belum ada, jalankan lagi `npm install` di folder `backend`.

## Hasil Akhir

Setelah server berjalan dan URL dibuka, halaman akan menampilkan:

1. Judul: `Belajar Node.js`
2. Subjudul: `Selamat datang, Siswa SMA!`
3. Pesan: `Halo, ini HTML sederhana dari Handlebars.`

Catatan render:

1. Struktur HTML utama diambil dari `views/layouts/main.handlebars`.
2. Konten halaman diambil dari `views/home.handlebars` melalui `res.render('home', data)`.

Log terminal yang tampil:

```text
Server berjalan di http://localhost:3000
```

## Ringkasan Singkat untuk Siswa

1. `server.js` mengatur server dan route.
2. `main.handlebars` adalah layout utama, dan `home.handlebars` adalah isi halamannya.
3. Data dikirim dari server ke tampilan lewat `res.render()`.
4. Ini adalah fondasi sebelum masuk ke SQLite dan CRUD.