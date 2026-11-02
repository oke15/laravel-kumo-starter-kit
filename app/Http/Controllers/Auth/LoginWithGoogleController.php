<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class LoginWithGoogleController extends Controller
{
    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirect(): SymfonyRedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google and log the user in.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidStateException|ClientException) {
            return redirect()->route('login')->with('error', 'Login dengan Google dibatalkan atau gagal.');
        }

        if (blank($googleUser->getEmail())) {
            return redirect()->route('login')->with('error', 'Email Google tidak tersedia.');
        }

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'google_id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
                'email_verified_at' => now(),
            ],
        );

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }
}
