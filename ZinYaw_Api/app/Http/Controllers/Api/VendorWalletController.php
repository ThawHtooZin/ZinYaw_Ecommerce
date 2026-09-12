<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CashoutRequest;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VendorWalletController
{
    public function cashout(CashoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $user->wallet;
        $validated = $request->validated();

        if ($wallet->withdrawable_balance < $validated['amount_mmk']) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient withdrawable balance.',
            ], 422);
        }

        DB::transaction(function () use ($wallet, $validated) {
            $wallet->decrement('withdrawable_balance', $validated['amount_mmk']);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'cashout',
                'amount' => $validated['amount_mmk'],
                'description' => "Cash-out request to {$validated['payout_account_type']} ({$validated['account_number']})",
                'status' => 'pending',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Cash-out request submitted for Admin review.',
        ], 201);
    }
}