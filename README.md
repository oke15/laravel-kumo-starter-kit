# Laravel Kumo Starter Kit

Starter kit **Laravel + Inertia.js + React** dengan UI **Kumo UI** (Cloudflare) dan autentikasi **tanpa password** (Google OAuth). Cocok untuk membangun aplikasi dashboard modern tanpa kompleksitas SPA.

## Stack

- **Backend:** Laravel 13, PHP 8.5
- **Frontend:** React 19, TypeScript, Inertia.js v3
- **UI:** Kumo UI (`@cloudflare/kumo`), Tailwind CSS v4, Phosphor Icons
- **Build:** Vite, Wayfinder
- **Auth:** Laravel Socialite (Google OAuth)
- **QA:** Pest, Larastan, Pint

## Fitur

- Login tanpa password via Google OAuth (akun dibuat otomatis saat pertama masuk).
- Dashboard dengan layout sidebar responsif berbasis Kumo UI.
- Routing frontend type-safe melalui Laravel Wayfinder.
- Contoh feature test untuk login, logout, dan dashboard.

## Kebutuhan

- PHP 8.5+, Composer
- Node.js 22+ dan pnpm
- Database: SQLite (default) atau MySQL/PostgreSQL

## Instalasi

```bash
composer setup   # install, .env, key, migrate, pnpm install, build
php artisan dev  # jalankan server pengembangan
```

Atau manual:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
pnpm install && pnpm run build
```

## Konfigurasi Google OAuth

1. Buat OAuth 2.0 Client ID (Web application) di [Google Cloud Console](https://console.cloud.google.com/).
2. Tambahkan redirect URI: `{APP_URL}/auth/google/callback`.
3. Isi `.env`:

    ```dotenv
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
    ```

## Pengujian

```bash
php artisan test --compact
```

## Lisensi

Dirilis di bawah lisensi [MIT](https://opensource.org/licenses/MIT).
