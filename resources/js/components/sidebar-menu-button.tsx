import { Sidebar } from '@cloudflare/kumo';
import { usePage } from '@inertiajs/react';
import type { Icon } from '@phosphor-icons/react';
import KumoInertiaLinkProvider from '@/components/kumo-inertia-link';

type item = {
    label: string;
    icon?: Icon;
    href?: string;
    active?: boolean;
};
type props = {
    groupLabel: string;
    items: item[];
};
function getActiveState(
    href: string | undefined,
    currentPath: string,
): boolean {
    if (!href) {
        return false;
    }

    return new URL(href, 'http://localhost').pathname === currentPath;
}
/**
 * Single navigation entry in the sidebar that links directly to a page.
 * Kumo auto-wraps this in a `Sidebar.MenuItem`. Links navigate client-side
 * through Inertia.
 */
export default function SidebarMenuButton({ groupLabel, items }: props) {
    const { url } = usePage();
    const currentPath = new URL(url, 'http://localhost').pathname;

    return (
        <KumoInertiaLinkProvider>
            <Sidebar.Group>
                <Sidebar.GroupLabel>{groupLabel ?? ''}</Sidebar.GroupLabel>
                <Sidebar.Menu>
                    {items.map((item) => (
                        <Sidebar.MenuButton
                            key={item.label}
                            icon={item.icon}
                            href={item.href}
                            active={
                                item.active ??
                                getActiveState(item.href, currentPath)
                            }
                        >
                            {item.label}
                        </Sidebar.MenuButton>
                    ))}
                </Sidebar.Menu>
            </Sidebar.Group>
        </KumoInertiaLinkProvider>
    );
}
