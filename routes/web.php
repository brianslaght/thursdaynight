<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SeriesController;
use App\Http\Controllers\WeekController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/series/{series:slug}', [SeriesController::class, 'show'])->name('series.show');
Route::get('/series/{series:slug}/week/{week}', [WeekController::class, 'show'])->name('week.show');

// Dashboard (for logged in users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
