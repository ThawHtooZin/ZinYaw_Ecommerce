<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentTopup;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminPaymentController
{
    public function pendingSlips(): JsonResponse
    {
        $slips = PaymentTopup::where('status', 'pending')
            ->whereIn('method', ['kbzpay_slip', 'ayapay_slip'])
            ->with('user')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $slips,
        ], 200);
    }

    public function verifySlip(int $id): JsonResponse
    {
        $topup = PaymentTopup::where('status', 'pending')->findOrFail($id);

        DB::transaction(function () use ($topup) {
            $topup->update(['status' => 'approved']);

            $wallet = Wallet::firstOrCreate(['user_id' => $topup->user_id]);
            $wallet->increment('buyer_coin_balance', $topup->amount_mmk);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'topup',
                'amount' => $topup->amount_mmk,
                'description' => "Verified Bank Slip Top-Up ({$topup->method})",
                'status' => 'completed',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Bank slip verified and coins credited to user wallet.',
        ], 200);
    }
}