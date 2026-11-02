# Laravel Kumo Starter Kit

Starter kit **Laravel + Inertia.js + React** dengan antarmuka **Kumo UI** (Cloudflare). Cocok untuk membangun aplikasi dashboard modern dengan SPA yang tetap memakai pola routing dan controller Laravel.

Autentikasi dirancang **tanpa password** (_passwordless_): pengguna masuk dengan **Google OAuth** dan **kode OTP email**. Tidak ada registrasi manual, halaman lupa password, maupun pengelolaan password di aplikasi ini.

## Stack

| Lapisan      | Teknologi                                                     |
| ------------ | ------------------------------------------------------------- |
| Backend      | Laravel 13, PHP 8.3+                                          |
| Frontend     | React 19, TypeScript, Inertia.js v3                           |
| UI           | Kumo UI (`@cloudflare/kumo`), Tailwind CSS v4, Phosphor Icons |
| Build        | Vite (vite-plus), Wayfinder                                   |
| Auth         | Laravel Socialite (Google OAuth)                              |
| Testing & QA | Pest 5, Larastan, Laravel Pint                                |

## Fitur

- **Login tanpa password** melalui Google OAuth.
- **Kode OTP email** sebagai metode autentikasi kedua (lihat [Status autentikasi](#status-autentikasi)).
- Akun dibuat otomatis saat pertama kali masuk; akun lama ditautkan berdasarkan email.
- Dashboard dengan layout sidebar responsif berbasis Kumo UI.
- Routing frontend bertipe (type-safe) melalui **Laravel Wayfinder**.
- Sudah dilengkapi contoh feature test untuk login, logout, dan dashboard.

## Kebutuhan

- PHP **8.3+** dengan ekstensi standar Laravel
- [Composer](https://getcomposer.org/)
- Node.js **22+** dan [pnpm](https://pnpm.io/)
- Database: **SQLite** (default) atau MySQL/PostgreSQL

## Instalasi

### Cara cepat

```bash
composer setup
```

Perintah tersebut menjalankan `composer install`, menyalin `.env`, membuat application key, migrasi database, `pnpm install`, dan `pnpm run build`.

### Langkah manual

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
pnpm install
pnpm run build
```

Jalankan server pengembangan:

```bash
composer dev
```

Atau jalankan terpisah:

```bash
php artisan serve
pnpm run dev
```

## Konfigurasi Google OAuth

1. Buat project di [Google Cloud Console](https://console.cloud.google.com/) lalu aktifkan **Google Identity / OAuth consent screen**.
2. Buat kredensial **OAuth 2.0 Client ID** bertipe _Web application_.
3. Tambahkan **Authorized redirect URI**:

    ```text
    {APP_URL}/auth/google/callback
    ```

    Contoh untuk lokal: `http://localhost:8000/auth/google/callback`

4. Isi variabel berikut di `.env`:

    ```dotenv
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
    ```

5. Untuk pengembangan lokal, `GOOGLE_ACCOUNT_DEV` dapat diisi dengan email Google Anda. Seeder memakai email tersebut agar akun hasil seeding otomatis tertaut saat login:

    ```dotenv
    GOOGLE_ACCOUNT_DEV="you@gmail.com"
    ```

    Lalu jalankan:

    ```bash
    php artisan db:seed
    ```

## Status autentikasi

| Metode                    | Status          |
| ------------------------- | --------------- |
| Google OAuth              | Aktif           |
| OTP email                 | Direncanakan    |
| Password / reset password | Tidak digunakan |

Alur Google OAuth yang sudah berjalan:

1. Pengguna membuka `/login` lalu menekan **Masuk dengan Google**.
2. `LoginWithGoogleController@redirect` mengarahkan ke halaman persetujuan Google.
3. `LoginWithGoogleController@callback` membuat atau memperbarui pengguna berdasarkan email, menautkan `google_id`, lalu memulai sesi.
4. Pengguna diarahkan ke `/dashboard`. Halaman ini dilindungi middleware `auth` dan `verified`.

Karena aplikasi tidak memakai password, tabel `users` tidak memiliki kolom password dan tidak ada endpoint registrasi, lupa password, atau ubah password.

## Perintah yang tersedia

| Perintah                     | Fungsi                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `composer dev`               | Server pengembangan lengkap (Laravel + Vite/queue/log) |
| `pnpm run dev`               | Vite dev server                                        |
| `pnpm run build`             | Build aset produksi                                    |
| `pnpm run build:ssr`         | Build aset termasuk SSR                                |
| `pnpm run check`             | Lint & format check frontend                           |
| `pnpm run check:fix`         | Perbaiki otomatis masalah lint/format                  |
| `pnpm run types:check`       | Pemeriksaan TypeScript                                 |
| `composer lint`              | Pint (format PHP)                                      |
| `composer types:check`       | Larastan / PHPStan                                     |
| `composer test`              | Lint check, type check, dan seluruh test               |
| `php artisan test --compact` | Menjalankan test                                       |

## Struktur penting

```text
app/
├── Http/Controllers/Auth/
│   ├── AuthController.php             # Halaman login & logout
│   └── LoginWithGoogleController.php  # Redirect & callback Google
├── Http/Middleware/HandleInertiaRequests.php
└── Models/User.php

resources/js/
├── app.tsx                            # Entry point Inertia + layout
├── layouts/app-layout.tsx             # Sidebar Kumo UI
├── pages/
│   ├── auth/login.tsx
│   ├── dashboard.tsx
│   └── welcome.tsx
├── actions/                           # Generated oleh Wayfinder
└── routes/                            # Generated oleh Wayfinder

routes/web.php                         # Definisi route
tests/Feature/                         # Feature test
```

## Route utama

| Method | URI                     | Nama                   | Keterangan                     |
| ------ | ----------------------- | ---------------------- | ------------------------------ |
| GET    | `/`                     | `home`                 | Halaman sambutan               |
| GET    | `/login`                | `login`                | Halaman login (hanya tamu)     |
| POST   | `/logout`               | `logout`               | Keluar (butuh login)           |
| GET    | `/auth/google/redirect` | `auth.google.redirect` | Mulai OAuth Google             |
| GET    | `/auth/google/callback` | `auth.google.callback` | Callback OAuth Google          |
| GET    | `/dashboard`            | `dashboard`            | Dashboard (`auth`, `verified`) |

## Pengujian

```bash
# Seluruh test
php artisan test --compact

# Test tertentu
php artisan test --compact tests/Feature/LoginWithGoogleTest.php
```

## Roadmap

- Implementasi login OTP email (kirim kode, verifikasi, masa berlaku, dan rate limit).
- Halaman profil dan pengaturan akun (tanpa fitur password).
- Manajemen peran pengguna (`UserRole`: User, Admin, Super Admin).

## Lisensi

Dirilis di bawah lisensi [MIT](https://opensource.org/licenses/MIT).
