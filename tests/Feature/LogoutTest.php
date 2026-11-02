<?php

use App\Models\User;

test('logs out authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('home'));

    $this->assertGuest();
});

test('redirects guests away from logout', function () {
    $this->post(route('logout'))->assertRedirect(route('login'));

    $this->assertGuest();
});
