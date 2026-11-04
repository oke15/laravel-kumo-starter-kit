import { Head, Link } from '@inertiajs/react';
import { Banner, buttonVariants, cn, LayerCard, Text } from '@cloudflare/kumo';
import { redirect as googleRedirect } from '@/routes/auth/google';
import { show as otpShow } from '@/routes/otp';
import { KeyIcon } from '@phosphor-icons/react';

type LoginProps = {
    flash?: {
        error?: string | null;
    };
};

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
            />
        </svg>
    );
}

export default function Login({ flash }: LoginProps) {
    return (
        <>
            <Head title="Masuk" />

            <main className="flex min-h-screen items-center justify-center bg-kumo-canvas px-4 py-12 text-kumo-default">
                <div className="w-full max-w-sm">
                    <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
                        <Text as="h1" variant="heading" size="lg">
                            Masuk ke akun Anda
                        </Text>
                        <Text variant="secondary">
                            Gunakan akun Google atau OTP untuk melanjutkan.
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
                        <a
                            href={googleRedirect.url()}
                            className={cn(
                                buttonVariants({
                                    variant: 'secondary',
                                    size: 'lg',
                                }),
                                'w-full justify-center text-sm',
                            )}
                        >
                            <GoogleIcon />
                            Masuk dengan Google
                        </a>

                        <div className="pt-4 text-center">
                            <Text variant="secondary">
                                <Link
                                    href={otpShow.url()}
                                    className={cn(
                                        buttonVariants({
                                            variant: 'secondary',
                                            size: 'lg',
                                        }),
                                        'w-full justify-center text-sm',
                                    )}
                                >
                                    <KeyIcon />
                                    Masuk dengan kode OTP
                                </Link>
                            </Text>
                        </div>
                        <div className="mt-4 text-center">
                            <Text variant="secondary">
                                Akun akan dibuat otomatis saat pertama kali
                                masuk.
                            </Text>
                        </div>
                    </LayerCard>
                </div>
            </main>
        </>
    );
}
