<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('creates a new user when logging in with google', function () {
    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-123',
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]));

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'google_id' => 'google-123',
    ]);
});

test('links the google id to an existing user with the same email', function () {
    $user = User::factory()->create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'google_id' => null,
    ]);

    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-123',
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]));

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
    $this->assertDatabaseCount('users', 1);
    expect($user->fresh()->google_id)->toBe('google-123');
});

test('updates the name of an existing user when logging in with google', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'jane@example.com',
    ]);

    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-123',
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]));

    $this->get(route('auth.google.callback'))->assertRedirect(route('dashboard'));

    expect($user->fresh()->name)->toBe('Jane Doe');
});

test('redirects to login with an error when the google email is missing', function () {
    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-123',
        'name' => 'Jane Doe',
        'email' => null,
    ]));

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('error');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});
