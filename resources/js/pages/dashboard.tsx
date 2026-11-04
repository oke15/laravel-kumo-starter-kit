import { LayerCard, Text } from '@cloudflare/kumo';
import { Head, setLayoutProps } from '@inertiajs/react';

const stats = [
    { label: 'Total pengguna', value: '—' },
    { label: 'Sesi aktif', value: '—' },
    { label: 'Permintaan hari ini', value: '—' },
];

export default function Dashboard() {
    setLayoutProps({ title: 'Dashboard' });

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <div className="grid gap-1.5">
                    <Text as="h2" variant="heading" size="lg">
                        Selamat datang
                    </Text>
                    <Text variant="secondary">
                        Ringkasan aktivitas platform akan tampil di sini.
                    </Text>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <LayerCard key={stat.label} className="px-5 py-4">
                            <div className="grid gap-1">
                                <Text variant="secondary" size="sm">
                                    {stat.label}
                                </Text>
                                <Text variant="heading" size="lg" as="p">
                                    {stat.value}
                                </Text>
                            </div>
                        </LayerCard>
                    ))}
                </div>

                <LayerCard className="px-5 py-4">
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-1">
                            <Text as="h3" variant="heading">
                                Aktivitas terbaru
                            </Text>
                            <Text variant="secondary" size="sm">
                                Belum ada aktivitas untuk ditampilkan.
                            </Text>
                        </div>
                        <div className="flex min-h-32 items-center justify-center rounded-lg bg-kumo-recessed">
                            <Text variant="secondary" size="sm">
                                Data aktivitas akan muncul di sini.
                            </Text>
                        </div>
                    </div>
                </LayerCard>
            </div>
        </>
    );
}
