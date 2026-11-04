import { Button, cn, DropdownMenu, LinkButton } from '@cloudflare/kumo';
import { ListIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { usePage } from '@inertiajs/react';
import { getActiveState, getCurrentPath } from '@/lib/navigation';

export type HeaderNavItem = {
    label: string;
    href: string;
    icon?: Icon;
};

/**
 * Horizontal navigation shown in the header on desktop.
 */
export function HeaderNav({ items }: { items: HeaderNavItem[] }) {
    const { url } = usePage();
    const currentPath = getCurrentPath(url);

    return (
        <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 md:flex"
        >
            {items.map((item) => {
                const active = getActiveState(item.href, currentPath);

                return (
                    <LinkButton
                        key={item.label}
                        href={item.href}
                        variant="ghost"
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'text-sm text-kumo-subtle',
                            active && 'bg-kumo-tint text-kumo-strong',
                        )}
                    >
                        {item.label}
                    </LinkButton>
                );
            })}
        </nav>
    );
}

/**
 * Collapses the header navigation into a dropdown on small screens.
 */
export function HeaderMobileNav({ items }: { items: HeaderNavItem[] }) {
    const { url } = usePage();
    const currentPath = getCurrentPath(url);

    return (
        <div className="md:hidden">
            <DropdownMenu>
                <DropdownMenu.Trigger
                    render={
                        <Button
                            variant="ghost"
                            shape="square"
                            icon={ListIcon}
                            aria-label="Buka navigasi"
                        />
                    }
                />
                <DropdownMenu.Content align="end" className="w-56">
                    {items.map((item) => {
                        const active = getActiveState(item.href, currentPath);

                        return (
                            <DropdownMenu.LinkItem
                                key={item.label}
                                href={item.href}
                                icon={item.icon}
                                className={cn(active && 'text-kumo-strong')}
                            >
                                {item.label}
                            </DropdownMenu.LinkItem>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu>
        </div>
    );
}
