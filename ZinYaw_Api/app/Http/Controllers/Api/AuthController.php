<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AuthController
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            // 1. Create User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            // 2. Initialize Wallet
            Wallet::create([
                'user_id' => $user->id,
                'buyer_coin_balance' => 0.00,
                'withdrawable_balance' => 0.00,
                'escrow_balance' => 0.00,
            ]);

            // 3. Create Vendor record if role is vendor
            if ($validated['role'] === 'vendor') {
                Vendor::create([
                    'user_id' => $user->id,
                    'store_name' => $validated['store_name'] ?? $user->name . ' Store',
                    'store_slug' => Str::slug($validated['store_name'] ?? $user->name . ' Store') . '-' . Str::random(5),
                    'is_verified' => true,
                    'token_balance' => 100, // Initial signup quota
                ]);
            }

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Account registered successfully.',
            'data' => [
                'user' => $user->load('vendor', 'wallet'),
                'token' => $token,
            ]
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password credentials.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data' => [
                'user' => $user->load('vendor', 'wallet'),
                'token' => $token,
            ]
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tokens revoked. Logged out successfully.',
        ], 200);
    }
}