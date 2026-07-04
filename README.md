# Node Web Learning - Seri 07-08

Materi pada repository ini mencakup:

1. Seri 07: Berita + Upload.
2. Seri 08: Auth + Middleware + CMS (Session dan JWT).

## Setup dan Menjalankan Project

1. Masuk ke folder backend.

```bash
cd backend
```

2. Inisialisasi project.

```bash
npm init -y
```

3. Install dependency utama.

```bash
npm install express express-handlebars
```

4. Install dependency development.

```bash
npm install -D nodemon
```

5. Pastikan scripts di package.json.

```json
"scripts": {
	"dev": "nodemon server.js",
	"start": "node server.js"
}
```

6. Jalankan server.

Mode development:

```bash
npm run dev
```

Mode normal:

```bash
npm start
```

7. Buka di browser.

```text
http://localhost:3000
```

8. Matikan server dari terminal.

```text
Ctrl + C
```

9. Jika port 3000 masih terkunci (Windows).

Cari PID:

```bash
netstat -ano | findstr :3000
```

Hentikan proses (ganti PID_NYA):

```bash
taskkill /PID PID_NYA /F
```

Alternatif PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Hasil Akhir

```text
Server berjalan di http://localhost:3000
```

---

## Rangkuman Pelajaran 08

### Fokus Besar Seri 08

Pada seri ini, pembelajaran berpindah dari fitur berita/upload ke sistem autentikasi dan otorisasi.

Target utama:

1. Memahami middleware dasar (logger + auth).
2. Memahami auth berbasis session untuk web.
3. Memahami auth berbasis JWT untuk API.
4. Memahami role access (`superadmin` dan `user`).
5. Mampu melakukan testing manual (REST Client) dan testing otomatis (unit test).

### 08a - Middleware Dasar

Topik inti:

1. Logger global untuk mencatat request dan durasi response.
2. Auth middleware sederhana.
3. Perbedaan middleware global vs middleware per-route.
4. Urutan middleware di Express.

Output belajar:

1. Bisa membuat logger yang mencatat method, URL, status code, dan durasi `ms`.
2. Bisa membatasi route tertentu dengan middleware auth.
3. Bisa memahami alur request dari masuk sampai response.

### 08b - CMS Auth Sederhana (Session)

Topik inti:

1. Landing login menuju dashboard.
2. Super admin hardcode (`admin/admin`).
3. Role-based page (`superadmin` dan `user`).
4. CRUD user di SQLite untuk area admin.
5. Logout dan validasi session.

Output belajar:

1. Bisa membangun login session di web.
2. Bisa menerapkan middleware `requireLogin`, `requireSuperAdmin`, dan `requireUserPage`.
3. Bisa mengelola data user lewat halaman admin.

### 08c - CMS JWT (API + Web Client)

Topik inti:

1. Login API menghasilkan JWT.
2. Middleware `verifyToken` (cek token) dan `requireRole` (cek role).
3. API protected untuk users dan posts.
4. Unit test dengan Vitest + Supertest.
5. Halaman web sederhana yang menyimpan token dan memanggil API.

Output belajar:

1. Bisa implementasi auth JWT end-to-end.
2. Bisa test endpoint role-based (401/403/200).
3. Bisa menghubungkan frontend sederhana ke backend JWT.

### Alur Belajar yang Disarankan

1. Mulai dari 08a untuk memahami middleware dasar.
2. Lanjut 08b untuk memahami auth web berbasis session.
3. Lanjut 08c untuk memahami auth API berbasis token (JWT).
4. Jalankan REST Client testing setelah setiap tahap.
5. Jalankan unit test setelah fitur auth stabil.

### Kompetensi Akhir Seri 08

Setelah menyelesaikan seri 08, siswa diharapkan mampu:

1. Mendesain alur auth sederhana dari login sampai logout.
2. Mengamankan route berdasarkan role user.
3. Menulis middleware reusable untuk project berikutnya.
4. Melakukan verifikasi fitur dengan manual test dan unit test.