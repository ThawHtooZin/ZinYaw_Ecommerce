<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;

class AdminCashoutController
{
    public function pending(): JsonResponse
    {
        $cashouts = WalletTransaction::where('type', 'cashout')
            ->where('status', 'pending')
            ->with('wallet.user')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cashouts,
        ], 200);
    }

    public function approve(int $id): JsonResponse
    {
        $transaction = WalletTransaction::where('type', 'cashout')
            ->where('status', 'pending')
            ->findOrFail($id);

        $transaction->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'message' => 'Vendor cash-out payout completed.',
        ], 200);
    }
}