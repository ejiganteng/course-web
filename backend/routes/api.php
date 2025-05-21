<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PdfController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;




// Auth Routes
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('api.logout');

// User CRUD Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');
});


// Category CRUD Routes
Route::middleware(['auth:sanctum','admin'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('api.categories.store');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('api.categories.show');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('api.categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('api.categories.destroy');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store'])->middleware('instruktur');
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    Route::put('/courses/{course}', [CourseController::class, 'update'])->middleware('instruktur');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware('instruktur');
    Route::post('/courses/{id}/upload', [PdfController::class, 'upload'])->middleware('instruktur');
});
