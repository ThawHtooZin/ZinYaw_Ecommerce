<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VendorSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        // 1. Create Users
        $users = [
            ['id' => 1, 'name' => 'Admin System', 'email' => 'admin@zinyaw.com', 'phone' => '09900000000', 'role' => 'admin', 'password' => Hash::make('password')],
            ['id' => 2, 'name' => 'Urban Carry Official', 'email' => 'urban@zinyaw.com', 'phone' => '09911111111', 'role' => 'vendor', 'password' => Hash::make('password')],
            ['id' => 3, 'name' => 'Sound House Audio', 'email' => 'sound@zinyaw.com', 'phone' => '09922222222', 'role' => 'vendor', 'password' => Hash::make('password')],
            ['id' => 4, 'name' => 'Daily Form Home', 'email' => 'daily@zinyaw.com', 'phone' => '09933333333', 'role' => 'vendor', 'password' => Hash::make('password')],
            ['id' => 5, 'name' => 'Move Myanmar Sports', 'email' => 'move@zinyaw.com', 'phone' => '09944444444', 'role' => 'vendor', 'password' => Hash::make('password')],
        ];
        DB::table('users')->insert(array_map(fn($u) => array_merge($u, ['created_at' => $now, 'updated_at' => $now]), $users));

        // 2. Create Vendor Profiles
        $vendors = [
            ['id' => 1, 'user_id' => 2, 'store_name' => 'URBAN CARRY', 'store_slug' => 'urban-carry', 'is_approved' => true],
            ['id' => 2, 'user_id' => 3, 'store_name' => 'SOUND HOUSE', 'store_slug' => 'sound-house', 'is_approved' => true],
            ['id' => 3, 'user_id' => 4, 'store_name' => 'DAILY FORM', 'store_slug' => 'daily-form', 'is_approved' => true],
            ['id' => 4, 'user_id' => 5, 'store_name' => 'MOVE MYANMAR', 'store_slug' => 'move-myanmar', 'is_approved' => true],
        ];
        DB::table('vendors')->insert(array_map(fn($v) => array_merge($v, ['created_at' => $now, 'updated_at' => $now]), $vendors));

        // 3. Initialize empty wallets for everyone
        $wallets = [];
        foreach (range(1, 5) as $userId) {
            $wallets[] = [
                'user_id' => $userId,
                'buyer_coin_balance' => 0.00,
                'withdrawable_balance' => 0.00,
                'escrow_balance' => 0.00,
                'created_at' => $now,
                'updated_at' => $now
            ];
        }
        DB::table('wallets')->insert($wallets);
    }
}