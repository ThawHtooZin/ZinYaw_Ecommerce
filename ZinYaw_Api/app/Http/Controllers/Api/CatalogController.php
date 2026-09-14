<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestBaseProductRequest;
use App\Models\BaseProduct;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController
{
    public function categories(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')->with('children')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ], 200);
    }

    public function index(Request $request): JsonResponse
    {
        $query = BaseProduct::where('approval_status', 'approved')
            ->with([
                'category',
                'vendorListings' => function ($q) {
                    $q->where('is_active', true)->where('stock_quantity', '>', 0);
                }
            ]);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->has('search')) {
            $query->where('title', 'LIKE', '%' . $request->query('search') . '%');
        }

        $products = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $products,
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $product = BaseProduct::where('approval_status', 'approved')
            ->with(['category', 'vendorListings.vendor', 'vendorListings.variants'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 200);
    }

    public function requestBaseProduct(RequestBaseProductRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Admin creation auto-approves immediately
        $status = $user->role === 'admin' ? 'approved' : 'pending';

        $baseProduct = BaseProduct::create([
            'category_id' => $validated['category_id'],
            'requested_by_user_id' => $user->id,
            'title' => $validated['title'],
            'brand' => $validated['brand'] ?? null,
            'description' => $validated['description'] ?? null,
            'master_image_url' => $validated['master_image_url'] ?? null,
            'specs_schema' => $validated['specs_schema'] ?? null,
            'approval_status' => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => $status === 'approved'
                ? 'Base product created and approved automatically.'
                : 'Base product creation request submitted for Admin review.',
            'data' => $baseProduct,
        ], 201);
    }

    public function featuredProducts(): JsonResponse
    {
        $products = BaseProduct::query()
            ->where('approval_status', 'approved')
            ->whereHas('vendorListings', function ($query) {
                $query
                    ->where('is_active', true)
                    ->where('stock_quantity', '>', 0);
            })
            ->with('category')
            ->withCount([
                'vendorListings as vendor_listings_count' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->where('stock_quantity', '>', 0);
                },
            ])
            ->withMin([
                'vendorListings as min_price_mmk' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->where('stock_quantity', '>', 0);
                },
            ], 'price_coins')
            ->withMax([
                'vendorListings as max_price_mmk' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->where('stock_quantity', '>', 0);
                },
            ], 'price_coins')
            ->latest()
            ->take(5)
            ->get();

        $products = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'brand' => $product->brand,
                'category_name' => $product->category?->name,
                'master_image_url' => $product->master_image_url,
                'vendor_listings_count' => $product->vendor_listings_count,
                'min_price_mmk' => (float) $product->min_price_mmk,
                'max_price_mmk' => (float) $product->max_price_mmk,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ], 200);
    }
}