<?php

use Illuminate\Support\Facades\Route;

// Minimal test route - no database, no Inertia, no middleware
Route::get('/', function () {
    return 'Hello World - Thursday Night Bible Study';
});
