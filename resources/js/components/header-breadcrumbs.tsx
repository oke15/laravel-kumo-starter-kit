import { Breadcrumbs } from '@cloudflare/kumo';
import { Fragment } from 'react';
import { dashboard } from '@/routes';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type HeaderBreadcrumbsProps = {
    /** Page title, used as the last breadcrumb when no trail is provided. */
    title?: string;
    /** Overrides the generated breadcrumb trail when provided. */
    breadcrumbs?: BreadcrumbItem[];
};

/**
 * Breadcrumb trail shown below the header. Falls back to a `Beranda / title`
 * trail so pages only need to provide their title.
 */
export default function HeaderBreadcrumbs({
    title,
    breadcrumbs,
}: HeaderBreadcrumbsProps) {
    const items: BreadcrumbItem[] = breadcrumbs ?? [
        { label: 'Beranda', href: dashboard.url() },
        ...(title ? [{ label: title }] : []),
    ];

    return (
        <Breadcrumbs size="sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <Fragment key={`${item.label}-${index}`}>
                        {index > 0 && <Breadcrumbs.Separator />}
                        {isLast || !item.href ? (
                            <Breadcrumbs.Current>
                                {item.label}
                            </Breadcrumbs.Current>
                        ) : (
                            <Breadcrumbs.Link href={item.href}>
                                {item.label}
                            </Breadcrumbs.Link>
                        )}
                    </Fragment>
                );
            })}
        </Breadcrumbs>
    );
}
