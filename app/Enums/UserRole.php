<?php

namespace App\Enums;

enum UserRole: int
{
    case USER = 1;
    case ADMIN = 98;
    case SUPER_ADMIN = 99;

    /**
     * Get the human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::USER => 'User',
            self::ADMIN => 'Admin',
            self::SUPER_ADMIN => 'Super Admin',
        };
    }
}
