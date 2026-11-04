const THEME_STORAGE_KEY = 'theme';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

/** Stored preference. `system` follows the device colour scheme. */
export type Theme = 'light' | 'dark' | 'system';

/** Preference after `system` has been resolved against the device. */
export type ResolvedTheme = 'light' | 'dark';

function isTheme(value: string | null): value is Theme {
    return value === 'light' || value === 'dark' || value === 'system';
}

function prefersDarkMode(): boolean {
    try {
        return window.matchMedia(DARK_MODE_QUERY).matches;
    } catch {
        return false;
    }
}

/**
 * Reads the persisted preference, falling back to `system` when nothing
 * usable is stored.
 */
export function getStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);

        return isTheme(stored) ? stored : 'system';
    } catch {
        return 'system';
    }
}

/** Resolves a preference to the theme that should actually be rendered. */
export function resolveTheme(theme: Theme): ResolvedTheme {
    if (theme !== 'system') {
        return theme;
    }

    return prefersDarkMode() ? 'dark' : 'light';
}

/**
 * Applies an already resolved theme to the document. The `data-mode`
 * attribute drives Kumo tokens, while the `dark` class keeps Tailwind
 * `dark:` utilities in sync.
 */
export function applyResolvedTheme(resolved: ResolvedTheme): void {
    const root = document.documentElement;

    root.dataset.mode = resolved;
    root.classList.toggle('dark', resolved === 'dark');
}

/** Applies a theme and persists the preference for the next visit. */
export function applyTheme(theme: Theme): ResolvedTheme {
    const resolved = resolveTheme(theme);

    applyResolvedTheme(resolved);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Storage can be unavailable; the theme still applies for this session.
    }

    return resolved;
}

/**
 * Notifies whenever the device colour scheme changes. Returns an
 * unsubscribe function.
 */
export function subscribeToSystemTheme(listener: () => void): () => void {
    const query = window.matchMedia(DARK_MODE_QUERY);

    query.addEventListener('change', listener);

    return () => query.removeEventListener('change', listener);
}
