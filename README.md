# Node Web Learning - Tahap 02 Layout

## Resume

Tahap ini fokus pada pembuatan layout halaman utama secara bertahap dengan Handlebars partial.

Yang sudah dieksekusi di folder `backend`:

1. Server Express + Handlebars.
2. Layout utama `main.handlebars`.
3. Partial `navbar` dan `footer`.
4. Halaman `home.handlebars` berisi section hero, berita, dan video.
5. File CSS terpisah untuk styling layout.

Tujuan tahap ini:

1. Siswa memahami pemecahan halaman ke section.
2. Siswa memahami konsep layout + partial di Handlebars.
3. Siswa punya pondasi tampilan sebelum masuk data dinamis/database.

## Struktur yang Sudah Dieksekusi

```text
node-web/
	.gitignore
	backend/
		server.js
		package.json
		package-lock.json
		public/
			css/
				style.css
		views/
			home.handlebars
			layouts/
				main.handlebars
			partials/
				navbar.handlebars
				footer.handlebars
```

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

Halaman utama menampilkan urutan layout:

1. Menu atas (navbar).
2. Hero section.
3. Section berita dalam bentuk kartu.
4. Section video (iframe).
5. Footer informasi lembaga.

Log terminal saat server berhasil jalan:

```text
Server berjalan di http://localhost:3000
```

## Ringkasan Singkat untuk Siswa

1. `main.handlebars` adalah kerangka utama HTML.
2. `home.handlebars` berisi konten per section.
3. `navbar` dan `footer` dipisahkan jadi partial agar rapi.
4. CSS dipisah di `public/css/style.css` agar mudah dikembangkan.
