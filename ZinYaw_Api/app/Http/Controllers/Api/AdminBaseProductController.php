<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectBaseProductRequest;
use App\Models\BaseProduct;
use Illuminate\Http\JsonResponse;

class AdminBaseProductController
{
    public function pending(): JsonResponse
    {
        $products = BaseProduct::where('approval_status', 'pending')
            ->with(['requestedBy', 'category'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ], 200);
    }

    public function approve(int $id): JsonResponse
    {
        $product = BaseProduct::findOrFail($id);
        $product->update(['approval_status' => 'approved']);

        return response()->json([
            'success' => true,
            'message' => 'Base product approved and added to global catalog.',
            'data' => $product,
        ], 200);
    }

    public function reject(RejectBaseProductRequest $request, int $id): JsonResponse
    {
        $product = BaseProduct::findOrFail($id);
        $product->update([
            'approval_status' => 'rejected',
            'rejection_reason' => $request->validated()['rejection_reason'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Base product request rejected.',
            'data' => $product,
        ], 200);
    }
}