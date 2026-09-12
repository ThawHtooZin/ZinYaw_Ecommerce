<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Address;
use App\Models\EscrowHold;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VendorListing;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController
{
    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $user->wallet;
        $validated = $request->validated();

        $address = Address::where('user_id', $user->id)->findOrFail($validated['address_id']);

        // Calculate order total
        $totalCoins = 0;
        $itemsToProcess = [];

        foreach ($validated['items'] as $item) {
            $listing = VendorListing::with('variants')->findOrFail($item['vendor_listing_id']);
            $unitPrice = $listing->price_coins;

            if (!empty($item['variant_id'])) {
                $variant = $listing->variants->firstWhere('id', $item['variant_id']);
                if ($variant) {
                    $unitPrice += $variant->additional_price;
                }
            }

            $subtotal = $unitPrice * $item['quantity'];
            $totalCoins += $subtotal;

            $itemsToProcess[] = [
                'listing' => $listing,
                'variant_id' => $item['variant_id'] ?? null,
                'unit_price' => $unitPrice,
                'quantity' => $item['quantity'],
                'subtotal' => $subtotal,
            ];
        }

        if ($wallet->buyer_coin_balance < $totalCoins) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient coin balance. Required: {$totalCoins} Coins.",
            ], 422);
        }

        $order = DB::transaction(function () use ($user, $wallet, $address, $totalCoins, $itemsToProcess) {
            // Deduct coins from user balance
            $wallet->decrement('buyer_coin_balance', $totalCoins);

            // Log purchase transaction
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'purchase',
                'amount' => $totalCoins,
                'description' => 'Order purchase via Buyer Coins',
                'status' => 'completed',
            ]);

            // Create Order
            $order = Order::create([
                'customer_id' => $user->id,
                'order_number' => 'ORD-', now()->format('Ymd') . '-' . Str::upper(Str::random(5)),
                'total_coins' => $totalCoins,
                'payment_status' => 'paid_in_escrow',
                'shipping_address_snapshot' => $address->toArray(),
            ]);

            // Create Order Items and Lock Escrow Holds
            foreach ($itemsToProcess as $data) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'vendor_id' => $data['listing']->vendor_id,
                    'vendor_listing_id' => $data['listing']->id,
                    'variant_id' => $data['variant_id'],
                    'unit_price' => $data['unit_price'],
                    'quantity' => $data['quantity'],
                    'subtotal' => $data['subtotal'],
                    'fulfillment_status' => 'paid_in_escrow',
                ]);

                // Deduct stock quantity
                $data['listing']->decrement('stock_quantity', $data['quantity']);

                // Create System Escrow Hold
                EscrowHold::create([
                    'order_item_id' => $orderItem->id,
                    'vendor_id' => $data['listing']->vendor_id,
                    'amount' => $data['subtotal'],
                    'status' => 'locked',
                ]);
            }

            return $order;
        });

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully. Funds held in Escrow.',
            'data' => $order->load('orderItems.vendorListing.baseProduct'),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('customer_id', $request->user()->id)
            ->with(['orderItems.vendorListing.baseProduct'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ], 200);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with(['orderItems.vendorListing.baseProduct', 'orderItems.vendor'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ], 200);
    }

    public function confirmDelivery(int $id, Request $request): JsonResponse
    {
        $orderItem = OrderItem::with('escrowHold')->findOrFail($id);

        if ($orderItem->fulfillment_status !== 'shipped') {
            return response()->json(['success' => false, 'message' => 'Item is not shipped yet.'], 422);
        }

        DB::transaction(function () use ($orderItem) {
            $orderItem->update([
                'fulfillment_status' => 'delivered',
                'delivered_at' => now(),
            ]);

            if ($orderItem->escrowHold && $orderItem->escrowHold->status === 'locked') {
                $escrow = $orderItem->escrowHold;
                $escrow->update([
                    'status' => 'released',
                    'released_at' => now(),
                ]);

                // Transfer escrow funds to vendor withdrawable wallet
                $vendorUser = $orderItem->vendor->user;
                $vendorWallet = Wallet::firstOrCreate(['user_id' => $vendorUser->id]);
                $vendorWallet->increment('withdrawable_balance', $escrow->amount);

                WalletTransaction::create([
                    'wallet_id' => $vendorWallet->id,
                    'type' => 'escrow_release',
                    'amount' => $escrow->amount,
                    'description' => "Escrow released for order item #{$orderItem->id}",
                    'status' => 'completed',
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Delivery confirmed. Funds released to vendor wallet.',
        ], 200);
    }
}