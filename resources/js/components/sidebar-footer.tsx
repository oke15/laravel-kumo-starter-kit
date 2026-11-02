import { Sidebar, DropdownMenu, Text } from '@cloudflare/kumo';
import type { User } from '@/types';
import { CaretUpDownIcon, SignOutIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { router } from '@inertiajs/react';
import { logout } from '@/routes';

type AccountMenuItem = {
    label: string;
    icon?: Icon;
    onSelect?: () => void;
};
/**
 * Placeholder for future account menu items, such as Profile or Settings.
 */
const accountMenuItems: AccountMenuItem[] = [];

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
export default function SidebarFooter({ user }: { user: User }) {
    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        <Sidebar.Menu className="min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden">
            <Sidebar.MenuItem>
                <DropdownMenu>
                    <DropdownMenu.Trigger
                        render={
                            <Sidebar.MenuButton
                                icon={<UserAvatar user={user} />}
                                className="h-auto min-h-10 py-1"
                            >
                                <span className="grid min-w-0 flex-1 gap-0.5 leading-tight">
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
    );
}
