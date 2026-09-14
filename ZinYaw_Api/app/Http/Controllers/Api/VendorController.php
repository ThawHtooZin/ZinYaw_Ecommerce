<?php

namespace App\Http\Controllers\Api;

use App\Models\Vendor;
use Illuminate\Http\JsonResponse;

class VendorController
{
    public function featured(): JsonResponse
    {
        $vendors = Vendor::query()
            ->where('is_verified', true)
            ->withCount([
                'vendorListings as active_listings_count' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->where('stock_quantity', '>', 0);
                },
            ])
            ->latest()
            ->take(3)
            ->get([
                'id',
                'store_name',
                'store_slug',
                'is_verified',
            ]);

        return response()->json([
            'success' => true,
            'data' => $vendors,
        ], 200);
    }
}