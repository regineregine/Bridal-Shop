<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminCustomerController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\WishlistController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products/{id}/reduce-stock', [ProductController::class, 'reduceStock']);
Route::post('/reservations', [ReservationController::class, 'store']);

// Password reset routes
Route::post('/password/forgot', [PasswordResetController::class, 'forgotPassword']);
Route::post('/password/verify-code', [PasswordResetController::class, 'verifyCode']);
Route::post('/password/reset-with-code', [PasswordResetController::class, 'resetPasswordWithCode']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/address', [UserController::class, 'updateAddress']);
    Route::post('/user/password', [UserController::class, 'changePassword']);
    Route::post('/user/payment', [UserController::class, 'updatePayment']);
    Route::get('/user/measurements', [UserController::class, 'getMeasurements']);
    Route::post('/user/measurements', [UserController::class, 'updateMeasurements']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::post('/wishlist/check', [WishlistController::class, 'check']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
});

// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/user', [AdminAuthController::class, 'user']);
        
        Route::prefix('products')->group(function () {
            Route::get('/', [AdminProductController::class, 'index']);
            Route::get('/{id}', [AdminProductController::class, 'show']);
            Route::post('/', [AdminProductController::class, 'store']);
            Route::put('/{id}', [AdminProductController::class, 'update']);
            Route::post('/{id}', [AdminProductController::class, 'update']); // For form data
            Route::delete('/{id}', [AdminProductController::class, 'destroy']);
        });
        
        Route::prefix('orders')->group(function () {
            Route::get('/', [AdminOrderController::class, 'index']);
            Route::get('/{id}', [AdminOrderController::class, 'show']);
            Route::put('/{id}/status', [AdminOrderController::class, 'updateStatus']);
        });
        
        Route::prefix('customers')->group(function () {
            Route::get('/', [AdminCustomerController::class, 'index']);
            Route::get('/{id}', [AdminCustomerController::class, 'show']);
            Route::post('/{id}/archive', [AdminCustomerController::class, 'archive']);
            Route::post('/{id}/unarchive', [AdminCustomerController::class, 'unarchive']);
        });
    });
});
