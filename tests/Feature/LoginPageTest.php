<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('renders the login page', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('auth/login'));
});

test('redirects authenticated users away from the login page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect(route('dashboard'));
});

test('shows a flash error on the login page', function () {
    $this->withSession(['error' => 'Login dengan Google gagal.'])
        ->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('flash.error', 'Login dengan Google gagal.'));
});
