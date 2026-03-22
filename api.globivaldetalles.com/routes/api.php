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
use App\Http\Controllers\Api\FeaturedCategoryController;

// Perfil del usuario autenticado (Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth: registro, login, perfil y logout
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

// Productos — /products/featured ANTES del wildcard {product}
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::post('/products/{product}/update', [ProductController::class, 'update']); // Ruta especial para FormData
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::delete('/products/{product}/images/{imageId}', [ProductController::class, 'destroyImage']); // Eliminar imagen adicional
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
Route::post('/banners', [BannerController::class, 'store']);
Route::put('/banners/{banner}', [BannerController::class, 'update']);
Route::post('/banners/{banner}/update', [BannerController::class, 'update']); // Ruta especial para FormData
Route::put('/banners/{banner}/toggle-active', [BannerController::class, 'toggleActive']);
Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/banners/{banner}', [BannerController::class, 'destroy']);
});

// Testimonios
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
Route::post('/testimonials/{testimonial}/update', [TestimonialController::class, 'update']); // Ruta especial para FormData
Route::put('/testimonials/{testimonial}/toggle-active', [TestimonialController::class, 'toggleActive']);
Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
});

// Configuración de categoría destacada
Route::get('/featured-category', [FeaturedCategoryController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/featured-category', [FeaturedCategoryController::class, 'update']);
});
