import { Sidebar, Text } from '@cloudflare/kumo';
import { CaretUpDownIcon } from '@phosphor-icons/react';
import ThemeToggle from '@/components/theme-toggle';
import UserAvatar from '@/components/user-avatar';
import UserMenu from '@/components/user-menu';
import type { User } from '@/types';

export default function SidebarFooter({ user }: { user: User }) {
    return (
        <>
            <Sidebar.Menu className="min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden">
                <Sidebar.MenuItem>
                    <UserMenu
                        user={user}
                        side="top"
                        align="start"
                        trigger={
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
                </Sidebar.MenuItem>
            </Sidebar.Menu>

            <ThemeToggle className="group-data-[state=collapsed]/sidebar:hidden" />
        </>
    );
}
