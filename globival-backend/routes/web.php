<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin - Productos
    Route::get('admin/productos', function () {
        return Inertia::render('admin/products');
    })->name('admin.products');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
