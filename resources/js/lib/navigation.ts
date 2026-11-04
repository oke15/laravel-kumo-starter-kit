/**
 * Returns whether `href` points at the current path. Query strings and hashes
 * are ignored so links stay active across filtered views.
 */
export function getActiveState(
    href: string | undefined,
    currentPath: string,
): boolean {
    if (!href) {
        return false;
    }

    return new URL(href, 'http://localhost').pathname === currentPath;
}

/**
 * Extracts the pathname from Inertia's page URL so it can be compared with
 * navigation hrefs.
 */
export function getCurrentPath(url: string): string {
    return new URL(url, 'http://localhost').pathname;
}
