import { Button } from '@cloudflare/kumo';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function applyTheme(theme: Theme): void {
    const root = document.documentElement;

    root.dataset.mode = theme;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
}

type ThemeToggleProps = {
    className?: string;
};

/**
 * Toggles between light and dark mode. Kumo tokens read the `data-mode`
 * attribute, while the `dark` class keeps Tailwind `dark:` utilities in sync.
 */
export default function ThemeToggle({ className }: ThemeToggleProps = {}) {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        setTheme(
            document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light',
        );
    }, []);

    const handleToggle = () => {
        const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        setTheme(nextTheme);
        applyTheme(nextTheme);
    };

    const label =
        theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap';

    return (
        <Button
            variant="ghost"
            shape="square"
            icon={theme === 'dark' ? SunIcon : MoonIcon}
            aria-label={label}
            className={className}
            onClick={handleToggle}
        />
    );
}
