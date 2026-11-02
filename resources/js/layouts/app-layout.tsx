import { Sidebar } from '@cloudflare/kumo';
import { HouseIcon, ListIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { index as dashboardRoute } from '@/actions/App/Http/Controllers/DashboardController';
import SidebarMenuButton from '@/components/sidebar-menu-button';
import SidebarMenuCollapsible from '@/components/sidebar-menu-collapsible';
import type { User } from '@/types';
import SidebarFooter from '@/components/sidebar-footer';

type AppLayoutProps = {
    children: ReactNode;
};

type SharedProps = {
    auth: {
        user: User | null;
    };
};

type SidebarNavItem = {
    label: string;
    icon?: Icon;
    href?: string;
    /** Overrides the automatic active state when provided. */
    active?: boolean;
};

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
];
const ORDERS: SidebarNavItem[] = [
    {
        label: 'order',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    },
    {
        label: 'order2',
        icon: HouseIcon,
        href: dashboardRoute.url(),
    },
];

export default function AppLayout({ children }: AppLayoutProps) {
    const page = usePage<SharedProps>();
    const user = page.props.auth?.user ?? null;

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
                    {/* orders */}
                    <SidebarMenuCollapsible
                        items={ORDERS}
                        collapseLabel="Order"
                        collapsibleIcon={ListIcon}
                    />
                </Sidebar.Content>
                <Sidebar.Footer className="gap-2">
                    {user && <SidebarFooter user={user} />}
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
