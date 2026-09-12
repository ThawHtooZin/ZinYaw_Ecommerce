<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShipOrderItemRequest;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorOrderController
{
    public function index(Request $request): JsonResponse
    {
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            return response()->json(['success' => false, 'message' => 'Vendor profile not found.'], 403);
        }

        $items = OrderItem::where('vendor_id', $vendor->id)
            ->with(['order.customer', 'vendorListing.baseProduct', 'variant'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ], 200);
    }

    public function ship(ShipOrderItemRequest $request, int $itemId): JsonResponse
    {
        $vendor = $request->user()->vendor;
        $item = OrderItem::where('vendor_id', $vendor->id)->findOrFail($itemId);

        if ($item->fulfillment_status !== 'paid_in_escrow' && $item->fulfillment_status !== 'processing') {
            return response()->json([
                'success' => false,
                'message' => 'Order item is not in shippable state.',
            ], 422);
        }

        $validated = $request->validated();

        $item->update([
            'courier_name' => $validated['courier_name'],
            'tracking_number' => $validated['tracking_number'],
            'fulfillment_status' => 'shipped',
            'shipped_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order item marked as SHIPPED.',
            'data' => $item,
        ], 200);
    }
}