import { DropdownMenu, LinkProvider, Sidebar, Text } from '@cloudflare/kumo';
import type { LinkComponentProps } from '@cloudflare/kumo';
import {
    CaretUpDownIcon,
    CodeIcon,
    HouseIcon,
    SignOutIcon,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { Link, router, usePage } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { index as dashboardRoute } from '@/actions/App/Http/Controllers/DashboardController';
import SidebarMenuButton from '@/components/sidebar-menu-button';
import SidebarMenuCollapsible from '@/components/sidebar-menu-collapsible';
import { logout } from '@/routes';
import type { User } from '@/types';

type AppLayoutProps = {
    children: ReactNode;
};

type SharedProps = {
    auth: {
        user: User | null;
    };
};

type AccountMenuItem = {
    label: string;
    icon?: Icon;
    onSelect?: () => void;
};

type SidebarNavItem = {
    label: string;
    icon?: Icon;
    href?: string;
    /** Overrides the automatic active state when provided. */
    active?: boolean;
};

/**
 * Placeholder for future account menu items, such as Profile or Settings.
 */
const accountMenuItems: AccountMenuItem[] = [];

/**
 * Sidebar navigation data. Add, remove, or reorder items here to change the
 * sidebar without touching the rendering logic.
 */
const HOME: SidebarNavItem[] = [
    {
        label: 'Dashboard',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    },
    {
        label: 'Dashboard2',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    }
];
const ORDERS: SidebarNavItem[] = [
    {
        label: 'order',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    },
];


function getUserInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function UserAvatar({ user }: { user: User }) {
    if (user.avatar) {
        return (
            <img
                src={user.avatar}
                alt=""
                className="size-7 shrink-0 rounded-full object-cover"
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-kumo-recessed text-xs font-medium text-kumo-default"
        >
            {getUserInitials(user.name)}
        </span>
    );
}

export default function AppLayout({ children }: AppLayoutProps) {
    const page = usePage<SharedProps>();
    const user = page.props.auth?.user ?? null;

    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        // <LinkProvider component={InertiaLink}>
        <Sidebar.Provider
            defaultOpen
            peekable
            className="h-dvh overflow-hidden"
        >
            <Sidebar>
                <Sidebar.Content>
                    {/* home */}
                    <SidebarMenuButton groupLabel="Home" items={HOME} />

                </Sidebar.Content>
                <Sidebar.Footer className="gap-2">
                    {user && (
                        <Sidebar.Menu className="min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden">
                            <Sidebar.MenuItem>
                                <DropdownMenu>
                                    <DropdownMenu.Trigger
                                        render={
                                            <Sidebar.MenuButton
                                                icon={
                                                    <UserAvatar
                                                        user={user}
                                                    />
                                                }
                                                className="h-auto min-h-10 py-1"
                                            >
                                                <span className="grid min-w-0 flex-1 gap-0.5 leading-tight">
                                                    <Text
                                                        as="span"
                                                        bold
                                                        truncate
                                                    >
                                                        {user.name}
                                                    </Text>
                                                    <Text
                                                        as="span"
                                                        variant="secondary"
                                                        size="xs"
                                                        truncate
                                                    >
                                                        {user.email}
                                                    </Text>
                                                </span>
                                                <CaretUpDownIcon className="size-4 shrink-0 text-kumo-subtle" />
                                            </Sidebar.MenuButton>
                                        }
                                    />
                                    <DropdownMenu.Content
                                        side="top"
                                        align="start"
                                        className="w-64"
                                    >
                                        <div className="flex min-w-0 flex-col gap-0.5 px-2 py-1.5">
                                            <Text as="span" bold truncate>
                                                {user.name}
                                            </Text>
                                            <Text
                                                as="span"
                                                variant="secondary"
                                                size="xs"
                                                truncate
                                            >
                                                {user.email}
                                            </Text>
                                        </div>

                                        <DropdownMenu.Separator />

                                        {accountMenuItems.map((item) => (
                                            <DropdownMenu.Item
                                                key={item.label}
                                                icon={item.icon}
                                                onClick={item.onSelect}
                                            >
                                                {item.label}
                                            </DropdownMenu.Item>
                                        ))}

                                        {accountMenuItems.length > 0 && (
                                            <DropdownMenu.Separator />
                                        )}

                                        <DropdownMenu.Item
                                            variant="danger"
                                            icon={SignOutIcon}
                                            onClick={handleLogout}
                                        >
                                            Keluar
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu>
                            </Sidebar.MenuItem>
                        </Sidebar.Menu>
                    )}
                    <Sidebar.Trigger />
                </Sidebar.Footer>
            </Sidebar>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile topbar: the trigger inside the sidebar is unreachable
                        while the sidebar sheet is closed. */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-kumo-line px-2 md:hidden">
                    <Sidebar.Trigger />
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
                    {children}
                </main>
            </div>
        </Sidebar.Provider>
        // </LinkProvider>
    );
}
