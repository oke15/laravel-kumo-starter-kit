<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LoginWithGoogleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/login', [AuthController::class, 'viewLogin'])->middleware('guest')->name('login');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/auth/google/redirect', [LoginWithGoogleController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [LoginWithGoogleController::class, 'callback'])->name('auth.google.callback');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['auth', 'verified']);
