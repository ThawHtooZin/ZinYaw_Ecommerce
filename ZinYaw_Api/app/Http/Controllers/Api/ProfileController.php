<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['vendor', 'wallet', 'addresses']);

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }
}