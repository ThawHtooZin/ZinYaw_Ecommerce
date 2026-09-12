<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentTopup;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PaymentCallbackController
{
    public function kbzpay(Request $request): JsonResponse
    {
        return $this->processGatewayCallback($request, 'kbzpay_api');
    }

    public function ayapay(Request $request): JsonResponse
    {
        return $this->processGatewayCallback($request, 'ayapay_api');
    }

    private function processGatewayCallback(Request $request, string $gateway): JsonResponse
    {
        $transId = $request->input('trans_id') ?? $request->input('kbz_trans_id');
        $merchOrderId = $request->input('merch_order_id');
        $amount = $request->input('amount');
        $status = $request->input('status');

        if ($status !== 'SUCCESS') {
            return response()->json(['sign_status' => 'FAIL', 'message' => 'Payment failed at gateway.'], 400);
        }

        DB::transaction(function () use ($merchOrderId, $amount, $gateway, $transId) {
            $topup = PaymentTopup::where('trans_id', $merchOrderId)
                ->where('status', 'pending')
                ->first();

            if ($topup) {
                $topup->update([
                    'status' => 'approved',
                    'trans_id' => $transId ?? $topup->trans_id,
                ]);

                $wallet = Wallet::firstOrCreate(['user_id' => $topup->user_id]);
                $wallet->increment('buyer_coin_balance', $amount);

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'topup',
                    'amount' => $amount,
                    'reference_id' => $topup->id,
                    'description' => "Instant Top-Up via {$gateway}",
                    'status' => 'completed',
                ]);
            }
        });

        return response()->json(['sign_status' => 'SUCCESS']);
    }
}