<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


// Autentikasi Routes
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('api.logout');

// User Routes 
Route::middleware(['auth:sanctum'])->prefix('users')->name('api.users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->middleware('admin')->name('index');
    Route::post('/', [UserController::class, 'store'])->middleware('admin')->name('store');
    Route::get('/{id}', [UserController::class, 'show'])->name('show');
    Route::put('/{id}', [UserController::class, 'update'])->name('update');
    Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('admin')->name('destroy');
});

// Category Routes 
Route::middleware(['auth:sanctum'])->prefix('categories')->name('api.categories.')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::post('/', [CategoryController::class, 'store'])->middleware('admin')->name('store');
    Route::get('/{id}', [CategoryController::class, 'show'])->middleware('admin')->name('show');
    Route::put('/{id}', [CategoryController::class, 'update'])->middleware('admin')->name('update');
    Route::delete('/{id}', [CategoryController::class, 'destroy'])->middleware('admin')->name('destroy');
});

// Course dan PDF Routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Course Routes
    Route::get('/courses', [CourseController::class, 'index'])->name('api.courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->middleware('instruktur')->name('api.courses.store');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('api.courses.show');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->middleware('instruktur')->name('api.courses.update');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware('instruktur')->name('api.courses.destroy');

    // PDF Routes
    Route::post('/courses/{id}/upload', [PdfController::class, 'upload'])->middleware('instruktur')->name('api.pdfs.upload');
    Route::get('/pdfs/{id}/download', [PdfController::class, 'downloadById'])->name('api.pdfs.download');
    Route::put('/pdfs/{id}/update', [PdfController::class, 'update'])->middleware('instruktur')->name('api.pdfs.update');
    Route::delete('/pdfs/{id}', [PdfController::class, 'destroy'])->middleware('instruktur')->name('api.pdfs.destroy');

    
});