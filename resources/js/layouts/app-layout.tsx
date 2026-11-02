import { Sidebar } from '@cloudflare/kumo';
import { HouseIcon, CodeIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <Sidebar.Provider
            defaultOpen
            peekable
            className="h-dvh overflow-hidden"
        >
            <Sidebar>
                <Sidebar.Content>
                    <Sidebar.Group>
                        <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
                        <Sidebar.Menu>
                            <Sidebar.MenuButton icon={HouseIcon} active>
                                Home
                            </Sidebar.MenuButton>
                            {/* MenuItem only needed to wrap Collapsible */}
                            <Sidebar.MenuItem>
                                <Sidebar.Collapsible>
                                    <Sidebar.CollapsibleTrigger
                                        render={
                                            <Sidebar.MenuButton icon={CodeIcon}>
                                                Compute <Sidebar.MenuChevron />
                                            </Sidebar.MenuButton>
                                        }
                                    />
                                    <Sidebar.CollapsibleContent>
                                        <Sidebar.MenuSub>
                                            <Sidebar.MenuSubButton>
                                                Workers
                                            </Sidebar.MenuSubButton>
                                        </Sidebar.MenuSub>
                                    </Sidebar.CollapsibleContent>
                                </Sidebar.Collapsible>
                            </Sidebar.MenuItem>
                        </Sidebar.Menu>
                    </Sidebar.Group>
                </Sidebar.Content>
                <Sidebar.Footer>
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
    );
}
