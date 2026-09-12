<?php

use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PaymentTopupController;
use App\Http\Controllers\Api\PaymentCallbackController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\VendorListingController;
use App\Http\Controllers\Api\VendorOrderController;
use App\Http\Controllers\Api\VendorTokenController;
use App\Http\Controllers\Api\VendorWalletController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AdminBaseProductController;
use App\Http\Controllers\Api\AdminPaymentController;
use App\Http\Controllers\Api\AdminCashoutController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1 (/api/v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ==========================================
    // 1. PUBLIC ROUTES
    // ==========================================

    // Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public Payment Callback Webhooks (Gateway Hash Verified in Controller)
    Route::post('/payments/kbzpay/callback', [PaymentCallbackController::class, 'kbzpay']);
    Route::post('/payments/ayapay/callback', [PaymentCallbackController::class, 'ayapay']);

    // Public Catalog Storefront
    Route::get('/catalog/categories', [CatalogController::class, 'categories']);
    Route::get('/catalog/base-products', [CatalogController::class, 'index']);
    Route::get('/catalog/base-products/{id}', [CatalogController::class, 'show']);


    // ==========================================
    // 2. PROTECTED ROUTES (Sanctum Auth Required)
    // ==========================================

    Route::middleware(['auth:sanctum'])->group(function () {

        // Auth & Profile Management
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/profile/me', [ProfileController::class, 'me']);
        Route::get('/profile/addresses', [AddressController::class, 'index']);
        Route::post('/profile/addresses', [AddressController::class, 'store']);

        // Payments & Wallet Top-Ups
        Route::post('/payments/topup/initiate', [PaymentTopupController::class, 'initiate']);
        Route::post('/payments/topup/bank-slip', [PaymentTopupController::class, 'submitBankSlip']);

        // Catalog Base Product Requests
        Route::post('/catalog/base-products/request', [CatalogController::class, 'requestBaseProduct']);

        // Customer Order Checkout & History
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::post('/orders/{id}/confirm-delivery', [OrderController::class, 'confirmDelivery']);

        // ------------------------------------------
        // Vendor Portal Endpoints
        // ------------------------------------------
        Route::prefix('vendor')->group(function () {
            Route::post('/tokens/purchase', [VendorTokenController::class, 'purchase']);
            Route::get('/listings', [VendorListingController::class, 'index']);
            Route::post('/listings', [VendorListingController::class, 'store']);
            Route::put('/listings/{id}', [VendorListingController::class, 'update']);
            Route::get('/orders', [VendorOrderController::class, 'index']);
            Route::post('/orders/{item_id}/ship', [VendorOrderController::class, 'ship']);
            Route::post('/cashout', [VendorWalletController::class, 'cashout']);
        });

        // ------------------------------------------
        // Admin Control Center Endpoints
        // ------------------------------------------
        Route::prefix('admin')->group(function () {
            // Base Product Moderation
            Route::get('/base-products/pending', [AdminBaseProductController::class, 'pending']);
            Route::post('/base-products/{id}/approve', [AdminBaseProductController::class, 'approve']);
            Route::post('/base-products/{id}/reject', [AdminBaseProductController::class, 'reject']);

            // Bank Slip Verification
            Route::get('/payments/slips/pending', [AdminPaymentController::class, 'pendingSlips']);
            Route::post('/payments/slips/{id}/verify', [AdminPaymentController::class, 'verifySlip']);

            // Vendor Cashout Approvals
            Route::get('/cashouts/pending', [AdminCashoutController::class, 'pending']);
            Route::post('/cashouts/{id}/approve', [AdminCashoutController::class, 'approve']);
        });

    });
});