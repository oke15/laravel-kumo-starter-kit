import { Banner, Button, Input, LayerCard, Text } from '@cloudflare/kumo';
import { Head, Link, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import {
    send,
    verify,
} from '@/actions/App/Http/Controllers/Auth/OneTimePasswordController';
import { show as otpShow } from '@/routes/otp';

type VerifyOneTimePasswordProps = {
    email: string;
    flash?: {
        status?: string | null;
        error?: string | null;
    };
};

export default function VerifyOneTimePassword({
    email,
    flash,
}: VerifyOneTimePasswordProps) {
    const form = useForm({ email, one_time_password: '' });
    const resendForm = useForm({ email });

    function submit(event: SubmitEvent) {
        event.preventDefault();

        form.post(verify.url(), {
            preserveScroll: true,
            onError: () => form.reset('one_time_password'),
        });
    }

    function resendCode() {
        resendForm.post(send.url(), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Verifikasi kode sekali pakai" />

            <main className="flex min-h-screen items-center justify-center bg-kumo-canvas px-4 py-12 text-kumo-default">
                <div className="w-full max-w-sm">
                    <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
                        <Text as="h1" variant="heading" size="lg">
                            Masukkan kode sekali pakai
                        </Text>
                        <Text variant="secondary">
                            Kami mengirim kode ke {email}.
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

                    {flash?.status && (
                        <Banner
                            variant="default"
                            size="sm"
                            role="status"
                            className="mb-4"
                        >
                            {flash.status}
                        </Banner>
                    )}

                    <LayerCard className="rounded-xl px-5 py-6">
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <Input
                                label="Kode sekali pakai"
                                name="one_time_password"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                autoFocus
                                maxLength={6}
                                placeholder="000000"
                                value={form.data.one_time_password}
                                onChange={(event) =>
                                    form.setData(
                                        'one_time_password',
                                        event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6),
                                    )
                                }
                                error={form.errors.one_time_password}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full justify-center text-sm"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Memverifikasi...'
                                    : 'Verifikasi'}
                            </Button>

                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={resendCode}
                                    disabled={resendForm.processing}
                                >
                                    {resendForm.processing
                                        ? 'Mengirim...'
                                        : 'Kirim ulang kode'}
                                </Button>

                                <Text variant="secondary">
                                    <Link
                                        href={otpShow.url()}
                                        className="text-kumo-strong underline-offset-2 hover:underline"
                                    >
                                        Gunakan email lain
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
