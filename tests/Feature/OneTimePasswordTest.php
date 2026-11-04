<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\OneTimePasswords\Notifications\OneTimePasswordNotification;

test('renders the one-time password request page', function () {
    $this->get(route('otp.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('auth/request-one-time-password'));
});

test('renders the one-time password verification page for a given email', function () {
    $this->get(route('otp.verify.show', ['email' => 'jane@example.com']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/verify-one-time-password')
            ->where('email', 'jane@example.com'));
});

test('redirects to the request page when verifying without an email', function () {
    $this->get(route('otp.verify.show'))
        ->assertRedirect(route('otp.show'));
});

test('redirects authenticated users away from the one-time password pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('otp.show'))
        ->assertRedirect(route('dashboard'));

    $this->actingAs($user)
        ->get(route('otp.verify.show', ['email' => $user->email]))
        ->assertRedirect(route('dashboard'));
});

test('sends a one-time password and redirects to the verification page', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('otp.send'), ['email' => 'jane@example.com'])
        ->assertRedirect(route('otp.verify.show', ['email' => 'jane@example.com']))
        ->assertSessionHas('status');

    Notification::assertSentTo($user, OneTimePasswordNotification::class);
});

test('creates a user and sends a one-time password when the email is unknown', function () {
    Notification::fake();

    $this->post(route('otp.send'), ['email' => 'new@example.com'])
        ->assertRedirect(route('otp.verify.show', ['email' => 'new@example.com']))
        ->assertSessionHas('status');

    $user = User::firstWhere('email', 'new@example.com');

    expect($user)->not->toBeNull();
    Notification::assertSentTo($user, OneTimePasswordNotification::class);
});

test('logs in a user with a valid one-time password', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('otp.send'), ['email' => 'jane@example.com']);
    $code = oneTimePasswordCodeFor($user);

    $this->post(route('otp.verify.store'), [
        'email' => 'jane@example.com',
        'one_time_password' => $code,
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('marks the email as verified when logging in with a one-time password', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create(['email' => 'jane@example.com']);

    expect($user->hasVerifiedEmail())->toBeFalse();

    $this->post(route('otp.send'), ['email' => 'jane@example.com']);
    $code = oneTimePasswordCodeFor($user);

    $this->post(route('otp.verify.store'), [
        'email' => 'jane@example.com',
        'one_time_password' => $code,
    ])->assertRedirect(route('dashboard'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

test('rejects an incorrect one-time password', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('otp.send'), ['email' => 'jane@example.com']);
    $code = oneTimePasswordCodeFor($user);

    $this->post(route('otp.verify.store'), [
        'email' => 'jane@example.com',
        'one_time_password' => str_pad((string) (((int) $code + 1) % 1000000), 6, '0', STR_PAD_LEFT),
    ])->assertSessionHasErrors('one_time_password');

    $this->assertGuest();
});

test('rejects an expired one-time password', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('otp.send'), ['email' => 'jane@example.com']);
    $code = oneTimePasswordCodeFor($user);

    $this->travel(3)->minutes();

    $this->post(route('otp.verify.store'), [
        'email' => 'jane@example.com',
        'one_time_password' => $code,
    ])->assertSessionHasErrors('one_time_password');

    $this->assertGuest();
});

/**
 * Read the code sent to the given user by intercepting the notification.
 */
function oneTimePasswordCodeFor(User $user): string
{
    $code = null;

    Notification::assertSentTo(
        $user,
        OneTimePasswordNotification::class,
        function (OneTimePasswordNotification $notification) use (&$code): bool {
            $code = $notification->oneTimePassword->password;

            return true;
        },
    );

    return $code;
}
