import { Button } from '@cloudflare/kumo';
import { CaretDownIcon } from '@phosphor-icons/react';
import UserAvatar from '@/components/user-avatar';
import UserMenu from '@/components/user-menu';
import type { User } from '@/types';

/**
 * Account trigger and dropdown for the header layout.
 */
export default function HeaderUserMenu({ user }: { user: User }) {
    return (
        <UserMenu
            user={user}
            side="bottom"
            align="end"
            trigger={
                <Button
                    variant="ghost"
                    className="h-9 gap-2 px-1.5"
                    aria-label={`Menu akun ${user.name}`}
                >
                    <UserAvatar user={user} />
                    <span className="hidden max-w-32 truncate text-sm font-medium text-kumo-default sm:inline">
                        {user.name}
                    </span>
                    <CaretDownIcon className="size-3.5 shrink-0 text-kumo-subtle" />
                </Button>
            }
        />
    );
}
