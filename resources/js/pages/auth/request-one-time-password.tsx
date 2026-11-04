import { Banner, Button, Input, LayerCard, Text } from '@cloudflare/kumo';
import { Head, Link, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import { send } from '@/actions/App/Http/Controllers/Auth/OneTimePasswordController';
import { login } from '@/routes';

type RequestOneTimePasswordProps = {
    flash?: {
        error?: string | null;
    };
};

export default function RequestOneTimePassword({
    flash,
}: RequestOneTimePasswordProps) {
    const form = useForm({ email: '' });

    function submit(event: SubmitEvent) {
        event.preventDefault();

        form.post(send.url(), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Masuk dengan kode sekali pakai" />

            <main className="flex min-h-screen items-center justify-center bg-kumo-canvas px-4 py-12 text-kumo-default">
                <div className="w-full max-w-sm">
                    <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
                        <Text as="h1" variant="heading" size="lg">
                            Masuk dengan kode sekali pakai
                        </Text>
                        <Text variant="secondary">
                            Masukkan email Anda dan kami akan mengirim kode 6
                            digit.
                        </Text>
                    </div>

                    {flash?.error && (
                        <Banner
                            variant="error"
                            size="sm"
                            role="alert"
                            className="mb-4"
                        >
                            {flash.error}
                        </Banner>
                    )}

                    <LayerCard className="rounded-xl px-5 py-6">
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                placeholder="anda@contoh.com"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                error={form.errors.email}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full justify-center text-sm"
                                disabled={form.processing}
                            >
                                {form.processing ? 'Mengirim...' : 'Kirim kode'}
                            </Button>

                            <div className="text-center">
                                <Text variant="secondary">
                                    <Link
                                        href={login.url()}
                                        className="text-kumo-strong underline-offset-2 hover:underline"
                                    >
                                        Kembali ke halaman masuk
                                    </Link>
                                </Text>
                            </div>
                        </form>
                    </LayerCard>
                </div>
            </main>
        </>
    );
}
