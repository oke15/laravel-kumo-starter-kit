<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LoginWithGoogleController;
use App\Http\Controllers\Auth\OneTimePasswordController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/login', [AuthController::class, 'viewLogin'])->middleware('guest')->name('login');

Route::middleware('guest')->group(function () {
    Route::get('/otp', [OneTimePasswordController::class, 'showRequest'])->name('otp.show');
    Route::post('/otp/send', [OneTimePasswordController::class, 'send'])->middleware('throttle:6,1')->name('otp.send');
    Route::get('/otp/verify', [OneTimePasswordController::class, 'showVerify'])->name('otp.verify.show');
    Route::post('/otp/verify', [OneTimePasswordController::class, 'verify'])->name('otp.verify.store');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/auth/google/redirect', [LoginWithGoogleController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [LoginWithGoogleController::class, 'callback'])->name('auth.google.callback');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['auth', 'verified']);
