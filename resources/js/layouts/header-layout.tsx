import { LinkButton, Text } from '@cloudflare/kumo';
import { LayoutIcon, SquaresFourIcon } from '@phosphor-icons/react';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import type { BreadcrumbItem } from '@/components/header-breadcrumbs';
import HeaderUserMenu from '@/components/header-user-menu';
import { HeaderMobileNav, HeaderNav } from '@/components/header-nav';
import type { HeaderNavItem } from '@/components/header-nav';
import KumoInertiaLinkProvider from '@/components/kumo-inertia-link';
import ThemeToggle from '@/components/theme-toggle';
import { dashboard } from '@/routes';
import type { User } from '@/types';

type HeaderLayoutProps = {
    children: ReactNode;
    /** Page title, also used as the last breadcrumb. */
    title?: string;
    /** Overrides the generated breadcrumb trail when provided. */
    breadcrumbs?: BreadcrumbItem[];
};

type SharedProps = {
    name: string;
    auth: {
        user: User | null;
    };
};

/**
 * Primary navigation for the header layout. Add, remove, or reorder items here
 * to change the header without touching the rendering logic.
 */
const NAV_ITEMS: HeaderNavItem[] = [
    {
        label: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutIcon,
    },
];

/**
 * Top-navigation layout. Pages opt in by assigning this component to their
 * static `layout` property, so the sidebar layout stays the default.
 */
export default function HeaderLayout({
    children,
    title,
    breadcrumbs,
}: HeaderLayoutProps) {
    const page = usePage<SharedProps>();
    const user = page.props.auth?.user ?? null;
    const appName = page.props.name ?? 'Aplikasi';

    return (
        <KumoInertiaLinkProvider>
            <div className="flex min-h-dvh flex-col bg-kumo-base text-kumo-default">
                <header className="sticky top-0 z-40 border-b border-kumo-line bg-kumo-base">
                    <div className="flex h-14 w-full items-center gap-2 px-4 md:px-6">
                        <LinkButton
                            href={dashboard.url()}
                            variant="ghost"
                            className="gap-2 px-2 text-sm text-kumo-strong"
                        >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-kumo-contrast text-kumo-inverse">
                                <SquaresFourIcon
                                    className="size-3.5"
                                    weight="fill"
                                />
                            </span>
                            <Text as="span" bold truncate>
                                {appName}
                            </Text>
                        </LinkButton>

                        <HeaderNav items={NAV_ITEMS} />

                        <div className="ml-auto flex items-center gap-1">
                            <ThemeToggle />
                            {user && <HeaderUserMenu user={user} />}
                            <HeaderMobileNav items={NAV_ITEMS} />
                        </div>
                    </div>
                </header>

                <div className="border-b border-kumo-line bg-kumo-base">
                    <div className="px-4 py-1 md:px-6">
                        <HeaderBreadcrumbs
                            title={title}
                            breadcrumbs={breadcrumbs}
                        />
                    </div>
                </div>

                <main className="min-w-0 flex-1 px-4 py-6 md:px-6">
                    {children}
                </main>
            </div>
        </KumoInertiaLinkProvider>
    );
}
