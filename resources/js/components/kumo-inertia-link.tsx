import { LinkProvider } from '@cloudflare/kumo';
import type { LinkComponentProps } from '@cloudflare/kumo';
import { Link } from '@inertiajs/react';
import { forwardRef } from 'react';
import type {
    ForwardRefExoticComponent,
    ReactNode,
    RefAttributes,
} from 'react';

/**
 * Inertia's `<Link>` typed with the ref shape Kumo's link context expects.
 */
const InertiaLink = Link as unknown as ForwardRefExoticComponent<
    Omit<LinkComponentProps, 'to'> & RefAttributes<HTMLAnchorElement>
>;

/**
 * Kumo passes both `href` and `to` to the link component. `to` is dropped so
 * it does not leak to the DOM, then navigation is handed over to Inertia.
 */
const KumoInertiaLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
    ({ href, to, ...props }, ref) => (
        <InertiaLink ref={ref} href={href ?? to ?? ''} {...props} />
    ),
);

KumoInertiaLink.displayName = 'KumoInertiaLink';

/**
 * Makes every Kumo link below it (Sidebar.MenuButton, MenuSubButton, Button or
 * Link with `href`) navigate client-side through Inertia.
 */
export default function KumoInertiaLinkProvider({
    children,
}: {
    children: ReactNode;
}) {
    return <LinkProvider component={KumoInertiaLink}>{children}</LinkProvider>;
}
