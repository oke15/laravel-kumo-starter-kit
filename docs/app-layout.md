# App layout

Layout dengan navigasi di samping (sidebar). Layout ini memakai komponen [Kumo UI](https://www.npmjs.com/package/@cloudflare/kumo) dan mendukung Inertia v3. Navigasi sidebar memakai `Sidebar.Provider` yang bisa di-collapse, di-peek, dan otomatis berubah menjadi sheet di layar kecil.

Layout dipilih per halaman lewat properti statis `layout`. Halaman yang ingin sidebar memilih `AppLayout`, sedangkan halaman yang ingin header memilih `HeaderLayout` (lihat [`header-layout.md`](./header-layout.md)), sehingga kedua layout bisa hidup berdampingan.

## File terkait

| File                                              | Fungsi                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `resources/js/layouts/app-layout.tsx`             | Layout utama: sidebar, footer pengguna, topbar mobile, dan area konten. |
| `resources/js/components/sidebar-menu-button.tsx` | Grup menu sidebar dan penentuan state aktif.                            |
| `resources/js/components/sidebar-footer.tsx`      | Kartu pengguna di footer sidebar beserta menu akun.                     |
| `resources/js/components/kumo-inertia-link.tsx`   | Menghubungkan link Kumo ke navigasi client-side Inertia.                |

## Cara memakai

### 1. Tetapkan layout pada halaman

Tambahkan `AppLayout` sebagai properti statis `layout` pada komponen halaman.

```tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Contoh() {
    return (
        <>
            <Head title="Contoh" />
            <div className="mx-auto w-full max-w-6xl">
                <p>Konten halaman.</p>
            </div>
        </>
    );
}

Contoh.layout = AppLayout;
```

> Gunakan function declaration seperti contoh di atas. Untuk komponen arrow function, Inertia v3 meminta layout dibungkus array: `Contoh.layout = [AppLayout];`.

`AppLayout` hanya menerima `children`, jadi tidak perlu memanggil `setLayoutProps`. Judul dokumen tetap diatur lewat `<Head title="..." />` di komponen halaman.

### 2. Tulis konten halaman

`AppLayout` sudah menyediakan `<main>` dengan padding dan scroll sendiri (`h-dvh` + `overflow-y-auto`). Konten halaman tidak perlu lagi memakai `min-h-screen`; cukup bungkus isi dengan container seperti contoh di atas.

### 3. Menambah item navigasi

Item sidebar didefinisikan di `HOME` pada `resources/js/layouts/app-layout.tsx`.

```tsx
import { HouseIcon, GearIcon } from '@phosphor-icons/react';
import { index as dashboardRoute } from '@/actions/App/Http/Controllers/DashboardController';

const HOME: SidebarNavItem[] = [
    {
        label: 'Dashboard',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    },
    {
        label: 'Pengaturan',
        icon: GearIcon,
        href: '/pengaturan',
    },
];
```

- `label` — teks menu sekaligus `key` saat render.
- `href` — URL tujuan; gunakan helper Wayfinder (`dashboardRoute.url()`, `routeLain.url()`) agar tidak hardcode.
- `icon` — ikon Phosphor yang tampil di samping label.
- `active` — opsional; isi hanya jika ingin menimpa state aktif otomatis.

Untuk mengelompokkan menu lain, tambahkan pemanggilan `SidebarMenuButton` dengan `groupLabel` berbeda di dalam `Sidebar.Content`:

```tsx
<Sidebar.Content>
    <SidebarMenuButton groupLabel="Home" items={HOME} />
    <SidebarMenuButton groupLabel="Pengaturan" items={SETTINGS} />
</Sidebar.Content>
```

### 4. State aktif

State aktif dihitung otomatis dari pathname halaman saat ini dan dicocokkan persis dengan `href` (query string diabaikan). Item yang cocok mendapat gaya aktif dari Kumo.

Gunakan `active` untuk menimpa hasil otomatis, misalnya saat satu menu harus selalu tampil aktif:

```tsx
const SETTINGS: SidebarNavItem[] = [
    {
        label: 'Pengguna',
        icon: UsersIcon,
        href: '/pengguna',
        active: true,
    },
];
```

Jika satu menu mencakup banyak subpath (misalnya `/pengguna`, `/pengguna/1`, `/pengguna/1/edit`), hitung `active` di dalam komponen yang memakai `usePage()`:

```tsx
import { usePage } from '@inertiajs/react';

function Sidebar() {
    const { url } = usePage();
    const currentPath = new URL(url, 'http://localhost').pathname;

    const settings: SidebarNavItem[] = [
        {
            label: 'Pengguna',
            icon: UsersIcon,
            href: '/pengguna',
            active: currentPath.startsWith('/pengguna'),
        },
    ];

    return <SidebarMenuButton groupLabel="Pengaturan" items={settings} />;
}
```

### 5. Footer pengguna

Footer sidebar otomatis menampilkan pengguna yang sedang login dari shared prop `auth.user`, lengkap dengan menu akun dan aksi logout. Tidak ada yang perlu diatur di halaman; cukup pastikan controller membagikan `auth.user` seperti biasa.

Jika `auth.user` bernilai `null`, footer pengguna tidak dirender dan hanya tombol collapse sidebar yang tampil.

### 6. Perilaku mobile

Di bawah breakpoint `md`, sidebar berubah menjadi sheet. Karena trigger di dalam sidebar tidak terjangkau saat sheet tertutup, `AppLayout` menampilkan topbar mobile berisi `Sidebar.Trigger`. Tidak ada konfigurasi tambahan yang dibutuhkan.

### 7. Menjadikan layout default (opsional)

Halaman yang tidak mendefinisikan `layout` tidak memakai layout apa pun. Untuk menjadikan `AppLayout` sebagai default global, aktifkan opsi `layout` di `resources/js/app.tsx`:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) =>
        name === 'welcome' || name.startsWith('auth/') ? undefined : AppLayout,
});
```

Layout per-halaman tetap menang atas default ini, sehingga halaman yang memilih `HeaderLayout` tidak terpengaruh.

## Props layout

| Prop       | Tipe        | Default | Keterangan      |
| ---------- | ----------- | ------- | --------------- |
| `children` | `ReactNode` | —       | Konten halaman. |

## Catatan

- Layout memakai tinggi viewport penuh (`h-dvh`) dan mengunci scroll di level layout; area konten yang scroll ada di dalam `<main>`.
- Semua link Kumo di dalam layout bernavigasi client-side lewat Inertia melalui `KumoInertiaLinkProvider`.
- Untuk navigasi di atas (header), gunakan `HeaderLayout` seperti dijelaskan di [`header-layout.md`](./header-layout.md).
