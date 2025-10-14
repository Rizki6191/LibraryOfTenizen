<?php

use App\Http\Controllers\BookModelController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController; 
use Illuminate\Support\Facades\Route;

// ==============================
// Auth (register & login) → bisa diakses tanpa login
// ==============================
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ==============================
// Route yang butuh login
// ==============================
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // Users
    Route::apiResource('users', UserController::class);

    // Books
    Route::apiResource('books', BookModelController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Borrowing
    Route::apiResource('borrowing', BorrowingController::class);
    
    // Route khusus: Member mengembalikan buku
    Route::post('borrowing/{borrowing}/return', [BorrowingController::class, 'returnBook']);
});