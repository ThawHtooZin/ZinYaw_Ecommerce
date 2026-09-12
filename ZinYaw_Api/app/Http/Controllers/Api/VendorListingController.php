<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendorListingRequest;
use App\Http\Requests\UpdateVendorListingRequest;
use App\Models\VendorListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendorListingController
{
    public function index(Request $request): JsonResponse
    {
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            return response()->json(['success' => false, 'message' => 'Vendor profile not found.'], 403);
        }

        $listings = VendorListing::where('vendor_id', $vendor->id)
            ->with(['baseProduct', 'variants'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $listings,
        ], 200);
    }

    public function store(StoreVendorListingRequest $request): JsonResponse
    {
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            return response()->json(['success' => false, 'message' => 'Vendor profile not found.'], 403);
        }

        $validated = $request->validated();

        // Check token quota balance
        if ($vendor->token_balance < 1) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient Vendor Tokens. Please purchase more tokens to create store listings.',
            ], 422);
        }

        $listing = DB::transaction(function () use ($vendor, $validated) {
            // Deduct 1 Vendor Token
            $vendor->decrement('token_balance', 1);

            $listing = VendorListing::create([
                'base_product_id' => $validated['base_product_id'],
                'vendor_id' => $vendor->id,
                'price_coins' => $validated['price_coins'],
                'stock_quantity' => $validated['stock_quantity'],
                'is_active' => true,
            ]);

            if (!empty($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    $listing->variants()->create($variantData);
                }
            }

            return $listing;
        });

        return response()->json([
            'success' => true,
            'message' => 'Store listing created successfully. 1 Vendor Token consumed.',
            'data' => $listing->load('variants'),
        ], 201);
    }

    public function update(UpdateVendorListingRequest $request, int $id): JsonResponse
    {
        $vendor = $request->user()->vendor;
        $listing = VendorListing::where('vendor_id', $vendor->id)->findOrFail($id);

        $listing->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Store listing updated successfully.',
            'data' => $listing,
        ], 200);
    }
}