<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('api.logout');

// User CRUD Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');
});
