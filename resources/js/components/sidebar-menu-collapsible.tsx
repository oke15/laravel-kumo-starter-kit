import { Sidebar } from '@cloudflare/kumo';
import type { Icon } from '@phosphor-icons/react';

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
function getActiveState(href: string | undefined): boolean {
    if (!href) {
        return false;
    }
    const currentPath = window.location.pathname;
    const linkPath = new URL(href, window.location.origin).pathname;
    return currentPath === linkPath;
}

/**
 * Grouped sidebar navigation. Items with nested `items` render as collapsible
 * sections that auto-open when one of their children is active, while items
 * without children render as direct links.
 */
export default function SidebarMenuCollapsible({
    items,
    groupLabel,
    collapseLabel,
    collapsibleIcon,
}: props) {
    return (
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
                                                getActiveState(item.href)
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
    );
}
