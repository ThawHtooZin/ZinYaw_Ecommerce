<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PurchaseTokensRequest;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;

class VendorTokenController
{
    public function purchase(PurchaseTokensRequest $request): JsonResponse
    {
        $user = $request->user();
        $vendor = $user->vendor;
        $wallet = $user->wallet;

        if (!$vendor || !$wallet) {
            return response()->json(['success' => false, 'message' => 'Vendor wallet not initialized.'], 403);
        }

        $tokens = $request->validated()['token_quantity'];
        // Cost: 1000 MMK/Coins per Token
        $cost = $tokens * 1000;

        if ($wallet->buyer_coin_balance < $cost) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient coin balance. Purchasing {$tokens} tokens requires {$cost} coins.",
            ], 422);
        }

        \DB::transaction(function () use ($wallet, $vendor, $cost, $tokens) {
            $wallet->decrement('buyer_coin_balance', $cost);
            $vendor->increment('token_balance', $tokens);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'token_purchase',
                'amount' => $cost,
                'description' => "Purchased {$tokens} Vendor Tokens",
                'status' => 'completed',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => "Successfully purchased {$tokens} Vendor Tokens.",
            'data' => [
                'token_balance' => $vendor->fresh()->token_balance,
                'remaining_coins' => $wallet->fresh()->buyer_coin_balance,
            ]
        ], 200);
    }
}