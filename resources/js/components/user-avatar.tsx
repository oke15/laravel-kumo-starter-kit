import type { User } from '@/types';

function getUserInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Avatar for the signed-in user. Falls back to initials when the user has no
 * profile picture.
 */
export default function UserAvatar({ user }: { user: User }) {
    if (user.avatar) {
        return (
            <img
                src={user.avatar}
                alt=""
                className="size-7 shrink-0 rounded-full object-cover"
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-kumo-recessed text-xs font-medium text-kumo-default"
        >
            {getUserInitials(user.name)}
        </span>
    );
}
