<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('renders the dashboard for verified users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('dashboard'));
});

test('redirects guests away from the dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});
