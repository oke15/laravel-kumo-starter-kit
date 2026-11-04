import { Button, DropdownMenu } from '@cloudflare/kumo';
import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import {
    applyTheme,
    getStoredTheme,
    subscribeToSystemTheme,
} from '@/lib/theme';
import type { Theme } from '@/lib/theme';

type ThemeOption = {
    label: string;
    icon: Icon;
};

const THEME_OPTIONS: Record<Theme, ThemeOption> = {
    light: { label: 'Terang', icon: SunIcon },
    dark: { label: 'Gelap', icon: MoonIcon },
    system: { label: 'Ikuti perangkat', icon: MonitorIcon },
};

const THEME_ORDER: Theme[] = ['light', 'dark', 'system'];

type ThemeToggleProps = {
    className?: string;
};

/**
 * Theme picker offering light, dark, and device preference. The `system`
 * option keeps following the device colour scheme until the user picks an
 * explicit theme.
 */
export default function ThemeToggle({ className }: ThemeToggleProps = {}) {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        setTheme(getStoredTheme());
    }, []);

    useEffect(() => {
        if (theme !== 'system') {
            return;
        }

        return subscribeToSystemTheme(() => {
            applyTheme('system');
        });
    }, [theme]);

    const handleSelect = (value: Theme) => {
        setTheme(value);
        applyTheme(value);
    };

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger
                render={
                    <Button
                        variant="ghost"
                        shape="square"
                        icon={THEME_OPTIONS[theme].icon}
                        aria-label={`Tema: ${THEME_OPTIONS[theme].label}`}
                        className={className}
                    />
                }
            />
            <DropdownMenu.Content align="end">
                <DropdownMenu.RadioGroup
                    value={theme}
                    onValueChange={(value) => handleSelect(value as Theme)}
                >
                    {THEME_ORDER.map((value) => (
                        <DropdownMenu.RadioItem
                            key={value}
                            value={value}
                            icon={THEME_OPTIONS[value].icon}
                        >
                            {THEME_OPTIONS[value].label}
                            <DropdownMenu.RadioItemIndicator />
                        </DropdownMenu.RadioItem>
                    ))}
                </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}
