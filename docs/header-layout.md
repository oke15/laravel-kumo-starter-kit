# Header layout

Layout dengan navigasi di atas (header) sebagai alternatif layout sidebar. Layout ini tetap memakai komponen dan token [Kumo UI](https://www.npmjs.com/package/@cloudflare/kumo), serta mendukung Inertia v3.

Layout dipilih per halaman lewat properti statis `layout`. Halaman yang ingin memakai header cukup memilih `HeaderLayout`, sedangkan halaman yang ingin sidebar memilih `AppLayout`, sehingga kedua layout bisa hidup berdampingan.

## File terkait

| File                                             | Fungsi                                                         |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `resources/js/layouts/header-layout.tsx`         | Layout utama: header, breadcrumbs, dan area konten.            |
| `resources/js/components/header-nav.tsx`         | Navigasi horizontal desktop dan dropdown mobile.               |
| `resources/js/components/header-breadcrumbs.tsx` | Trail breadcrumbs di bawah header.                             |
| `resources/js/components/header-user-menu.tsx`   | Trigger menu akun di header.                                   |
| `resources/js/components/user-menu.tsx`          | Isi dropdown akun dan aksi logout (dipakai juga oleh sidebar). |
| `resources/js/components/user-avatar.tsx`        | Avatar pengguna dengan fallback inisial.                       |
| `resources/js/components/theme-toggle.tsx`       | Toggle tema terang/gelap.                                      |
| `resources/js/lib/navigation.ts`                 | Helper pencocokan path untuk state aktif.                      |

## Cara memakai

### 1. Tetapkan layout pada halaman

Tambahkan `HeaderLayout` sebagai properti statis `layout` pada komponen halaman. Layout per-halaman selalu menang atas layout default di `resources/js/app.tsx` bila default tersebut diaktifkan.

```tsx
import { Head, setLayoutProps } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header-layout';

export default function Contoh() {
    setLayoutProps({ title: 'Contoh' });

    return (
        <>
            <Head title="Contoh" />
            <div className="mx-auto w-full max-w-6xl">
                <p>Konten halaman.</p>
            </div>
        </>
    );
}

Contoh.layout = HeaderLayout;
```

> Gunakan function declaration seperti contoh di atas. Untuk komponen arrow function, Inertia v3 meminta layout dibungkus array: `Contoh.layout = [HeaderLayout];`.

### 2. Atur judul halaman

`setLayoutProps({ title })` mengisi prop `title` pada layout. Nilai ini dipakai untuk breadcrumb terakhir (`Beranda / Contoh`); judul visual halaman tetap dibuat di komponen halaman.

`<Head title="..." />` tetap diperlukan untuk mengatur `<title>` dokumen.

## Props layout

`HeaderLayout` menerima props berikut:

| Prop          | Tipe                                 | Default           | Keterangan                             |
| ------------- | ------------------------------------ | ----------------- | -------------------------------------- |
| `children`    | `ReactNode`                          | —                 | Konten halaman.                        |
| `title`       | `string`                             | —                 | Judul halaman dan breadcrumb terakhir. |
| `breadcrumbs` | `{ label: string; href?: string }[]` | `Beranda / title` | Menimpa trail breadcrumbs otomatis.    |

### Breadcrumbs kustom

Gunakan `setLayoutProps` dengan array `breadcrumbs` jika halaman punya hierarki lebih dari satu level. Item terakhir otomatis dirender sebagai `Breadcrumbs.Current` (bukan link), termasuk jika `href` diisi.

```tsx
setLayoutProps({
    title: 'Detail pengguna',
    breadcrumbs: [
        { label: 'Beranda', href: dashboard.url() },
        { label: 'Pengguna', href: '/pengguna' },
        { label: 'Detail pengguna' },
    ],
});
```

Breadcrumbs juga bisa dirender langsung sebagai komponen:

```tsx
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import { dashboard } from '@/routes';

<HeaderBreadcrumbs
    breadcrumbs={[
        { label: 'Beranda', href: dashboard.url() },
        { label: 'Pengaturan' },
    ]}
/>;
```

## Menambah item navigasi

Item nav didefinisikan di `NAV_ITEMS` pada `resources/js/layouts/header-layout.tsx`.

```tsx
import { HouseIcon, GearIcon } from '@phosphor-icons/react';
import { dashboard } from '@/routes';
import type { HeaderNavItem } from '@/components/header-nav';

const NAV_ITEMS: HeaderNavItem[] = [
    {
        label: 'Dashboard',
        href: dashboard.url(),
        icon: HouseIcon,
    },
    {
        label: 'Pengaturan',
        href: '/pengaturan',
        icon: GearIcon,
    },
];
```

- `label` — teks yang tampil di desktop dan menu mobile.
- `href` — URL tujuan; gunakan helper Wayfinder (`dashboard.url()`, `routeLain.url()`) agar tidak hardcode.
- `icon` — ikon Phosphor; dipakai di dropdown mobile.

State aktif dihitung otomatis dari pathname saat ini. Item yang cocok mendapat gaya `bg-kumo-tint text-kumo-strong`; di desktop item tersebut juga diberi `aria-current="page"`.

Di layar `md` ke atas item tampil horizontal. Di bawah `md`, item masuk ke dropdown yang dipicu tombol menu.
