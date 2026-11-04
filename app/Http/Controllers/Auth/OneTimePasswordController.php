<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use Spatie\OneTimePasswords\Rules\OneTimePasswordRule;

class OneTimePasswordController extends Controller
{
    /**
     * Show the page where a user requests a one-time password.
     */
    public function showRequest(): Response
    {
        return inertia('auth/request-one-time-password');
    }

    /**
     * Send a one-time password to the user with the given email address.
     */
    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::firstOrCreate(
            ['email' => $validated['email']],
            ['name' => Str::before($validated['email'], '@')],
        );

        defer(fn () => $user->sendOneTimePassword());

        return redirect()
            ->route('otp.verify.show', ['email' => $validated['email']])
            ->with('status', 'Kami telah mengirim kode sekali pakai ke email Anda.');
    }

    /**
     * Show the page where a user enters the one-time password.
     */
    public function showVerify(Request $request): Response|RedirectResponse
    {
        $email = $request->string('email')->toString();

        if (blank($email)) {
            return redirect()->route('otp.show');
        }

        return inertia('auth/verify-one-time-password', [
            'email' => $email,
        ]);
    }

    /**
     * Verify the one-time password and log the user in.
     */
    public function verify(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::firstWhere('email', $validated['email']);

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Kami tidak dapat menemukan pengguna dengan alamat email tersebut.',
            ]);
        }

        $request->validate([
            'one_time_password' => ['required', 'string', new OneTimePasswordRule($user)],
        ]);

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
