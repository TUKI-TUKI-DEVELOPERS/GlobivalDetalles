<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubCategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ClaimController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\TestimonialController;

// Perfil del usuario autenticado (Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth: registro, login, perfil y logout
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Categorías
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});

// Subcategorías
Route::get('/subcategories', [SubCategoryController::class, 'index']);
Route::get('/subcategories/{subcategory}', [SubCategoryController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/subcategories', [SubCategoryController::class, 'store']);
    Route::put('/subcategories/{subcategory}', [SubCategoryController::class, 'update']);
    Route::delete('/subcategories/{subcategory}', [SubCategoryController::class, 'destroy']);
});

// Productos
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});

// Libro de reclamaciones
Route::post('/claims', [ClaimController::class, 'store']); // público
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/claims', [ClaimController::class, 'index']);
    Route::get('/claims/{claim}', [ClaimController::class, 'show']);
});

// Formulario de contacto
Route::post('/contacts', [ContactController::class, 'store']); // público
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}/read', [ContactController::class, 'markAsRead']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
});

// Banners
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/banners/{banner}', [BannerController::class, 'show']);
Route::post('/banners', [BannerController::class, 'store']); // público o protegido según necesidad
Route::put('/banners/{banner}/toggle-active', [BannerController::class, 'toggleActive']);

// Testimonios
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::post('/testimonials', [TestimonialController::class, 'store']); // público o protegido según necesidad
Route::put('/testimonials/{testimonial}/toggle-active', [TestimonialController::class, 'toggleActive']);

Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/banners/{banner}', [BannerController::class, 'destroy']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
});
