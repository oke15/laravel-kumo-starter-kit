import { DropdownMenu, Text } from '@cloudflare/kumo';
import { SignOutIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { router } from '@inertiajs/react';
import type { ComponentProps, ReactElement } from 'react';
import { logout } from '@/routes';
import type { User } from '@/types';

type AccountMenuItem = {
    label: string;
    icon?: Icon;
    onSelect?: () => void;
};

/**
 * Placeholder for future account menu items, such as Profile or Settings.
 */
const accountMenuItems: AccountMenuItem[] = [];

type UserMenuProps = {
    user: User;
    /** Element rendered as the dropdown trigger. */
    trigger: ReactElement;
    side?: ComponentProps<typeof DropdownMenu.Content>['side'];
    align?: ComponentProps<typeof DropdownMenu.Content>['align'];
};

/**
 * Account dropdown shared by the sidebar and header layouts. It owns the
 * account details and logout action; consumers provide the trigger element.
 */
export default function UserMenu({
    user,
    trigger,
    side = 'bottom',
    align = 'end',
}: UserMenuProps) {
    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger render={trigger} />
            <DropdownMenu.Content side={side} align={align} className="w-64">
                <div className="flex min-w-0 flex-col gap-0.5 px-2 py-1.5">
                    <Text as="span" bold truncate>
                        {user.name}
                    </Text>
                    <Text as="span" variant="secondary" size="xs" truncate>
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

                {accountMenuItems.length > 0 && <DropdownMenu.Separator />}

                <DropdownMenu.Item
                    variant="danger"
                    icon={SignOutIcon}
                    onClick={handleLogout}
                >
                    Keluar
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}
