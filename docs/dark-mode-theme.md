# Dark mode & tema

Starter kit ini mendukung mode terang dan gelap. Sistemnya memakai **dua mekanisme yang harus selalu berjalan bersama**:

1. **Atribut `data-mode`** pada `<html>` — dibaca oleh token [Kumo UI](https://www.npmjs.com/package/@cloudflare/kumo) (`[data-mode="dark"]`).
2. **Class `dark`** pada `<html>` — dibaca oleh varian `dark:` milik Tailwind CSS.

Keduanya diatur dari satu tempat (`applyTheme`) agar token Kumo dan utility Tailwind tidak pernah berbeda mode.

## File terkait

| File                                         | Fungsi                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| `resources/css/app.css`                      | Varian `dark:`, impor tema Kumo, dan override palet gelap.      |
| `resources/views/app.blade.php`              | Script inline untuk menerapkan tema sebelum paint (anti-flash). |
| `resources/js/components/theme-toggle.tsx`   | Tombol toggle terang/gelap dan fungsi `applyTheme`.             |
| `resources/js/layouts/header-layout.tsx`     | Menampilkan `ThemeToggle` di header.                            |
| `resources/js/components/sidebar-footer.tsx` | Menampilkan `ThemeToggle` di footer sidebar.                    |

## Cara kerja

### 1. Tema awal diterapkan sebelum halaman di-render

Script inline di `head` `resources/views/app.blade.php` berjalan sebelum React dan CSS di-paint, sehingga tidak ada kedipan tema:

```blade
<script>
    (function () {
        try {
            const stored = localStorage.getItem('theme');
            const dark = stored
                ? stored === 'dark'
                : window.matchMedia('(prefers-color-scheme: dark)').matches;

            document.documentElement.dataset.mode = dark ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', dark);
        } catch (error) {
            // Storage can be unavailable; fall back to the light theme.
        }
    })();
</script>
```

Aturannya:

- Kunci `localStorage` adalah `theme` dengan nilai `'light'` atau `'dark'`.
- Jika belum ada pilihan tersimpan, tema mengikuti preferensi sistem (`prefers-color-scheme`).
- Jika `localStorage` tidak tersedia (mode privat, cookie diblokir), aplikasi jatuh ke tema terang tanpa error.

### 2. Varian `dark:` Tailwind

Di `resources/css/app.css`, varian `dark:` diarahkan ke class `.dark` (bukan media query `prefers-color-scheme`), sehingga toggle manual selalu menang:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Karena itu, `dark:` boleh dipakai di komponen mana pun tanpa konfigurasi tambahan:

```tsx
<div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
    Konten
</div>
```

> Jangan menambah `@media (prefers-color-scheme: dark)` sendiri. Preferensi sistem sudah ditangani di script `app.blade.php`; menambah media query akan membuat mode manual dan mode sistem bertabrakan.

### 3. Token Kumo

`resources/css/app.css` mengimpor tema Kumo:

```css
@source "../../node_modules/@cloudflare/kumo/dist/**/*.{js,jsx,ts,tsx}";
@import '@cloudflare/kumo/styles/tailwind';
@import 'tailwindcss';
```

Token seperti `--color-kumo-canvas`, `--color-kumo-base`, dan `--text-color-kumo-default` sudah punya nilai terang dan gelap sendiri. Kumo mengaktifkan nilai gelap lewat selector `[data-mode="dark"]`, jadi cukup pakai utility token-nya (`bg-kumo-canvas`, `text-kumo-subtle`, dan seterusnya) — nilainya otomatis menyesuaikan mode.

### 4. Toggle saat runtime

`ThemeToggle` (`resources/js/components/theme-toggle.tsx`) membaca mode aktif dari `document.documentElement` saat mount, lalu menulis ulang lewat `applyTheme` ketika diklik:

```tsx
function applyTheme(theme: Theme): void {
    const root = document.documentElement;

    root.dataset.mode = theme;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
}
```

Pasang toggle di tempat baru cukup dengan merender komponennya:

```tsx
import ThemeToggle from '@/components/theme-toggle';

<ThemeToggle />;
```

Prop opsional `className` dipakai untuk styling dari luar, misalnya menyembunyikan tombol saat sidebar collapsed:

```tsx
<ThemeToggle className="group-data-[state=collapsed]/sidebar:hidden" />
```

> Jika ingin memakai tombol milik sendiri, panggil `applyTheme` dari file komponen ini — jangan mengubah `data-mode` atau class `dark` secara langsung. Hanya mengubah salah satunya akan membuat token Kumo dan utility `dark:` tidak sinkron.

## Menyesuaikan palet gelap

Palet gelap default Kumo sangat pekat (canvas sekitar `oklch(10%)`). `resources/css/app.css` menimpanya lewat blok `:root[data-mode='dark']` di bagian bawah file. Hanya mode gelap yang disentuh; mode terang tetap memakai default Kumo.

Blok yang aktif saat ini memakai palet **"GitHub soft dark" (dimmed)** — permukaan abu-abu kebiruan (hue sekitar `257`) yang lebih lembut:

```css
:root[data-mode='dark'] {
    --color-kumo-canvas: oklch(31.5% 0.018 258);
    --color-kumo-elevated: oklch(34% 0.019 258);
    --color-kumo-recessed: oklch(36.5% 0.019 257);
    --color-kumo-base: oklch(38.5% 0.019 257);
    --color-kumo-control: oklch(41% 0.02 257);
    --color-kumo-overlay: oklch(43% 0.021 257);
    --color-kumo-tint: oklch(43% 0.021 257);
    --color-kumo-fill: oklch(43% 0.021 257);
    --color-kumo-hairline: oklch(43% 0.021 257);
    --color-kumo-line: oklch(47% 0.022 256);
    --color-kumo-fill-hover: oklch(50% 0.024 256);
    --color-kumo-interact: oklch(50% 0.024 256);
    --color-kumo-arrow-stroke: oklch(47% 0.022 256);
}
```

Panduan menyesuaikan:

- **Lightness** (persentase pertama) adalah knob utama: naikkan untuk menerangkan permukaan.
- Urutan permukaan harus tetap sama agar hierarki visual terjaga:
  `canvas < elevated < recessed < base < control < overlay < line < fill-hover`.
- **Chroma** (angka kedua, contoh `0.018`) mengatur kejenuhan. Isi `0` untuk netral abu-abu murni.
- **Hue** (angka ketiga, contoh `258`) mengatur cast warna. `258` memberi kesan biru-kelabu, sedangkan hue netral membuat abu-abu murni.

Di file yang sama tersedia blok alternatif **softened dark** (netral abu-abu, semua chroma `0`) yang saat ini dikomentari. Untuk mencobanya, komentari blok GitHub soft dark dan aktifkan blok tersebut:

```css
:root[data-mode='dark'] {
    --color-kumo-canvas: oklch(18% 0 0);
    --color-kumo-elevated: oklch(20% 0 0);
    --color-kumo-recessed: oklch(22% 0 0);
    --color-kumo-base: oklch(24% 0 0);
    --color-kumo-control: oklch(28% 0 0);
    --color-kumo-overlay: oklch(32% 0 0);
    --color-kumo-tint: oklch(32% 0 0);
    --color-kumo-fill: oklch(32% 0 0);
    --color-kumo-hairline: oklch(32% 0 0);
    --color-kumo-line: oklch(37% 0 0);
    --color-kumo-fill-hover: oklch(42% 0 0);
    --color-kumo-interact: oklch(42% 0 0);
    --color-kumo-arrow-stroke: oklch(37% 0 0);
}
```

> Jangan mengaktifkan dua blok `:root[data-mode='dark']` sekaligus. Yang terakhir dibaca akan menang dan membuat palet sulit diprediksi.

## Catatan

- Setelah mengubah `resources/css/app.css`, jalankan `pnpm run build` (atau `pnpm run dev`) agar hasilnya terlihat di browser.
- Kunci `localStorage` `theme` dipakai bersama oleh script di `app.blade.php` dan `theme-toggle.tsx`. Jika salah satu diubah, ubah keduanya.
- `data-mode` mengontrol token Kumo, sedangkan class `dark` mengontrol utility `dark:` Tailwind. Keduanya wajib diubah bersamaan lewat `applyTheme`.
- Label aksesibilitas tombol sudah mengikuti bahasa aplikasi (`Aktifkan tema terang` / `Aktifkan tema gelap`) melalui `aria-label`.
