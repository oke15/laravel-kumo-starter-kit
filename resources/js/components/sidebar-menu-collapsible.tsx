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
    items: item[];
    groupLabel?: string;
    collapseLabel?: string;
    collapsibleIcon?: Icon;
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
 * Grouped sidebar navigation. Items with nested `items` render as collapsible
 * sections that auto-open when one of their children is active, while items
 * without children render as direct links. Links navigate client-side through
 * Inertia.
 */
export default function SidebarMenuCollapsible({
    items,
    groupLabel,
    collapseLabel,
    collapsibleIcon,
}: props) {
    const { url } = usePage();
    const currentPath = new URL(url, 'http://localhost').pathname;

    return (
        <KumoInertiaLinkProvider>
            <Sidebar.Group>
                <Sidebar.GroupLabel>{groupLabel ?? ''}</Sidebar.GroupLabel>
                <Sidebar.Menu>
                    <Sidebar.MenuItem>
                        <Sidebar.Collapsible defaultOpen>
                            <Sidebar.CollapsibleTrigger
                                render={
                                    <Sidebar.MenuButton icon={collapsibleIcon}>
                                        {collapseLabel ?? 'Collapse'}
                                        <Sidebar.MenuChevron />
                                    </Sidebar.MenuButton>
                                }
                            />
                            <Sidebar.CollapsibleContent>
                                <Sidebar.MenuSub>
                                    {items.map((item) => (
                                        <Sidebar.MenuSubItem key={item.label}>
                                            <Sidebar.MenuSubButton
                                                href={item.href}
                                                active={
                                                    item.active ??
                                                    getActiveState(
                                                        item.href,
                                                        currentPath,
                                                    )
                                                }
                                            >
                                                {item.icon && (
                                                    <item.icon className="size-4" />
                                                )}
                                                {item.label}
                                            </Sidebar.MenuSubButton>
                                        </Sidebar.MenuSubItem>
                                    ))}
                                </Sidebar.MenuSub>
                            </Sidebar.CollapsibleContent>
                        </Sidebar.Collapsible>
                    </Sidebar.MenuItem>
                </Sidebar.Menu>
            </Sidebar.Group>
        </KumoInertiaLinkProvider>
    );
}
