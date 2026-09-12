<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiateTopupRequest;
use App\Http\Requests\SubmitBankSlipRequest;
use App\Models\PaymentTopup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentTopupController
{
    public function initiate(InitiateTopupRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $topup = PaymentTopup::create([
            'user_id' => $user->id,
            'method' => $validated['gateway'] === 'kbzpay' ? 'kbzpay_api' : 'ayapay_api',
            'amount_mmk' => $validated['amount_mmk'],
            'trans_id' => 'PREPAY_' . Str::upper(Str::random(10)),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment QR initialized.',
            'data' => [
                'topup_id' => $topup->id,
                'prepay_id' => $topup->trans_id,
                'qr_code_url' => "https://payment.{$validated['gateway']}.com/pay?code=" . $topup->trans_id,
                'deep_link' => "{$validated['gateway']}://pay?prepay_id=" . $topup->trans_id,
            ]
        ], 200);
    }

    public function submitBankSlip(SubmitBankSlipRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $filePath = null;
        if ($request->hasFile('proof_image')) {
            $filePath = $request->file('proof_image')->store('bank_slips', 'public');
        }

        $topup = PaymentTopup::create([
            'user_id' => $user->id,
            'method' => $validated['gateway'],
            'amount_mmk' => $validated['amount_mmk'],
            'trans_id' => $validated['trans_id'],
            'proof_image_path' => $filePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank slip submitted for Admin verification.',
            'data' => $topup,
        ], 201);
    }
}