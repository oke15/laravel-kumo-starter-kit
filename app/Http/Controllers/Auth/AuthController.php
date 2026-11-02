<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show the login page.
     */
    public function viewLogin(): Response
    {
        return inertia('auth/login');
    }
}
