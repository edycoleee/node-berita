# 8B. Desain API Specs (Website Berita + CMS)

Dokumen ini melanjutkan desain database di [08a-desain-db.md](e:/REACT/node-web/08a-desain-db.md).

Fokusnya adalah spesifikasi endpoint agar implementasi backend terarah, terutama untuk:

1. Halaman publik (landing, detail berita).
2. CMS admin/editor (CRUD berita, hero, video, menu, settings).
3. Auth berbasis tabel `users`.

## Prinsip API yang Dipakai

1. Prefix publik: `/api/public/*`
2. Prefix CMS: `/api/cms/*`
3. Semua endpoint CMS wajib login.
4. Endpoint tertentu hanya untuk role `admin`.

## Format Response Standar

Sukses:

```json
{
	"success": true,
	"message": "OK",
	"data": {}
}
```

Error:

```json
{
	"success": false,
	"message": "Validation error",
	"errors": {
		"title": "Judul wajib diisi"
	}
}
```

## Kode HTTP yang Dipakai

1. `200` sukses.
2. `201` data baru berhasil dibuat.
3. `400` data request tidak valid.
4. `401` belum login.
5. `403` login ada, tapi tidak punya hak akses.
6. `404` data tidak ditemukan.
7. `500` error server.

## A. Public API

## 1) GET `/api/public/landing`

Fungsi:

1. Ambil data landing: hero aktif, berita publish, video aktif, menu aktif, settings.

Query opsional:

1. `news_limit` (default 9)
2. `hero_limit` (default 5)

Contoh response ringkas:

```json
{
	"success": true,
	"message": "OK",
	"data": {
		"hero": [],
		"news": [],
		"videos": [],
		"menus": [],
		"settings": {}
	}
}
```

## 2) GET `/api/public/news`

Fungsi:

1. Ambil list berita publish.

Query opsional:

1. `page` (default 1)
2. `limit` (default 9)
3. `category`
4. `q` (keyword judul)

## 3) GET `/api/public/news/:slug`

Fungsi:

1. Ambil detail satu berita publish berdasarkan slug.

Jika slug tidak ada:

1. Return `404`.

## 4) GET `/api/public/videos`

Fungsi:

1. Ambil list video aktif berdasarkan `sort_order`.

## B. Auth API

## 1) POST `/api/auth/login`

Body:

```json
{
	"username": "admin",
	"password": "secret"
}
```

Proses:

1. Cari user by username.
2. Cek `is_active = 1`.
3. Verifikasi password hash (bcrypt).
4. Simpan session: `userId`, `username`, `role`.

Response sukses:

```json
{
	"success": true,
	"message": "Login berhasil",
	"data": {
		"username": "admin",
		"role": "admin"
	}
}
```

## 2) POST `/api/auth/logout`

Fungsi:

1. Hapus session user aktif.

Response:

```json
{
	"success": true,
	"message": "Logout berhasil"
}
```

## 3) GET `/api/auth/me`

Fungsi:

1. Cek user yang sedang login dari session.

## C. CMS API (Butuh Login)

Catatan:

1. Semua endpoint ini pakai middleware `requireAuth`.
2. Endpoint yang bersifat sensitif pakai `requireRole('admin')`.

## C1. Hero Slides

1. GET `/api/cms/hero`
2. POST `/api/cms/hero`
3. PUT `/api/cms/hero/:id`
4. DELETE `/api/cms/hero/:id`

Body create/update (contoh):

```json
{
	"title": "Judul Hero",
	"subtitle": "Sub Judul",
	"image": "hero-1.jpg",
	"button_text": "Lihat Detail",
	"button_url": "/berita",
	"sort_order": 1,
	"is_active": 1
}
```

## C2. Berita

1. GET `/api/cms/news`
2. GET `/api/cms/news/:id`
3. POST `/api/cms/news`
4. PUT `/api/cms/news/:id`
5. DELETE `/api/cms/news/:id`

Body create/update (contoh):

```json
{
	"title": "Judul berita",
	"summary": "Ringkasan singkat",
	"content": "Isi lengkap berita",
	"image": "berita-123.jpg",
	"category": "Penelitian",
	"status": "publish",
	"slug": "judul-berita",
	"published_at": "2026-07-01 10:00:00"
}
```

## C3. YouTube Links

1. GET `/api/cms/videos`
2. POST `/api/cms/videos`
3. PUT `/api/cms/videos/:id`
4. DELETE `/api/cms/videos/:id`

## C4. Menus

1. GET `/api/cms/menus`
2. POST `/api/cms/menus`
3. PUT `/api/cms/menus/:id`
4. DELETE `/api/cms/menus/:id`

## C5. Settings

1. GET `/api/cms/settings`
2. PUT `/api/cms/settings`

Body update settings (contoh):

```json
{
	"site_logo": "/uploads/site/logo.png",
	"footer_address": "Gedung ICT Centre Lantai 4",
	"footer_email": "lppm@kampus.ac.id",
	"footer_phone": "024-0000000",
	"google_map_embed": "https://www.google.com/maps/embed?..."
}
```

## D. Matrix Akses Role

1. `admin`: full akses semua endpoint CMS + user management.
2. `editor`: CRUD hero/berita/video/menu/settings tanpa endpoint user management.

Saran sederhana:

1. Tahap awal: `admin` dan `editor` boleh akses endpoint CMS yang sama.
2. Tahap lanjut: kunci endpoint sensitif (misalnya hapus user, reset password) hanya `admin`.

## E. Validasi Minimal per Modul

Berita:

1. `title` wajib.
2. `content` wajib.
3. `status` hanya `draft` atau `publish`.
4. `slug` unik.

Hero:

1. `image` wajib.
2. `sort_order` angka.

Video:

1. `title` wajib.
2. `youtube_url` wajib dan format URL.

## F. Urutan Implementasi API

1. Buat auth endpoint (`login`, `logout`, `me`).
2. Buat middleware auth dan role.
3. Buat public endpoint (`landing`, `news`, `detail`).
4. Buat CMS endpoint berita dulu.
5. Lanjut hero, video, menu, settings.
6. Tambahkan validasi dan standard error response.

## Kesimpulan

Spesifikasi ini membuat implementasi backend lebih terstruktur. Tim bisa mengerjakan modul per modul tanpa saling tabrakan, dan alur publik serta CMS tetap jelas.
