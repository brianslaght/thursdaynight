<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PresentationController;
use App\Http\Controllers\SeriesController;
use App\Http\Controllers\WeekController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/series/{series:slug}', [SeriesController::class, 'show'])->name('series.show');
Route::get('/series/{series:slug}/week/{week}', [WeekController::class, 'show'])->name('week.show');

// Public presentation view (anyone can watch)
Route::get('/series/{series:slug}/week/{week}/present', [PresentationController::class, 'present'])
    ->name('presentation.present');

// Leader-only presentation control
Route::middleware(['auth'])->group(function () {
    Route::get('/series/{series:slug}/week/{week}/control', [PresentationController::class, 'control'])
        ->name('presentation.control');

    Route::post('/weeks/{week}/presentation/state', [PresentationController::class, 'updateState'])
        ->name('presentation.updateState');
    Route::post('/weeks/{week}/presentation/next', [PresentationController::class, 'next'])
        ->name('presentation.next');
    Route::post('/weeks/{week}/presentation/previous', [PresentationController::class, 'previous'])
        ->name('presentation.previous');
    Route::post('/weeks/{week}/presentation/toggle-scripture', [PresentationController::class, 'toggleScripture'])
        ->name('presentation.toggleScripture');
    Route::post('/weeks/{week}/presentation/highlight-question', [PresentationController::class, 'highlightQuestion'])
        ->name('presentation.highlightQuestion');
});

// Dashboard (for logged in users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
