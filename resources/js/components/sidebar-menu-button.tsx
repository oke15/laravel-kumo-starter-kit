import { Sidebar } from '@cloudflare/kumo';
import type { Icon } from '@phosphor-icons/react';

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
function getActiveState(href: string | undefined): boolean {
    if (!href) {
        return false;
    }
    const currentPath = window.location.pathname;
    const linkPath = new URL(href, window.location.origin).pathname;
    return currentPath === linkPath;
}
/**
 * Single navigation entry in the sidebar that links directly to a page.
 * Kumo auto-wraps this in a `Sidebar.MenuItem`.
 */
export default function SidebarMenuButton({ groupLabel, items }: props) {
    return (
        <Sidebar.Group>
            <Sidebar.GroupLabel>{groupLabel ?? ''}</Sidebar.GroupLabel>
            <Sidebar.Menu>
                {items.map((item) => (
                    <Sidebar.MenuButton
                        key={item.label}
                        icon={item.icon}
                        href={item.href}
                        active={item.active ?? getActiveState(item.href)}
                    >
                        {item.label}
                    </Sidebar.MenuButton>
                ))}
            </Sidebar.Menu>
        </Sidebar.Group>
    );
}
