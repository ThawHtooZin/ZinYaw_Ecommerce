<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AddressController
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->orderBy('is_default', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $addresses,
        ], 200);
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (!empty($validated['is_default']) && $validated['is_default']) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully.',
            'data' => $address,
        ], 201);
    }
}