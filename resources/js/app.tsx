import { LinkProvider, type LinkComponentProps } from '@cloudflare/kumo';
import {
    createInertiaApp,
    Link,
    type InertiaLinkProps,
} from '@inertiajs/react';
import { forwardRef } from 'react';
import AppLayout from '@/layouts/app-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// const AppLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
//     ({ href = '', to: _to, ...props }, ref) => (
//         <Link
//             ref={ref}
//             href={href}
//             {...(props as unknown as InertiaLinkProps)}
//         />
//     ),
// );

// AppLink.displayName = 'AppLink';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    layout: (name) =>
        name === 'welcome' || name.startsWith('auth/') ? undefined : AppLayout,
    // withApp: (app) => <LinkProvider component={AppLink}>{app}</LinkProvider>,
});
